'use strict';

const fs = require('fs');
const path = require('path');
const Bluebird = require('bluebird');

module.exports = (master) => {
  const dest = path.resolve(__dirname, '../../bind/zones.blacklist');

  return Bluebird.map(master, (host) => {
    return `zone "${host}" { type master; notify no; file "null.zone.file"; };`;
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
