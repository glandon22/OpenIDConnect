const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 9001;
const path = require('path');
const uuidv4 = require('uuid/v4');
const request = require('request');
const config = require('./config');
let uuid = "";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));  

app.get('/google-auth', function(req,res) {
    console.log("hitting auth flow");
    uuid = uuidv4();
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.clientID}\
    &response_type=code\
    &scope=openid%20email\
    &redirect_uri=${config.redirect}\
    &state=${uuid}\
    &login_hint="test"\
    &nonce=${uuidv4()}`;
});

app.get('/redirect', function(req,res) {
    console.log(req.params);
    return;
}); 

app.all('/*', function(req,res) {
    console.log(req.params);
    console.log(req.url);
    console.log(req.body);
    return;
}); 

app.listen(PORT, function(err) {
    if (err) {
        console.log(err);
    }

    else {
        console.log(`listening on ${PORT}`);
    }
});