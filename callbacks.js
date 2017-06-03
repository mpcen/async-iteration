const request = require('request');
const rootURL = 'https://jsonplaceholder.typicode.com/users';

const getUsers = (options, callback) => {
	request(options, (error, response, body) => {
		if(error) {
			handleError(error);
			return;
		}

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
			url: `${rootURL}/${user.id}`
		}, (error, response, body) => {
			if(error) {
				handleError(error);
				return;
			}

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
			url: `${rootURL}/${user.id}`
		}, (error, response, body) => {
			if(error) {
				handleError(error);
				return;
			}

			count++;
			body = JSON.parse(body);
			user.email = body.email;
			_users.push(user);

			if(count === users.length) {
				console.log('DONE:', _users);
			}
		});
	});
};

const handleError = error => {
	console.log('ERROR:', error);
}

getUsers({
	method: 'GET',
	url: rootURL
}, (error, users) => {
	if(error) {
		handleError(error);
		return;
	}

	getUserNames(users);
});