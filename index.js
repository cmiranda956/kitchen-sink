const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

// Make public folder servable with express server
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/public/NWS-Weather.html', (req, res) => {
    res.sendFile(__dirname + '/public/NWS-Weather.html');
});

server.listen(3000, () => { console.log('Listening on http://localhost:3000'); });
