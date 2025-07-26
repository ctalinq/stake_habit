package bot

import (
	"log"
	"os"

	"github.com/PaulSonOfLars/gotgbot/v2"
)

func ConnectBot() *gotgbot.Bot {
	token := os.Getenv("TELEGRAM_BOT_TOKEN")
	b, err := gotgbot.NewBot(token, nil)

	if err != nil {
		log.Fatal(err)
	}

	return b
}
