'use strict'

const rp = require('request-promise')
const argv = require('yargs').argv

const main = () => {
  const whitelist = require('../custom.whitelist')
  const master = require('../custom.blacklist')

  const formats = [
    require('./formats/bind'),
    require('./formats/dnsmasq'),
    require('./formats/dnsmasq-server')
  ]

  return rp.get('https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts')
    .then((hosts) => {
      return hosts.split('\n')
    })
    .map((host) => {
      // Trim whitespace
      return host.trim()
    })
    .filter((host) => {
      // Remove blank lines and comments
      if (host === '') {
        return false
      } else if (host.charAt(0) === '#') {
        return false
      }
      return true
    })
    .map((host) => {
      // Extract just the hostname
      return host.split(' ')[1]
    })
    .filter((host) => {
      // Filter out whitelisted domains
      if (whitelist.includes(host)) {
        return false
      }
      return true
    })
    .then((hosts) => {
      // Sort hosts by length
      return hosts.sort((a, b) => {
        return a.length - b.length
      })
    })
    .map((host) => {
      // Remove subdomains - with dns we can block using a wildcard.
      let find = master.find(x => host.slice(-Math.abs(x.length + 1)) === '.' + x)
      if (!find) {
        if (!argv.silent) {
          console.log(`Adding zone ${host}`)
        }
        return master.push(host)
      }
      return
    }, {concurrency: 1})
    .then(() => {
      return formats
    })
    .map((format) => {
      return format(master)
    })
}

main()
