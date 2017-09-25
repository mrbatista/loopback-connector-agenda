'use strict';

var DataSource = require('loopback-datasource-juggler').DataSource;
var TEST_ENV = process.env.TEST_ENV || 'test';
var config = require('rc')('loopback', {test: {mongodb: {}}})[TEST_ENV].mongodb;

if (process.env.CI) {
  config = {
    host: process.env.MONGODB_HOST || 'localhost',
    port: process.env.MONGODB_PORT || 27017,
    database: process.env.MONGODB_DATABASE || 'lb-ds-mongodb-test-' + (
      process.env.TRAVIS_BUILD_NUMBER || process.env.BUILD_NUMBER || '1'
    ),
  };
}

exports.getDataSource = global.getSchema = function(customConfig) {
  var db = new DataSource(require('../'), customConfig || config);
  db.log = function(a) {
    console.log(a);
  };

  return db;
};
