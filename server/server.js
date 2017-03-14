// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var multer  =   require('multer');
var fs = require('fs');

// Storage option can be changed - check Multer docs 
// var storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         var path = './' // Make sure this path exists 
//         cb(null, path)
//     }})

// var upload = multer({
//     storage: storage
// })
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

var users = [];

var tags = [
                    { text: 'engineer' },
                    { text: 'doctor' },
                    { text: 'sciencetist' },
                    { text: 'broker' },
                    { text: 'css' },
                    { text: 'js' },
                    { text: 'tag1' },
                    { text: 'tag2' },
                    { text: 'tag3' },
                    { text: 'tag4' },
                    { text: 'tag5' },
                    { text: 'tag6' },
                    { text: 'tag7' },
                    { text: 'tag8' },
                    { text: 'tag9' },
                    { text: 'tag10' },
                    { text: 'tag11' },
                    { text: 'tag12' }
                ];
// middleware to use for all requests
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");

    if (req.method === 'OPTIONS') {
        res.send(200);
    }
    // do logging
    console.log("Middleware caught a url = " + req.url);
    if(req.url != '/register' && req.url != '/login'){
    	if(req.headers && req.headers.token != null){
    		var token = req.headers.token;
    		for(var i in users){
    			if(users[i].token == token)
    				next();
    		}
    		return res.status(401).send({success: false, msg: 'Authentication failed.'});
    	} else{
    		return res.status(401).send({success: false, msg: 'Authentication failed.'});
    	}
    } else{
        console.log('going to next path after middleware');
    	next();
    }
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.post('/register', function(req, res) {
    var email = req.body.email;
	var password = req.body.password;
	var name = req.body.name;
	//console.log("req name " + req.body.email);
    for(var i in users){
    	console.log(users[i].name);
    	if(users[i].name == name)
    		res.status(400).send({success: false, msg: 'Username already exists.'});	
    }

    var user = {};
    user.name = name;
    user.password = password;
    user.email = email;
    user.tags = [];
    user.comments = [{
        'name': 'Emmad', 'time': new Date().toDateString(), 'text': 'my own comment'
    },
    {
        'name': 'Ahmad', 'time': new Date().toDateString(), 'text': 'my own comment'
    }];
    user.token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    users.push(user);
    res.status(200).send({ success: true, token: user.token });   
});

router.get('/profile', function(req, res) {
	for(var i in users){
    	if(users[i].token == req.headers.token)
    		res.json({success: false, profile: users[i]});	
    }
});

router.post('/login', function(req, res) {
	var name = req.body.name;
	var password = req.body.password
	if (!name || !password) {
		res.status(400).send({success:false, msg: 'Incorrect username or password'});
	} else{
		for(var i in users){
			var user = users[i];
			if(user.name == name && user.password == password){
				var token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
				user.token = token;
				res.status(200).send({ success: true, token: token });   
			}
		}
		//If no user found
		res.status(400).send({success:false, msg: 'Incorrect username or password'});
	}
});

router.post('/tags', function(req, res) {
    var tags = req.body.tags;
    var token = req.headers.token;
    for(var i in users){
        if(users[i].token == token){
            users[i].tags = tags;
            break;
        }
    }
    res.status(200).send({success: true});  
});

router.post('/comment', function(req, res) {
    var comment = req.body.comment;
    console.log(JSON.stringify(comment));
    var token = req.headers.token;
    for(var i in users){
        if(users[i].token == token){
            users[i].comments.push(comment);
            break;
        }
    }
    res.status(200).send({success: true});  
});

router.get('/tags', function(req, res) {
    res.status(200).send(tags);  
});


// router.get('/tags', function(req, res) {
//     var tags = req.body.tags;
//     var token = req.headers.token;
//     var user = getUserFromToken(token);
//     user.tags = tags;
//     res.status(200).send({success: false, tags: users[i]});    
// });


// router.post('/profile-image', upload.single('file'), function(req, res) {
//     var user = getUserFromToken(req.header.token);
//     user.profileImage = req.filename + " jpg";
//     res.status(204).end()
// })

// router.get('/profile-image', function(req, res){
//     var profileImage = "44763aba29a20500594c19806e3d8ae9.jpg"
//     // for(var i in users){
//     //     if(users[i].token == req.headers.token){
//     //         profileImage = users[i].profileImage;
//     //     }
//     // }
//     // var file = fs.readFileSync(__dirname + '/'+profileImage, 'binary');

//     // res.setHeader('Content-Length', file.length);
//     // res.write(file, 'binary');
//     // res.end();
//     var file = __dirname + '\a.jpg';
//     console.log(file);
//     res.download(file); // Set disposition and send it.
// });


function getUserFromToken(token){
    for(var i in users){
        if(users[i].token == token){
            return users[i];
        }
    }
}
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);