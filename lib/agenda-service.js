/*
 * loopback-connector-agenda
 * https://github.com/mrbatista/loopback-connector-agenda
 *
 * Copyright (c) 2016 Matteo Padovano
 * Licensed under the MIT license.
 */

'use strict';

var Agenda = require('agenda');

/**
 * Agenda service constructor.
 *
 * @options {Object} options Options to create a queue; see below.
 */
function AgendaService(options) {
  if (!(this instanceof AgendaService)) {
    return new AgendaService(options);
  }

  this.agenda = new Agenda(options);
}

/**
 * Connect Agenda to MongoDB
 * @param {Function} [callback] The callback function
 *
 * @callback callback
 * @param {Error} err The error object
 * @param {Db} agenda The Agenda object
 */
AgendaService.prototype.connect = function(cb) {
  var self = this;
  self.agenda.on('ready', function() {
    process.nextTick(function() {
      self.agenda.start();
      if (cb) {
        cb(null, self.agenda);
      }
    });
  });
};

AgendaService.prototype.find = function find(where, cb) {
  if (typeof where === 'function' && cb === undefined) {
    cb = where;
    where = {};
  }

  this.agenda.jobs(where, cb);
};

AgendaService.prototype.now = function schedule(name, data, cb) {
  if (typeof data === 'function' && cb === undefined) {
    cb = data;
    data = {};
  }

  this.agenda.now(name, data, cb);
};

AgendaService.prototype.schedule = function schedule(when, name, data, cb) {
  if (typeof data === 'function' && cb === undefined) {
    cb = data;
    data = {};
  }

  this.agenda.schedule(when, name, data, cb);
};

AgendaService.prototype.define = function define(jobName, options, cb) {
  if (typeof options === 'function' && cb === undefined) {
    cb = options;
    options = {};
  }
  this.agenda.define(jobName, options, cb);
};

AgendaService.prototype.purge = function purge(cb) {
  this.agenda.purge(cb);
};

AgendaService.prototype.cancel = function cancel(where, cb) {
  if (typeof where === 'function' && cb === undefined) {
    cb = where;
    where = {};
  }

  this.agenda.cancel(where, cb);
};

/**
 * Disconnect from Agenda
 */
AgendaService.prototype.disconnect = function(cb) {
  var self = this;
  if (self.agenda) {
    self.agenda.stop(function() {
      self.agenda._mdb.close();
      if (cb) {
        process.nextTick(cb);
      }
    });
  }
};

module.exports = AgendaService;
