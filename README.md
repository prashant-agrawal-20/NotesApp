# NotesApp
Gateway server to all APIs of NotesApp.

## Frameworks/DB/Tech used:
- Node.js with Typescript (for static type checking)
- express framework (for RESTful API implementation)
- InversifyJs (for IOC)
- Mongo DB (for database)
- Express Rate limiter (rate limit is: 100 requests per 15 mins configured in `index.ts` file)
- implemented jsonwebtoken npm package (for authentication purpose)
- using [node-logger](https://www.npmjs.com/package/@openscriptsin/node-logger) package for logging published by me as an opensource npm package on [npmjs](https://www.npmjs.com/).

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
- We can setup the log level using LOG_LEVEL (configured in scripts in package.json file), like in `start-dev` command


## Run

- `pnpm install` to install the dependencies
- `pnpm start-dev` to build and start the server
- app will start on port `3000`
- verify if the app is running using this curl command:
    ```
    curl --location 'http://localhost:3000/api/status'
    ```

## Sample APIs

- server status check API:
    ```
    curl --location 'http://localhost:3000/api/status'
    ```

- sample user signup api:
    ```
    curl --location 'http://localhost:3000/api/auth/signup' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "userId": "xyz@gmail.com",
    "password": "Prashant@123",
    "address": "Bangalore(560068)",
    "phoneNumber": "+918811234455"
    }'
    ```
- sample user login api (will receive a token in response to be used in other APIs): 
    ```
    curl --location 'http://localhost:3000/api/auth/login' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "userId": "xyz@gmail.com",
        "password": "Prashant@123"
    }'
    ```
- sample notes API to fetch all notes of a user:
    ```
    curl --location --request GET 'http://localhost:3000/api/notes/' \
    --header 'Authorization: <token-received-at-login>' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "userId": "xyz@gmail.com",
        "password": "Prashant@123"
    }'
    ```
- sample notes API to fetch a note using note id:
    - here note id is `_id` returned at the time of creating note or at the time of fetching notes for a user
    ```
    curl --location --request GET 'http://localhost:3000/api/notes/<_id>' \
    --header 'Authorization: <token-received-at-login>' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "userId": "xyz@gmail.com",
        "password": "Prashant@123"
    }'
    ```
- sample notes API to create a note:
    ```
    curl --location 'http://localhost:3000/api/notes/' \
    --header 'Authorization: <token-received-at-login>' \
    --header 'Content-Type: application/json' \
    --data '{
        "title": "Assigment",
        "note": "This assigment is made using Node.js, express, typescript, mongo"
    }'
    ```
- sample notes API to share a note with the other existing user:
    - shared user must exist in system before hand.
    - The shared user will just be able to read the notes.
    - The shared user will not be able to edit/share/delete the shared notes.
    ```
    curl --location 'http://localhost:3000/api/notes/<id>/share' \
    --header 'Authorization: <token-received-at-login>' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "shareWith": "xyz123@gmail.com"
    }'
    ```
- sample note API to edit the note:
    ```
    curl --location --request PUT 'http://localhost:3000/api/notes/<_id>' \
    --header 'Authorization: <token-received-at-login>' \
    --header 'Content-Type: application/json' \
    --data '{
        "title": "Assigment updated",
        "note": "Updated: This assigment is made using Node.js, express, typescript, mongo"
    }'
    ```
- sample note API to delete the note:
    ```
    curl --location --request DELETE 'http://localhost:3000/api/notes/<_id>' \
    --header 'Authorization: <token-received-at-login>'
    ```
- sample notes search API:
    ```
    curl --location 'http://localhost:3000/api/search?q=note' \
    --header 'Authorization: <token-received-at-login>'
    ```
    - here `q` is the text to search
    - works using mongo text indexing

    
