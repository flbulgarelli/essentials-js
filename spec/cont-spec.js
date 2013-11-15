var should = require('should');
var c = require('../../src/common/cont.js');

describe('cont', function() {
  describe('map', function() {
    it('applies the function to the result of the continuation', function(done) {
      var cont = {
        onSuccess: function(result) {
          result.should.be.equal(11);
          done();
        }
      }
      c.map(cont,function(x) {
        return x + 1
      }).onSuccess(10)
    })

    it('does not affect onError', function(done) {
      var cont = {
        onError: function(result) {
          result.should.be.equal(10);
          done();
        }
      }
      c.map(cont,function(x) {
        return x + 1
      }).onError(10)
    })
  });

  describe('backward', function() {
    it('replaces error handler of continuation', function(done) {
      var cont = {
        onError: function(result) {
          fail()
        }
      }
      c.backward(cont,function(result) {
        result.should.be.equal('error');
        done();
      }).onError('error')
    })

    it('keeps success handler of continuation', function(done) {
      var cont = {
        onSuccess: function(result) {
          result.should.be.equal('success');
          done();
        }
      }
      c.backward(cont,function(result) {
      }).onSuccess('success')
    })
  })


})