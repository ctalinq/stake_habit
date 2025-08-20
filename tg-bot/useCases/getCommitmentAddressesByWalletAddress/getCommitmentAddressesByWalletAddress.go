package getCommitmentAddressesByWalletAddress

import (
	"log"
	"net/http"
	"strconv"
	telegramAuthMiddeware "tg-bot/telegramAuthMiddleware"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type CommitmentDTO struct {
	CommitmentAddress string `db:"commitment_address" json:"commitment_address" binding:"required"`
}

type GetCommitmentAddressesByWalletAddressUseCase struct {
	DB *sqlx.DB
}

func NewGetCommitmentAddressesByWalletAddressUseCase(db *sqlx.DB) *GetCommitmentAddressesByWalletAddressUseCase {
	return &GetCommitmentAddressesByWalletAddressUseCase{
		DB: db,
	}
}

func (s *GetCommitmentAddressesByWalletAddressUseCase) GetCommitmentAddressesByWalletAddress(c *gin.Context) {
	address := c.Param("address")
	pageQuery := c.DefaultQuery("page", "0")

	pageNumber, err := strconv.Atoi(pageQuery)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
		return
	}

	var commitments []CommitmentDTO

	initData, ok := telegramAuthMiddeware.CtxInitData(c.Request.Context())
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid init-data"})
		return
	}

	query := `
		SELECT
			commitments.commitment_address
		FROM
			commitments
		WHERE
			commitments.wallet_address = $1 AND
			commitments.tg_user_id = $2 AND
			commitments.is_active = TRUE
		ORDER BY commitments.created_at DESC
		LIMIT 5 OFFSET $3
	`

	err = s.DB.Select(&commitments, query, address, initData.User.ID, pageNumber*5)

	if err != nil {
		log.Println("Db: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	var commitmentAddresses []string

	for _, commitment := range commitments {
		commitmentAddresses = append(commitmentAddresses, commitment.CommitmentAddress)
	}

	c.JSON(http.StatusOK, commitmentAddresses)
}
