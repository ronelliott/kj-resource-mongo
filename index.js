'use strict';

const is = require('is'),
      prequire = require('parent-require'),
      mongodb = prequire('mongodb'),
      MongoClient = mongodb.MongoClient;

module.exports = function($opts) {
    var enabled = is.defined($opts.enabled) ? $opts.enabled : true,
        inject = $opts.inject || '$mongo',
        uri = $opts.uri;

    if (enabled && (is.null(uri) || is.undefined(uri))) {
        throw new Error('URI is not defined!');
    }

    return function($$resolver, callback) {
        if (!enabled) {
            callback();
            return;
        }

        MongoClient.connect(uri, function(err, db) {
            if (err) {
                callback(err);
                return;
            }

            $$resolver.add(inject, db);
            callback();
        });
    };
};
