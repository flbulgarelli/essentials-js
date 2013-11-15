var c = (typeof module === 'undefined') ? {} : module.exports;
var u = u || require('./utils.js');

(function() {

  /**Continuation utilities*/
  c.map = function(cont, f) {
    return c.forward(cont, function(result) {
      cont.onSuccess(f(result));
    });
  }

  c.concatMap = function(cont, f) {
    return c.forward(cont, function(result) {
      f(result)(cont);
    });
  }

  c.success = function(f) {
    return c.cont(f, u.fail);
  },

  c.successMatch = function(pattern) {
    return c.success(function(result) {
      result.match(pattern);
    });
  }

  c.fail = function(f) {
    return c.cont(u.fail, f);
  }

  /**
   * Continuation that that forwards the
   * error of the original one
   *
   * @param cont the original continuation
   * @param onSuccess the onSuccess part of the continuation
   */
  c.forward = function(cont, onSuccess) {
    return c.cont(onSuccess, cont.onError);
  };

  c.backward = function(cont, onError) {
    return c.cont(cont.onSuccess, onError);
  };

  c.forwardParse = function(cont, patternOnSuccess) {
    return c.forward(cont, function(json) {
      d.parse(json, cont, patternOnSuccess);
    });
  };

  c.forwardMatch = function(cont, patternOnSuccess) {
    return c.forward(cont, function(data) {
      data.match(patternOnSuccess)
    })
  };

  var Cont = {
    map: function(f) {
      return c.map(this, f);
    },
    forward: function(onSuccess) {
      return c.forward(this, onSuccess);
    },
    forwardParse: function(patternOnSuccess) {
      return c.forwardParse(this, patternOnSuccess);
    },
    forwardMatch: function(patternOnSuccess) {
      return c.forwardMatch(this, patternOnSuccess);
    },
    backward: function(onError) {
      return c.backward(this, onError);
    }
  }

  c.cont = function(onSuccess, onError) {
    var cont = (function(x) {
      onSuccess(x)
    });
    cont.onSuccess = onSuccess;
    cont.onError = onError;
    cont.__proto__ = Cont;
    return cont;
  }

})();

