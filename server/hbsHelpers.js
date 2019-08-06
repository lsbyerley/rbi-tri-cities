const moment = require('moment');
const _isEmpty = require('lodash/isEmpty')

module.exports = function () {

	var _helpers = {};

    _helpers.isNavItemActive = function(path, link) {
        if (path === link) { return 'is-active'; }
        return '';
    };

		_helpers.isNotEmpty = function(object) {
			return !_isEmpty(object);
		};

	_helpers.ifCond = function(v1, operator, v2, options) {
		switch (operator) {
	        case '==':
	            return (v1 == v2) ? options.fn(this) : options.inverse(this);
	        case '===':
	            return (v1 === v2) ? options.fn(this) : options.inverse(this);
	        case '!=':
	            return (v1 != v2) ? options.fn(this) : options.inverse(this);
	        case '!==':
	            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
	        case '<':
	            return (v1 < v2) ? options.fn(this) : options.inverse(this);
	        case '<=':
	            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
	        case '>':
	            return (v1 > v2) ? options.fn(this) : options.inverse(this);
	        case '>=':
	            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
	        case '&&':
	            return (v1 && v2) ? options.fn(this) : options.inverse(this);
	        case '||':
	            return (v1 || v2) ? options.fn(this) : options.inverse(this);
	        default:
	            return options.inverse(this);
	    }
	}

	_helpers.formatDate = function(context, options) {

		var date = context.hash.date,
			format = context.hash.format;

		/*if (!options && context.hasOwnProperty('hash')) {
			options = context;
			context = undefined;

			if (this.publishedDate) {
				context = this.publishedDate;
			}
		}

		// ensure that context is undefined, not null, as that can cause errors
		context = context === null ? undefined : context;*/

		//return 'hello';
		return moment(date).format(format);
	};

    return _helpers;
};
