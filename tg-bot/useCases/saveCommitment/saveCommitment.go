package saveCommitment

import (
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
								Text: "Click to open app",
								Url:  fmt.Sprintf("%s/%s?key=%s", linkPrefix, commitment.CommitmentAddress, key),
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

	_, dbErr := s.DB.Exec("INSERT INTO commitments (wallet_id, commitment_address) VALUES ($1, $2)", walletId, commitment.CommitmentAddress)
	if dbErr != nil {
		log.Println("Db: ", dbErr)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, messageIds)
}
