# Ember Django CSRF

[![Build Status](https://travis-ci.org/bobisjan/ember-django-csrf.svg?branch=master)](https://travis-ci.org/bobisjan/ember-django-csrf) [![Code Climate](https://codeclimate.com/github/bobisjan/ember-django-csrf/badges/gpa.svg)](https://codeclimate.com/github/bobisjan/ember-django-csrf) [![Dependency Status](https://david-dm.org/bobisjan/ember-django-csrf.svg)](https://david-dm.org/bobisjan/ember-django-csrf) [![Ember Observer Score](http://emberobserver.com/badges/ember-django-csrf.svg)](http://emberobserver.com/addons/ember-django-csrf)

Add Django based CSRF protection to your Ember application.

This addon requires a meta tag named `X-CSRFToken` provided within `index.html` file. You can use [Django Ember Index](https://pypi.python.org/pypi/django-ember-index) as a provider of the `index.html` file.

## Installation

* `ember install ember-django-csrf`

The CSRF protection is enabled by default on every AJAX request with `X-CSRFToken` header. You can specify an URL pattern in `config/environment.js` to protect only a subset of requests.

```javascript
var ENV = {
  ...
  django: {
    csrf: '^api'
  }
};
```
## License

Ember Django CSRF is available under the MIT license. See the LICENSE file for more info.
