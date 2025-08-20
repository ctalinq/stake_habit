package main

import (
	"tg-bot/infra/bot"
	"tg-bot/infra/db"
	telegramAuthMiddeware "tg-bot/telegramAuthMiddleware"

	"tg-bot/useCases/createCommitment"
	"tg-bot/useCases/getCommitment"
	"tg-bot/useCases/getCommitments"
	"tg-bot/useCases/getVisitors"
	"tg-bot/useCases/setCommitmentIsActive"
	"tg-bot/useCases/visitCommitment"

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

	createCommitment := createCommitment.NewCreateCommitmentUseCase(db, b)
	setCommitmentIsActive := setCommitmentIsActive.NewSetCommitmentIsActiveUserCase(db)

	getCommitment := getCommitment.NewGetCommitmentUseCase(db)
	getCommiments := getCommitments.NewGetCommitmentsUseCase(db)

	getVisitors := getVisitors.NewGetVisitorsUseCase(db)
	visitCommitment := visitCommitment.NewVisitCommitmentUserCase(db)

	r.GET("/visitors", getVisitors.GetVisitors)

	r.GET("/commitments", getCommiments.GetCommitments)
	r.GET("/commitments/:address", getCommitment.GetCommitment)

	r.POST("/commitments", createCommitment.CreateCommitment)
	r.POST("/commitments/:address/visits", visitCommitment.VisitCommitment)
	r.POST("/commitments/:address/success", setCommitmentIsActive.SetCommitmentIsActive)

	r.Run(":5174")
}
