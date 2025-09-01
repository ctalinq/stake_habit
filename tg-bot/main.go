package main

import (
	"tg-bot/infra/bot"
	"tg-bot/infra/db"
	telegramAuthMiddeware "tg-bot/telegramAuthMiddleware"

	"tg-bot/useCases/createCommitment"
	"tg-bot/useCases/getCommitment"
	"tg-bot/useCases/getCommitments"
	"tg-bot/useCases/getVisitors"
	"tg-bot/useCases/updateCommitment"

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
	updateCommitment := updateCommitment.NewUpdateCommitmentUserCase(db)
	getCommitment := getCommitment.NewGetCommitmentUseCase(db)
	getCommiments := getCommitments.NewGetCommitmentsUseCase(db)

	r.GET("/commitments", getCommiments.GetCommitments)
	r.POST("/commitments", createCommitment.CreateCommitment)
	r.GET("/commitments/:address", getCommitment.GetCommitment)
	r.PATCH("/commitments/:address", updateCommitment.UpdateCommitment)

	getVisitors := getVisitors.NewGetVisitorsUseCase(db)
	r.GET("/visitors", getVisitors.GetVisitors)

	r.Run(":5174")
}
