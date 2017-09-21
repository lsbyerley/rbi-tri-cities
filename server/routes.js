var async = require('async');
var moment = require('moment');
var utils = require('./utils.js');
var marked = require('marked');
//var sendmail = require('sendmail')(); // will move to mailgun
//var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain })

module.exports = function(app, cache) {

	app.post('/private-instruction-request', function(req, res) {

		console.log(req.body)

		req.checkBody("playerName", "Player name is required").notEmpty();
		req.checkBody("parentEmail", "Invalid email address").isEmail();
		req.checkBody("parentPhone", "Invalid phone number").isMobilePhone('en-US');
		req.checkBody("rbi_b1e623405f2c_23909403", "Missing check").exists();
		req.sanitize('playerName').escape();
		req.sanitize('playerName').trim();

		req.getValidationResult().then(function(result) {
			if (!result.isEmpty()) {
				var errors = result.array().map(function (elem) {
					return elem.msg;
		        });
				return res.send({success: false, errors: errors})
			} else {
				// validation ok
				/*sendmail({
					from: 'no-reply@rbitricities.com',
					to: 'lsbyerley@gmail.com',
					subject: 'RBI Private Instruction Request',
					html: 'Mail of test sendmail',
				}, function(err, reply) {
					console.log(err && err.stack);
					console.dir(reply);
				});*/
				return res.send({success: true, errors: []})
			}
		})

	})

	app.get('/', cache(300), function(req, res) {
		utils.homePageData()
			.then(function(result) {
				app.locals.tweets = result.tweets;
				app.locals.instagramPics = result.instagramPics;
				app.locals.events = result.events;
				return res.render('pages/home.hbs');
			})
			.catch(function(err) {
				return res.render('pages/home.hbs');
			})
	});

	app.get('/about', function(req, res) {
		return res.render('pages/about.hbs');
	});

	app.get('/annual-camps', function(req, res) {
		return res.render('pages/annual-camps.hbs');
	});

	//need to figure out why cage-schedules is so slow
	app.get('/api/cage-schedule', function(req, res) {
		utils.getCageSchedule()
			.then(function(result) {
				res.send(result)
			})
			.catch(function(err) {
				console.error(err)
				res.status(500).render('pages/error.hbs');
			})
	});

	app.get('/cage-schedule', cache(300), function(req, res) {

		// Get all Cages and Mounds
		utils.getCageSchedule()
			.then(function(result) {
				app.locals.cageSchedules = result.cageSchedules;
				app.locals.scheduleDate = result.scheduleDate;
				return res.render('pages/cage-schedule.hbs');
			})
			.catch(function(err) {
				console.error(err)
				res.status(500).render('pages/error.hbs');
			})

	});

	app.get('/college-signees', cache(300), function(req, res) {
		utils.getCollegeSignees()
			.then(function(signees) {
				app.locals.signees = signees;
				return res.render('pages/college-signees.hbs');
			})
			.catch(function(err) {
				console.error(err)
				res.status(500).render('pages/error.hbs');
			})
	});

	app.get('/contact', function(req, res) {
		return res.render('pages/contact.hbs');
	});

	app.get('/directory', function(req, res) {
		return res.render('pages/directory.hbs');
	});

	app.get('/event/:id', cache(300), function(req, res) {

		var id = req.params.id;
		utils.getEvent(id)
			.then(function(event) {

				var eventDesc = marked(event.fields.eventDescription);
				app.locals.event = event;
				app.locals.pageMeta.title = event.fields.eventName + ' | Event | RBI Tri-Cities';
				app.locals.pageMeta.description = event.fields.introText;
				app.locals.eventDesc = eventDesc;

				return res.render('pages/event.hbs');
			})
			.catch(function(err) {
				console.error(err);
				app.locals.event = {};
				return res.render('pages/event.hbs');
			})

	});

	app.get('/events', cache(300), function(req, res) {

		utils.getEvents()
			.then(function(events) {
				app.locals.events = events;
				return res.render('pages/events.hbs');
			})
			.catch(function(err) {
				console.error(err);
				app.locals.events = [];
				return res.render('pages/events.hbs');
			})
	});

	app.get('/high-school-leagues', function(req, res) {
		return res.render('pages/high-school-leagues.hbs');
	});

	app.get('/instructors', cache(300), function(req, res) {

		utils.getInstructors()
			.then(function(instructors) {
				app.locals.instructors = instructors
				return res.render('pages/instructors.hbs');
			})
			.catch(function(err) {
				console.error(err)
				res.status(500).render('pages/error.hbs');
			})
	});

	app.get('/memberships', function(req, res) {
		return res.render('pages/memberships.hbs');
	});

	app.get('/our-facility', function(req, res) {
		return res.render('pages/our-facility.hbs');
	});

	app.get('/private-instruction', function(req, res) {
		return res.render('pages/private-instruction.hbs');
	});

	app.get('/rbi-pride-teams', function(req, res) {
		return res.render('pages/rbi-pride-teams.hbs');
	});

	app.get('/rbi-teams', function(req, res) {
		return res.render('pages/rbi-teams.hbs');
	});

	app.get('/recruiting-videos', cache(300), function(req, res) {

		utils.getUpcomingVideoShoots()
			.then(function(videoShoot) {
				app.locals.videoShoot = videoShoot;
				return res.render('pages/recruiting-videos.hbs');
			})
			.catch(function(err) {
				console.error(err);
				app.locals.videoShoot = {};
				return res.render('pages/recruiting-videos.hbs');
			})
	});

	app.get('/shop', function(req, res) {
		return res.render('pages/shop.hbs');
	});

	app.get('/showcases', function(req, res) {
		return res.render('pages/showcases.hbs');
	});

	app.get('/strength-agility', function(req, res) {
		return res.render('pages/strength-agility.hbs');
	});

	app.get('/swing-analytics', function(req, res) {
		return res.render('pages/swing-analytics.hbs');
	});

	app.get('/team-practices', function(req, res) {
		// google doc api?
		return res.render('pages/team-practices.hbs');
	});

	app.get('/youth-leagues', function(req, res) {
		return res.render('pages/youth-leagues.hbs');
	});

	//Error handling
	app.use(function (err, req, res, next) {
		console.error(err.stack)
		res.status(500).render('pages/error.hbs');
	});

	//Page not found
	app.use(function (req, res, next) {
		res.status(404).render('pages/404.hbs');
	});

};
