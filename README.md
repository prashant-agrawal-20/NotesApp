# NotesApp
Gateway server to app APIs of NotesApp.

## SetUp

- Install [Homebrew](https://brew.sh)
- brew install node@21
- check the npm version using to check if npm is installed successfully with Node:
    npm --version
- npm install -g pnpm
- can change the port from LOCAL.json file (src/conf/LOCAL.json) if required, by default it is 3000
- log directory can be changed by configuring logDir in LOCAL.json file -> logging -> logDir
- similarly logToFile can be changed from LOCAL.json file -> logging -> logToFile (true/false)
- mongo config can be added here: LOCAL.json -> mongoConfig (sample config present in the file)
- you can configure mongo db locally if not using mongo atlas using the [Mongo Doc](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)



