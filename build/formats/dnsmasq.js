'use strict';

const fs = require('fs');
const path = require('path');
const Bluebird = require('bluebird');

module.exports = (master) => {
  const dest = path.resolve(__dirname, '../../dnsmasq/dnsmasq.blacklist');

  return Bluebird.map(master, (host) => {
    return `address=/${host}/0.0.0.0`;
  })
  .then((hosts) => {
    return hosts.join('\n');
  })
  .then((bind) => {
    fs.writeFile(dest, bind, (err) => {
      if (err) {
        throw err;
      }
      console.log(`${master.length} zones saved to ${dest}`);
    });
  });
};
