var Pagination = require('../utils/pagination.utils')
var Transformer = require('../utils/transformer.utils')
var BikersModel = require('../models/bikers.model');

module.exports = {
	findAll : (req, res) => {
		var condition = {
	        // created_by: res.decoded._id,
	    };
	    var query = req.query;
	    var condition2 = { sort: '-created_at' };
	    condition2.limit = query.limit || 10;
	    var page = query.page || 1;
	    var offset = (page - 1) * condition2.limit;
	    condition2.limit = offset;

	    var exclude = "-password";
	    BikersModel
	        .find(condition, exclude, condition2)
	        .populate('created_by', '-password')
	        .exec(function(err, bikers) {
	            if (err) {
	            	console.log(err);
	                res.json(Transformer.transformResponse(0, "An Error Occured"));
	            } else {
	                BikersModel.count(condition, function(err, count) {
	                    Pagination.createPages(count, condition2.limit, function(pages) {
	                        var info = { pages: pages };
	                        res.json(Transformer.transformResponse(1, "ok", { bikers: bikers, meta: info }));
	                    });
	                });
	            }

	        });
	},
	add : (req, res) => {
		var BikerObject = {
	        created_by: res.decoded._id,
	        name: req.body.name,
	        email: req.body.email,
	        city: req.body.city,
	        ride_in_group: req.body.ride_in_group,
	        days_of_week: req.body.days_of_week
	    };
	    var BikersInstance = new BikersModel(BikerObject);
	    BikersInstance.save(function(err, biker) {
	        if (err) {
	            res.json(Transformer.transformResponse(0, "An Error Occured, Please try again"));
	        } else {
	            res.json(Transformer.transformResponse(1, "Biker Created successfully", { biker: biker }));
	        }
	    });
	},
	update : (req, res) => {
		var biker_id = req.params.id;
	    var update = req.body.update;

	    BikersModel
	        .update({ _id: biker_id }, update)
	        .exec(function(error, response) {
	            if (error) {
	                return res.json(Transformer.transformResponse(0, 'Currently unable to perform update operation for the admin, please try again later'));
	            }

	            return res.json(Transformer.transformResponse(1, 'Update successful'));
	        });
	},
	delete : (req, res) => {
		var biker_id = req.params.id;
		console.log(biker_id)
	    BikersModel
	        .remove({ _id: biker_id })
	        .exec(function(error, response) {
	            if (error) {
	                return res.json(Transformer.transformResponse(0, 'Currently unable to perform update operation for the admin, please try again later'));
	            }

	            return res.json(Transformer.transformResponse(1, 'Delete successful'));
	        });
	},	
}