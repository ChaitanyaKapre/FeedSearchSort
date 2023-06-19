# FeedSearchSort

### About the project/ Overview

This Api handles searching and sorting int hrefeed which is pagination enabled.

### Built with

- **[Node.js](https://nodejs.org/)** to run JavaScript on the server
- **[Express](https://expressjs.com/)** to provide server-side logic for the application
- **[JavaScript] ** to ensure the highest code quality


### Getting started

###### Clone git repository

Run this 'git clone git@github.com:ChaitanyaKapre/FeedSearchSort.git' command to clone the repository into your local.

###### Installations(After Cloning repository)

1. To install all dependencies run 'npm i' command
2. Run 'npm start' to start the server. Server will start at localhost:8080
3. Use /feed route to get all posts, /feed?search=SearchTerm to search by particular feed and 
    /feed?search=SearchTerm&sortBy=dateLastEdited for sorting the posts(if sortBy is not given by default it will get sorted by  name)
3. For running the test cases use 'npm test' command.
