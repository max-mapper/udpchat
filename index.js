var dgram = require('dgram')
var fs = require('fs')
var ansi = require('ansi')
var spawn = require('child_process').spawn
var readline = require('readline')
var url = require('url')

var socket = dgram.createSocket('udp4')
var port = 12346

module.exports = function(opts) {
  if (!opts.them) opts.them = 'them'
  if (!opts.target) opts.target = 'udp://0.0.0.0:9999'
  if (!opts.me) opts.me = 'you'
  if (!opts.local) opts.local = 'udp://0.0.0.0:9999'
  
  var target = url.parse(opts.target)
  var me = url.parse(opts.local)
  
  var rl = readline.createInterface(process.stdin, process.stdout)
  
  rl.clearLine = function() {
    rl.write(null, {ctrl: true, name: 'u'})
  }
  
  var cursor = ansi(rl.output)
  
  rl.setPrompt('', 0)
  rl.prompt()
  
  // sending message
  rl.on('line', function(line) {
    rl.clearLine()
    rl.prompt()
    var message = line.trim()
    if (message === '') return
    var buf = new Buffer(message)
    socket.send(buf, 0, buf.length, target.port, target.hostname, function(err, bytes) {
      if (err && err.code === 'ENOTFOUND') return console.log('could not deliver message :(')
      else if (err) console.log('error!', err, err.message)
      cursor.white().bg.black().write(' ' + opts.me + ' ')
      cursor.reset().bg.reset().write(' ' + buf.toString() + '\n')
    })
  })


  // receiving message
  socket.on("message", function (msg, rinfo) {
    cursor.black().bg.cyan().write(' ' + opts.them + ' ')
    cursor.blue().bg.reset().write(' ' + msg.toString())
    cursor.write('\u0007\n')
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
