package visitCommitment

import (
	"log"
	"net/http"
	telegramAuthMiddeware "tg-bot/telegramAuthMiddleware"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type VisitCommitmentUserCase struct {
	DB *sqlx.DB
}

func NewVisitCommitmentUserCase(db *sqlx.DB) *VisitCommitmentUserCase {
	return &VisitCommitmentUserCase{
		DB: db,
	}
}

func (s *VisitCommitmentUserCase) VisitCommitment(c *gin.Context) {
	commitmentAddress := c.Param("address")

	initData, ok := telegramAuthMiddeware.CtxInitData(c.Request.Context())
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid init-data"})
		return
	}

	_, dbErr := s.DB.Exec("INSERT INTO visitors (tg_user_id, tg_user_full_name, tg_user_photo_link, commitment_address) VALUES ($1, $2, $3, $4) ON CONFLICT (commitment_address, tg_user_id) DO NOTHING",
		initData.User.ID,
		initData.User.FirstName+" "+initData.User.LastName,
		initData.User.PhotoURL,
		commitmentAddress,
	)

	if dbErr != nil {
		log.Println("Db: ", dbErr)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, nil)
}
