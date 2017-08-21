window.cash = require('cash-dom'); //jQuery alternative
window.moment = require('moment');
var Barba = require('barba.js');
var venueMap = require('./googleMap.js');
var loadScript = require('./util/loadScript.js');

// Greensock Animation Library
require('gsap').TweenLite;
require('gsap/CSSPlugin');
require('gsap/ScrollToPlugin');

(function(window, document, $) {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		// attach page click handlers
		attachClickHandlers();
		// Toggles the mobile nav menu. Doesn't need to be added every page load because its not in barba-container
		var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
		if ($navbarBurgers.length > 0) {
			$navbarBurgers.forEach(function($el) {
				$el.addEventListener('click', function() {
					var target = $el.dataset.target;
					var $target = document.getElementById(target);
					$el.classList.toggle('is-active');
					$target.classList.toggle('is-active');
				});
			});
		}

	});

	// Any click handlers inside the .barba-container need to be re-added every time a new view is loaded
	function attachClickHandlers() {

		// Video player click handlers
		var $videos = Array.prototype.slice.call(document.querySelectorAll('.youtube-player'), 0);
        if ($videos.length > 0) {
			$videos.forEach(function($el) {
				var videoId = $el.dataset.id;
			    var div = document.createElement("div");
	            div.setAttribute("data-id", videoId);
				var innerHtml = '<img src="https://i.ytimg.com/vi/'+videoId+'/hqdefault.jpg"><div class="play"></div>';
	            div.innerHTML = innerHtml;
	            div.onclick = insertYoutubeIframe;
	            $el.appendChild(div);
	        });
		}

		// When any? link is clicked, remove is-active class from .navbar-menu and .navbar-burger
		var $links = Array.prototype.slice.call(document.querySelectorAll('a'), 0);
		if ($links.length > 0) {
			$links.forEach(function($el) {
				$el.addEventListener('click', function() {
					$('.navbar-menu').removeClass('is-active');
					$('.navbar-burger').removeClass('is-active');
				});
			})
		}

		/*var $maps = Array.prototype.slice.call(document.querySelectorAll('#google-map-event .map'), 0);
		if ($maps.length > 0) {
			$maps.forEach(function($el) {
				var lat = $el.dataset.latitude,
					long = $el.dataset.longitude;

				console.log('initmap', lat, long)
				venueMap.init(lat, long);
			})
		}*/

	}

	function insertYoutubeIframe() {
		var iframe = document.createElement("iframe");
		var embed = "https://www.youtube.com/embed/ID?autoplay=1";
		iframe.setAttribute("src", embed.replace("ID", this.dataset.id));
		iframe.setAttribute("frameborder", "0");
		iframe.setAttribute("allowfullscreen", "1");
		this.parentNode.replaceChild(iframe, this);
	}

	function updateActiveNavItems(HTMLElement) {
		var link = $(HTMLElement);
		if ((link.hasClass('navbar-item') || link.hasClass('foot-link'))) {
			$('.navbar-item').removeClass('is-active');
			$('.foot-link').removeClass('is-active');
			$('.navbar .navbar-burger').removeClass('is-active');
			$('.navbar .navbar-menu').removeClass('is-active');
			$('.navbar-item').each(function() {
				if ( $(this)[0].pathname === link[0].pathname && link[0].pathname !== '/') {
					$(this).addClass('is-active');
				}
			})
			$('.foot-link').each(function() {
				if ( $(this)[0].pathname === link[0].pathname && link[0].pathname !== '/') {
					$(this).addClass('is-active');
				}
			})
		}
	}

	// Custom about page event for Google Map
	var eventPage = Barba.BaseView.extend({
		namespace: 'event',
		onEnter: function() {
			console.log('event page!');

			var $maps = Array.prototype.slice.call(document.querySelectorAll('#google-map-event .map'), 0);
			if ($maps.length > 0) {
				var $theMap = $maps[0];
				var lat = $theMap.dataset.latitude,
					long = $theMap.dataset.longitude;

				if (!window.google) {
					loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyB2KN3R37wRR-idz5kg6y0jhTZVS_qTQL8', function() {
						venueMap.init(lat, long);
					});
				} else {
					venueMap.init(lat, long);
				}
			}

		}
	});

	eventPage.init();

	// Barba.js page transitions
	Barba.Pjax.start();
	//Barba.Prefetch.init();
	Barba.Dispatcher.on('linkClicked', function(HTMLElement, MouseEvent) {
		updateActiveNavItems(HTMLElement);
	});
	Barba.Dispatcher.on('initStateChange', function(currentStatus) {
		//if (!linkClicked) {
			console.log('previous', Barba.HistoryManager.prevStatus());
			console.log('current', Barba.HistoryManager.currentStatus());
		//}
	});
	Barba.Dispatcher.on('newPageReady', function(currentStatus, prevStatus, HTMLElementContainer, newPageRawHTML) {
		attachClickHandlers();
		// For Google Analytics tracking, make sure ga() exists first.
        if ( typeof ga === "function" ) {
            ga('set', {
                page: window.location.pathname,
                title: document.title
            });
            ga('send', 'pageview');
    	}
	});

	var FadeTransition = Barba.BaseTransition.extend({
	    start: function() {
	        // As soon the loading is finished and the old page is faded out, let's fade the new page
	        Promise
	            .all([this.newContainerLoading, this.fadeOut()])
	            .then(this.fadeIn.bind(this));
	    },

	    fadeOut: function() {
	        //oldContainer is the old page that is fading out of the DOM
	         var oldContainer = $(this.oldContainer);
	         return
	            TweenLite.to(oldContainer, .75, { opacity: 0 } )
	            .promise();
	    },

	    fadeIn: function() {
			// At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
			var _this = this;
			var oldContainer = $(this.oldContainer);
			var newContainer = $(this.newContainer);

			TweenLite.to(window, .5, {scrollTo:0});

			oldContainer.css( { display: 'none' } );
			TweenLite.fromTo(newContainer,  0.75, { y:10, opacity:0 }, { y:0, opacity:1 });

	        _this.done(); //Do not forget to call .done() as soon your transition is finished!
	    }
	});

	// Tell Barba to use the new Transition
	Barba.Pjax.getTransition = function() {
	   // can use different transitions for different pages
	    return FadeTransition;
	};

})(window, document, window.cash);
