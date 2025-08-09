package setCommitmentIsActive

import (
	"fmt"
	"log"
	"net/http"
	telegramAuthMiddeware "tg-bot/telegramAuthMiddleware"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type SetCommitmentIsActiveUserCase struct {
	DB *sqlx.DB
}

func NewSetCommitmentIsActiveUserCase(db *sqlx.DB) *SetCommitmentIsActiveUserCase {
	return &SetCommitmentIsActiveUserCase{DB: db}
}

func (s *SetCommitmentIsActiveUserCase) SetCommitmentIsActive(c *gin.Context) {
	commitmentAddress := c.Param("address")

	initData, ok := telegramAuthMiddeware.CtxInitData(c.Request.Context())
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid init-data"})
		return
	}

	fmt.Println(commitmentAddress)
	fmt.Println(initData.User.ID)

	_, dbErr := s.DB.Exec("UPDATE commitments SET is_active = TRUE WHERE commitment_address = $1 AND tg_user_id = $2", commitmentAddress, initData.User.ID)
	if dbErr != nil {
		log.Println("Db: ", dbErr)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}
