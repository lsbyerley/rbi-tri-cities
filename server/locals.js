(function() {
	'use strict';

	function config(path) {
		return {
			pageMeta: buildPageMeta(path),
			navLinks: buildNavLinks(path)
		};
	}

	function buildNavLinks(path) {
		return [

			{ title: 'Facility', dropdown: [
				{ title: 'About The Facility', link: '/our-facility' },
				{ title: 'Memberships', link: '/memberships' },
				{ title: 'Team Practices', link: '/team-practices' },
				{ title: 'Daily Cage Schedule', link: '/cage-schedule' }
			] },
			{ title: 'Player Development', dropdown: [
				{ title: 'Private Instruction', link: '/private-instruction' },
				{ title: 'Strength & Agility', link: '/strength-agility' },
				{ title: 'HitTrax', link: '/hittrax' }
			] },
			{ title: 'HitTrax', dropdown: [
				{ title: 'About HitTrax', link: '/hittrax' },
				{ title: 'HitTrax FAQ', link: '/hittrax-faq' },
				{ title: 'Monthly Leaders', link: '/hittrax-monthly-leaders' }
			] },
			{ title: 'VHL', dropdown: [
				{ title: 'About VHL', link: '/vhl-about' },
				{ title: 'VHL Schedules', link: '/vhl-schedules' },
				{ title: 'Standings & Stats', link: '/vhl-standings-stats' }
			] },
			{ title: 'Camps & Events', dropdown: [
				{ title: 'Upcoming Events', link: '/events' },
				{ title: 'Annual Camps', link: '/annual-camps' },
				{ title: 'Showcases', link: '/showcases' }
			] },
			{ title: 'College Recruiting', dropdown: [
				{ title: 'Recruiting Videos', link: '/recruiting-videos' },
				{ title: 'Showcases', link: '/showcases' },
				{ title: 'College Signees', link: '/college-signees' }
			] },
			{ title: 'RBI Teams', dropdown: [
				{ title: 'RBI Tri-Cities Teams', link: '/rbi-teams' },
				{ title: 'Equipment Shop', link: '/shop' }
			] },
			{ title: 'About', dropdown: [
				{ title: 'About Us', link: '/about' },
				{ title: 'Instructors', link: '/instructors' },
				{ title: 'Directory', link: '/directory' },
				{ title: 'Contact', link: '/contact' }
			] }

		];
	}

	function buildPageMeta(path) {
		var title = "RBI Tri-Cities: Premier Indoor Baseball & Softball Training Facility",
			shortTitle = "RBI Tri-Cities",
			description = "Indoor Baseball & Softball Facility offering professional instruction on hitting, pitching & defense as well as memberships, camps, and clinics in Johnson City, TN";

		switch (path) {
			case '/our-facility':
			    title = "Our Facility | " + shortTitle;
			    //description = "";
			    break;
			case '/memberships':
			    title = "Memberships | " + shortTitle;
			    //description = "";
			    break;
			case '/team-practices':
			    title = "Team Practices | " + shortTitle;
			    //description = "";
			    break;
			case '/cage-schedule':
			    title = "Cage Schedule | " + shortTitle;
			    //description = "";
			    break;
			case '/private-instruction':
			    title = "Private Instruction | " + shortTitle;
			    //description = "";
			    break;
			case '/strength-agility':
			    title = "RBIron Strength and Agility | " + shortTitle;
			    //description = "";
			    break;
			case '/events':
			    title = "Events | " + shortTitle;
			    //description = "";
			    break;
			case '/annual-camps':
			    title = "Annual Camps | " + shortTitle;
			    //description = "";
			    break;
			case '/recruiting-videos':
			    title = "Recruiting Videos | " + shortTitle;
			    //description = "";
			    break;
			case '/showcases':
			    title = "Showcases | " + shortTitle;
			    //description = "";
			    break;
			case '/college-signees':
			    title = "College Signees | " + shortTitle;
			    //description = "";
			    break;
			case '/rbi-teams':
			    title = "RBI Teams | " + shortTitle;
			    //description = "";
			    break;
			case '/shop':
			    title = "Equipment Shop | " + shortTitle;
			    //description = "";
			    break;
			case '/about':
			    title = "About Us | " + shortTitle;
			    //description = "";
			    break;
			case '/instructors':
			    title = "Instructors | " + shortTitle;
			    //description = "";
			    break;
			case '/directory':
			    title = "Staff Directory | " + shortTitle;
			    //description = "";
			    break;
			case '/contact':
			    title = "Contact Us | " + shortTitle;
			    //description = "";
			    break;
			case '/hittrax':
				title = "HitTrax | " + shortTitle;
				break;
			case '/hittrax-faq':
				title = "HitTrax FAQ | " + shortTitle;
				//description = "";
				break;
			case '/hittrax-monthly-leaders':
			    title = "HitTrax Monthly Leaders | " + shortTitle;
			    //description = "";
			    break;
			case '/vhl-about':
				title = "About our Virtual Hitting Leagues | " + shortTitle;
				break;
			case '/vhl-schedules':
				title = "VHL Schedules | " + shortTitle;
				break;
			case '/vhl-standings-stats':
				title = "VHL Standings & Stats | " + shortTitle;
				break;
		}

		return {
			title: title,
			description: description
		};
	}

	module.exports = config;

})();
