const async = require('async');
const moment = require('moment');
const utils = require('./utils.js');
const marked = require('marked');
const config = require('./config');
var mailgun = require('mailgun-js')({
	apiKey: config.mailgun.api_key,
	domain: (process.env.NODE_ENV === 'development') ? config.mailgun.api_sandbox_domain : config.mailgun.api_domain
})

module.exports = function(app, cache) {

	app.post('/private-instruction-request', function(req, res) {

		req.checkBody("playerName", "Player name is required").notEmpty();
		req.checkBody("parentEmail", "Invalid email address").isEmail();
		req.checkBody("parentPhone", "Invalid phone number").isMobilePhone('any');
		req.checkBody("rbi_b1e623405f2c_23909403", "Missing check").exists();
		req.sanitize('playerName').escape();
		req.sanitize('playerName').trim();

		req.getValidationResult().then(function(result) {
			if (!result.isEmpty()) {
				var errors = result.array().map(function (elem) {
					return elem.msg;
		        });
				return res.json({status: 400, errors: errors, message: "There was a problem sending your request, please contact us by phone at 423-202-3228"})
			} else {

				// validation ok, send the email
				var message = 'The following information was just submitted for a private instruction: \n\n' +
				'Player Name: ' + req.body.playerName + '\n\n' +
				'Parent Phone: ' + req.body.parentPhone + '\n\n' +
				'Parent Email: ' + req.body.parentEmail + '\n\n';

				var sendTo = (process.env.NODE_ENV === 'development') ? 'lsbyerley@gmail.com' : 'rbifrontdesk@gmail.com';

		        var mailgun_data = {
		          from: 'RBI Tri-Cities <no-reply@rbitricities.com>',
		          to: sendTo,
		          subject: 'Private Instruction Form Submission',
		          text: message
		        }

		        mailgun.messages().send(mailgun_data, function (error, body) {
					 if (error) {
						 return res.json({status: 500, errors: ['error'], message: "There was a problem sending your request, please contact us by phone at 423-202-3228"})
					 } else {
						 return res.json({status: 200, errors: [], message: "Thank you! Your private instruction request has been received, we will be in touch with you shortly!"})
					 }
		        })

			}
		})

	})

	app.post('/equipment-request', function(req, res) {

		req.checkBody("firstName", "First name is required").notEmpty();
		req.checkBody("lastName", "Last name is required").notEmpty();
		req.checkBody("playerEmail", "Invalid email address").isEmail();
		req.sanitize('firstName').escape();
		req.sanitize('firstName').trim();
		req.sanitize('lastName').escape();
		req.sanitize('lastName').trim();

		req.getValidationResult().then(function(result) {
			if (!result.isEmpty()) {
				var errors = result.array().map(function (elem) {
					return elem.msg;
		        });
				return res.json({status: 400, errors: errors, message: "There was a problem sending your request, please contact us by phone at 423-202-3228"})
			} else {

				// validation ok, send the email
				var message = 'The following information was just submitted for equipment: \n\n' +
				'Player Name: ' + req.body.firstName + ' ' + req.body.lastName + '\n\n' +
				'Player Email: ' + req.body.playerEmail + '\n\n';

				var sendTo = (process.env.NODE_ENV === 'development') ? 'lsbyerley@gmail.com' : 'rbifrontdesk@gmail.com';

		        var mailgun_data = {
		          from: 'RBI Tri-Cities <no-reply@rbitricities.com>',
		          to: sendTo,
		          subject: 'Equipment Form Submission',
		          text: message
		        }

		        mailgun.messages().send(mailgun_data, function (error, body) {
					 if (error) {
						 return res.json({status: 500, errors: ['error'], message: "There was a problem sending your equipment request, please contact us by phone at 423-202-3228"})
					 } else {
						 return res.json({status: 200, errors: [], message: "Thank you! Your equipment request has been received, Wilson will be in touch with you within 24 hours!"})
					 }
		        })

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

	app.get('/annual-camps', cache(300), function(req, res) {
		utils.getAnnualCamps()
			.then(function(camps) {
				app.locals.camps = camps;
				return res.render('pages/annual-camps.hbs');
			})
			.catch(function(err) {
				console.error(err)
				app.locals.camps = [];
				return res.render('pages/annual-camps.hbs');
			})
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

	app.get('/drill-videos', cache(300), function(req, res) {
		utils.getDrillVideos()
			.then(function(drillVideos) {
				app.locals.drillVideos = drillVideos;
				return res.render('pages/drill-videos.hbs');
			})
			.catch(function(err) {
				console.error(err);
				app.locals.drillVideos = [];
				return res.render('pages/drill-videos.hbs');
			})
	});

	app.get('/event/:id', cache(300), function(req, res) {

		var id = req.params.id;

		let isPreview = false;
		if (req.query.isPreview && req.query.isPreview === 'true') {
			isPreview = true
		}

		utils.getEvent(id, isPreview)
			.then(function(event) {

				var eventDesc = marked(event.fields.eventDescription);
				app.locals.event = event;
				app.locals.metaTitle = event.fields.eventName + ' | Event | RBI Tri-Cities';
				app.locals.metaDesc = event.fields.introText;
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

	app.get('/hittrax', function(req, res) {
		return res.render('pages/hittrax.hbs');
	})

	app.get('/hittrax-faq', function(req, res) {
		return res.render('pages/hittrax-faq.hbs');
	})

	app.get('/hittrax-monthly-leaders', cache(300), function(req, res) {

		app.locals.month = moment().subtract(1, "month").format('MMMM YYYY');

		utils.getHittraxLeaders()
			.then(function(leaders) {
				app.locals.leaders = leaders;
				return res.render('pages/hittrax-leaders.hbs');
			})
			.catch(function(err) {
				console.error(err)
				app.locals.leaders = [];
				return res.render('pages/hittrax-leaders.hbs');
			})
	})

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

	app.get('/mindbody-widgets', function(req, res)  {
		return res.render('pages/mindbody-widgets.hbs')
	})

	app.get('/our-facility', function(req, res) {
		return res.render('pages/our-facility.hbs');
	});

	app.get('/private-instruction', function(req, res) {
		return res.render('pages/private-instruction.hbs');
	});

	app.get('/rapsodo', function(req, res) {
		return res.render('pages/rapsodo.hbs');
	})

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

	app.get('/team-practices', function(req, res) {
		return res.render('pages/team-practices.hbs');
	});

	app.get('/vhl-about', function(req, res) {
		return res.render('pages/vhl-about.hbs');
	});

	app.get('/vhl-schedules', cache(300), function(req, res) {

		utils.getVHLGameSchedules()
			.then(function(gameSchedules) {
				//console.log(gameSchedules)
				app.locals.hsGameSchedules = gameSchedules.hsGameSchedules
				app.locals.msGameSchedules = gameSchedules.msGameSchedules
				app.locals.tenTwelveGameSchedules = gameSchedules.tenTwelveGameSchedules
				app.locals.mensLeagueSchedules = gameSchedules.mensLeagueSchedules
				app.locals.vhlEvents = gameSchedules.vhlEvents
				return res.render('pages/vhl-schedules.hbs');
			})
			.catch(function(err) {
				console.error(err)
				app.locals.hsGameSchedules = []
				app.locals.msGameSchedules = []
				app.locals.tenTwelveGameSchedules = []
				app.locals.mensLeagueSchedules = []
				app.locals.vhlEvents = []
				return res.render('pages/vhl-schedules.hbs');
			})

		/*utils.getVHLEvents()
			.then(function(events) {
				app.locals.vhlEvents = events;
				return res.render('pages/vhl-schedules.hbs');
			})
			.catch(function(err) {
				console.error(err)
				app.locals.vhlEvents = [];
				return res.render('pages/vhl-schedules.hbs');
			})*/

	});

	app.get('/vhl-standings-stats', function(req, res) {

		app.locals.leagueData = [
			{
				name: "Virtual Hitting Leagues - High School Baseball",
				date: "January 7th - February 5th, 2018",
				link: "https://hittraxstatscenter.com/widget/tournament_widget.php?TId=1&TUId=552&SId=552&UId=552"
			},
			{
				name: "Virtual Hitting Leagues - Middle School Baseball",
				date: "January 8th - February 5th, 2018",
				link: "https://hittraxstatscenter.com/widget/tournament_widget.php?TId=2&TUId=552&SId=552&UId=552"
			},
			{
				name: "Virtual Hitting Leagues - 10U & 12U Baseball",
				date: "January 27th - February 24th, 2018",
				link: "https://hittraxstatscenter.com/widget/tournament_widget.php?TId=3&TUId=552&SId=552&UId=552"
			},
			{
				name: "Virtual Hitting Leagues - Men's League 21 & Up",
				date: "March 4 - April 1, 2018",
				link: "https://hittraxstatscenter.com/widget/tournament_widget.php?TId=4&TUId=552&SId=552&UId=552"
			}
		]

		return res.render('pages/vhl-standings-stats.hbs');
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
