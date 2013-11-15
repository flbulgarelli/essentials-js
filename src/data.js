var d = (typeof module === 'undefined') ? {} : module.exports;
var u = u || require('./utils.js');

(function() {

  d.parse = function(json, cont, patternOnSuccess) {
    var caseOnSuccess = patternOnSuccess[json.type]
    if (!caseOnSuccess) {
      cont.onError("unknown data type " + json.type + " while parsing " + JSON.stringify(json));
    } else {
      caseOnSuccess(json)
    }
  };

  d.datadef = function(patternName, args) {
    if (!args || args.length === 0) {
      return eval('({ ' +
        'type:"' + patternName + '",' +
        'match: function(pattern){ return pattern.' + patternName + '(); }' +
        '})');
    } else {
      var initCode = args.map(function(x) {
        return 'this.' + x + '=' + x
      }).join(';');
      var attributesPassingCode = args.map(function(x) {
        return 'this.' + x
      }).join(',');
      var jsonCode = args.map(function(x) {
        return '' + x + ':' + 'this.' + x;
      }).join(',');
      var parametersPassingCode = args.join(',');
      var classdef = eval(
        'u.classdef({ ' +
          'init: function(' + args.join(',') + ') { this.type = "' + patternName + '";' + initCode + '},' +
          'match: function(pattern) { return pattern.' + patternName + '(' + attributesPassingCode + '); }' +
          '})');
      return eval('(function(' + parametersPassingCode + ') { return new classdef(' + parametersPassingCode + ') })');
    }

  };
})();

