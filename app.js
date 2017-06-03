"use strict"

/*
	1.0 - Async Iteration Using Callbacks
*/
const request = require('request');
const rootURL = 'https://jsonplaceholder.typicode.com/users';
const proxyURL = 'http://www-proxy.boeing.com:31060';

const getUsers = (options, callback) => {
	request(options, (error, response, body) => {
		if(error) {
			handleError(error);
			return;
		}

		console.log('REQUEST');
		body = JSON.parse(body);
		
		let _users = body.map(user => {
			return {
				id: user.id,
				name: user.name
			};
		});

		callback(null, _users);
	});
};

const getUserNames = users => {
	let count = 0,
		_users = [];

	users.forEach(user => {
		request({
			method: 'GET',
			url: `${rootURL}/${user.id}`,
			proxy: proxyURL
		}, (error, response, body) => {
			if(error) {
				handleError(error);
				return;
			}

			console.log('REQUEST');
			count++;
			body = JSON.parse(body);
			user.username = body.username;
			_users.push(user);

			if(count === users.length) {
				getUserEmails(_users)
			}
		});
	});
};

const getUserEmails = users => {
	let count = 0,
		_users = [];

	users.forEach(user => {
		request({
			method: 'GET',
			url: `${rootURL}/${user.id}`,
			proxy: proxyURL
		}, (error, response, body) => {
			if(error) {
				handleError(error);
				return;
			}

			console.log('REQUEST');
			count++;
			body = JSON.parse(body);
			user.email = body.email;
			_users.push(user);

			if(count === users.length) {
				end = Date.now();
				console.log('DONE:', _users);
				console.log('Process took:', (end - start) + ' ms');
			}
		});
	});
};

const handleError = error => {
	console.log('ERROR:', error);
}

let start = Date.now(), end;
console.log('Process Started');
getUsers({
	method: 'GET',
	url: rootURL,
	proxy: proxyURL
}, (error, users) => {
	if(error) {
		handleError(error);
		return;
	}

	getUserNames(users);
});

/*
	1.1 - Async Iteration Using Promises
*/

/*
	1.2 - Async Iteration Using Generators
*/