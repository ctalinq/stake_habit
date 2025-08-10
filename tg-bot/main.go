package main

import (
	"tg-bot/infra/bot"
	"tg-bot/infra/db"
	telegramAuthMiddeware "tg-bot/telegramAuthMiddleware"
	"tg-bot/useCases/getCommitmentByAddress"
	"tg-bot/useCases/getCommitmentsByWalletAddress"
	"tg-bot/useCases/getVisitorsByWalletAddress"
	"tg-bot/useCases/saveCommitment"
	"tg-bot/useCases/setCommitmentIsActive"
	"tg-bot/useCases/visitCommitment"

	"github.com/gin-gonic/gin"
)

func main() {
	//todo - handle load env on dev env, and for production
	//err := godotenv.Load()
	//if err != nil {
	//	panic("Error loading .env file")
	//}

	db := db.ConnectDB()
	b := bot.ConnectBot()

	defer db.Close()

	r := gin.New()

	r.Use(telegramAuthMiddeware.AuthMiddleware())

	saveCommitment := saveCommitment.NewSaveCommitmentUserCase(db, b)
	setCommitmentIsActive := setCommitmentIsActive.NewSetCommitmentIsActiveUserCase(db)
	getCommitments := getCommitmentsByWalletAddress.NewGetCommitmentsUserCase(db)
	getCommitment := getCommitmentByAddress.NewGetCommitmentUserCase(db)
	visitCommitment := visitCommitment.NewVisitCommitmentUserCase(db)
	getVisitors := getVisitorsByWalletAddress.NewGetVisitorsByWalletAddressUseCase(db)

	r.POST("/wallets/:address/commitments", saveCommitment.SaveCommitment)
	r.GET("/wallets/:address/commitments", getCommitments.GetCommitmentsByWalletAddress)
	r.GET("/wallets/:address/visitors", getVisitors.GetVisitorsByWalletAddress)
	r.GET("/commitments/:address", getCommitment.GetCommitmentByAddress)
	r.POST("/commitments/:address/visits", visitCommitment.VisitCommitment)
	r.POST("/commitments/:address/success", setCommitmentIsActive.SetCommitmentIsActive)

	r.Run(":5174")
}
