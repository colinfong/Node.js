//console.log(process.argv);

/*Sum the input numbers
var sum = 0;
for(i=2; i < process.argv.length; i++) 
	sum += Number(process.argv[i]);
console.log(sum);*/

// Count number of newlines in a file with synchronous code
/*var fs = require('fs');
var buf = fs.readFileSync(process.argv[2]);
var buf_str = buf.toString();
var lines = buf_str.split("\n");
console.log(lines.length-1);
*/
/*Async I/O - use io with a callback
The async readFile function calls the callback function doneReading after it is done reading
Thus, we have a sequential running of of what we want to run because we don't know
when the async process will finish. But we know where which is at the end of the asyc code
so we can callback a certain function if we like*/
/*We can also nest callbacks
callbacks typically get (err, data) as input 
var fs = require('fs');
fs.readFile(process.argv[2], function doneReading(err, fileContents) {
	var buf_str_arr_len = fileContents.toString().split("\n").length - 1;
	console.log(buf_str_arr_len);
});*/

//Filter LS - filter a directory via extention, can also use path module
/* var fs = require('fs');
 fs.readdir(process.argv[2], function count_dir(err, list){
 	for(i = 0; i < list.length; i++) {
 		if(list[i].includes("." + process.argv[3])) {
	 		var split =  list[i].split(".");
	 		if(split[split.length-1] === process.argv[3]) {
	 			console.log(list[i]);
	 		}
	 	}
 			//console.log(list[i]);
 	}
 });*/

//Make It Modular - turn filter into a module
/*var mymodule = require('./file_ext.js');
mymodule(process.argv[2], process.argv[3], function callback(err, list) {
	if(err)
		return err;
	for(i=0; i< list.length; i++) {
		console.log(list[i]);
	}
});*/

/*HTTP Client - get a single data response from a link
the get produces a response object that is a Stream object
you can use reponse.on("data", console.log)*/
/*"data" as well as "error" and "end:"
http.request() is similar to get but doesn't call req.end() automatically
http = require('http');
http.get(process.argv[2], function (response) {
	response.setEncoding("utf8"); //changes the data buffer into a  string
	response.on("data", function (data){ //on a data response to the get request on the link, we run another callback
		console.log(data);
	});
});*/

/*HTTP Connect** -- get all the data from link and count characters
There's 2 approaches
-concatenating multiple data response streams
-using a pipeline and creating a buffer list*/
/*http = require('http');
bl =  require('bl');
var num_char = 0;
var all_data = "";
http.get(process.argv[2], function(response) {
	response.pipe(bl(function(err, data) {
		data_str = data.toString();
		all_data += data_str;
		num_char += data_str.length;
		console.log(num_char);
		console.log(all_data);
	}));
}); */

//Juggling Async** - can use an async library as well
/*http = require('http');
bl = require('bl');
http.get(process.argv[2], function(res1){
	res1.pipe(bl(function(err1, data1) {
		if(err1) return err1;
		console.log(data1.toString());
		http.get(process.argv[3], function(res2){
			res2.setEncoding("utf8");
			res2.pipe(bl(function(err2, data2) {
				if(err2) return err2;
				console.log(data2.toString());
				http.get(process.argv[4], function(res3){
					res3.setEncoding("utf8");
					res3.pipe(bl(function(err3, data3) {
						if(err3) return err3;
						console.log(data3.toString());
						
					}));
				});	
			}));
		});	
	}));
});*/


/*Time Server**  get the time of a TCP connection
- no http involved
a socket is a duplex stream that can be read from and written to
*/
/*var net = require('net');
var server = net.createServer(function (socket) {
	date = new Date();
	year = date.getFullYear();
	month = (date.getMonth() + 1).toString();
	day = date.getDate().toString();
	hr = date.getHours().toString();
	min = date.getMinutes().toString();
	if(month.length === 1)
		month = "0" + month;
	if(day.length === 1) 
		day = "0" + day;
	if(hr.length === 1)
		hr = "0" + hr;
	if(min.length === 1)
		min = "0" + min;
	//"YYYY-MM-DD hh:mm"
	socket.write(year+ "-" + month + "-" +
		day + " " + hr + ":" + min);
	socket.write('\n');
	socket.end();
});
server.listen(process.argv[2]);*/

/*HTTP File Server*/
/*var http = require('http');
var fs = require('fs');
var server = http.createServer(function (request, response) {
	var src = fs.createReadStream(process.argv[3]);
	src.pipe(response);
});
server.listen(process.argv[2]);*/


/*HTTP UPPERCASERER*/
/*var http = require('http');
var stream_map = require('through2-map');
var server = http.createServer(function (request, response) {
	if(request.method === "POST") {
		request.pipe(stream_map(function (chunk){
			return chunk.toString().toUpperCase();
		})).pipe(response);
	}
});

server.listen(process.argv[2]);*/

/*HTTP JSON API SERVER*/
var http = require('http');
var url = require('url');
var server = http.createServer(function (request, response) {
	if(request.method === 'GET') { //respond to get messaged
		response.writeHead(200, { 'Content-Type': 'application/json' }); //assign response header
		var end_pt = url.parse(request.url, true); //
		var date = new Date(end_pt.query.iso);
		if(end_pt.pathname === '/api/parsetime' ) {
			response.write("{\"hour\": " + date.getHours() + ",\"minute\": "
				+ date.getMinutes() + ",\"second\": " + date.getSeconds() + "}");
			response.end();
		} else if (end_pt.pathname ==='/api/unixtime') {
			response.write("{ \"unixtime\": " + date.getTime() + " }");
			response.end();
		} else {
			respnse.write("");
		}
	}
});
server.listen(process.argv[2]);