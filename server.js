var http = require('request'),
  express = require('express'),
  app = express()

app.get('/station/:station_id', function(req, res) {
  var request = require("request")

  request('http://www3.septa.org/hackathon/Arrivals/' + req.params.station_id + '/10/', function(error, response, body) {
    res.setHeader('Content-Type', 'application/json')
    res.send(body)
  })
  
});

app.use('/', express.static('client'))

app.listen(80)
