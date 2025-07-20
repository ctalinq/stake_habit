package main

import (
	"net/http"
	"os"
	telegramAuthMiddeware "tg-bot/telegramAuthMiddleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	tgBotToken := os.Getenv("TELEGRAM_BOT_TOKEN")

	r := gin.New()
	r.Use(telegramAuthMiddeware.AuthMiddleware(tgBotToken))

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Hello, World!")
	})
	r.Run(":5174")
}
