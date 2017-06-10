'use strict'

const fs = require('fs')
const path = require('path')
const Bluebird = require('bluebird')
const crypto = require('crypto')

module.exports = (master) => {
  const dest = path.resolve(__dirname, '../../bind/zones.blacklist')
  const checksum = dest + '.checksum'

  return Bluebird.map(master, (host) => {
    return `zone "${host}" { type master; notify no; file "null.zone.file"; };`
  })
  .then((hosts) => {
    return hosts.join('\n')
  })
  .then((bind) => {
    let sha256 = crypto.createHash('sha256').update(bind).digest('hex')
    fs.writeFile(checksum, sha256, (err) => {
      if (err) {
        throw err
      }
      console.log(`bind checksum is ${sha256}`)
    })

    fs.writeFile(dest, bind, (err) => {
      if (err) {
        throw err
      }
      console.log(`${master.length} bind zones saved to ${dest}`)
    })
  })
}
