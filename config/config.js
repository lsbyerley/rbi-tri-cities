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
				{ title: 'Strength & Agility', link: '/strength-agility' }
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
				{ title: 'RBI Pride Teams', link: '/rbi-pride-teams' },
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
		var title = "RBI Tri-Cities",
			description = "Indoor Baseball & Softball Facility offering professional instruction on hitting, pitching & defense as well as memberships, camps, and clinics in Johnson City, TN";

		switch (path) {
			case '/our-facility':
				title = "Our Facility | " + title;
				//description = "";
				break;
			case '/memberships':
				title = "Memberships | " + title;
				//description = "";
				break;
			case '/team-practices':
				title = "Team Practices | " + title;
				//description = "";
				break;
			case '/cage-schedule':
				title = "Cage Schedule | " + title;
				//description = "";
				break;
			case '/private-instruction':
				title = "Private Instruction | " + title;
				//description = "";
				break;
			case '/strength-agility':
				title = "RBIron Strength and Agility | " + title;
				//description = "";
				break;
			case '/events':
				title = "Events | " + title;
				//description = "";
				break;
			case '/annual-camps':
				title = "Annual Camps | " + title;
				//description = "";
				break;
			case '/recruiting-videos':
				title = "Recruiting Videos | " + title;
				//description = "";
				break;
			case '/showcases':
				title = "Showcases | " + title;
				//description = "";
				break;
			case '/college-signees':
				title = "College Signees | " + title;
				//description = "";
				break;
			case '/rbi-teams':
				title = "RBI Teams | " + title;
				//description = "";
				break;
			case '/rbi-pride-teams':
				title = "RBI Pride Teams | " + title;
				//description = "";
				break;
			case '/shop':
				title = "Equipment Shop | " + title;
				//description = "";
				break;
			case '/about':
				title = "About Us | " + title;
				//description = "";
				break;
			case '/instructors':
				title = "Instructors | " + title;
				//description = "";
				break;
			case '/directory':
				title = "Staff Directory | " + title;
				//description = "";
				break;
			case '/contact':
				title = "Contact Us | " + title;
				//description = "";
				break;
		}

		return {
			title: title,
			description: description
		};
	}

	module.exports = config;

})();
