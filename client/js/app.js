moment.lang('en', { relativeTime: { future : '%s', past : 'now departing', s : 'now arriving', m : '%d min', mm : '%d min', h : '%d hour', hh : '%d hours', d : 'a day', dd : '%d days', M : 'a month', MM : '%d months', y : 'a year', yy : '%d years' }})

function Station(station_id, init_func) {
  var self = this

  self.station_id = null
  self.trains = []

  self.init = function(station_id) {
    self.station_id = station_id
    init_func && init_func.call(this)
  }

  self.update = function() {
    $.getJSON('/station/' + self.station_id, function(d) {
      for (var dir in d) {
        self.trains[0] = d[dir][0].Northbound
        self.trains[1] = d[dir][1].Southbound
      }
      self.trigger('updated')
    })
    return self
  }

  self.setStation = function(station_id) {
    self.station_id = station_id
    self.trigger('set:station')
    self.update()
    return self
  }
  
  self.log = function() {
    console.log(self.trains)
  }

  riot.observable(this)
  self.init(station_id)
}


$(function() {
  $.getJSON('js/station_ids.json', function(d) {
    $.each(d, function() {
      $('#station-list').append(riot.render($('#tmpl-station').html(), this))
    })
    
    var station_callback = function() {
      var station_name = _.findWhere(d, {station_id: parseInt(this.station_id)}) === undefined ? this.station_id : _.findWhere(d, {station_id: parseInt(this.station_id)}).station_name
      $('.selected-station').text(station_name)
    }
    
    window.station = new Station('Market East', station_callback)

    window.station.on('set:station', station_callback).on('updated', function() {
      $('#track-1, #track-2').empty()
      $.each(window.station.trains[0], function() {
        this.time = moment(this.sched_time, 'MMM DD YYYY hh:mm:ss:SSSA').add('m', isNaN(parseInt(this.status)) ? this.status === 'On Time' ? 0 : NaN : parseInt(this.status)).fromNow()
        $('#track-1').append(riot.render($('#tmpl-train').html(), this))
      })
      $.each(window.station.trains[1], function() {
        this.time = moment(this.sched_time, 'MMM DD YYYY hh:mm:ss:SSSA').add('m', isNaN(parseInt(this.status)) ? this.status === 'On Time' ? 0 : NaN : parseInt(this.status)).fromNow()
        $('#track-2').append(riot.render($('#tmpl-train').html(), this))
      })
    }).update()

    setInterval(function() {
      window.station.update()
    }, 10000)
  })
  
  $(document).on('click', 'a.list-group-item', function(e) {
    e.preventDefault()
  }).on('click', '#station-list a', function(e) {
    window.station.setStation(e.target.hash.substring(1))
    e.preventDefault()
  })
})
