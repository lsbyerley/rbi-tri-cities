(function(window, document, $) {
	'use strict';

    var CustomGoogleMap = {

        init: function(lat, long) {

			var map, latLng, marker = new google.maps.Geocoder();

			var latitude = (lat) ? lat : 36.29620999999999,
			    longitude = (long) ? long : -82.34483999999998;

			var style = [
			    {	//poi stands for point of interest - don't show these lables on the map
			        featureType: 'poi',
			        elementType: 'labels',
			        stylers: [
			            {visibility: 'on'}
			        ]
			    }
			];

			var mapOptions = {
				//center: new google.maps.LatLng(latitude, longitude),
		        zoom: 17,
		        fullscreenControl: false,
		        scrollwheel: false,
		        panControl: false,
		        zoomControl: true,
		        zoomControlOptions: {
		            position: google.maps.ControlPosition.RIGHT_BOTTOM
		        },
			    mapTypeControl: false,
			    streetViewControl: false,
				styles: style
		    };

			map = new google.maps.Map(document.getElementById('google-container'), mapOptions);
			latLng = new google.maps.LatLng(latitude, longitude);
		    map.setCenter(latLng);
		    marker = new google.maps.Marker({
		        position: latLng,
		        map: map,
		        draggable: false,
				clickable: false,
		        animation: google.maps.Animation.DROP
		    });

        }

    }

    module.exports = CustomGoogleMap;

})(window, document, window.cash);
