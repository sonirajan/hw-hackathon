var http = require('http');
var url = require('url');
var fs = require('fs');
var server;

server = http.createServer(function(req, res){
    var path = url.parse(req.url).pathname;
    switch (path){
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<h1>Hello! Try the <a href="/test.html">Test page</a></h1>');
            res.end();
            break;
        case '/test.html':
        case '/login.html' :
        case '/qrCodeReader.html' :
        case '/welcome.html' :
            fs.readFile(__dirname + path, function(err, data){
                if (err){
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
                res.write(data, 'utf8');
                res.end();
            });
            break;
        case '/socket.io-1.3.7.js':
        case '/jquery.js':
        case '/qrcode.js':
        case '/src/grid.js':
        case '/src/version.js':
        case '/src/detector.js':
        case '/src/formatinf.js':
        case '/src/errorlevel.js':
        case '/src/bitmat.js':
        case '/src/datablock.js':
        case '/src/bmparser.js':
        case '/src/datamask.js':
        case '/src/rsdecoder.js':
        case '/src/gf256poly.js':
        case '/src/gf256.js':
        case '/src/decoder.js':
        case '/src/qrcode.js':
        case '/src/findpat.js':
        case '/src/alignpat.js':
        case '/src/databr.js':
            fs.readFile(__dirname + path, function(err, data){
                if (err){
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                res.write(data, 'utf8');
                res.end();
            });
            break;
        default: send404(res);
    }
});

send404 = function(res){
    res.writeHead(404);
    res.write('404 PAGE NOT FOUND');
    res.end();
};

server.listen(8001);

// use socket.io
var io = require('socket.io').listen(server);

//turn off debug
io.set('log level', 1);

var arrClientIds = [];

// define interactions with client
io.sockets.on('connection', function(socket){

    /// temp practice code for temp.html
    //send data to client
    setInterval(function(){
        socket.emit('date', {'date': new Date()});
    }, 1000);

    //receive client data
    socket.on('client_data', function(data){
        process.stdout.write(data.letter);
    });
    /////////////////////

    socket.on('onClientIdGeneration', function(data){
        arrClientIds.push(data);
        console.log(arrClientIds);
        socket.emit('allClientIds', data);
    });

    socket.on('onDecodingQRCode', function(data){
        console.log('onDecodingQRCode: from: ' + data.from);
        io.sockets.emit('onLoginRequest', data);
    });

});
