var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

function endsWith(str, suffix) {
    return str.endsWith(suffix);
};

http.createServer(function (request, response) {
    console.log('request ', request.url);
    var parsedUrl = url.parse(request.url);
    var filePath = '.' + parsedUrl.pathname;
    if (filePath == './') {
        filePath = path.join('login', 'index.html');
    }

    if (endsWith(parsedUrl.pathname, '/')) {
        console.log('url modificada');
        if(filePath != path.join('login', 'index.html')) {
            filePath = path.join(filePath, 'index.html');
        }
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.woff2': 'application/font-woff2',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404/index.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            } else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error + ' ..\n');
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(3001);

console.log('Server running at http://127.0.0.1:3001/');
