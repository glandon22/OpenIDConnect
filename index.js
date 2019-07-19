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

/**
 * This route is called when user hits submit on index.html
 * It makes a google to google to begin authenticating a user
 */
app.get('/google-auth', function(req,res) {
    uuid = uuidv4();
    state = uuidv4();
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.clientID}&response_type=code&scope=${encodeURIComponent("openid profile email https://www.googleapis.com/auth/drive.file")}&redirect_uri=${encodeURIComponent(config.redirect)}&state=${uuid}&login_hint="test"&nonce=${state}`;
    res.status(200).redirect(url);
});

/**
 * Google will redirect a successfully authenticated user to this url
 * 
 * The access token is captured as well as the JWT containing user information
 * The access token is then used to query the open ID endpoint and return additional user info
 */
app.get('/redirect', function(req,res) {
    let token = "";
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
                token = JSON.parse(response.body);
                console.log(response.body);
                console.log(token.access_token);
                const options1 = {
                    url:"https://openidconnect.googleapis.com/v1/userinfo",
                    headers:{"Authorization": "Bearer " + token.access_token} 
               };
                request.get(options1, function(err, response1) {
                    if (err) {
                        console.log(err);
                    }
        
                    else {
                        let data = response1.body;
                        res.render('success', {data: data});
                    }
                    return;
                });
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

app.listen(PORT, function(err) {
    if (err) {
        console.log(err);
    }

    else {
        console.log(`listening on ${PORT}`);
    }
});