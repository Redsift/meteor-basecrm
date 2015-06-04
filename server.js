/* global Meteor */
/* global BaseCRM */
/* global MeteorSettings */

function log(/* arguments */) {
	if (BaseCRM._loggingEnabled()) {
		// TODO: Replace with call through to Meteor's logging when available
		console.log.apply(console, arguments);
	}
}

BaseCRM = {
	_URL: 'https://api.getbase.com/v2',
	_USER_AGENT: 'Meteor BaseCRM Binding/1.0',
	_loggingEnabled: function() {
		return Meteor.settings['basecrm']['debug'];
	},
	_timeout: function() {
		return Meteor.settings['basecrm']['timeout'];		
	},
	_accessToken: function() {
		return Meteor.settings['basecrm']['accessToken'];		
	},
	users: function(who) {
		var url = this._URL + '/users/' + who;
		return this._get(url);
	},
	addContact: function(contact) {
		return this._post(this._URL + '/contacts', { data: contact });	
	},
	addLead: function(lead) {
		return this._post(this._URL + '/leads', { data: lead });	
	},
	getLeads: function(search) {
		return this._getWithParams(this._URL + '/leads', search);
	},
	getContacts: function(search) {
		return this._getWithParams(this._URL + '/contacts', search);
	},	
	updateContact: function(id, contact) {
		return this._put(this._URL + '/contacts/' + id, { data: contact });	
	},
	updateLead: function(id, lead) {
		return this._put(this._URL + '/leads/' + id, { data: lead });	
	},	
	_getWithParams: function(url, search) {
		var urlWithParams = url;
		if (search) {
			urlWithParams += '?';
			Object.keys(search).forEach(function(key, index) {
				if (index !== 0) {
					urlWithParams += '&';
				}
				var val = search[key];
				if (typeof val === "string") {
					val = encodeURIComponent(val);
				}
				urlWithParams += (key + '=' + val);
			});
		}
		return this._get(urlWithParams);
	},		
	_get: function(url) {
		var bearer = 'Bearer ' + this._accessToken();
		var result = Meteor.http.get(url, { timeout: this._timeout(), headers: {
        	'Authorization': bearer,
			'Accept': 'application/json',
			'User-Agent': this._USER_AGENT
      	} });
		if (result.statusCode === 200) {
			var respJson = JSON.parse(result.content);
			log('Base response received.', result.content);
			return respJson;
		} else {
			log('Base error.', result.statusCode);
			var errorJson = JSON.parse(result.content);
			throw new Meteor.Error(result.statusCode, errorJson.error);
		}
	},
	_put: function(url, json) {
		return this._postOrPut('put', url, json);
	},
	_post: function(url, json) {
		return this._postOrPut('post', url, json);
	},
	_postOrPut: function(action, url, json) {
		var bearer = 'Bearer ' + this._accessToken();
		var result = Meteor.http[action](url, { timeout: this._timeout(), headers: {
        	'Authorization': bearer,
			'Accept': 'application/json',
			'User-Agent': this._USER_AGENT
      		},
		  data: json });
		if (result.statusCode === 200) {
			var respJson = JSON.parse(result.content);
			log('Base response received.', result.content);
			return respJson;
		} else {
			log('Base error.', result.statusCode);
			var errorJson = JSON.parse(result.content);
			throw new Meteor.Error(result.statusCode, errorJson.error);
		}
	}
};

Meteor.methods({

});

Meteor.startup(function() {
	if  (Meteor.settings.basecrm == null) {
		throw new Error('"basecrm" must be defined in the SETTINGS');
	}
	
	if  (Meteor.settings.basecrm.accessToken == null) {
		throw new Error('"accessToken" must be defined in the basecrm SETTINGS');
	}	
});