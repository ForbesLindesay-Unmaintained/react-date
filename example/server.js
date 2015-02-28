'use strict';

var fs = require('fs');
var React = require('react');
var express = require('express');
var browserify = require('browserify-middleware');
var Application = require('./app');

var app = express();

app.get('/', function (req, res) {
  var html = fs.readFileSync(__dirname + '/index.html', 'utf8');
  html = html.replace('{{component}}', React.renderToString(React.createElement(Application)));
  res.send(html);
});
app.get('/index.js', browserify(__dirname + '/index.js'));

app.listen(3000);
