var express = require('express');
var router = express.Router();
var fs = require("fs");
var https = require("http");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/listUsersTest', function (req, res) {
	
   fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})

/* Retrieve All employee */
router.get('/retrieveAllEmployee', function (req, res, next) {
   
    var username = req.query.username;
    var password1 = req.query.pass;

	var body='';
    var options = {
        host: 'localhost',   
		port : 8084,
        path: '/SpringSecurityRestWS/employee/retrieveAllEmployee',
        method: 'GET',
        headers: 
		{
			'Authorization': 'Basic ' + new Buffer(username + ':' + password1).toString('base64')			
		}	
    };
	
	requestMethod(options,body,function (err,resData){
		if (err) {			
			console.log("Error:"+err);
		} else {
			console.log("Final"+resData);
			res.setHeader('Content-Type', 'application/json');    
			res.end(resData);
		}
	});
})

function requestMethod(options,body,callback)
{	
	var req = https.request(options, function (res) {        
	var data = '';				
		//the listener that handles the response chunks
		res.addListener('data', function (chunk) {			
			data += chunk.toString();								
		});
		res.addListener('end', function () {
			try{			
				console.log("Data:"+data);				
				return callback(null,data);
			}
			catch(e)
			{	
				console.log("Error!"+e.message);			
				return callback(e.message);
				
			}				
		});		
	});
	req.on('error', function (e) {
		console.log("Error2"+e.message);		
		return callback(e.message)		
	});  
	req.write(body);    
	req.end();	
}

module.exports = router;
