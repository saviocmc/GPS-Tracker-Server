// This function waits the end of the connection and parses the body of the request in the Json format
// Then, it calls the callback function with the Json object as the parameter.
module.exports.extractJsonBody = function(request, maxRequestSize, callback){
	var stringBody = "";
	request.on('data', function (data) {
		stringBody += data;
		// kill the connection if the request is greater than the "maxRequestSize" parameter
		if (stringBody.length > maxRequestSize)
			request.connection.destroy();
		});
	request.on('end', function () {
		var jsonBody = JSON.parse(stringBody);
		callback(jsonBody);
	});
}

// Swaps the keys with the values of a Json object
module.exports.swap = function(json){
	var swaped = { };
	for(var key in json){
		swaped [ json [ key ] ] = key;
	}
	return swaped;
}