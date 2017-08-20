var async = require('async');
var _ = require('lodash');
var mindbody = require('./mindbody.js');
var moment = require('moment');
var Twitter = require('twitter');
var Instagram = require('node-instagram').default;
var twitterText = require('twitter-text');
var twemoji = require('twemoji');
var Contentful = require('contentful');
var config = require('./config');
//https://jelled.com/instagram/access-token

var contentful_client = Contentful.createClient({
    space: config.contentful.space_id,
    accessToken: config.contentful.access_token
});
var twitter_client = new Twitter(config.twitter);
var instagram_client = new Instagram(config.instagram);

function formatTweetText(tweet) {

    var text = tweet.text;
    var entities = tweet.entities;

    if (entities && entities.media) {
        entities.media.forEach(e => {
            text = text.replace(e.url, '')
        })
    }

    // remove any quote links
    if (entities && tweet.quoted_status) {
        entities.urls.forEach(u => {
            if (u.expanded_url.indexOf('/status/') > -1) {
                text = text.replace(u.url, '')
            }
        })
    }

    // replace + style links and mentions
    text = twitterText.autoLinkWithJSON(text, (entities || {}), {
        'usernameIncludeSymbol': true
    })
    text = text.replace(/href=/g, 'class="tweet-link" href=')

    // replace + style emoji
    text = twemoji.parse(text)
    text = text.replace(/<img class="emoji"/g, '<img class="emoji" style="height:14px;margin-right:5px;"')
    // browsers add http which causes isomorphic rendering probs
    text = text.replace(/src="\/\/twemoji/g, 'src="http://twemoji')

    return text;
}

module.exports = {

    getEvent: function(id) {

        return new Promise(function (resolve, reject) {

            contentful_client.getEntries({
                content_type: 'events',
                'sys.id': id
            })
            .then(function(response) {
                console.log(JSON.stringify(response))
                if (response.items) {
                    var event = response.items[0]
                    resolve(event)
                } else {
                    reject({})
                }
            })
            .catch(function(err) {
                console.error(err)
                reject(err)
            })
        });

    },

    getEvents: function() {

        return new Promise(function (resolve, reject) {
            contentful_client.getEntries({
                content_type: 'events',
                limit: 10,
                order: 'fields.startDate'
            })
            .then(function(response) {
                //console.log(JSON.stringify(response.items));
                var events = response.items;
                resolve(events)
            })
            .catch(function(err) {
                console.error(err)
                reject(err)
            })
        });

    },

    homePageData: function() {
    	return new Promise(function (resolve, reject) {
    		async.parallel({
    		    tweets: function(parallelCb) {

    		        var params = { screen_name: 'rbitricities', count: 5 };
    		        twitter_client.get('statuses/user_timeline', params)
    		            .then(function(tweets) {
    						//console.log(tweets)
    						tweets = _.map(tweets, function(tweet) {
    							var date = moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').fromNow()
    							return {
    								favorites: tweet.favorite_count,
    								retweets: tweet.retweet_count,
    								text: formatTweetText(tweet),
    								date: date
    							}
    						});
    		                parallelCb(null, tweets);
    		            })
    		            .catch(function(err) {
    		                console.error(err);
    						reject(err)
    		            });

    		    },
    			instagramPics: function(parallelCb) {

    				var params = { count: 6 };
    				instagram_client.get('users/self/media/recent', params)
    					.then(function(response) {
    						var instagramPics = response.data;
    						parallelCb(null, instagramPics)
    					})
    					.catch(function(err) {
    						console.error(err)
    						reject(err)
    					})

    			},
    		    events: function(parallelCb) {

                    contentful_client.getEntries({
                        content_type: 'events',
                        limit: 4,
                        order: 'fields.startDate'
                    })
                    .then(function(response) {
                        //console.log(JSON.stringify(response.items[0]));
                        var events = response.items;
                        parallelCb(null, events)
                    })
                    .catch(function(err) {
                        console.error(err)
                        reject(err)
                    })

    		    }
    		}, function (err, result) {
    		    resolve(result);
    		});
    	});
    },

    getCageSchedule: function() {
        return new Promise(function (resolve, reject) {
            mindbody.getResources()
    			.then(function(resources) {

    				var cageSchedules = [];

    				// Get all appointments for the day
    				var scheduleDate = moment().format('YYYY-MM-DD');
    				mindbody.getStaffAppointments(scheduleDate)
    					.then(function(appointments) {

    						// Loop through each resource
    						_.forEach(resources, function(resource) {
    							var rMap = {
    								id: resource.ID,
    								name: resource.Name,
    								appointments: []
    							};

    							// loop through each appointment and match it to a cage/mound
    							if (appointments) {
    								_.forEach(appointments, function(appointment) {
    									if (appointment.Resources) {
    										if ( _.find(appointment.Resources.Resource, { 'ID': resource.ID }) ) {
    											var startTime = moment(appointment.StartDateTime).utc().format("h:mm a");
    											var endTime = moment(appointment.EndDateTime).utc().format("h:mm a");
    											var aMap = {
    												startTime: startTime,
    												endTime: endTime
    											}
    											rMap.appointments.push(aMap);
    										}
    									}

    								})
    							}
    							cageSchedules.push(rMap);
    						});

                            var displayDate = moment(scheduleDate).format('MMMM D, YYYY')
                            resolve({
                                cageSchedules: cageSchedules,
                                scheduleDate: displayDate
                            })

    					})
    					.catch(function(err) {
                            reject(err);
    					})
    			})
    			.catch(function(err) {
                    reject(err);
    			})
        });
    },

    getInstructors: function() {

        return new Promise(function (resolve, reject) {
            contentful_client.getEntries({
                content_type: 'instructors',
                order: 'sys.createdAt'
            })
            .then(function(response) {
                //console.log(JSON.stringify(response.items));
                var instructors = response.items;
                resolve(instructors);
            })
            .catch(function(err) {
                console.error(err)
                reject(err)
            })
        });

        var options = {
            sort: {
                $dateCreated: 'ASC'
            }
        }

    }

}
