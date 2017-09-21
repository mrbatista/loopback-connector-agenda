'use strict';

var loopback = require('loopback');
var expect = require('./expect');
var AgendaConnector = require('../');
var app = loopback();

describe('Loopback Agenda Connector', function() {
  var QueueJob, ds;

  before(function() {
    ds = loopback.createDataSource({connector: AgendaConnector});
    QueueJob = app.model('QueueJob', {dataSource: ds, public: false});
    return QueueJob.delete();
  });

  afterEach(function() {
    return QueueJob.delete();
  });

  after(function() {
    return ds.disconnect();
  });

  it('Create job to be run now', function(done) {
    QueueJob.now('test-email', function(err, job) {
      if (err) return done(err);
      expect(job).to.exist();
      expect(job.attrs._id).to.exist();
      done();
    });
  });

  it('Create job to be run now - promise variant', function() {
    return QueueJob.now('test-email')
      .then(function(job) {
        expect(job).to.exist();
        expect(job.attrs._id).to.exist();
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

  it('Create scheduled job - promise variant', function() {
    return QueueJob.schedule(new Date(), 'test')
      .then(function(job) {
        expect(job).to.exist();
        expect(job.attrs._id).to.exist();
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

  it('Create recurrent job - promise variant', function(done) {
    QueueJob.define('test-rec')
      .spread(function(j, doneJob) {
        expect(j).to.exist();
        expect(j.attrs._id).to.exist();
        doneJob();
        done();
      });

    QueueJob.every("1 seconds", 'test-rec')
      .then(function(job) {
        expect(job).to.exist();
        expect(job.attrs._id).to.exist();
      }).catch(done);
  });

  it('Create recurrent job without done job callback', function(done) {
    QueueJob.define('test-rec', function(j) {
      expect(j).to.exist();
      expect(j.attrs._id).to.exist();
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

  it('Define job - promise variant', function(done) {
    var job;
    QueueJob.define('test')
      .spread(function(j, doneJob) {
        expect(j.attrs._id).to.be.eql(job.attrs._id);
        doneJob();
        done();
      });

    QueueJob.schedule(new Date(), 'test')
      .then(function(j) {
        job = j;
        expect(job).to.exist();
        expect(job.attrs._id).to.exist();
      }).catch(done);
  });

  it('Define job that fail', function(done) {
    var job;
    QueueJob.define('test-fail', function(j, doneJob) {
      var jobId = j.attrs._id;
      expect(jobId).to.be.eql(job.attrs._id);
      var error = new Error('generic error');
      doneJob(error);
      setTimeout(function() {
        QueueJob.find({_id: jobId}, function(err, jobs) {
          if (err) return done(err);
          expect(jobs).to.be.instanceof(Array);
          expect(jobs.length).to.be.equal(1);
          var job2 = jobs[0];
          var attrs = job2.attrs;
          expect(attrs).to.exist();
          expect(attrs.failedAt).to.be.instanceof(Date);
          expect(attrs.failReason).to.be.equal('generic error');
          expect(attrs.failCount).to.be.equal(1);
          done();
        });
      }, 200);
    });

    QueueJob.now('test-fail', function(err, j) {
      if (err) return done(err);
      job = j;
      expect(job).to.exist();
      expect(job.attrs._id).to.exist();
    });
  });

  it('Define job that fail - promise variant', function(done) {
    var job;
    QueueJob.define('test-fail')
      .spread(function(j, doneJob) {
        var jobId = j.attrs._id;
        expect(jobId).to.be.eql(job.attrs._id);
        var error = new Error('generic error');
        doneJob(error);
        setTimeout(function() {
          QueueJob.find({_id: jobId})
            .then(function(jobs) {
              expect(jobs).to.be.instanceof(Array);
              expect(jobs.length).to.be.equal(1);
              var job2 = jobs[0];
              var attrs = job2.attrs;
              expect(attrs).to.exist();
              expect(attrs.failedAt).to.be.instanceof(Date);
              expect(attrs.failReason).to.be.equal('generic error');
              expect(attrs.failCount).to.be.equal(1);
              done();
            }).catch(done);
        }, 200);
      });

    QueueJob.now('test-fail')
      .then(function(j) {
        job = j;
        expect(job).to.exist();
        expect(job.attrs._id).to.exist();
      }).catch(done);
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

  it('Find specific job - promise variant', function() {
    return QueueJob.schedule(new Date(), 'test', {text: 'Ciao'})
      .then(function(job) {
        expect(job).to.exist();
        expect(job.attrs._id).to.exist();
        return QueueJob.find({'data.text': 'Ciao'}).then(function(jobs) {
          expect(jobs).to.be.instanceOf(Array);
          expect(jobs.length).to.be.equal(1);
          expect(jobs[0].attrs.data.text).to.be.equal('Ciao');
        })
      });
  });
});
