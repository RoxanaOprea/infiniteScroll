const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;
const faker = require("faker");
const uuid = require('uuid');

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
//pp.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send("Welcome to our restful API")
});

app.get('/user', (req, res) => {
  let data = ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.internet.userName(),
    email: faker.internet.email()
  });
  
  res.status(200).send(data);
});

app.get('/users', (req, res) => {
  const users = [];
  const { limit, offset } = req.query;
  //console.log(req);

  for(let i = offset; i <= offset+limit-1; i++) {
    users.push({
      id: uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      userName: faker.internet.userName(),
      email: faker.internet.email()
    });
  }

  res.status(200).send(users);
});

app.delete('/users/:id', (req, res) => {
    //let userId = parseInt(req.params.id);
    console.log(userId);
})


// create a GET route
app.get("/express_backend", (req, res) => {
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});
