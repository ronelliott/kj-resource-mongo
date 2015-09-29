'use strict';

var should = require('should'),
    sinon = require('sinon'),
    reflekt = require('reflekt'),
    proxyquire = require('proxyquire');

describe('mongo', function() {
    beforeEach(function() {
        var self = this;

        this.mongodb = {
            MongoClient: {
                connect: sinon.spy(function(uri, callback) {
                    callback(null, 'db');
                })
            }
        };

        this.$$resolver = new reflekt.ObjectResolver();

        this.initializer = proxyquire('./', {
            'parent-require': function() {
                return self.mongodb;
            }
        });
    });

    it('should throw an error if no uri is defined', function() {
        var self = this;
        (function() {
            self.initializer({});
        }).should.throw('URI is not defined!');
    });

    it('should create the resource if it is enabled', function(done) {
        var self = this;
        this.initializer({ enabled: true, uri: '' })(this.$$resolver, function() {
            self.mongodb.MongoClient.connect.called.should.equal(true);
            done();
        });
    });

    it('should create the resource if enabled is undefined in the options', function(done) {
        var self = this;
        this.initializer({ uri: '' })(this.$$resolver, function() {
            self.mongodb.MongoClient.connect.called.should.equal(true);
            done();
        });
    });

    it('should not create the resource if it is disabled', function(done) {
        var self = this;
        this.initializer({ enabled: false, uri: '' })(this.$$resolver, function() {
            self.mongodb.MongoClient.connect.called.should.equal(false);
            done();
        });
    });

    it('should use the defined uri', function(done) {
        var self = this;
        this.initializer({ enabled: true, uri: 'foo' })(this.$$resolver, function() {
            self.mongodb.MongoClient.connect.calledWith('foo').should.equal(true);
            done();
        });
    });

    it('should inject the resource using the defined name', function(done) {
        var self = this;
        this.initializer({ enabled: true, uri: 'foo', inject: 'foo' })(this.$$resolver, function() {
            self.$$resolver('foo').should.equal('db');
            done();
        });
    });

    it('should inject the resource using `$mongo` if no name is defined', function(done) {
        var self = this;
        this.initializer({ enabled: true, uri: 'foo' })(this.$$resolver, function() {
            self.$$resolver('$mongo').should.equal('db');
            done();
        });
    });
});
