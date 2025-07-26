package getCommitments

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type CommitmentDTO struct {
	WalletId          string `db:"wallet_id" json:"wallet_id" binding:"required"`
	CommitmentAddress string `db:"commitment_address" json:"commitment_address" binding:"required"`
}

type GetCommitmentsUseCase struct {
	DB *sqlx.DB
}

func NewGetCommitmentsUserCase(db *sqlx.DB) *GetCommitmentsUseCase {
	return &GetCommitmentsUseCase{DB: db}
}

func (s *GetCommitmentsUseCase) GetCommitments(c *gin.Context) {
	var commitments []CommitmentDTO
	walletId := c.Param("walletId")

	err := s.DB.Select(&commitments, "SELECT * FROM commitments WHERE wallet_id = $1", walletId)
	if err != nil {
		log.Println("Db: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, commitments)
}
