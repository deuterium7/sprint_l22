const http = require('http');
const path = require('path');
const fs   = require('fs');
const axios = require('axios');

const ALLOWED_QUERIES = [
	{ query: 'posts', link: 'https://jsonplaceholder.typicode.com/posts' },
	{ query: 'comments', link: 'https://jsonplaceholder.typicode.com/comments' },
	{ query: 'albums', link: 'https://jsonplaceholder.typicode.com/albums' },
	{ query: 'photos', link: 'https://jsonplaceholder.typicode.com/photos' },
	{ query: 'todos', link: 'https://jsonplaceholder.typicode.com/todos' },
	{ query: 'users', link: 'https://jsonplaceholder.typicode.com/users' },
];

const getDataByLink = (link) => {
	return axios.get(link)
		.then(r => r.data)
		.catch((e) => { console.log('Не удалось получить данные из API') })
}

const getStoragePath = (fPath = '') => {
	return fPath ? path.resolve(__dirname, 'storage', fPath) :
		path.resolve(__dirname, 'storage');
}

const storeToJsonFile = (data, filename) => {
	try {
		fs.mkdir(getStoragePath(), { recursive: true }, (e) => {});
		fs.writeFile(getStoragePath(`${filename}.json`), JSON.stringify(data), (e, content) => {});
	} catch (e) { console.log('Не удалось записать файл') }
}

const server = http.createServer((request, response) => {
	response.writeHead(200, {'Content-Type': 'text/plain'});

	const allowQuery = ALLOWED_QUERIES.find(
		item => item.query === request.url.replace('/', '')
	);

	if (allowQuery) getDataByLink(allowQuery.link).then((data) => { storeToJsonFile(data, allowQuery.query) });

	response.end(new Date().toDateString());
});

server.listen(3000, () => { console.log('Server running at http://127.0.0.1:3000') });