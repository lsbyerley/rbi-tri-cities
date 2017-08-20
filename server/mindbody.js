var soap = require('soap');
var moment = require('moment');
var appointmentService = "https://api.mindbodyonline.com/0_5/AppointmentService.asmx";
var siteService = "https://api.mindbodyonline.com/0_5/SiteService.asmx";
var config = require('./config');

var sourceCredentials = {
    "SourceName": "RBITriCities",
    "Password": "hXyMUftL8XrY7jhftfge/+NCIC0=",
    "SiteIDs": {
        "int": [192033]
    }
}

var sourceCredentials_sandbox = {
    "SourceName": "RBITriCities",
    "Password": "hXyMUftL8XrY7jhftfge/+NCIC0=",
    "SiteIDs": {
        "int": [-99]
    }
}

var userCredentials = {
    "Username": "lsbyerley",
    "Password": "mindbody88",
    "SiteIDs": {
        "int": [192033]
    }
}

var userCredentials_sandbox = {
    "Username": "Siteowner",
    "Password": "apitest1234",
    "SiteIDs": {
        "int": [-99]
    }
}

var staffCredentials = {
    "Username": "_RBITriCities",
    "Password": "hXyMUftL8XrY7jhftfge/+NCIC0=",
    "SiteIDs": {
        "int": [192033]
    }
}

module.exports = {
    getResources: function() {

        return new Promise(function (resolve, reject){

            soap.createClient(siteService+'?WSDL', function (err, client) {
    			if (!err) {

    				client.setEndpoint(siteService);
    				var params = {
    	                "Request": {
    	                    "SourceCredentials": config.mindbody.sourceCredentials
    	                }
    	            };

    				client.GetResources(params, function (err, result) {
                        if (err || result.GetResourcesResult.ErrorCode !== 200) {
                            reject(err);
                        } else {
                            //console.log(JSON.stringify(result.GetResourcesResult.Resources.Resource))
                            resolve(result.GetResourcesResult.Resources.Resource);
                        }
    	            });

    			} else {
    				reject(err);
    			}

    		});

        });

    },
    getStaffAppointments: function(date) {

        return new Promise(function (resolve, reject){

            soap.createClient(appointmentService+'?WSDL', function (err, client) {
    			if (!err) {

    				client.setEndpoint(appointmentService);
                    //'2017-07-31T00:00:00'
                    //'2017-07-31T23:59:59'
    				var params = {
    	                "Request": {
    						"SourceCredentials": config.mindbody.sourceCredentials,
    	                    "StaffCredentials": config.mindbody.staffCredentials,
    						"StaffIDs": {
    							"long": [0]
    						},
    						"StartDate": date,
    						"EndDate": date
    	                }
    	            };

    				client.GetStaffAppointments(params, function (err, result) {
                        if (err || result.GetStaffAppointmentsResult.ErrorCode !== 200) {
                            reject(err);
                        } else {
                            //console.log(JSON.stringify(result.GetStaffAppointmentsResult.Appointments.Appointment));
                            if (!result.GetStaffAppointmentsResult.Appointments) {
                                resolve([])
                            } else {
                                resolve(result.GetStaffAppointmentsResult.Appointments.Appointment);
                            }
                        }
    	            })

    			} else {
    				reject(err);
    			}

    		});

        });

    }
}
