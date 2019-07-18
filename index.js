const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 9001;
const path = require('path');
const uuidv4 = require('uuid/v4');
const request = require('request');
const config = require('./config');
let uuid = "";
let state = "";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));  

app.set('view engine', 'ejs');

app.get('/google-auth', function(req,res) {
    console.log("hitting auth flow");
    uuid = uuidv4();
    state = uuidv4();
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.clientID}&response_type=code&scope=openid%20email&redirect_uri=${encodeURIComponent(config.redirect)}&state=${uuid}&login_hint="test"&nonce=${state}`;
    console.log(url);
    res.status(200).redirect(url);
});

app.get('/redirect', function(req,res) {
    if (true) {
        const body = JSON.stringify({
            "code": req.query.code,
            "client_id": config.clientID,
            "client_secret": config.secret,
            "redirect_uri": config.redirect,
            "grant_type": "authorization_code"
        });
        const options = {
            url:"https://oauth2.googleapis.com/token",
            headers:{"content-type": "application/json"},
            body: body
        };
        request.post(options, function(err, response) {
            if (err) {
                console.log(err);
            }

            else {
                let data = response.body['id_token'];
                console.log(data);
                res.render('success', {data: data});
            }
            return;
        });
    }

    else {
        res.status(401).send('invalid state');
        return;
    }
    return;
});

app.get('/authenticated', function(req,res) {
    console.log(url);
    console.log(req.body);
    res.status(200).send('ok');
});

app.listen(PORT, function(err) {
    if (err) {
        console.log(err);
    }

    else {
        console.log(`listening on ${PORT}`);
    }
});