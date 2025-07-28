package main

import (
	"tg-bot/infra/bot"
	"tg-bot/infra/db"
	telegramAuthMiddeware "tg-bot/telegramAuthMiddleware"
	"tg-bot/useCases/getCommitmentByAddress"
	"tg-bot/useCases/getCommitmentsByWalletId"
	"tg-bot/useCases/saveCommitment"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	db := db.ConnectDB()
	b := bot.ConnectBot()

	defer db.Close()

	r := gin.New()

	r.Use(telegramAuthMiddeware.AuthMiddleware())

	saveCommitment := saveCommitment.NewSaveCommitmentUserCase(db, b)
	getCommitments := getCommitmentsByWalletId.NewGetCommitmentsUserCase(db)
	getCommitment := getCommitmentByAddress.NewGetCommitmentUserCase(db)

	r.POST("/wallets/:walletId/commitments", saveCommitment.SaveCommitment)
	r.GET("/wallets/:walletId/commitments", getCommitments.GetCommitmentsByWalletId)
	r.GET("/commitments/:address", getCommitment.GetCommitmentByAddress)

	r.Run(":5174")
}
