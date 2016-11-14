'use strict';

const fs = require('fs');
const path = require('path');
const Bluebird = require('bluebird');
const crypto = require('crypto');

module.exports = (master) => {
  const dest = path.resolve(__dirname, '../../dnsmasq/dnsmasq.blacklist');
  const checksum = dest + '.checksum';

  return Bluebird.map(master, (host) => {
    return `address=/${host}/0.0.0.0`;
  })
  .then((hosts) => {
    return hosts.join('\n');
  })
  .then((bind) => {

    let sha256 = crypto.createHash('sha256').update(bind).digest('hex');
    fs.writeFile(checksum, sha256, (err) => {
      if (err) {
        throw err;
      }
      console.log(`dnsmasq checksum is ${sha256}`);
    });

    fs.writeFile(dest, bind, (err) => {
      if (err) {
        throw err;
      }
      console.log(`${master.length} dnsmasq zones saved to ${dest}`);
    });
  });
};
