/* global Package */

Package.describe({
  name: 'redsift:meteor-basecrm',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Access BaseCRM with meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/Redsift/meteor-basecrm.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('common.js');
	api.addFiles('server.js', 'server');  
  api.addFiles('client.js', 'client');  
  api.export('BaseCRM', 'server');	  
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('redsift:meteor-basecrm');
  api.addFiles('tests.js');
});
