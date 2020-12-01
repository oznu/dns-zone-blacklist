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
    // check for custom.formats file
    let custom_formats = './custom.formats.json'
    fs.access(custom_formats, fs.F_OK, (nofile) => {
      if (nofile) {
        // file does not exist
        console.log(`Using default formats, no ${custom_formats} file found.`)
        this.formats = [
          {
            type: 'bind',
            filename: 'zones.blacklist',
            enabled: true,
            template: 'zone "<%= host %>" { type master; notify no; file "null.zone.file"; };'
          },
          {
            type: 'bind',
            filename: 'bind-nxdomain.blacklist',
            enabled: true,
            template: '<%= host %> CNAME .\n*.<%= host %> CNAME .',
            header: `$TTL 60\n@ IN SOA localhost. dns-zone-blacklist. (2 3H 1H 1W 1H)\ndns-zone-blacklist. IN NS localhost.`
          },
          {
            type: 'dnsmasq',
            filename: 'dnsmasq.blacklist',
            enabled: true,
            template: 'address=/<%= host %>/0.0.0.0'
          },
          {
            type: 'dnsmasq',
            filename: 'dnsmasq-server.blacklist',
            enabled: true,
            template: 'server=/<%= host %>/'
          },
          {
            type: 'unbound',
            filename: 'unbound.blacklist',
            enabled: true,
            template: 'local-zone: "<%= host %>" redirect\nlocal-data: "<%= host %> A 0.0.0.0"'
          },
          {
            type: 'unbound',
            filename: 'unbound-nxdomain.blacklist',
            enabled: true,
            template: 'local-zone: "<%= host %>" always_nxdomain'
          }
        ]
        return
      }
      //file exists
      console.log(`Using custom formats found in ${custom_formats}.`)
      let file =  fs.readFileSync(custom_formats)
      this.formats = JSON.parse(file); 
    })
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
      if (format.enabled) {
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
      }
    })

    // write array to json file
    let custom_formats_file = JSON.stringify(this.formats, null, 2);
    fs.writeFile('custom.formats.json', custom_formats_file, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    }); 

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
