const express = require('express');
const cors = require('cors');
const app = express();
const port = 3333;
const routes = require('./routes');

require('dotenv').config();

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'content-type, Authorization');
  response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  app.use(cors());
  next();
});
app.use(express.json());
app.use(routes);

app.listen(port, () => console.log(`Server is running at localhost:${port}`));

// const createUser = require('./utils/createUser');
// (async () => await createUser())();
