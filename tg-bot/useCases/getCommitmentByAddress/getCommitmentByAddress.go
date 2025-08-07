package getCommitmentByAddress

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type CommitmentDTO struct {
	WalletAddress     string `db:"wallet_address" json:"wallet_address" binding:"required"`
	UserPhotoURL      string `db:"tg_user_photo_link" json:"tg_user_photo_link"`
	CommitmentAddress string `db:"commitment_address" json:"commitment_address" binding:"required"`
}

type GetCommitmentUseCase struct {
	DB *sqlx.DB
}

func NewGetCommitmentUserCase(db *sqlx.DB) *GetCommitmentUseCase {
	return &GetCommitmentUseCase{DB: db}
}

func (s *GetCommitmentUseCase) GetCommitmentByAddress(c *gin.Context) {
	var commitments []CommitmentDTO
	address := c.Param("address")

	err := s.DB.Select(&commitments, "SELECT * FROM commitments WHERE commitment_address = $1", address)
	if err != nil {
		log.Println("Db: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, commitments[0])
}
