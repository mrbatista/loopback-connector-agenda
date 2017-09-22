/*
 * loopback-connector-agenda
 * https://github.com/mrbatista/loopback-connector-agenda
 *
 * Copyright (c) 2016 Matteo Padovano
 * Licensed under the MIT license.
 */

'use strict';

var Promise = require('bluebird');

function createPromiseCallback() {
  var cb;
  var promise = new Promise(function(resolve, reject) {
    cb = function(err, data) {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    };
  });
  cb.promise = promise;
  return cb;
}

function createPromiseCallbackMultipleArgs() {
  var cb;
  var promise = new Promise(function(resolve) {
    cb = function(job, jobCallback) {
      return resolve([job, jobCallback]);
    };
  });
  cb.promise = promise;
  return cb;
}

exports.createPromiseCallback = createPromiseCallback;
exports.createPromiseCallbackMultipleArgs = createPromiseCallbackMultipleArgs;
