# udpchat

simple 2 person command line chat over udp

written on a plane so my girlfriend and I could talk to each other over ad-hoc laptop wifi

```
npm install udpchat -g
```

### Usage

```
udpchat <otherUsername> <otherAddress> <myUsername> <myAddress>
``

e.g.

```
udpchat jessica udp://169.254.39.12:9999 max udp://localhost:9999
```

you can also just do `udpchat jessica udp://169.254.39.12:9999` or even just `udpchat`

## license

BSD