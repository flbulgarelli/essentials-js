var should = require('should');
var d = require('../../src/common/data.js');

describe('datadef', function() {
  it('can convert toJson', function() {
    var X = d.datadef('x', ['y', 'z']);
    JSON.stringify(X(1, 2)).should.equal(JSON.stringify({ type: 'x', y: 1, z: 2 }))
  });

  it('can convert simple data toJson', function() {
    var X = d.datadef('x');
    JSON.stringify(X).should.equal(JSON.stringify({ type: 'x' }))
  });
})