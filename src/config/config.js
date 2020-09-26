require('dotenv').config();

let CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'development';
CONFIG.port         = process.env.PORT  || '4000';
// CONFIG.client_url         = process.env.CLIENT_URL  || "http://localhost:3000";

CONFIG.MONGODB_URI 		 = 'mongodb://'+process.env.MONGODB_HOST+':'+process.env.MONGODB_PORT+'/'+process.env.MONGODBDB_NAME   || 'mongodb://localhost:27017/test';

CONFIG.jwt_encryption 	 = process.env.JWT_ENCRYPTION || 'AaBrAkaDaBaRa';
CONFIG.jwt_expiration 	 = process.env.JWT_EXPIRATION || '3h';

module.exports = CONFIG;
