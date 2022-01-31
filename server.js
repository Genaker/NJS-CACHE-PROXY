import http from 'http';
import https from 'https';
import sharp from 'sharp';
import URL from 'url';
import fetch from 'node-fetch';
import qs from 'qs';

//For Production uncomment this
//console.log = function() {}
//console.time = function() {}
//console.timeEnd = function() {}

const config = {
        host: 'https://react-luma.merche.io/',
        replace: { find: /https:\/\/react-luma.merche.io/g, replace: "http://127.0.0.1:8880" }
}

const colors = {
        reset: "\x1b[0m",
        bright: "\x1b[1m",
        dim: "\x1b[2m",
        underscore: "\x1b[4m",
        blink: "\x1b[5m",
        reverse: "\x1b[7m",
        hidden: "\x1b[8m",
        fg: {
                black: "\x1b[30m",
                red: "\x1b[31m",
                green: "\x1b[32m",
                yellow: "\x1b[33m",
                blue: "\x1b[34m",
                magenta: "\x1b[35m",
                cyan: "\x1b[36m",
                white: "\x1b[37m",
                crimson: "\x1b[38m" // Scarlet
        },
        bg: {
                black: "\x1b[40m",
                red: "\x1b[41m",
                green: "\x1b[42m",
                yellow: "\x1b[43m",
                blue: "\x1b[44m",
                magenta: "\x1b[45m",
                cyan: "\x1b[46m",
                white: "\x1b[47m",
                crimson: "\x1b[48m"
        }
};

let cacheStorage = [];

let tagStorage = {};

const server = http.createServer([], async function (req, res) {

        console.log(colors.fg.green, req.url, colors.reset);
        console.log(colors.fg.magenta, req.method, colors.reset);

        console.time('request');

        console.time('hash');
        let key = req.url; //.replace('&', '').replace('?','').replace('=',''); //Buffer.from(req.url).toString('base64');
        console.timeEnd('hash');

        if (req.method === 'CACHE') {

                console.time('actions');
                if (req.url === "/tagInfo") {
                        res.write(JSON.stringify({ 'tags': tagStorage, 'count': tagStorage.length }));
                        res.end();
                        return;
                }

                if (req.url.substring(0, 7) === "/tagClear".substring(0, 7)) {
                        console.time('delete TAGS');
                        const queryParams = URL.parse(req.url, true).query;
                        const tags = queryParams['tags'].split(',');

                        if (tags.length === 1 && tags[0].toLowerCase() === "all") {
                                cacheStorage = [];
                                tagStorage = {};
                        } else {
                                for (const tag of tags) {
                                        console.log("tag " + tag + " deleted");
                                        for (const pageKey in tagStorage[tag]) {
                                                //delete page form the cache
                                                delete cacheStorage[pageKey];
                                                //delete tagStorage[tag][pageKey];
                                        }
                                        tagStorage[tag] = {};
                                }
                        }
                        console.timeEnd('delete TAGS');
                        res.write(`Tags ${tags.join(',')} cleared`);
                        res.end();
                        return;
                }
                console.timeEnd('actions')
        }

        // caching only  GET request 
        if (req.method === 'GET') {
                console.time('typeof')
                // check if in cache
                if (cacheStorage[key] !== undefined) {
                        console.timeEnd('typeof')
                        console.log("From the Cache");
                        //console.log(cacheStorage[key].headers);
                        cacheStorage[key].headers['NJS-CACHE'] = 'HIT';
                        res.writeHeader(cacheStorage[key].status, cacheStorage[key].headers)
                        res.write(cacheStorage[key].body);
                        res.end(); ///header('Content-Type', 'text/html; charset=utf-8').send(cacheStorage[key]);
                        console.timeEnd('request');
                        return
                }

                let response = '';

                try {
                        response = await fetch(config.host + req.url);
                } catch (error) {
                        console.log(colors.bg.red, "Error", colors.reset);
                        console.log(error);
                        if (error.response) response = error.response;
                }
                console.log("fetched from the origin");
                //let response = await fetch('https://react-luma.merche.io/');
                console.time("replace");
                let body = '';

                if (response.headers.get('content-type') !== null && response.headers.get('content-type').substring(0, 4) === "text") {
                        console.log("content-type: text");
                        body = await response.buffer()//text();
                        //body = body.replace(config.replace.find, config.replace.replace);
                } else {
                        console.log("content-type: not a text");
                        body = new Uint8Array(await response.arrayBuffer());
                }
                //console.log(body);
                console.timeEnd("replace");

                cacheStorage[key] = { 'body': body, 'status': response.status, 'headers': response.headers, 'created_at': Date.now(), 'ttl': 3600, 'tags': [] };

                let tags = ['test', 'test2', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9'];

                console.time("tag processing");
                /*if (cacheStorage['all'] === undefined){
                tagStorage['all'] = {};
                }
                tagStorage['all'][key] = 1;*/

                if (tags.length > 0)
                        for (const tag of tags) {
                                if (tagStorage[tag] === undefined) {
                                        tagStorage[tag] = {}
                                }
                                tagStorage[tag][key] = 1;
                        }
                console.timeEnd("tag processing");
                //console.log(response.headers);
                //res.setHeader('NodeTime', "test");
                res.writeHead(response.status, response.headers);
                res.write(body);
                res.end();
                return
                // IF not GET request
        } else {

                let response = '';

                try {
                        // Requests can be made by passing the relevant config to 
                        response = await fetch(config.host + req.url, {
                                method: req.method,
                                data: req.data
                        });
                } catch (error) {
                        console.log(colors.bg.red, "Error", colors.reset);
                        console.log(error);
                        if (error.response) response = error.response;
                }

                let body = await response.text(); //.replace(config.replace.find, config.replace.replace);
                res.write(body);
                res.end();
                return
        }
}).listen(8880);

server.on("error", err => console.log(err));

const { address, port } = server.address();
console.log(colors.fg.yellow, `Server running at http://${address}:${port}`, colors.reset);
