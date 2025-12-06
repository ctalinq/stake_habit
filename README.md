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
* Tools: Docker / Vite / Turborepo / Jest / Github Actions


- Before development run database
```bash
docker compose up -d postgress
```

- To run database migration (always run before first development)
```bash
docker compose migrate up
```
