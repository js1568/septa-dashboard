var http = require('request'),
  express = require('express'),
  app = express();

app.get('/station', function(req, res) {
  var request = require("request");
 
  request("http://www3.septa.org/hackathon/Arrivals/Suburban%20Station/10/", function(error, response, body) {
    res.setHeader('Content-Type', 'application/json');
    res.send(body);
  });
    
});

app.use('/', express.static('client'));

app.listen(process.env.PORT);