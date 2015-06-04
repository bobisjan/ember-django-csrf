import Ember from 'ember';
import { initialize } from '../../../instance-initializers/django-csrf';
import { module, test, skip } from 'qunit';
import Pretender from 'pretender';

var instance, application;

const token = 'OJr6Dfr17XZ0rRiTz123LZLNQBcgct5X';

module('Unit | Instance Initializer | Django CSRF', {
  beforeEach: function() {
    Ember.run(function() {
      application = Ember.Application.create();
      instance = application.__deprecatedInstance__;
      application.deferReadiness();
    });

    Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
      jqXHR.setRequestHeader('X-CSRFToken', undefined);
    });

    Ember.$('head').append(`<meta name="X-CSRFToken" content="${token}">`);
  }
});

function environment(instance, env) {
  env = env || {};
  instance.registry.register('config:environment', env, { instantiate: false });
}

test('it sends token if no configuration is provided', function(assert) {
  assert.expect(1);

  environment(instance);
  initialize(instance);

  let server = new Pretender(function() {
    this.post('/api/posts', function(request) {
      assert.equal(request.requestHeaders['X-CSRFToken'], token);
      return [201, {}, ""];
    });
  });

  Ember.$.ajax({
    url: 'api/posts',
    method: 'POST'
  });

  server.shutdown();
});

test('it sends token if protection is explictly enabled', function(assert) {
  assert.expect(1);

  environment(instance, {django: {csrf: true}});
  initialize(instance);

  let server = new Pretender(function() {
    this.post('/api/posts', function(request) {
      assert.equal(request.requestHeaders['X-CSRFToken'], token);
      return [201, {}, ""];
    });
  });

  Ember.$.ajax({
    url: 'api/posts',
    method: 'POST'
  });

  server.shutdown();
});

test('it skips if protection is explictly disabled', function(assert) {
  assert.expect(1);

  environment(instance, {django: {csrf: false}});
  initialize(instance);

  let server = new Pretender(function() {
    this.post('/api/posts', function(request) {
      assert.equal(request.requestHeaders['X-CSRFToken'], undefined);
      return [200, [], ""];
    });
  });

  Ember.$.ajax({
    url: 'api/posts',
    method: 'POST'
  });

  server.shutdown();
});

test('it skips if request has safe HTTP method', function(assert) {
  assert.expect(1);

  environment(instance);
  initialize(instance);

  let server = new Pretender(function() {
    this.get('/api/posts', function(request) {
      assert.equal(request.requestHeaders['X-CSRFToken'], undefined);
      return [200, [], ""];
    });
  });

  Ember.$.ajax({
    url: 'api/posts',
    method: 'GET'
  });

  server.shutdown();
});

test('it sends token if pattern matches', function(assert) {
  assert.expect(1);

  environment(instance, {django: {csrf: '^api'}});
  initialize(instance);

  let server = new Pretender(function() {
    this.post('/api/posts', function(request) {
      assert.equal(request.requestHeaders['X-CSRFToken'], token);
      return [201, {}, ""];
    });
  });

  Ember.$.ajax({
    url: 'api/posts',
    method: 'POST'
  });

  server.shutdown();
});

test('it skips if pattern does not match', function(assert) {
  assert.expect(1);

  environment(instance, {django: {csrf: '^api'}});
  initialize(instance);

  let server = new Pretender(function() {
    this.post('/images/logo.png', function(request) {
      assert.equal(request.requestHeaders['X-CSRFToken'], undefined);
      return [200, [], ""];
    });
  });

  Ember.$.ajax({
    url: 'images/logo.png',
    method: 'POST'
  });

  server.shutdown();
});

test('it throws error if protection is enabled and meta tag is not provided', function(assert) {
  Ember.$('meta[name="X-CSRFToken"]').remove();

  environment(instance);

  assert.throws(function() {
    initialize(instance);
  }, Error);
});

skip('it skips if request goes outside the domain', function(assert) { });
