"use strict";

module.exports.partials = function (req, res) {

	var filename = req.params.filename;
	if (!filename) return;
	res.render("partials/" + filename);
};

module.exports.index = function (req, res) {

	res.render('index');
};