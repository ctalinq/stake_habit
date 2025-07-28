package saveCommitment

import (
	"encoding/base64"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	telegramAuthMiddeware "tg-bot/telegramAuthMiddleware"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"

	"github.com/PaulSonOfLars/gotgbot/v2"
)

type CommitmentDTO struct {
	CommitmentAddress string   `json:"commitment_address" binding:"required"`
	RecipientKeys     []string `json:"recipient_keys" binding:"required"`
}

type SaveCommitmentUserCase struct {
	DB  *sqlx.DB
	BOT *gotgbot.Bot
}

func NewSaveCommitmentUserCase(db *sqlx.DB, bot *gotgbot.Bot) *SaveCommitmentUserCase {
	return &SaveCommitmentUserCase{DB: db, BOT: bot}
}

func (s *SaveCommitmentUserCase) SaveCommitment(c *gin.Context) {
	walletId := c.Param("walletId")
	var commitment CommitmentDTO

	if err := c.ShouldBind(&commitment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	initData, ok := telegramAuthMiddeware.CtxInitData(c.Request.Context())
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid init-data"})
		return
	}

	var messageIds []string
	linkPrefix := os.Getenv("COMMITMENT_LINK_PREFIX")

	for index, key := range commitment.RecipientKeys {
		linkPostfix := fmt.Sprintf("commitment=%s;key=%s", commitment.CommitmentAddress, key)
		encodedLinkPostfix := base64.StdEncoding.EncodeToString([]byte(linkPostfix))
		url := fmt.Sprintf("%s%s", linkPrefix, encodedLinkPostfix)

		preparedMessage, _ := s.BOT.SavePreparedInlineMessage(initData.User.ID,
			&gotgbot.InlineQueryResultArticle{
				Id:    strconv.Itoa(index),
				Title: "Invitation",
				InputMessageContent: &gotgbot.InputTextMessageContent{
					MessageText: "Stake-habit invitation",
				},
				ReplyMarkup: &gotgbot.InlineKeyboardMarkup{
					InlineKeyboard: [][]gotgbot.InlineKeyboardButton{
						{
							{
								Text: "Click button to open app",
								Url:  url,
							},
						},
					},
				},
			}, &gotgbot.SavePreparedInlineMessageOpts{
				AllowUserChats:    true,
				AllowBotChats:     false,
				AllowGroupChats:   false,
				AllowChannelChats: false,
			})

		messageIds = append(messageIds, preparedMessage.Id)
	}

	_, dbErr := s.DB.Exec("INSERT INTO commitments (wallet_id, tg_user_photo_link, commitment_address) VALUES ($1, $2, $3)", walletId, initData.User.PhotoURL, commitment.CommitmentAddress)
	if dbErr != nil {
		log.Println("Db: ", dbErr)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, messageIds)
}
