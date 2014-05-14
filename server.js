var app = require('http').createServer(handler),
    io = require('socket.io').listen(app), //require('socket.io').listen(80);
    fs = require('fs');

app.listen(99);

function handler(req, res) {
    console.log('handler')
    fs.readFile(__dirname + '/index.html',
        function(err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

// Manage connections
io.sockets.on('connection', function(socket) {
    console.log('handle connection');

    var periodInMilliseconds = 400;
    var timeoutId = -1;

    /**
     * Handle "disconnect" events.
     */
    var handleDisconnect = function() {
        console.log('handle disconnect');

        clearTimeout(timeoutId);
    };

    /**
     * Generate a request to be sent to the client.
     */
    var generateServerRequest = function() {
        console.log('generate server request');

        socket.emit('server request', {
            date: new Date(),
            value: Math.pow(Math.random(), 2)
        });

        timeoutId = setTimeout(generateServerRequest, periodInMilliseconds);
    };

    socket.on('disconnect', handleDisconnect);

    timeoutId = setTimeout(generateServerRequest, periodInMilliseconds);
});