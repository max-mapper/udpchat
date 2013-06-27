#!/usr/bin/env node
var friend = {
  them: process.argv[2],
  target: process.argv[3],
  me: process.argv[4],
  local: process.argv[5]
}
require('../')(friend)