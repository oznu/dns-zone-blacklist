FROM alpine:latest

RUN apk add --no-cache bats bind bind-tools dnsmasq unbound

CMD ["/dns-zone-blacklist/.travis-ci/dns-zone-blacklist-test.sh"]
