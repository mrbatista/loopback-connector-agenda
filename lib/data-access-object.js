/*
 * loopback-connector-agenda
 * https://github.com/mrbatista/loopback-connector-agenda
 *
 * Copyright (c) 2016 Matteo Padovano
 * Licensed under the MIT license.
 */

var assert = require('assert');
var utils = require('loopback-datasource-juggler/lib/utils');

function stillConnecting(dataSource, obj, args) {
  if (typeof args[args.length - 1] === 'function') {
    return dataSource.ready(obj, args);
  }

  // promise variant
  var promiseArgs = Array.prototype.slice.call(args);
  promiseArgs.callee = args.callee;
  var cb =  utils.createPromiseCallback();
  promiseArgs.push(cb);
  if (dataSource.ready(obj, promiseArgs)) {
    return cb.promise;
  } else {
    return false;
  }
}

function DataAccessObject() {
  if (DataAccessObject._mixins) {
    var self = this;
    var args = arguments;
    DataAccessObject._mixins.forEach(function(m) {
      m.call(self, args);
    });
  }
}

DataAccessObject.getConnector = function() {
  return this.getDataSource().connector;
};

DataAccessObject.find = function find(where, cb) {
  var connectionPromise = stillConnecting(this.getDataSource(), this, arguments);
  if (connectionPromise) {
    return connectionPromise;
  }

  var Model = this;
  var connector = Model.getConnector();
  assert(typeof connector.find === 'function',
    'schedule() must be implemented by the connector');

  return connector.find(where, cb);
};

DataAccessObject.now = function schedule(name, data, cb) {
  var connectionPromise = stillConnecting(this.getDataSource(), this, arguments);
  if (connectionPromise) {
    return connectionPromise;
  }

  var Model = this;
  var connector = Model.getConnector();
  assert(typeof connector.now === 'function',
    'schedule() must be implemented by the connector');

  return connector.now(name, data, cb);
};

DataAccessObject.schedule = function schedule(when, name, data, cb) {
  var connectionPromise = stillConnecting(this.getDataSource(), this, arguments);
  if (connectionPromise) {
    return connectionPromise;
  }

  var Model = this;
  var connector = Model.getConnector();
  assert(typeof connector.schedule === 'function',
    'schedule() must be implemented by the connector');

  return connector.schedule(when, name, data, cb);
};

DataAccessObject.define = function define(jobName, options, cb) {
  var connectionPromise = stillConnecting(this.getDataSource(), this, arguments);
  if (connectionPromise) {
    return connectionPromise;
  }

  var Model = this;
  var connector = Model.getConnector();
  assert(typeof connector.define === 'function',
    'schedule() must be implemented by the connector');

  return connector.define(jobName, options, cb);
};

DataAccessObject.purge = function purge(cb) {
  var connectionPromise = stillConnecting(this.getDataSource(), this, arguments);
  if (connectionPromise) {
    return connectionPromise;
  }

  var Model = this;
  var connector = Model.getConnector();
  assert(typeof connector.purge === 'function',
    'schedule() must be implemented by the connector');

  return connector.purge(cb);
};

DataAccessObject.delete =
  DataAccessObject.cancel = function cancel(where, cb) {
  var connectionPromise = stillConnecting(this.getDataSource(), this, arguments);
  if (connectionPromise) {
    return connectionPromise;
  }

  var Model = this;
  var connector = Model.getConnector();
  assert(typeof connector.cancel === 'function',
    'schedule() must be implemented by the connector');

  return connector.cancel(where, cb);
};

module.exports = DataAccessObject;
