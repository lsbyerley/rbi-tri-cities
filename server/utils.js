const async = require('async');
const _ = require('lodash');
const mindbody = require('./mindbody.js');
const moment = require('moment');
const Twitter = require('twitter');
const Instagram = require('node-instagram').default;
const twitterText = require('twitter-text');
const twemoji = require('twemoji');
const Contentful = require('contentful');
const config = require('./config');
const axios = require('axios');
//https://jelled.com/instagram/access-token

var contentful_client = Contentful.createClient({
    space: config.contentful.space_id,
    accessToken: config.contentful.access_token
});
var twitter_client = new Twitter(config.twitter);
var instagram_client = new Instagram(config.instagram);

function removeDuplicates( myArr, prop ) {
	return myArr.filter( ( obj, pos, arr ) => {
		return arr.map( mapObj => mapObj[prop] ).indexOf( obj[prop] ) === pos;
	})
}

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

    getAnnualCamps: function() {
        return new Promise(function (resolve, reject) {
            contentful_client.getEntries({
                content_type: 'annualCamps',
                order: 'sys.createdAt'
            })
            .then(function(response) {
                if (response.items) {
                    var camps = response.items
                    resolve(camps)
                } else {
                    reject({})
                }
            })
            .catch(function(err) {
                console.error(err)
                reject(err)
            })
        })
    },

    getDrillVideos: function() {

        return new Promise(function (resolve, reject) {
            contentful_client.getEntries({
                content_type: 'drillVideos'
            })
            .then(function(response) {
                var drillVideos = response.items;
                resolve(drillVideos)
            })
            .catch(function(err) {
                console.error(err)
                reject(err)
            })
        });

    },

    getEvent: function(id) {

        return new Promise(function (resolve, reject) {
            contentful_client.getEntries({
                content_type: 'events',
                'sys.id': id
            })
            .then(function(response) {
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

        var startDate = moment().subtract(1, "days").format();

        return new Promise(function (resolve, reject) {
            contentful_client.getEntries({
                content_type: 'events',
                limit: 10,
                order: 'fields.startDate',
                'fields.startDate[gt]': startDate
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

    getVHLEvents: function() {

        var startDate = moment().subtract(1, "days").format();

        return new Promise(function (resolve, reject) {
            contentful_client.getEntries({
                content_type: 'events',
                order: 'fields.startDate',
                'fields.startDate[gt]': startDate,
                'fields.isVhlEvent[ne]': 'no' // where isVhlEvent equals yes
            })
            .then(function(response) {
                var events = response.items;
                resolve(events)
            })
            .catch(function(err) {
                console.error(err)
                reject(err)
            })
        });

    },

    getUpcomingVideoShoots: function() {

        return new Promise(function (resolve, reject) {
            contentful_client.getEntries({
                content_type: 'videoShoots',
                'sys.id': '3mN9xPIbao2AQcwKkg0omc'
            })
            .then(function(response) {
                if (response.items) {
                    var videoShoot = response.items[0]
                    resolve(videoShoot)
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

    homePageData: function() {
    	return new Promise(function (resolve, reject) {
    		async.parallel({
    		    tweets: function(parallelCb) {

    		        var params = { screen_name: 'rbitricities', count: 5 };
    		        twitter_client.get('statuses/user_timeline', params)
    		            .then(function(tweets) {
    						tweets = _.map(tweets, function(tweet) {
                                var tweetLink = 'https://twitter.com/'+tweet.user.screen_name+'/status/'+tweet.id_str;
                                var retweetLink = 'http://twitter.com/intent/retweet?lang=en&tweet_id='+tweet.id_str;
                                var favoriteLink = 'http://twitter.com/intent/favorite?lang=en&tweet_id='+tweet.id_str;
    							var date = moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').fromNow()
    							return {
    								favorites: tweet.favorite_count,
    								retweets: tweet.retweet_count,
    								text: formatTweetText(tweet),
    								date: date,
                                    tweetLink: tweetLink,
                                    retweetLink: retweetLink,
                                    favoriteLink: favoriteLink
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

                    var startDate = moment().subtract(1, "days").format();

                    contentful_client.getEntries({
                        content_type: 'events',
                        limit: 4,
                        order: 'fields.startDate',
                        'fields.startDate[gt]': startDate
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

    },

    getVHLLeaders: function() {
        return new Promise(function (resolve, reject) {

            const statOfMonthTitle = 'Slugging Percentage'
            const statOfMonthSlug = 'slg'
            const statOfMonthToFixed = 3
            const statField = 'gsx$'+statOfMonthSlug
            const leadersUrl = 'https://spreadsheets.google.com/feeds/list/10HTYBCgCbN17gGHvK_4-BlPqMqGpvPdVi3FCjErKIRI/2/public/values?alt=json';

            axios.get(leadersUrl).then((res) => {

                const entries = res.data.feed.entry

                // 1. Normalize entries, filter by at bats, sort by stat of month
                let leaders = entries.map((entry) => {
                    return {
                        name: entry.gsx$user.$t,
                        level: entry.gsx$level.$t,
                        atBats: parseFloat(entry.gsx$ab.$t).toFixed(0),
                        avg: entry.gsx$avg.$t,
                        slg: entry.gsx$slg.$t,
                        hha: entry.gsx$hha.$t,
                        avgvel: entry.gsx$avgvel.$t,
                        maxvel: entry.gsx$maxvel.$t
                        //statOfMonthTitle: statOfMonthTitle,
                        //statOfMonthSlug: statOfMonthSlug,
                        //statOfMonthStat: parseFloat(entry[statField]['$t']).toFixed(statOfMonthToFixed)
                    }
                })
                .filter((e) => {
                    return e.atBats > 29
                })
                /*.sort((a, b) => {
                    if (b.statOfMonthStat < a.statOfMonthStat)
                        return -1;
                    if (b.statOfMonthStat > a.statOfMonthStat)
                        return 1;
                    return 0;
                })*/

                //leaders = removeDuplicates(leaders, 'level');

                resolve(leaders);

            }).catch((err) => {
                reject(err)
            })

        });
    },

    getCollegeSignees: function() {

        return new Promise(function (resolve, reject) {

            var signeesUrl = 'https://spreadsheets.google.com/feeds/list/1bl9c_HhR5OpKpjTq9ZVno592ML02ouiO-w22Gg3IMkQ/1/public/values?alt=json';

            axios.get(signeesUrl).then((res) => {

                var entries = res.data.feed.entry;
                var signees = _.map(entries, function(entry) {
                    return {
                        name: entry.gsx$name.$t,
                        highSchool: entry.gsx$highschool.$t,
                        college: entry.gsx$college.$t,
                        year: entry.gsx$yearsigned.$t
                    }
                })
                resolve(signees);

            }).catch((err) => {
                reject(err)
            })

        });

    }

}
