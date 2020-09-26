const errResponse = require('./errorCode');

module.exports = {

	apiResp : (req, res, data = [], meta = {}) => {
	    let metaData = {...meta };

	    metaData.error = 0;
	    if(meta.message == undefined){
	    	metaData.message = errResponse[metaData.status].message;
	    }else{
	    	metaData.message = meta.message;
	    }
		const response = { data, meta: metaData };
	    let status = metaData.status; 

        return res.status(status).json(response);

	},

	apiErr : (req, res, status, err = {}) => {
	    let data = []
	    let metaData = {}

	    metaData.error = 1;
	    metaData.status = status;
	    if(err.message == undefined){
	    	metaData.message = errResponse[status].message;
	    }else{
	    	metaData.message = err.message;
	    }
		const output = { data, meta: metaData };
			    
       return  res.status(status).json(output);

	}


};
