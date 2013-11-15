var u = (typeof module === 'undefined') ? {} : module.exports;

(function() {

  /**OO utilities**/

  /**
   * Defines a "class", by providing a constructor,
   * a parent prototype, and the set of methods
   *
   * @param definition
   * @returns the class constructor
   */
  u.classdef = function(definition) {
    var prototype = definition.extend !== undefined
      ? new definition.extend()
      : {};
    var init = definition.init !== undefined
      ? definition.init
      : function() {
    };
    for (var property in definition) {
      if (property !== 'init' && property !== 'extend') {
        var propertyDescriptor = Object.getOwnPropertyDescriptor(definition, property);
        Object.defineProperty(prototype, property, propertyDescriptor)
      }
    }
    init.prototype = prototype;
    return init;
  };

  /**Callback utilities*/

  u.fail = function(e) {
    throw new Error(JSON.stringify(e));
  };

  /**Continuation utilities*/

  u.parseData = function(data, cont, patternOnSuccess) {
    var caseOnSuccess = patternOnSuccess[data.type]
    if (!caseOnSuccess) {
      cont.onError("unknown data type " + data.type + " while parsing " + JSON.stringify(data));
    } else {
      caseOnSuccess(data)
    }
  }
})();

