moment.lang('en', {
  relativeTime: {
    future : '%s',
    past : '%s ago',
    s : 'arriving now',
    m : '%d min',
    mm : '%d min',
    h : '%d hour',
    hh : '%d hours',
    d : 'a day',
    dd : '%d days',
    M : 'a month',
    MM : '%d months',
    y : 'a year',
    yy : '%d years'
  }
})


function Station() {
  var self = this

  self.trains = []

  self.update = function() {
    $.getJSON('/station', function(d) {
      for (var dir in d) {
        self.trains[0] = d[dir][0].Northbound
        self.trains[1] = d[dir][1].Southbound
      }
      self.trigger('updated')
    })
    return self
  }

  self.log = function() {
    console.log(self.trains)
  }

  riot.observable(this)
}


$(function() {
  window.station = new Station()

  window.station.on('updated', function() {
    console.log(this)
    $('#track-1, #track-2').empty()
    $.each(window.station.trains[0], function() {
      this.time = moment(this.sched_time, 'MMM DD YYYY hh:mm:ss:SSSA').add('m', isNaN(parseInt(this.status)) ? this.status === 'On Time' ? 0 : NaN : parseInt(this.status)).fromNow()
      $('#track-1').append(riot.render($('#tmpl_train').html(), this))
    })
    $.each(window.station.trains[1], function() {
      this.time = moment(this.sched_time, 'MMM DD YYYY hh:mm:ss:SSSA').add('m', isNaN(parseInt(this.status)) ? this.status === 'On Time' ? 0 : NaN : parseInt(this.status)).fromNow()
      $('#track-2').append(riot.render($('#tmpl_train').html(), this))
    })
  }).update()

  setInterval(function() {
    window.station.update()
  }, 10000)

  $(document).on('click', 'a.list-group-item', function(e) {
    console.log(e)
    e.preventDefault()
  })
})
