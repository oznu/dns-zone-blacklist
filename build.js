'use strict'

const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const crypto = require('crypto')
const rp = require('request-promise')

class Blacklist {
  constructor () {
    this.whitelist = require('./custom.whitelist')
    this.blacklist = require('./custom.blacklist')

    this.formats = [
      {
        type: 'bind',
        filename: 'zones.blacklist',
        template: 'zone "<%= host %>" { type master; notify no; file "null.zone.file"; };'
      },
      {
        type: 'bind',
        filename: 'bind-nxdomain.blacklist',
        template: '<%= host %> CNAME .\n*.<%= host %> CNAME .',
        header: `$TTL 60\n@ IN SOA localhost. dns-zone-blacklist. (2 3H 1H 1W 1H)\ndns-zone-blacklist. IN NS localhost.`
      },
      {
        type: 'dnsmasq',
        filename: 'dnsmasq.blacklist',
        template: 'address=/<%= host %>/0.0.0.0'
      },
      {
        type: 'dnsmasq',
        filename: 'dnsmasq-server.blacklist',
        template: 'server=/<%= host %>/'
      },
      {
        type: 'unbound',
        filename: 'unbound.blacklist',
        template: 'local-zone: "<%= host %>" redirect\nlocal-data: "<%= host %> A 0.0.0.0"'
      },
      {
        type: 'unbound',
        filename: 'unbound-nxdomain.blacklist',
        template: 'local-zone: "<%= host %>" always_nxdomain'
      }
    ]
  }

  async build () {
    let hosts = await rp.get('https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts')
    let stats = await rp.get('https://raw.githubusercontent.com/StevenBlack/hosts/master/readmeData.json', {json: true})

    // Filter the original hosts file
    hosts
      .split('\n')
      .map(x => x.trim())
      .filter(x => !(x === '' || x.charAt(0) === '#'))
      .map(x => x.split(' ')[1])
      .filter(x => !this.whitelist.includes(x))
      .sort((a, b) => a.length - b.length)
      .map(host => {
        if (!this.blacklist.find(x => host.slice(-Math.abs(x.length + 1)) === '.' + x)) {
          this.blacklist.push(host)
        }
      })

    // Build a zone blacklist for each format type
    this.formats.forEach((format) => {
      let zoneFile = this.blacklist.map(x => ejs.render(format.template, {host: x})).join('\n')

      if (format.header) {
        zoneFile = format.header + '\n\n' + zoneFile
      }

      let sha256 = crypto.createHash('sha256').update(zoneFile).digest('hex')
      let dest = path.resolve(__dirname, `${format.type}/${format.filename}`)

      fs.writeFileSync(`${dest}.checksum`, sha256)
      console.log(`${format.filename} checksum is ${sha256}`)

      fs.writeFileSync(`${dest}`, zoneFile)
      console.log(`${this.blacklist.length} ${format.filename} zones saved to ${dest}`)
    })

    // Update the README.md file
    let readmeTemplate = fs.readFileSync(path.resolve(__dirname, 'README.template.md'), 'utf8')
    let readme = ejs.render(readmeTemplate, {
      hosts: stats.base.entries.toLocaleString(),
      zones: this.blacklist.length.toLocaleString()
    })

    fs.writeFileSync(path.resolve(__dirname, 'README.md'), readme)
  }
}

const blacklist = new Blacklist()

blacklist.build()
