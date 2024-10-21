# Thought Organizer API

- Building an API to help organizing thoughts to help with anxiety, in this API, users can list all of their thoughts by name (or whatever is causing anxiety or worry), then they can add more details and information about each thought, identifying potential problems, and coming up with possible solutions, and they can also add a positive affirmation to help cope with their stress if any.
- Using Node.js, Express.js and MongoDB

# Requirements:

- Initialize package.json file: `npm init`
- Install Express: `npm install express`
- type mongosh --version to check if you already have mongo
- Install Mongo in mongoDB.com
- Install mongoose library: `npm install mongoose'
- Install babel to help with compiling:

```bash
npm install - - save-dev @babel/core @babel/cli @babel/node @babel/preset-env
```

- Install nodemon and body parser: `npm install nodemon body-parser`
-

```bash
npm install passport passport-jwt jsonwebtoken passport-local
```

- `npm install dotenv`
  `npm install express-validator`
  `npm install cors`

## Documentation

1. `npm install swagger-ui-express swagger-jsdoc yamljs`
2. Set up swagger in index.js
3. visit "localhost:3000/api-docs" for documentation

## Production Ready Code

- babel-node is not recommended in production, it's heavy, with high memory usage due to cache being stored in memory

Step 1: Move all your server (js) files in another folder.
Step 2: In package.json

- set a npm script to clean/create the build directory
  `"clean": "rm -rf build && mkdir build"`
- Add a npm script to transpile the server files eg.
  `"build-server": "babel -d ./build ./server -s"`
- Set build-server script to run from the build script eg.
  `"build": "npm run clean && npm run build-server"`
- Set a start script pointing to the build directory
  `"start": "node ./build/index.js"`

```bash
"scripts": {
    "clean": "rm -rf build && mkdir build",
    "build-server": "babel -d ./build ./server -s",
    "build": "npm run clean && npm run build-server",
    "start": "node ./build/index.js",
    "debug": "node --debug ./build/index.js"
  },
```
