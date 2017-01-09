/*
 * loopback-connector-agenda
 * https://github.com/mrbatista/loopback-connector-agenda
 *
 * Copyright (c) 2016 Matteo Padovano
 * Licensed under the MIT license.
 */

var DataAccessObject = require('./data-access-object');
var AgendaService = require('./agenda-service');

/*!
 * Generate the mongodb URL from the options
 */
function generateMongoDBURL(options) {
  options.hostname = (options.hostname || options.host || '127.0.0.1');
  options.port = (options.port || 27017);
  options.database = (options.database || options.db || 'test');
  var username = options.username || options.user;
  if (username && options.password) {
    return 'mongodb://' + username + ':' + options.password + '@' + options.hostname + ':' + options.port + '/' + options.database;
  } else {
    return 'mongodb://' + options.hostname + ':' + options.port + '/' + options.database;
  }
}

/**
 * Initialize the agenda service as a connector for LoopBack data sources
 * @param {DataSource} dataSource DataSource instance
 * @prop {Object} settings Connector settings
 * @callback {Function} callback Callback function
 * @param {String|Object} err Error string or object
 */
exports.initialize = function initializeDataSource(dataSource, callback) {
  var s = dataSource.settings || {};
  s.db = s.db || {};
  s.db.address = s.db.address || generateMongoDBURL(s.db);
  s.db.collection = s.db.collection || 'AgendaJob';
  var connector = new AgendaService(s);
  dataSource.connector = connector;
  dataSource.connector.dataSource = dataSource;

  if (callback) {
    dataSource.connector.connect(callback);
  }

  connector.DataAccessObject = DataAccessObject;
};
