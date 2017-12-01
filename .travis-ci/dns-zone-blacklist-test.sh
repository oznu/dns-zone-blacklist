#!/usr/bin/env bats

@test "test bind-nxdomain.blacklist is valid bind conf" {
  run named-checkconf /dns-zone-blacklist/bind/zones.blacklist
  [ "$status" -eq 0 ]
}

@test "test bind-nxdomain.blacklist is a valid bind zone file" {
  run named-checkzone dns-zone-blacklist /dns-zone-blacklist/bind/bind-nxdomain.blacklist
  [ "$status" -eq 0 ]
}

@test "test dnsmasq.blacklist is valid dnsmasq conf" {
  run dnsmasq --test --conf-file=/dns-zone-blacklist/dnsmasq/dnsmasq.blacklist
  [ "$status" -eq 0 ]
}

@test "test dnsmasq-server.blacklist is valid dnsmasq conf" {
  run dnsmasq --test --conf-file=/dns-zone-blacklist/dnsmasq/dnsmasq-server.blacklist
  [ "$status" -eq 0 ]
}

@test "test unbound.blacklist is valid unbound conf" {
  run unbound-checkconf /dns-zone-blacklist/.travis-ci/conf/unbound.conf
  [ "$status" -eq 0 ]
}

@test "test unbound-nxdomain.blacklist is valid unbound conf" {
  run unbound-checkconf /dns-zone-blacklist/.travis-ci/conf/unbound-nxdomain.conf
  [ "$status" -eq 0 ]
}
