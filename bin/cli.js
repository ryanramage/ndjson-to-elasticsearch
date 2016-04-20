#!/usr/bin/env node
var ndjson = require('ndjson');
var through = require('through2');

var config = require('rc')('ndjson-to-elasticsearch', {
  url: undefined,
  key: undefined,
  swallowErrors: false,
  copy_fields_from_prev: undefined,
  urlTemplate: false,
  retryTimes: 1,
  retryInterval: 100
})

if (!config.url && config._[0]) {
  config.url = config._[0];
}

if (!config.key && config._[1]) {
  config.key = config._[1];
}

var to_es = require('../lib');


process.stdin
  .pipe(ndjson.parse())
  .pipe(to_es(config))
  .pipe(ndjson.stringify())
  .pipe(process.stdout)
