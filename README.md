# StakeHabit
## todo-orch
* Find the way to make blockchain monorepo app, now there is a problem with jest esm support.
* Describe test telegram environment process, links to bot and web app
* App polyfill for telegram-sdk to test app in browser

## BUGS
* Critical: currently navigation is re-mounted every time I'm changing page.The cause is that navigation is a part of every page.
I need to investigate if I can create client side component that will not be re-rendered due navigation - If not - switch to react browser router.