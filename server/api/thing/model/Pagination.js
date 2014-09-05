var _ = require('underscore');
var async = require('async');

//The opts allows for field selection and sorting using the mongoose syntax
function findPaginated(filter, opts, pops, cb) {
  var defaults = {skip : 0, limit : 10};
  opts = _.extend({}, defaults, opts);

  filter = _.extend({}, filter);

  var cntQry = this.find(filter);
  var qry = this.find(filter).populate(pops);

  if (opts.sort) {
    qry = qry.sort(opts.sort);
  }
  if (opts.fields) {
    qry = qry.select(opts.fields);
  }

  qry = qry.limit(opts.limit).skip(opts.skip);

  async.parallel(
    [
      function (cb) {
        cntQry.count(cb);
      },
      function (cb) {
        qry.exec(cb);
      }
    ],
    function (err, results) {
      if (err) return cb(err);
      var count = 0, ret = [];

      _.each(results, function (r) {
        if (typeof(r) == 'number') {
          count = r;
        } else if (typeof(r) != 'number') {
          ret = r;
        }
      });

      cb(null, {totalCount : count, results : ret});
    }
  );

  return qry;
}

module.exports = findPaginated;