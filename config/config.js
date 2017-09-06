(function() {
	'use strict';

	function config(path) {
		return {
			pageMeta: buildPageMeta(path),
			navLinks: buildNavLinks(path)
		};
	}

	function buildPageMeta(path) {
		var title = "RBI Tri-Cities",
			description = "Indoor Baseball & Softball Facility offering professional instruction on hitting, pitching & defense as well as memberships, camps & clinics.";

		switch (path) {
			case '/about':
				title = "About | " + title;
				description = "page meta description";
				break;
			case '/contact':
				title = "Contact | " + title;
				description = "page meta description";
				break;
			case '/fundraising':
				title = "Fundraising | " + title;
				description = "page meta description";
				break;
			case '/instructors':
				title = "Instructors | " + title;
				description = "page meta description";
				break;
			case '/lessons':
				title = "Lessons | " + title;
				description = "page meta description";
				break;
			case '/members':
				title = "Members | " + title;
				description = "page meta description";
				break;
			case '/rbiron':
				title = "RBIron Strength and Agility Classes | " + title;
				description = "page meta description";
				break;
			case '/signees':
				title = "Collegiate Signees | " + title;
				description = "page meta description";
				break;
			case '/teams':
				title = "Teams | " + title;
				description = "page meta description";
				break;
		}

		return {
			title: title,
			description: description
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
				{ title: 'Private Lessons', link: '/private-lessons' },
				{ title: 'Strength & Agility', link: '/strength-agility' }
			] },
			{ title: 'Camps & Events', dropdown: [
				{ title: 'Upcoming Events', link: '/events' },
				{ title: 'Annual Camps', link: '/annual-camps' }
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

			/*--------------

			{ title: 'Members', dropdown: [
				{ title: 'Pricing', link: '/memberships' },
				{ title: 'Team Practices', link: '/team-practices' },
				{ title: 'Cage Schedule', link: '/cage-schedule' }
			] },
			{ title: 'Lessons', dropdown: [
				{ title: 'Private Lessons', link: '/private-lessons' },
				{ title: 'Swing Analytics', link: '/swing-analytics' }
			] },
			{ title: 'Events', dropdown: [
				{ title: 'Camps & Showcases', link: '/camps-showcases' },
				{ title: 'High School Leagues', link: '/high-school-leagues' },
				{ title: 'Youth Leagues', link: '/youth-leagues' }
			] },
			{ title: 'Recruiting Videos', link: '/recruiting-videos' },
			{ title: 'College Signees', link: '/college-signees' },
			{ title: 'Strength & Agility', link: '/strength-agility' },
			{ title: 'Shop', link: '/equipment-apparel' },
			{ title: 'More', dropdown: [
				{ title: 'About Us', link: '/about' },
				{ title: 'Instructors', link: '/instructors' },
				{ title: 'Contact', link: '/contact' }
			] }*/

		];
	}

	module.exports = config;

})();
