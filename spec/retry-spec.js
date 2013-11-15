describe('retry.onceOnError', function() {

  it('should not retry if computation succeeds', function(done) {
    retry.onceOnError(function(cont) {
      cont(3)
    }, 0, c.success(function(z) {
      z.should === 3
      done();
    }));
  });

  describe('retrying', function() {
    it('should succeed if second time computation succeeds', function(done) {
      var firstTime = true;
      retry.onceOnError(function(cont) {
        if (firstTime) {
          firstTime = false;
          cont.onError('ups!')
        } else {
          cont(3)
        }
      }, 0, c.success(function(z) {
        z.should == 3
        done();
      }));
    })

    it('should fail retying when second time computation fails', function(done) {
      retry.onceOnError(function(cont) {
        cont.onError('ups!')
      }, 0, c.fail(function(error) {
        error.should.be.eq('ups!')
        done();
      }));
    })
  });

  describe('continuous retrying', function() {
    const delay = 100;

    function okAfter3Evaluations() {
      var i = 0;
      return function(cont) {
        if (i === 3) {
          cont('ok')
        } else {
          i++;
          cont.onError('ups')
        }
      };
    }

    it('should support eternal looping', function(done) {
      var f = okAfter3Evaluations();
      retry.alwaysOnError(f, 0, c.success(function(z) {
        z.should.be.eq('ok')
        done();
      }))
    });

    it('should support looping with delay', function(done) {
      var f = okAfter3Evaluations();
      retry.alwaysOnError(f, 100, c.success(function(z) {
        z.should.be.eq('ok')
        done();
      }))
    });

    describe('should support looping with exponential backoff', function() {

      it('finishes with error if delay exceeds maxDelay', function(done) {
        //it should take 100 + 200 + 400 ms < 2000ms
        //max delay is 400 > 300
        var config = new retry.BackoffConfig(300);
        var f = okAfter3Evaluations();

        retry.exponentialBackoffOnError(f, delay, config, c.fail(function(e) {
          e.should.be.eq('ups')
          done();
        }))
      })


      it('finishes with success if delay does not exceed maxDelay', function(done) {
        //it should take 100 + 200 + 400 ms < 2000ms
        //max delay is 400  < 600
        var config = new retry.BackoffConfig(600);
        var f = okAfter3Evaluations();

        retry.exponentialBackoffOnError(f, delay, config, c.success(function(z) {
          z.should.be.eq('ok')
          done();
        }))
      })

    });
  });


});