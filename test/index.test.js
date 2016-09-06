'use strict';

var loopback = require('loopback');
var chai = require('chai');
chai.use(require('dirty-chai'));
var expect = chai.expect;
var AgendaConnector = require('../');
var mongoConnectionString = "mongodb://192.168.99.100:32768/development";
var app = loopback();

describe('Loopback Agenda Connector', function() {
  var QueueJob;

  before(function(done) {
    var ds = loopback.createDataSource({
      db: {address: mongoConnectionString, collection: "AgendaJob"},
      connector: AgendaConnector});
    QueueJob = app.model('QueueJob', {dataSource: ds, public: false});
    QueueJob.delete(done);
  });

  afterEach(function(done) {
    QueueJob.delete(done);
  });

  it('Create job to be run now', function(done) {
    QueueJob.now('test-email', function(err, job) {
      if (err) return done(err);
      expect(job).to.exist();
      expect(job.attrs._id).to.exist();
      done();
    });
  });

  it('Create scheduled job', function(done) {
      QueueJob.schedule(new Date(), 'test', function(err, job) {
        if (err) return done(err);
        expect(job).to.exist();
        expect(job.attrs._id).to.exist();
        done();
      });
  });

  it('Define job', function(done) {
    var job;
    QueueJob.define('test', function(j, doneJob) {
      expect(j.attrs._id).to.be.eql(job.attrs._id);
      doneJob();
      done();
    });

    QueueJob.schedule(new Date(), 'test', function(err, j) {
      if (err) return done(err);
      job = j;
      expect(job).to.exist();
      expect(job.attrs._id).to.exist();
    });
  });

  it('Find specific job', function(done) {
    QueueJob.schedule(new Date(), 'test', {text: 'Ciao'}, function(err, job) {
      if (err) return done(err);
      expect(job).to.exist();
      expect(job.attrs._id).to.exist();
      QueueJob.find({'data.text': 'Ciao'}, function(err, jobs) {
        if (err) return done(err);
        expect(jobs).to.be.instanceOf(Array);
        expect(jobs.length).to.be.equal(1);
        expect(jobs[0].attrs.data.text).to.be.equal('Ciao');
        done();
      })
    });
  });

});
