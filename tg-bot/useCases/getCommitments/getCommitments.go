package getCommitments

import (
	"log"
	"net/http"
	"strconv"
	telegramAuthMiddeware "tg-bot/telegramAuthMiddleware"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type CommitmentDTO struct {
	WalletAddress     string `db:"wallet_address" json:"wallet_address" binding:"required"`
	UserPhotoURL      string `db:"tg_user_photo_link" json:"tg_user_photo_link"`
	CommitmentAddress string `db:"commitment_address" json:"commitment_address" binding:"required"`
	CreatedAt         string `db:"created_at" json:"created_at" binding:"required"`
	UserId            string `db:"tg_user_id" json:"tg_user_id" binding:"required"`
	IsActive          bool   `db:"is_active" json:"is_active" binding:"required"`
}

type GetCommitmentsUseCase struct {
	DB *sqlx.DB
}

func NewGetCommitmentsUseCase(db *sqlx.DB) *GetCommitmentsUseCase {
	return &GetCommitmentsUseCase{
		DB: db,
	}
}

func (s *GetCommitmentsUseCase) GetCommitments(c *gin.Context) {
	walletAddress := c.Query("walletAddress")

	if walletAddress == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Wallet address is required"})
		return
	}

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
			*
		FROM
			commitments
		WHERE
			commitments.wallet_address = $1 AND
			commitments.tg_user_id = $2 AND
			commitments.is_active = TRUE
		ORDER BY commitments.created_at DESC
		LIMIT 5 OFFSET $3
	`

	err = s.DB.Select(&commitments, query, walletAddress, initData.User.ID, pageNumber*5)

	if err != nil {
		log.Println("Db: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, commitments)
}
