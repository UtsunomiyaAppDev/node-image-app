var morgan = require('morgan');
var body_parser = require('body-parser');
var express = require('express');
var app = express();
var path = require('path');
var router = require('./config/routes.js');

app.use(morgan('dev'));
app.use(body_parser.urlencoded({extended : true}));
app.use(body_parser.json());

app.use('/',express.static(path.join(__dirname, '../client')));
app.use('/api/v1', router);


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('Express server listening on port 8080');
});



module.exports = app;
