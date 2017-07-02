'use strict'

const fs = require('fs')
const path = require('path')
const Bluebird = require('bluebird')
const crypto = require('crypto')

module.exports = (master) => {
  const dest = path.resolve(__dirname, '../../unbound/unbound.blacklist')
  const checksum = dest + '.checksum'

  return Bluebird.map(master, (host) => {
    return `local-zone: "${host}" redirect\nlocal-data: "${host} A 0.0.0.0"`
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
      console.log(`unbound checksum is ${sha256}`)
    })

    fs.writeFile(dest, bind, (err) => {
      if (err) {
        throw err
      }
      console.log(`${master.length} unbound zones saved to ${dest}`)
    })
  })
}
