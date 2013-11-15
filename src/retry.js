retry = (function() {
  function delayWithCont(f, delay, cont) {
    setTimeout(function() {
      f(cont);
    }, delay)
  }

  function backwardLoop(f, delay, cont) {
    return c.backward(cont, function() {
      delayWithCont(f, delay, backwardLoop(f, delay, cont));
    });
  }

  function backwardLoopWithExponentialBackoff(f, delay, config, cont) {
    return c.backward(cont, function(e) {
      if (config.shouldRetry(delay)) {
        delayWithCont(f,
          config.effectiveDelay(delay),
          backwardLoopWithExponentialBackoff(f, config.nextDelay(delay), config, cont));
      } else {
        cont.onError(e);
      }
    })
  }

  return {
    BackoffConfig: u.classdef({
      init: function(maxDelay, maxRandomDelay) {
        this.maxDelay = maxDelay;
        this.maxRandomDelay = maxRandomDelay || 0;
      },

      shouldRetry: function(delay) {
        return delay < this.maxDelay;
      },

      effectiveDelay: function(delay) {
        return delay + Math.random() * this.maxRandomDelay;
      },

      nextDelay: function(delay) {
        return delay * 2;
      }
    }),

    onceOnError: function(f, delay, cont) {
      f(c.backward(cont, function(e) {
        delayWithCont(f, delay, cont)
      }));
    },

    alwaysOnError: function(f, delay, cont) {
      f(backwardLoop(f, delay, cont));
    },

    exponentialBackoffOnError: function(f, delay, config, cont) {
      f(backwardLoopWithExponentialBackoff(f, delay, config, cont));
    }
  };

})()