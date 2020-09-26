const moment = require("moment");


exports.dateFormat = date => {
	return date ? moment(date).format('llll') : null;
};
