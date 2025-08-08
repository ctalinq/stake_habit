package getVisitorsByWalletAddress

import (
	"log"
	"net/http"
	telegramAuthMiddeware "tg-bot/telegramAuthMiddleware"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

type UserDTO struct {
	PhotoURL string `json:"photo_url"`
	FullName string `json:"full_name"`
}

type CommitmentDTO struct {
	Users []UserDTO `json:"users"`
}

type VisitorDTO struct {
	ID                int64  `db:"tg_user_id" json:"id" binding:"required"`
	PhotoURL          string `db:"tg_user_photo_link" json:"photo_url"`
	FullName          string `db:"tg_user_full_name" json:"full_name" binding:"required"`
	CommitmentAddress string `db:"commitment_address" json:"commitment_address"`
	WalletAddress     string `db:"wallet_address" json:"wallet_address"`
}

type GetVisitorsByWalletAddressUseCase struct {
	DB *sqlx.DB
}

func NewGetVisitorsByWalletAddressUseCase(db *sqlx.DB) *GetVisitorsByWalletAddressUseCase {
	return &GetVisitorsByWalletAddressUseCase{
		DB: db,
	}
}

func (s *GetVisitorsByWalletAddressUseCase) GetVisitorsByWalletAddress(c *gin.Context) {
	address := c.Param("address")
	var visitors []VisitorDTO

	initData, ok := telegramAuthMiddeware.CtxInitData(c.Request.Context())
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid init-data"})
		return
	}

	query := `
		SELECT
  			COALESCE(visitors.tg_user_id, 0) AS tg_user_id,
    		COALESCE(visitors.tg_user_full_name, '') AS tg_user_full_name,
    		COALESCE(visitors.tg_user_photo_link, '') AS tg_user_photo_link,
			commitments.commitment_address
		FROM
			commitments
		LEFT JOIN
			visitors ON visitors.commitment_address = commitments.commitment_address
		WHERE
			commitments.wallet_address = $1 AND
			commitments.tg_user_id = $2 AND
			commitments.is_active = TRUE
	`
	err := s.DB.Select(&visitors, query, address, initData.User.ID)
	if err != nil {
		log.Println("Db: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	commitmentsMap := make(map[string]CommitmentDTO)

	for _, visitor := range visitors {
		commitment, exists := commitmentsMap[visitor.CommitmentAddress]

		user := UserDTO{
			PhotoURL: visitor.PhotoURL,
			FullName: visitor.FullName,
		}

		if !exists {
			users := []UserDTO{
				user,
			}

			if user.FullName != "" {
				commitment = CommitmentDTO{
					Users: users,
				}
			} else {
				commitment = CommitmentDTO{
					Users: []UserDTO{},
				}
			}
		} else {
			commitment.Users = append(commitment.Users, user)
		}

		commitmentsMap[visitor.CommitmentAddress] = commitment
	}

	c.JSON(http.StatusOK, commitmentsMap)
}
