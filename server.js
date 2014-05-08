var http = require('request'),
  express = require('express'),
  app = express(),
  _ = require('underscore-node')

app.get('/station/:station_id', function(req, res) {
  var request = require("request")

  request('http://www3.septa.org/hackathon/Arrivals/' + req.params.station_id + '/10/', function(error, response, body) {
    var all_trains = [],
        d = JSON.parse(body),
        tracks = []
    
    for(var station in d) {
      for (var dira in d[station]) {
        for (var dir in d[station][dira]) {
          for (var trains in d[station][dira][dir]) {
            all_trains.push(d[station][dira][dir][trains])
          }
        }
      }
    }
    
    for (var i = 0; i <= 6; i++) {
      tracks[i] = _.where(all_trains, {track: i+''})
    }
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({track: tracks}))
  })
  
});

app.use('/', express.static('client'))

app.listen(80)
