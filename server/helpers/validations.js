var _ = require('lodash'),
		validations = {
			customValidators:{}
		},
		moment = require('moment');

validations.customValidators.isString = function(value){
	if(value === null)
		return true;
	var str = typeof value;
	return str == 'string' ? true: false;
}

validations.customValidators.isValidDate = function(value, format){
  //optional field
  if(value === null)
    return true;
  //year month day hour(24 hour format) minutes seconds
  if(format === "YYYY-MM-DD hh:mm:ss")
    return moment(value, 'YYYY-MM-DD HH:mm:ss', true).isValid();
  //year month day
  else if(format == "YYYY-MM-DD")
    return moment(value, 'YYYY-MM-DD', true).isValid();
  //return
  return false;
}

module.exports = validations;
