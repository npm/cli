'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var kLastResolve = Symbol('lastResolve');
var kLastReject = Symbol('lastReject');
var kError = Symbol('error');
var kEnded = Symbol('ended');
var kLastPromise = Symbol('lastPromise');
var kHandlePromise = Symbol('handlePromise');
var kStream = Symbol('stream');

var AsyncIteratorRecord = function AsyncIteratorRecord(value, done) {
  _classCallCheck(this, AsyncIteratorRecord);

  this.done = done;
  this.value = value;
};

function readAndResolve(iter) {
  var resolve = iter[kLastResolve];
  if (resolve !== null) {
    var data = iter[kStream].read();
    // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'
    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(new AsyncIteratorRecord(data, false));
    }
  }
}

function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  process.nextTick(readAndResolve, iter);
}

function onEnd(iter) {
  var resolve = iter[kLastResolve];
  if (resolve !== null) {
    iter[kLastPromise] = null;
    iter[kLastResolve] = null;
    iter[kLastReject] = null;
    resolve(new AsyncIteratorRecord(null, true));
  }
  iter[kEnded] = true;
}

function onError(iter, err) {
  var reject = iter[kLastReject];
  // reject if we are waiting for data in the Promise
  // returned by next() and store the error
  if (reject !== null) {
    iter[kLastPromise] = null;
    iter[kLastResolve] = null;
    iter[kLastReject] = null;
    reject(err);
  }
  iter[kError] = err;
}

function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}

var ReadableAsyncIterator = function () {
  function ReadableAsyncIterator(stream) {
    var _this = this;

    _classCallCheck(this, ReadableAsyncIterator);

    this[kStream] = stream;
    this[kLastResolve] = null;
    this[kLastReject] = null;
    this[kError] = null;
    this[kEnded] = false;
    this[kLastPromise] = null;

    stream.on('readable', onReadable.bind(null, this));
    stream.on('end', onEnd.bind(null, this));
    stream.on('error', onError.bind(null, this));

    // the function passed to new Promise
    // is cached so we avoid allocating a new
    // closure at every run
    this[kHandlePromise] = function (resolve, reject) {
      var data = _this[kStream].read();
      if (data) {
        _this[kLastPromise] = null;
        _this[kLastResolve] = null;
        _this[kLastReject] = null;
        resolve(new AsyncIteratorRecord(data, false));
      } else {
        _this[kLastResolve] = resolve;
        _this[kLastReject] = reject;
      }
    };
  }

  ReadableAsyncIterator.prototype.next = function next() {
    // if we have detected an error in the meanwhile
    // reject straight away
    var error = this[kError];
    if (error !== null) {
      return Promise.reject(error);
    }

    if (this[kEnded]) {
      return Promise.resolve(new AsyncIteratorRecord(null, true));
    }

    // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time
    var lastPromise = this[kLastPromise];
    var promise = void 0;

    if (lastPromise) {
      promise = new Promise(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();
      if (data !== null) {
        return Promise.resolve(new AsyncIteratorRecord(data, false));
      }

      promise = new Promise(this[kHandlePromise]);
    }

    this[kLastPromise] = promise;

    return promise;
  };

  ReadableAsyncIterator.prototype.return = function _return() {
    var _this2 = this;

    // destroy(err, cb) is a private API
    // we can guarantee we have that here, because we control the
    // Readable class this is attached to
    return new Promise(function (resolve, reject) {
      _this2[kStream].destroy(null, function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(new AsyncIteratorRecord(null, true));
      });
    });
  };

  _createClass(ReadableAsyncIterator, [{
    key: 'stream',
    get: function () {
      return this[kStream];
    }
  }]);

  return ReadableAsyncIterator;
}();

module.exports = ReadableAsyncIterator;