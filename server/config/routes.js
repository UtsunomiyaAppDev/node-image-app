var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var utils = require('../utils.js');
var pagesList = {};
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
//var atob = require('atob');

//create db
db.serialize(function() {
  //employee table
  db.run("CREATE TABLE employee (sid varchar(7) not null, name varchar(256) not null, role varchar(256) not null, primary key(sid) );");


  //image table
  db.run("CREATE TABLE image (image_id integer not null, empid varchar(7) not null, image_type varchar(25) not null, image blob not null, image_size varchar(25), image_ctgy varchar(25) not null,"+
   "image_name varchar(50) not null, primary key (image_id), foreign key (empid) references employee(sid) );");
 
  var emps = [["123456a", "Paul Williams", "badass"], ["987654b", "Crud Muffin", "brotendo"]];
  var stmt = db.prepare("INSERT INTO employee VALUES (?,?,?)");
  for (var i = 0; i < 2; i++) {
      stmt.run(emps[i][0], emps[i][1], emps[i][2]);
  }
  stmt.finalize();

});

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}


//not used
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}

var saveImageQuery = function(image, res){

	console.log(image);

	db.serialize(function() {
		var stmt = db.prepare("INSERT INTO image VALUES(?,?,?,?,?,?,?);");
		stmt.run(image.id, image.empid, image.type, image.blob, image.size, image.ctgy, image.name);
		stmt.finalize();

		db.all("select * from image", function(err, rows){
			res.json(rows);
		});
	});
	

}
var employeeQuery = function(res){

	var result = [];

	db.serialize(function(){

	  db.all("SELECT * from employee", function(err, rows) {
	  	res.json(rows);
 	  });
	  
	});
}
router.get('/employees', function(req, res, next){
	
	employeeQuery(res);

});

router.get('/employee/:sid', function(req,res){
	db.serialize(function(){

		db.all("SELECT image from IMAGE where empid = '123456a';", function(err, rows){
			
			if(err){
				res.status(500).send("error in select query");
			}
			else{
				res.json(rows);
			}
		});
	})

});

router.post('/upload', function(req,res){

	  var form = new formidable.IncomingForm();

	  // Formidable Options
	  form.uploadDir = __dirname + '/public/images';
	  form.keepExtensions = true;

      form.parse(req, function(err, fields, files) {

	      console.log(files.image.path);
	      imageToSave = files.image.path;

	  	  var image = {
	  				id: 1,
	  				empid: fields.employee,
	  				type: "idk",
	  				blob: base64_encode(imageToSave),
	  				size: '1000',
	  				ctgy: "image",
	  				name: "my first image"
	  	  };

	  	  saveImageQuery(image, res);
      });

});


module.exports = router;

