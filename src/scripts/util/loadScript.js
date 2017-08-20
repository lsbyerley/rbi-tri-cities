(function(document) {
	'use strict';

    module.exports = function(url, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';

        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName('body')[0].appendChild(script);
    }

})(document);
