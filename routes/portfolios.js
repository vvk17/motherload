/*
 * Copyright 2020 IBM All Rights Reserved.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var datetime = require('node-datetime');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //console.log('Portfolio URL ' + process.env.PORTFOLIO_URL);
  if (req.session.loggedin) {
      var portfolioOptions = {
          uri: process.env.PORTFOLIO_URL + '/portfolio/portfolios',

          json: true // Automatically parses the JSON string in the response
      };

      console.log('Getting Portfolios ...');
      console.log('Calling Portfolio microservice  with URL ' + portfolioOptions.uri);
      rp(portfolioOptions)
        .then(function (reply) {
            console.log('Reply returned from Portfolio service');
            //console.log(JSON.stringify(quote));
            res.json(reply);
        })
        .catch(function (err) {
             res.status(500);
             res.send('Error calling Portfolio service ' + err);

        });  //res.send(req.session.passport);


  }
  else {
     res.status(401);
     res.send('Calling outside scope of valid login session');
  }
});

/* GET users listing. */
router.get('/:portfolioId/stocks', function(req, res, next) {
  //console.log('Stock URL ' + process.env.PORTFOLIO_URL + '/stocks/' + req.params.portfolioId);
  if (req.session.loggedin) {
      var portfolioOptions = {
          uri: process.env.PORTFOLIO_URL + '/portfolio/stocks/' + req.params.portfolioId,
        //  headers: {
        //    'X-IBM-Client-Id': process.env.API_CONNECT_PROXY_CLIENTID
        //  },
          json: true // Automatically parses the JSON string in the response
      };

      console.log('Getting Stocks ...');
      console.log('Calling Portfolio microservice  with URL ' + process.env.PORTFOLIO_URL + '/portfolio/stocks/' + req.params.portfolioId);
      rp(portfolioOptions)
        .then(function (reply) {
            console.log('Reply returned from Portfolio service');
            console.log(JSON.stringify(reply));
            const stocks = {};
            stocks.data = [];
            for (i=0; i < reply.data.length; i++) {
               const stock = {};
               stock.portfolioId = reply["data"][i].portfolioId;
               stock.symbol = reply["data"][i].symbol;
               stock.shares = reply["data"][i].shares;
               stock.price = reply["data"][i].price;
               stock.total = reply["data"][i].total;
               stock.commission = reply["data"][i].commission;
               stock.lastQuoted = datetime.create(reply["data"][i].lastQuoted).format('n D Y I:M:S p');
               stocks.data.push(stock);
            }
            res.json(stocks);
        })
        .catch(function (err) {
             res.status(500);
             res.send('Error calling Portfolio service ' + err);

        });  //res.send(req.session.passport);


  }
  else {
     res.status(401);
     res.send('Calling outside scope of valid login session');
  }
});


/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log('Portfolio URL ' + process.env.PORTFOLIO_URL);
  if (req.session.loggedin) {
      var portfolioOptions = {
          method: 'POST',
          uri: process.env.PORTFOLIO_URL + '/portfolio/portfolios',
          body: req.body,
        //  headers: {
        //    'X-IBM-Client-Id': process.env.API_CONNECT_PROXY_CLIENTID
        //  },
          json: true // Automatically parses the JSON string in the response
      };

      console.log('Creating Portfolio ...');
      console.log('Calling Portfolio microservice  with URL ' + process.env.PORTFOLIO_URL + '/portfolio/portfolios');
      rp(portfolioOptions)
        .then(function (reply) {
            console.log('Reply returned from Portfolio service');
            //console.log(JSON.stringify(quote));
            res.json(reply);
        })
        .catch(function (err) {
             res.status(500);
             res.send('Error calling Portfolio service ' + err);

        });  //res.send(req.session.passport);


  }
  else {
     res.status(401);
     res.send('Calling outside scope of valid login session');
  }
});

/* GET users listing. */
router.put('/', function(req, res, next) {
  //console.log('Portfolio URL ' + process.env.PORTFOLIO_URL);
  if (req.session.loggedin) {
      var portfolioOptions = {
          method: 'PUT',
          uri: process.env.PORTFOLIO_URL + '/portfolio/portfolios',
          body: req.body,
        //  headers: {
        //    'X-IBM-Client-Id': process.env.API_CONNECT_PROXY_CLIENTID
        //  },
          json: true // Automatically parses the JSON string in the response
      };

      console.log('Updating Portfolio ...');
      console.log('Calling Portfolio microservice  with URL ' + process.env.PORTFOLIO_URL + '/portfolio/portfolios');
      rp(portfolioOptions)
        .then(function (reply) {
            console.log('Reply returned from Portfolio service');
            //console.log(JSON.stringify(quote));
            res.json(reply);
        })
        .catch(function (err) {
             res.status(500);
             res.send('Error calling Portfolio service ' + err);

        });  //res.send(req.session.passport);


  }
  else {
     res.status(401);
     res.send('Calling outside scope of valid login session');
  }
});



module.exports = router;
