# BIND DNS Zone Blacklist Generator

This project generates a BIND zone file to be used in DNS based AD Blockers such as [oznu/dns-ad-blocker](https://hub.docker.com/r/oznu/dns-ad-blocker/).

The blacklist is generated using data from the [StevenBlack/hosts](https://github.com/StevenBlack/hosts) project which is extending and consolidating hosts files from a variety of sources like adaway.org, mvps.org, malwaredomains.com, someonewhocares.org, yoyo.org, and potentially others.

Since DNS based AD Blockers can support wildcard entries, this tool filters out any subdomains of known adware or malware domains, reducing the number of BIND entries required from over 29,000 to just under 19,000.

## Building the Blacklist

The blacklist can be generated using [Node.js 6.9.1](https://nodejs.org) or later.

Install:

```
git clone https://github.com/oznu/bind-zone-blacklist.git
cd bind-zone-blacklist

npm install
```

Then build:

```
node build/index.js
```

The updated zones.blacklist file will be saved in the root of the project.

### Custom Entries

Custom entries can be added to the custom.blacklist.json file in the root of this project before building.

### Whitelist

Any domains you wish to exclude from the blacklist can be added to the custom.whitelist.json file in the root of this project before building.
