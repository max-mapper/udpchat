var dgram = require('dgram')
var fs = require('fs')
var ansi = require('ansi')
var spawn = require('child_process').spawn
var url = require('url')

var socket = dgram.createSocket('udp4')
var port = 12346
var cursor = ansi(process.stdout)

module.exports = function(opts) {
  if (!opts.them) opts.them = 'them'
  if (!opts.target) opts.target = 'udp://0.0.0.0:9999'
  if (!opts.me) opts.me = 'you'
  if (!opts.local) opts.local = 'udp://0.0.0.0:9999'
  
  var target = url.parse(opts.target)
  var me = url.parse(opts.local)
  
  process.stdin.setRawMode(true)
  process.stdin.setEncoding('utf8')

  // sending message
  var message = ''
  process.stdin.on('data', function(c) {
    var str = c.toString()
    c = str.charCodeAt(0)
    if (c === 3) return process.exit()
    if (c === 13) {
      if (message === '') return
      var buf = new Buffer(message)
      socket.send(buf, 0, buf.length, target.port, target.hostname, function(err, bytes) {
        if (err && err.code === 'ENOTFOUND') return console.log('could not deliver message :(')
        else if (err) console.log('error!', err, err.message)
        cursor.white().bg.black().write(' ' + opts.me + ' ')
        cursor.reset().bg.reset().write(' ' + buf.toString() + '\n')
      })
      message = ''
      return
    }
    message += str
  })


  // receiving message
  socket.on("message", function (msg, rinfo) {
    cursor.black().bg.cyan().write(' ' + opts.them + ' ')
    cursor.blue().bg.reset().write(' ' + msg.toString())
    cursor.write('\n')
    cursor.reset()
    spawn("/usr/bin/afplay", ["/System/Library/Sounds/Submarine.aiff"])
  })
  
  socket.on('error', function(e) {
    // no op
  })
  
  // open socket
  socket.bind(me.port)
  socket.on('listening', function () {
    var address = socket.address()
    console.log('listening on udp://' + address.address + ':' + address.port)
    console.log('sending to udp://' + target.hostname + ':' + target.port)
    console.log('type message + hit enter to send')
    socket.setMulticastTTL(16)
  })
}

