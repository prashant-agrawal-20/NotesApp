# NotesApp
Gateway server to app APIs of NotesApp.

## SetUp

- Install [Homebrew](https://brew.sh)
- `brew install node@21` this command will install node version 21, you can skip this step if you have node version >=18 already installed
- check the npm version using to check if npm is installed successfully with Node:
    `npm --version`
- `npm install -g pnpm` this command will install pnpm globally
- can change the port from LOCAL.json file (`src/conf/LOCAL.json`) if required, by default it is 3000
- log directory can be changed by configuring logDir in LOCAL.json file -> logging -> logDir
- similarly logToFile can be changed from LOCAL.json file -> logging -> logToFile (true/false)
- mongo config must be added here: LOCAL.json -> mongoConfig (sample config present in the file)
- you can configure mongo db locally if not using mongo atlas using the [Mongo Doc](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)


## Run

- `pnpm install` to install the dependencies
- `pnpm start-dev` to build and start the server
- app will start on port `3000`
- verify if the app is running using this curl command:
    `curl --location 'http://localhost:3000/api/status'`
    ```
    reposne: `Status is OK`
    ```
    
