### An app to display trending hashtags with a corresponding giphy. 

## Run the app

Ensure that the `callback URL` in your Twitter developer app settings is set to `http://localhost:3000`.

To run the app, `cd` into the `backend` directory and run `mongod` to start MongoDB. The application is connecting to a database named `twitter-hashtags`.

This application uses a Twitter secret and key. 

`cd` into the `frontend` directory and run `npm install` and then `npm start`.

`cd` into the `backend` directory and run `npm install` and then `CONSUMER_KEY=value CONSUMER_SECRET=value npx gulp develop`.

