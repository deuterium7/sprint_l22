const http = require('http');
const path = require('path');
const fs   = require('fs');
const axios = require('axios');

const getTodos = () => {
	return axios.get('https://jsonplaceholder.typicode.com/todos')
		.then(r => r.data)
		.catch((e) => {
			console.log('Не удалось получить данные из API');
		})
}

const storeToJsonFile = (data, filename) => {
	try {
		fs.writeFile(path.resolve(__dirname, `${filename}.json`), JSON.stringify(data), (e, content) => {});
	} catch (e) {
		console.log('Не удалось записать файл');
	}
}

const server = http.createServer((request, response) => {
	response.writeHead(200, {'Content-Type': 'text/plain'});

	getTodos()
		.then((data) => { storeToJsonFile(data, 'todos') })

	response.end(new Date().toDateString());
});

server.listen(3000, () => { console.log('Server running at http://127.0.0.1:3000') });