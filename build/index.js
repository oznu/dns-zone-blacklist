'use strict';

const fs = require('fs');
const rp = require('request-promise');

const whitelist = require('./whitelist');
const master = [];

rp.get('https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts')
  .then((hosts) => {
    return hosts.split('\n');
  })
  .map((host) => {
    // Trim whitespace
    return host.trim();
  })
  .filter((host) => {
    // Remove blank lines and comments
    if (host === '') {
      return false;
    } else if (host.charAt(0) === '#') {
      return false;
    }
    return true;
  })
  .map((host) => {
    // Extract just the hostname
    return host.split(' ')[1];
  })
  .filter((host) => {
    // Filter out whitelisted domains
    if (whitelist.includes(host)) {
      return false;
    }
    return true;
  })
  .then((hosts) => {
    // Sort hosts by length
    return hosts.sort((a, b) => {
      return a.length - b.length;
    });
  })
  .map((host) => {
    // Remove subdomains - with dns we can block using a wildcard.
    let find = master.find(x => host.slice(-Math.abs(x.length + 1)) === '.' + x);
    if (!find) {
      return master.push(host);
    }
    console.log(host + ' is a subdomain of ' + find);
    return;
  }, {concurrency: 1})
  .then(() => {
    return master;
  })
  .map((host) => {
    // Format for bind zone file
    return `zone "${host}" { type master; notify no; file "/etc/bind/null.zone.file"; };`;
  })
  .then((hosts) => {
    return hosts.join('\n');
  })
  .then((bind) => {
    fs.writeFile('zones.blacklist', bind, (err) => {
      if (err) {
        throw err;
      }
      console.log('It\'s saved!');
    });
  });
