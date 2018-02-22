var async = require('async')
var jsonist = require('jsonist')
var request = require('request')
var through = require('through2')
var template = require('lodash.template')
var remove_meta = require('./remove-meta')

module.exports = function(config) {
  return through.obj(function(obj, enc, cb) {

    async.retry({
      times: config.retryTimes || 1,
      interval: config.retryInterval || 100
    }, function (callback) {

      var req_opts = {
        method: config.method || 'post',
        uri: config.url
      }
      if (config.urlTemplate) {
        var compiled = template(req_opts.uri)
        req_opts.uri = compiled(obj)
      }
      if (config.key) {
        req_opts.method = 'put';
        req_opts.uri = req_opts.uri + '/' + obj[config.key];
      }

      if (config.removeMeta) {
        obj = remove_meta(obj)
      }

      var update = function(){
        jsonist[req_opts.method].call(null, req_opts.uri, obj, function (err, resp) {
          if (err) {
            if (config.swallowErrors) return callback(null, {ok: false, error: err.toString() })
            else return callback(err);
          }
          obj._id = resp._id;
          callback(null, obj);
        })
      }
      if(config.key && config.copy_fields_from_prev_rev) prev_get(obj, config, update)
      else update()

    }, cb)
  })
}


function prev_get(obj, config, cb) {

  var fields = config.copy_fields_from_prev_rev;
  if (! Array.isArray(fields)) {
    fields = config.copy_fields_from_prev_rev.split(',');
  }

  jsonist.get(config.url + '/' + obj[config.key], function(err, doc) {
    if (err) return cb(err);
    fields.forEach(function(field){
      obj[field] = doc[field];
    })
    cb()
  })
}
