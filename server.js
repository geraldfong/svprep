var express = require('express');
var mongo = require('mongodb');
var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun('key-7ux95fuphgyqyvkntykij5umow6a2pn3');
var BSON = mongo.BSONPure;
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var app =  express.createServer();

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'svprep secret' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// app.set('view options', { layout: false });

var signupsCollection;
var trackingCollection;
var db = new Db('svprep', new Server("localhost", 27017, {}), { native_parser: false });
db.open(function (error, conn) {
  conn.collection('signups', function (error, coll) {
    signupsCollection = coll;
  });
  
  conn.collection('tracking', function (error, coll) {
    trackingCollection = coll;
  });
});

var classNames = {
  "javacs-a": "Intro to Java & Computer Science - Session A",
  "javacs-b": "Intro to Java & Computer Science - Session B",
  "pubsp-a": "Public Speaking - Session A",
  "pubsp-b": "Public Speaking - Session B",
  "debarg-a": "Debate & Argumentation - Session A",
  "debarg-b": "Debate & Argumentation - Session B",
}

var timeNames = {
  "sat101": "Saturday 10AM - 1PM",
  "sat25": "Saturday 2PM - 5PM",
  "sun101": "Sunday 10AM - 1PM",
  "sun25": "Sunday 2PM - 5PM"
}

app.get('/', function (req, res) {
  res.render('index', { page: 'home' });
});

app.get('/signup', function (req, res) {
  res.render('signup', { page: 'signup' });
});

app.post('/signup-confirm', function (req, res) {
  console.log(req.body);
  var p1Email = req.body['p1Email'];
  // console.log(p1Email.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/));
  if (p1Email.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i) != null) {
    signupsCollection.insert(req.body, function (error, docs) {
      console.log('User data inserted successfuly!');
    });
    mg.sendText("contact@svprep.org", p1Email, "Thank you for registering with Silicon Valley Prep!", "Hi!\n\nThank you for registering with Silicon Valley Prep. This is a confirmation that you have successfully registered. We will send you more information at this email as the program start dates approach. If you have any questions, comments, or concerns, please email us at contact@svprep.org.\n\nWe look forward to seeing you this summer!\n\nSincerely,\nGerald Fong and Sharad Vikram\nSilicon Valley Prep");
    res.render('signup-confirm', { page: 'signup', timeNames: timeNames, classNames: classNames, data: req.body });
  } else {
    res.render('signup-confirm', { page: 'signup', error: "Signup failed! Please hit the 'Back' button on your browser and enter a valid email address for Parent 1." });
  }
  
});

/*
app.post('/signup-test', function (req, res) {
  var studentFirstName = req.body.studentFirstName;
  var studentLastName = req.body.studentLastName;
  var studentEmail = req.body.studentEmail;
  var studentCellPhone = req.body.studentCellPhone;
  
  var street = req.body.street;
  var city = req.body.city;
  var zip = req.body.zip;
  var homePhone = req.body.homePhone;
  
  var p1FirstName = req.body.p1FirstName;
  var p1LastName = req.body.p1LastName;
  var p1Email = req.body.p1Email;
  var p1CellPhone = req.body.p1CellPhone;
  
  var p2FirstName = req.body.p2FirstName;
  var p2LastName = req.body.p2LastName;
  var p2Email = req.body.p2Email;
  var p2CellPhone = req.body.p2CellPhone;
  
  signupsCollection.insert({
    studentFirstName: studentFirstName,
    studentLastName: studentLastName,
    studentEmail: studentEmail,
    studentCellPhone: studentCellPhone,
    address: address,
    city: city,
    zip: zip,
    homePhone: homePhone,
    p1FirstName: p1FirstName,
    p1LastName: p1LastName,
    p1Email: p1Email,
    p1CellPhone: p1CellPhone,
    p2FirstName: p2FirstName,
    p2LastName: p2LastName,
    p2Email: p2Email,
    p2CellPhone: p2CellPhone
  }, function (error, docs) {
    console.log("Inserted data successfully!");
  });
  
  res.render('signup-confirm', { page: 'signup' });
});
*/

app.get('/courses', function (req, res) {
  res.render('courses', { page: 'courses' });
});

app.get('/faq', function (req, res) {
  res.render('faq', { page: 'faq' });
});

app.get('/testimonials', function (req, res) {
  res.render('testimonials', { page: 'testimonials' });
});

app.get('/discounts', function (req, res) {
  res.render('discounts', { page: 'discounts' });
});

app.get('/logistics', function (req, res) {
  res.render('logistics', { page: 'logistics' });
});

app.get('/aboutus', function (req, res) {
  res.redirect('/instructors');
});

app.get('/instructors', function (req, res) {
  res.render('instructors', { page: 'instructors' });
});

app.get('/tos', function (req, res) {
  res.render('tos', { page: 'tos' });
});

app.get('/privacy', function (req, res) {
  res.render('privacy', { page: 'privacy' });
});

app.get('/yc-video', function (req, res) {
  res.redirect('http://ritikm.posterous.com/private/EbDoxuqrxj');
});

app.listen(80);
