# StakeHabit
## todo-orch
* Describe test telegram environment process, links to bot and web app
* App polyfill for telegram-sdk to test app in browser

## Infra
- Before development run database
```bash
docker compose up -d postgress
```

- To run database migration (always run before first development)
```bash
docker compose migrate up
```
