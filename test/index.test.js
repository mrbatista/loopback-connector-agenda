'use strict';

var loopback = require('loopback');
var chai = require('chai');
chai.use(require('dirty-chai'));
var expect = chai.expect;
var AgendaConnector = require('../');
var app = loopback();

describe('Loopback Agenda Connector', function() {
  var QueueJob, ds;

  before(function(done) {
    ds = loopback.createDataSource({connector: AgendaConnector});
    QueueJob = app.model('QueueJob', {dataSource: ds, public: false});
    QueueJob.delete(done);
  });

  afterEach(function(done) {
    QueueJob.delete(done);
  });

  after(function(done) {
    ds.disconnect(done);
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

  it('Create recurrent job', function(done) {
    QueueJob.define('test-rec', function(j, doneJob) {
      expect(j).to.exist();
      expect(j.attrs._id).to.exist();
      doneJob();
      done();
    });
    
    QueueJob.every("1 seconds", 'test-rec', function(err, job) {
      if (err) return done(err);
      expect(job).to.exist();
      expect(job.attrs._id).to.exist();
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
