'use strict';

describe('Service: thingiverse', function () {

  // load the service's module
  beforeEach(module('openScadAnalyzerApp'));

  // instantiate service
  var thingiverse;
  beforeEach(inject(function (_thingiverse_) {
    thingiverse = _thingiverse_;
  }));

  it('should do something', function () {
    expect(!!thingiverse).toBe(true);
  });

});
