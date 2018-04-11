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
		var title = '',
			shortDesc = 'Premier Indoor Baseball & Softball Training Facility',
			description = 'Indoor Baseball & Softball Facility offering professional instruction on hitting, pitching & defense as well as memberships, camps, and clinics in Johnson City, TN';

		switch (path) {
			case '/':
					title = 'RBI Tri-Cities'
					break;
			case '/our-facility':
			    title = 'Our Facility'
			    //description = '';
			    break;
			case '/memberships':
			    title = 'Memberships'
			    //description = '';
			    break;
			case '/team-practices':
			    title = 'Team Practices'
			    //description = '';
			    break;
			case '/cage-schedule':
			    title = 'Cage Schedule'
			    //description = '';
			    break;
			case '/private-instruction':
			    title = 'Private Instruction'
			    //description = '';
			    break;
			case '/strength-agility':
			    title = 'RBIron Strength and Agility'
			    //description = '';
			    break;
			case '/events':
			    title = 'Events'
			    //description = '';
			    break;
			case '/annual-camps':
			    title = 'Annual Camps'
			    //description = '';
			    break;
			case '/recruiting-videos':
			    title = 'Recruiting Videos'
			    //description = '';
			    break;
			case '/showcases':
			    title = 'Showcases'
			    //description = '';
			    break;
			case '/college-signees':
			    title = 'College Signees'
			    //description = '';
			    break;
			case '/rbi-teams':
			    title = 'RBI Teams'
			    //description = '';
			    break;
			case '/shop':
			    title = 'Equipment Shop'
			    //description = '';
			    break;
			case '/about':
			    title = 'About Us'
			    //description = '';
			    break;
			case '/instructors':
			    title = 'Instructors'
			    //description = '';
			    break;
			case '/directory':
			    title = 'Staff Directory'
			    //description = '';
			    break;
			case '/contact':
			    title = 'Contact Us'
			    //description = '';
			    break;
			case '/hittrax':
				title = 'HitTrax'
				break;
			case '/hittrax-faq':
				title = 'HitTrax FAQ'
				//description = '';
				break;
			case '/hittrax-monthly-leaders':
			    title = 'HitTrax Monthly Leaders'
			    //description = '';
			    break;
			case '/vhl-about':
				title = 'About our Virtual Hitting Leagues'
				break;
			case '/vhl-schedules':
				title = 'VHL Schedules'
				break;
			case '/vhl-standings-stats':
				title = 'VHL Standings & Stats'
				break;
		}

		return {
			title: title,
			shortDesc: shortDesc,
			description: description
		};
	}

	module.exports = config;

})();
