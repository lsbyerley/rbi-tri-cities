window.cash = require('cash-dom'); //jQuery alternative
window.moment = require('moment');
var Barba = require('barba.js');
var venueMap = require('./googleMap.js');
var loadScript = require('./util/loadScript.js');
var Sortable = require('./sortable.js');

// Greensock Animation Library
require('gsap').TweenLite;
require('gsap').TimelineLite;
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

		var $tabs = Array.prototype.slice.call(document.querySelectorAll('a'), 0);
		if ($tabs.length > 0) {
			$tabs.forEach(function($el) {
				$el.addEventListener('click', function() {
					var id = $(this).parent().attr("data-tab");
					if (id) {
					    $(".tabs ul li").removeClass("is-active");
					    $(".tab-content").removeClass("current-tab");
					    $(this).parent().addClass("is-active");
					    $("#" + id).addClass("current-tab");
					}
				})
			})
		}

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

		//Equipment form submission
		var $eqipForms = Array.prototype.slice.call(document.querySelectorAll('form.equipment-form'), 0);
		if ($eqipForms.length > 0) {
			$eqipForms.forEach(function($el) {
				$el.addEventListener("submit", function(e) {
					e.preventDefault()

					var form = e.target
		        	var formData = $(form).serialize();
					var request = new XMLHttpRequest();
					var successNote = $('.equip-form .notification.is-success');
					var errorNote = $('.equip-form .notification.is-danger');

					request.open(form.method, form.action)
					request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		        	request.send(formData)

					request.onreadystatechange = function(){

						if (request.readyState === 4) {
							var response = JSON.parse(request.responseText)

							// Form good, email sent
							if (request.status === 200 && response.status === 200) {

								successNote.html(response.message)

								TweenLite.to(form, 0.5, {height:0, display:'none'})
								TweenLite.fromTo(successNote, 0.5, {opacity:0}, {opacity:1, display:'block'}).delay(0.5)

							} else {
								errorNote.html(response.message)

								TweenLite.to(form, 0.5, {height:0, display:'none'})
								TweenLite.fromTo(errorNote , 0.5, {opacity:0}, {opacity:1, display:'block'}).delay(0.5)
							}
						}
					}

				})
			})
		}

		// Private instruction form submissions
		var $piForms = Array.prototype.slice.call(document.querySelectorAll('.private-instruction-form'), 0);
		if ($piForms.length > 0) {
			$piForms.forEach(function($el) {
				$el.addEventListener("submit", function(e) {
					e.preventDefault()

					var form = e.target
		        	var formData = $(form).serialize();
					var request = new XMLHttpRequest();
					var successNote = $('.rbi-form .notification.is-success');
					var errorNote = $('.rbi-form .notification.is-danger');

					request.open(form.method, form.action)
					request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		        	request.send(formData)

					request.onreadystatechange = function(){

						if (request.readyState === 4) {
							var response = JSON.parse(request.responseText)

							// Form good, email sent
							if (request.status === 200 && response.status === 200) {

								successNote.html(response.message)

								TweenLite.to(form, 0.5, {height:0})
								TweenLite.fromTo(successNote, 0.5, {opacity:0}, {opacity:1, display:'block'}).delay(0.5)

							} else {
								errorNote.html(response.message)

								TweenLite.to(form, 0.5, {height:0})
								TweenLite.fromTo(errorNote , 0.5, {opacity:0}, {opacity:1, display:'block'}).delay(0.5)
							}
						}
					}

				});
			})
		}

		// Private instruction form - custom error message for parent phone
		var parentPhone = document.getElementById("parentPhone");
		if (parentPhone) {
			parentPhone.addEventListener("input", function (event) {
				if (parentPhone.validity.patternMismatch) {
					parentPhone.setCustomValidity("Phone format: XXX-XXX-XXXX");
				} else {
					parentPhone.setCustomValidity("");
				}
			});
		}

	}

	function insertYoutubeIframe() {
		var iframe = document.createElement("iframe");
		var embed = "https://www.youtube.com/embed/ID?autoplay=1";
		iframe.setAttribute("src", embed.replace("ID", this.dataset.id));
		iframe.setAttribute("frameborder", "0");
		iframe.setAttribute("allowfullscreen", "1");
		this.parentNode.replaceChild(iframe, this);
	}

	function updateActiveNavItems(currentStatus) {
		$('.navbar-item').each(function() {
			if ( $(this)[0].href === currentStatus.url) {
				$(this).addClass('is-active');
				return;
			}
		});
	}

	// Custom about page event for Google Map
	var eventPage = Barba.BaseView.extend({
		namespace: 'event',
		onEnter: function() {
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

	// Custom hittrax-leaders event for table sorting
	var hittraxLeadersPage = Barba.BaseView.extend({
		namespace: 'hittrax-monthly-leaders',
		onEnter: function() {
			const leadersTable = document.querySelector('#hittrax-leaders');
			if (leadersTable) {
				Sortable.initTable(leadersTable)
			}
		}
	})
	hittraxLeadersPage.init();

	// Barba.js page transitions
	Barba.Prefetch.init();
	Barba.Pjax.start();
	Barba.Dispatcher.on('linkClicked', function(HTMLElement, MouseEvent) {

	});
	Barba.Dispatcher.on('initStateChange', function(currentStatus) {
		$('.navbar-item').removeClass('is-active');
		$('.navbar .navbar-burger').removeClass('is-active');
		$('.navbar .navbar-menu').removeClass('is-active');
		updateActiveNavItems(currentStatus);
	});
	Barba.Dispatcher.on('transitionCompleted', function() {
		attachClickHandlers();
	});
	Barba.Dispatcher.on('newPageReady', function(currentStatus, prevStatus, HTMLElementContainer, newPageRawHTML) {
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
	        // this.newContainerLoading is a promise, when its done, fadeOut the old container
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
