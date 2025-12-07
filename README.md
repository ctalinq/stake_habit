# 📘 StakeHabit - Telegram Mini App for High-Stakes Habit Challenges
StakeHabit is a Telegram Mini App built on the TON blockchain that turns personal challenges into real, high-stakes commitments.

Users create challenges with a deadline and place a TON stake on completing them. If they succeed - they keep their stake.
If they fail - their friends can claim the reward.

Shareable challenge links make it easy to invite friends, build accountability, and create social pressure that actually works.

![Watch the video](./client/public/sh_intro.gif)


### Tech Stack
* Language: Go / TypeScript / Func
* Fronted: React + Tailwind / React-Router / useQuery / Storybook / Vite
* Backend: gin / gotgbot / sqlx
* Blockchain: @ton
* Tools: Docker / Vite / Turborepo / Jest / Github Actions / Hucky + Precommit

## Running the project
### Client
```bash
npm run dev
```
### Database (Postgres)
#### run container
```bash
docker compose up -d postgres
```
#### run migrations (after first container launch ⚠️)
```bash
docker compose migrate up
```
### Tg-bot
```bash
cd tg-bot
air
```
## Blockchain (deploying commiter or commitment)
```
cd blockchain
npm run blueprint
```

## TODO (x)
