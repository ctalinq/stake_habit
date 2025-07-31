package getVisitorsByWalletAddress

import (
	"fmt"
	"log"
	"net/http"

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

	fmt.Println(address)

	err := s.DB.Select(&visitors, "SELECT * FROM visitors LEFT JOIN commitments ON visitors.commitment_address = commitments.commitment_address WHERE commitments.wallet_address = $1", address)
	if err != nil {
		log.Println("Db: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	fmt.Println(visitors)

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

			commitment = CommitmentDTO{
				Users: users,
			}
		} else {
			commitment.Users = append(commitment.Users, user)
		}

		commitmentsMap[visitor.CommitmentAddress] = commitment
	}

	c.JSON(http.StatusOK, commitmentsMap)
}
