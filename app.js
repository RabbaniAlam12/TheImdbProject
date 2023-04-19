const express = require('express');
const controller = require('./controller/controller.js');
const db = require('./utility/index');
const bodyParser = require('body-parser');
const session = require('express-session');


const app = express();

// configure session middleware
app.use(session({
    secret: 'my-secret', // replace with a secret string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));
  
app.use(bodyParser.json());
const port = 3000;

async function connectionToDb() {
    await db();
}

connectionToDb();

app.use(express.static(__dirname + '/view'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/view/register.html');
});


app.use("/", controller);




db().then(() => {
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}).catch((err) => {
    console.error(`Error while starting server: ${err}`);
})

module.exports = app;