import Ember from 'ember';

function optionsFor(instance) {
  let config = instance.container.lookupFactory('config:environment');
  let django = config.django || {};
  let header = 'X-CSRFToken';

  let enabled = true;
  if (Ember.typeOf(django.csrf) === 'boolean' && !django.csrf) {
    enabled = false;
  }

  let pattern = null;
  if (Ember.typeOf(django.csrf) === 'string') {
    pattern = new RegExp(django.csrf);
  }

  return {
    enabled: enabled,
    header: header,
    pattern: pattern
  };
}

export function initialize(instance) {
  const {enabled, header, pattern} = optionsFor(instance);
  if (!enabled) { return; }

  const token = Ember.$(`meta[name="${header}"]`).attr('content') || null;

  if (!token) {
    throw new Error(`CSRF protection is enabled, but there is no meta tag named "${header}" with token!`);
  }

  Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    if (/^(GET|HEAD|OPTIONS|TRACE)$/.test(options.method)) { return; }
    if (pattern && !pattern.test(options.url)) { return; }
    if (options.crossDomain) { return; }

    jqXHR.setRequestHeader(header, token);
  });
}

export default {
  name: 'django-csrf',
  initialize: initialize
};
