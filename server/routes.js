var async = require('async');
var moment = require('moment');
var utils = require('./utils.js');
var marked = require('marked');

module.exports = function(app, cache) {

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

	app.get('/college-signees', function(req, res) {
		// google doc api?
		return res.render('pages/college-signees.hbs');
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

	app.get('/private-lessons', function(req, res) {
		return res.render('pages/private-lessons.hbs');
	});

	app.get('/rbi-pride-teams', function(req, res) {
		return res.render('pages/rbi-pride-teams.hbs');
	});

	app.get('/rbi-teams', function(req, res) {
		return res.render('pages/rbi-teams.hbs');
	});

	app.get('/recruiting-videos', function(req, res) {

		utils.getUpcomingVideoShoots()
			.then(function(videoShoot) {
				app.locals.videoShoot = videoShoot;
				console.log(videoShoot, videoShoot.fields.baseballShootLocation)
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
