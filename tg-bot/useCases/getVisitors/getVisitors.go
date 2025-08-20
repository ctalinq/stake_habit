package getVisitors

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type VisitorDTO struct {
	CommitmentAddress string `db:"commitment_address" json:"commitment_address" binding:"required"`
	TgUserFullName    string `db:"tg_user_full_name" json:"tg_user_full_name" binding:"required"`
	TgUserId          int64  `db:"tg_user_id" json:"tg_user_id" binding:"required"`
	TgUserPhotoLink   string `db:"tg_user_photo_link" json:"tg_user_photo_link"`
}

type GetVisitorsUseCase struct {
	DB *sqlx.DB
}

func NewGetVisitorsCase(db *sqlx.DB) *GetVisitorsUseCase {
	return &GetVisitorsUseCase{DB: db}
}

func (s *GetVisitorsUseCase) GetVisitors(c *gin.Context) {
	commitmentAddresses := c.Query("commitmentAddresses")
	var visitors []VisitorDTO

	err := s.DB.Select(&visitors, `
	SELECT tg_user_full_name, tg_user_id, tg_user_photo_link, commitment_address
	FROM (
		SELECT *, ROW_NUMBER() OVER (PARTITION BY commitment_address) AS n
		FROM visitors
		WHERE commitment_address = ANY (STRING_TO_ARRAY($1, ','))
	) AS x
	WHERE n <= 5;
	`, commitmentAddresses)

	if err != nil {
		log.Println("Db: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, visitors)
}
