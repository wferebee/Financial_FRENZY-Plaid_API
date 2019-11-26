//  Server Starting Point and Plaid API setup

/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */

//  Dependencies
//=========================================================================
require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var db = require("./models");
var session = require("express-session");
var passport = require("./config/passport");
var envvar = require('envvar');
var moment = require('moment');
var plaid = require('plaid');

//  App Setup
//=========================================================================
var app = express();
var PORT = process.env.PORT || 3000;
var APP_PORT = envvar.number('APP_PORT', 8000);
var PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID', "5dd040478e6cda0015503374");
var PLAID_SECRET = envvar.string('PLAID_SECRET', "8f619741faf8c93a1e4b0ea823d88f");
var PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY', "d709a077c62c423a5d9652fa75e96b");
var PLAID_ENV = envvar.string('PLAID_ENV', 'development');

// Plaid keys
//=========================================================================
var ACCESS_TOKEN = null;
var PUBLIC_TOKEN = null;

// Middleware and data parsing
//=========================================================================
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
//=========================================================================


// Routes
//=========================================================================
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// Plaid API sync
//========================================================================
var syncOptions = { force: false };
var client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV],
  {version: '2019-05-29', clientApp: 'Plaid Quickstart'}
);

// Plaid API routes
//========================================================================
// If running a test, set syncOptions.force to truegi
// clearing the `testdb`

app.post('/get_access_token', function(request, response, next) {
  PUBLIC_TOKEN = request.body.public_token;
  client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
    if (error != null) {
      console.log('Could not exchange public_token!' + '\n' + error);
      return response.json({error: msg});
    }
    ACCESS_TOKEN = tokenResponse.access_token;
    ITEM_ID = tokenResponse.item_id;
    console.log('Access Token: ' + ACCESS_TOKEN);
    console.log('Item ID: ' + ITEM_ID);
    response.json(ACCESS_TOKEN);
  });
});


app.post('/accounts/balance/get',function(req, res){
  
  client.getBalance(req.body.token,(err, result) => {
    // Handle err
    if(result){
      res.json(result.accounts[0].balances.available)
    }
    else{
      console.log("Try again");
    }
  });
});

if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

  // Pull transactions for a date range
  app.post("/transaction/get", function(req,res){
    client.getTransactions(req.body.token, '2019-01-01', '2019-11-24', {
      count: 300,
      offset: 0,
    }, (err, result) => {
      if(result){
        res.json(result.transactions);
      }
      else{
        console.log(err);
      }
  });
  })
  
  
// Starting the server, syncing models
//======================================================================
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
