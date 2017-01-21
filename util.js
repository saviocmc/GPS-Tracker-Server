console = new require( "console" ).Console( require( "fs" ).createWriteStream( "./log" ) );

log = ( logType, msg ) => console.log( "\n[%s] %s - %s", logType, new Date().toLocaleString( "pt-BR" ), msg );

module.exports.log =
{
	"info" : (msg) => log( "INFO", msg ),
	"warn" : (msg) => log( "WARNING", msg ),
	"error" : (msg) => log( "ERROR", msg )
}

// This function puts a listener on the event of incoming data of the request and concatenate the data into a string object
// When all the incoming data is read and concatenate into the string, this function calls the callback function with the string object as the parameter
module.exports.getRequestBody = ( request, maxBodySize, callback ) =>
{
	var body = "";
	request.on( 'data', ( data ) => ( body.length + data.length < maxBodySize ) ? body += data : request.connection.destroy() );
	request.on( 'end', () => callback( body ) );
}

// Swaps the keys with the values of a object
module.exports.swap = ( obj ) =>
{
	var swaped = { };
	for( var key in obj ) {
		swaped [ obj [ key ] ] = key;
	}
	return swaped;
}