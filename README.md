[![Travis branch](https://img.shields.io/travis/oznu/dns-zone-blacklist/master.svg)](https://travis-ci.org/oznu/dns-zone-blacklist)

# DNS Zone Blacklist Generator

This project generates a zone file for [BIND](https://en.wikipedia.org/wiki/BIND), [Dnsmasq](https://en.wikipedia.org/wiki/Dnsmasq) and [Unbound](https://en.wikipedia.org/wiki/Unbound_(DNS_server)) DNS servers using data from the [StevenBlack/hosts](https://github.com/StevenBlack/hosts) project. The generated zone files can be used to block ads and malware for an entire network when used with a local DNS server.

DNS based ad blockers can support wildcard entries. This tool filters out any subdomains of known adware or malware domains, reducing the number of zone entries required from **58,277** down to **33,187**.

| DNS Server | Response Type | Download  | SHA256 Checksum |
| ---------- |:-------------:|:---------:|:---------------:|
| BIND | 0.0.0.0 | [link](https://raw.githubusercontent.com/oznu/dns-zone-blacklist/master/bind/zones.blacklist) | [link](https://raw.githubusercontent.com/oznu/dns-zone-blacklist/master/bind/zones.blacklist.checksum) |
| BIND (RPZ) | NXDOMAIN | [link](https://raw.githubusercontent.com/oznu/dns-zone-blacklist/master/bind/bind-nxdomain.blacklist) | [link](https://raw.githubusercontent.com/oznu/dns-zone-blacklist/master/bind/bind-nxdomain.blacklist.checksum) |
| Dnsmasq | 0.0.0.0 | [link](https://raw.githubusercontent.com/oznu/dns-zone-blacklist/master/dnsmasq/dnsmasq.blacklist) | [link](https://raw.githubusercontent.com/oznu/dns-zone-blacklist/master/dnsmasq/dnsmasq.blacklist.checksum) |
| Dnsmasq | NXDOMAIN | [link](https://raw.githubusercontent.com/oznu/dns-zone-blacklist/master/dnsmasq/dnsmasq-server.blacklist) | [link](https://raw.githubusercontent.com/oznu/dns-zone-blacklist/master/dnsmasq/dnsmasq-server.blacklist.checksum) |
| Unbound | 0.0.0.0 | [link](https://raw.githubusercontent.com/oznu/dns-zone-blacklist/master/unbound/unbound.blacklist) | [link](https://raw.githubusercontent.com/oznu/dns-zone-blacklist/master/unbound/unbound.blacklist.checksum) |
| Unbound | NXDOMAIN | [link](https://raw.githubusercontent.com/oznu/dns-zone-blacklist/master/unbound/unbound-nxdomain.blacklist) | [link](https://raw.githubusercontent.com/oznu/dns-zone-blacklist/master/unbound/unbound-nxdomain.blacklist.checksum) |

## Blacklist Updates

The blacklists are updated every 24 hours with the latest data from [StevenBlack/hosts](https://github.com/StevenBlack/hosts). The builds logs are publicly available on [Travis CI](https://travis-ci.org/oznu/dns-zone-blacklist) and each zone file is tested to be valid before publishing.

## Building the Blacklist

The blacklist can be generated using [Node.js 8.4.0](https://nodejs.org) or later.

Install:

```
git clone https://github.com/oznu/dns-zone-blacklist.git
cd dns-zone-blacklist

npm install
```

Then build:

```
node build.js
```

The compiled blacklist files will be saved to the `./bind`, `./dnsmasq` and `./unbound` a directories in the root of the project.

### Custom Entries

Custom entries can be added to the custom.blacklist.json file in the root of this project before building.

### Whitelist

Any domains you wish to exclude from the blacklist can be added to the custom.whitelist.json file in the root of this project before building.
