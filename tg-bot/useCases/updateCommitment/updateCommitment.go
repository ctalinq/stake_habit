package updateCommitment

import (
	"log"
	"net/http"
	telegramAuthMiddeware "tg-bot/telegramAuthMiddleware"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type UpdateCommitmentDTO struct {
	Visited bool `json:"visited"`
	Active  bool `json:"active"`
}

type UpdateCommitmentUserCase struct {
	DB *sqlx.DB
}

func NewUpdateCommitmentUserCase(db *sqlx.DB) *UpdateCommitmentUserCase {
	return &UpdateCommitmentUserCase{
		DB: db,
	}
}

func (s *UpdateCommitmentUserCase) UpdateCommitment(c *gin.Context) {
	var updateCommitment UpdateCommitmentDTO

	if err := c.ShouldBind(&updateCommitment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	commitmentAddress := c.Param("address")

	initData, ok := telegramAuthMiddeware.CtxInitData(c.Request.Context())
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid init-data"})
		return
	}

	if updateCommitment.Visited == true {
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
	}

	if updateCommitment.Active == true {
		_, dbErr := s.DB.Exec("UPDATE commitments SET is_active = TRUE WHERE commitment_address = $1 AND tg_user_id = $2", commitmentAddress, initData.User.ID)
		if dbErr != nil {
			log.Println("Db: ", dbErr)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			return
		}
	}

	c.JSON(http.StatusOK, nil)
}
