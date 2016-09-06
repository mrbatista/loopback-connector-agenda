/*
 * loopback-connector-agenda
 * https://github.com/mrbatista/loopback-connector-agenda
 *
 * Copyright (c) 2016 Matteo Padovano
 * Licensed under the MIT license.
 */

var DataAccessObject = require('./data-access-object');
var AgendaService = require('./agenda-service');

/**
 * Initialize the agenda service as a connector for LoopBack data sources
 * @param {DataSource} dataSource DataSource instance
 * @prop {Object} settings Connector settings
 * @callback {Function} callback Callback function
 * @param {String|Object} err Error string or object
 */
exports.initialize = function initializeDataSource(dataSource, callback) {
  var settings = dataSource.settings || {};
  var connector = new AgendaService(settings);
  dataSource.connector = connector;
  dataSource.connector.dataSource = dataSource;

  if (callback) {
    dataSource.connector.connect(callback);
  }

  connector.DataAccessObject = DataAccessObject;

  
};
