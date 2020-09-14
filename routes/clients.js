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
var currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Quote URL ' + process.env.STOCK_QUOTE_URL);
  if (req.session.loggedin) {
      var quoteSvcOptions = {
          uri: process.env.STOCK_QUOTE_URL + '/stock-quote/djia',
      
          json: true // Automatically parses the JSON string in the response
      };

      console.log('Getting DJIA ...');
      console.log('Calling Stock Quote svc with URL ' + quoteSvcOptions.uri);
      rp(quoteSvcOptions)
        .then(function (quote) {
            console.log('Quote returned from Stock Quote svc');
            console.log(JSON.stringify(quote));
            res.render('clients', {
              djia: quote.current,
              volume: quote.volume,
              open: quote.open,
              high: quote.high,
              low: quote.low,
              timestamp: datetime.create().format('n D Y I:M:S p')
            });


        })
        .catch(function (err) {
             res.status(500);
             res.send('Error calling API Connect gateway and Alphavantage ' + err);

        });  //res.send(req.session.passport);


  }
  else
     res.redirect('/tradr/login.html');
});


/* GET users listing. */
router.get('/:portfolioId/clientpage', function(req, res, next) {
  //console.log('Trade History URL ' + process.env.TRADE_HISTORY_URL);
  if (req.session.loggedin) {
      const portfolioOptions = {
         uri: process.env.PORTFOLIO_URL + '/portfolio/portfolios/' + req.params.portfolioId,

         json: true // Automatically parses the JSON string in the response
      };

      console.log('Calling Portfolio Svc with URL ' + portfolioOptions.uri);

      rp(portfolioOptions)
        .then(function (portfolio) {
            res.render('client', {
              portfolioId: portfolio.portfolioId,
              clientName: portfolio.clientName,
              total: currencyFormatter.format(portfolio.total),
              balance:  currencyFormatter.format(portfolio.balance),
              roi: portfolio.roi.toFixed(2) + '%',
              loyalty: portfolio.loyalty,
              freeTrades: portfolio.freeTrades,
              retrieved: datetime.create().format('n D Y I:M:S p')
            });


        })
        .catch(function (err) {
             res.status(500);
             res.send('Error calling Portfolio service ' + err);

        });  //res.send(req.session.passport);


  }
  else
     res.redirect('/tradr/login.html');
});

/* GET users listing. */
router.get('/:portfolioId', function(req, res, next) {
  //console.log('Portfolio URL ' + process.env.PORTFOLIO_URL);
  if (req.session.loggedin) {
      var rpOptions = {
          uri: process.env.PORTFOLIO_URL + '/portfolio/portfolios/client/' + req.params.portfolioId,
        //  headers: {
        //    'X-IBM-Client-Id': process.env.API_CONNECT_PROXY_CLIENTID
        //  },
          json: true // Automatically parses the JSON string in the response
      };

      console.log('Getting Client details ...');
      console.log('Calling Portfolio svc with URL ' + rpOptions.uri);
      rp(rpOptions)
        .then(function (reply) {
            console.log('Data returned from Portfolio');
            console.log(JSON.stringify(reply));

            res.json(reply);


        })
        .catch(function (err) {
             res.status(500);
             res.send('Error calling Portfolio  service ' + err);

        });  //res.send(req.session.passport);


  }
  else {
     res.status(401);
     res.send('Calling outside scope of valid login session');
  }
});

module.exports = router;
