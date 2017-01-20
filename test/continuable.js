var pull = require('../pull')
var values = require('../sources/values')
var map = require('../throughs/map')
var error = require('../sources/error')
var test = require('tape')

test('continuable stream', function (t) {
  t.plan(2)

  var continuable = function (read) {
    return function (cb) {
      read(null, function (end, data) {
        if (end === true) return cb(null)
        if (end) return cb(end)
      })
    }
  }

  // With values:
  pull(
    values(1, 2, 3, 4, 5),
    map(function (item) {
      return item * 2
    }),
    continuable
  )(function (err) {
    t.is(err, null, 'no error')
  })

  // With error:
  pull(
    error(new Error('test error')),
    continuable
  )(function (err) {
    t.is(err.message, 'test error', 'error')
  })
})
