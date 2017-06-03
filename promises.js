const request = require('request');
const rootURL = 'https://jsonplaceholder.typicode.com/users';

const getUsers = url => {
	return new Promise((resolve, reject) => {
		fetchData(url, response => {
			let _users = response.map(user => {
				return {
					id: user.id,
					name: user.name
				}
			});

			resolve(_users);
		});
	});
};

const getUserNames = users => {
	return new Promise((resolve, reject) => {
		let _users = users.map(user => {
			return new Promise((resolve, reject) => {
				fetchData(`${rootURL}/${user.id}`, response => {
					user.username = response.username;

					resolve(user);
				});
			});
		});

		Promise.all(_users)
			.then(data => {
				resolve(data);
			})
			.catch(error => {
				reject(error);
			});
	});
};

const getUserEmails = users => {
	return new Promise((resolve, reject) => {
		let _users = users.map(user => {
			return new Promise((resolve, reject) => {
				fetchData(`${rootURL}/${user.id}`, response => {
					user.email = response.email;

					resolve(user);
				});
			});
		});

		Promise.all(_users)
			.then(data => {
				resolve(data);
			})
			.catch(error => {
				reject(error);
			});
	});
};

const fetchData = (url, callback) => {
	request({
		method: 'GET',
		url: url
	}, (error, response, body) => {
		if(error) {
			console.log('error');
			return;
		}

		body = JSON.parse(body);

		callback(body);
	});
}

getUsers(rootURL).then(users => {
	return getUserNames(users);
}).then(users => {
	return getUserEmails(users);
}).then(users => {
	console.log('DONE:', users);
}).catch(error => {
	console.log('ERROR:', error);
});