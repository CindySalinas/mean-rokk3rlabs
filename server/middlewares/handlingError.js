
exports.parseError = function(err, req, res, next) {
	if (err.status === 400 && err.name === 'SyntaxError' && err.body)
		return res
			.status(400)
			.send({
				status: 400,
				message: 'Bad request'
			});
	else if(err.status === 404)
		return res
			.status(404)
			.send({
				status: 404,
				message : 'Page not found'
			});
	else if(err){
		return res
			.status(500)
			.send({
				status : 500,
				message : 'Internal server error',
				error: err.message
			});
	}
	next();
}
