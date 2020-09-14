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
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
require('dotenv').config()

//var indexRouter = require('./routes/index');
var clientsRouter = require('./routes/clients');

var portfoliosRouter = require('./routes/portfolios');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: 'secrets that are truly secure are very hard to come up with',
	resave: true,
	saveUninitialized: true
}));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
app.use('/tradr/clients', clientsRouter);
app.use('/tradr/portfolios', portfoliosRouter);

app.get('/tradr', function(request, response) {

  response.redirect('/tradr/login.html');

});


app.get('/tradr/logout', function(request, response) {
    request.session.destroy((err) => {
         if(err) {
             return console.log(err);
         }
         response.redirect('/tradr');
     });
});


app.post('/tradr/echo', function(request, response) {
  console.log('Here');
  response.send(request.body);
});

// Handle POST request to authorize user
app.post('/tradr/auth', function(request, response) {
	var username = request.body.uname;
	var password = request.body.pwd;
	if (username && password) {
      if ((username === "stock") && (password === "trader")) {
          request.session.loggedin = true;
          request.session.username = username;
          response.redirect("/tradr/clients");
      }
      else
         response.redirect("/tradr/login.html?loginerror=true");
			response.end();
	//	});
	} else {
		response.redirect("/tradr/login.html?loginerror=true");
		response.end();
	}
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
