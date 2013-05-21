
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , Handlebars = require('hbs')
  , amqp = require('amqp')
  , async = require('async')
  , redis = require('redis')
  , request = require('request')
  , path = require('path');

var app = express();


// generic functions
parseMonthName = function(digit){
  var month=new Array();
  month[0]="January";
  month[1]="February";
  month[2]="March";
  month[3]="April";
  month[4]="May";
  month[5]="June";
  month[6]="July";
  month[7]="August";
  month[8]="September";
  month[9]="October";
  month[10]="November";
  month[11]="December";
  
  return month[digit];

};

// generic Handlebars helpers
Handlebars.registerHelper("key_value", function(obj, fn) {
  var buffer = "",
    key;
 
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      buffer += fn({key: key, value: obj[key]});
    }
  }
     
  return buffer;
});
Handlebars.registerHelper("each_with_key", function(obj, fn) {
  var context,
  buffer = "",
  key,
  keyName = fn.hash.key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      context = obj[key];
      if (keyName) {
        context[keyName] = key;
      }
      buffer += fn(context);
    }
  }

  return buffer;
});

Handlebars.registerHelper('link', function(text, options) {
  var attrs = [];

  for(var prop in options.hash) {
    attrs.push(prop + '="' + options.hash[prop] + '"');
  }

  return new Handlebars.SafeString(
    "<a " + attrs.join(" ") + ">" + text + "</a>"
  );
});

Handlebars.registerHelper('datetime', function(obj, fn){
  return obj.getUTCDate() + ". " + parseMonthName(obj.getUTCMonth())
})

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.favicon('http://cdn.zyg.li/01/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/:article', routes.article);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), '127.0.0.1');
