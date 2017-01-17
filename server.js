const fs = require( "fs" );
const util = require( "./util.js" );
const log = util.log;
const urlParser = require( "url" ).parse;

// These two map objects will be used for authentication purposes
const TRACKERS_ID	= util.swap( JSON.parse( fs.readFileSync ( './trackers.id' ) ) );
const CLIENTS_ID	= util.swap( JSON.parse( fs.readFileSync ( './clients.id' ) ) );

// This object will be used to store all the information posted by the trackers
const TRACKERS = { };
for ( var token in TRACKERS_ID ) { var id = TRACKERS_ID [token] ; TRACKERS [id] = { "id":id } ; }
 
var server = require( 'http' ).createServer( (request, response) =>
{
	log.info("New " + request.method + " to " + request.url);
	var resource = request.url.split("/") [1];
	try {
		if ( !( RESTfulMethod = RESTful [ request.method ] [ resource ] ) )
			throw "Ressource \"" + resource + "\" not found in the RESTful methods map";
	} catch (error) {
		response.writeHead( 400 );
		response.end( "400 - Bad Request" );
		log.warn("Bad Request: " + error);
		return;
	}
	RESTfulMethod (request, response);
});

// Starting the server with the configuration specified on the file "server.conf"
var serverConf = JSON.parse( fs.readFileSync( "./server.conf" ) );
server.listen( serverConf.port, serverConf.hostname, () =>
	log.info( "Server started. Listening to: \n" + JSON.stringify( server.address(), null, 4 ) ) );

const RESTful = { "GET" : { } , "POST" : { } }; // This map stores the references for the functions that will really handle the http requests

RESTful ["GET"] ["tracker"] = ( request, response ) => 
{
	// Validate the request using the "auth" property of the headers
	if ( CLIENTS_ID [request.headers.auth] ) {
		response.writeHead( 200, { "Content-Type" : "application/json'" } );
		// TODO : Deal with queries. e.g.: line=2,3&status=moving (use the urlParser)
		response.end( JSON.stringify( Object.values( TRACKERS ), null, 4 ) );
	} else {
		response.writeHead( 403 );
		response.end( "403 - Forbidden" );
	}
}

RESTful ["POST"] ["tracker"] = ( request, response ) =>
{
	var tracker_id = request.url.split("/")[2];
	// Validate the request using the "auth" property of the headers
	if ( TRACKERS_ID [request.headers.auth] && TRACKERS_ID [request.headers.auth] == tracker_id ) {
		// It will accept post with the maximun body size of 1KB (1000 B)
		util. extractJsonBody( request, 1000, ( jsonBody ) => { 
			response.writeHead( 200, { "Content-Type" : "application/json" } );
			//Merge the propreties of the incomming object with the local object and return it as the http response
			response.end( JSON.stringify( Object.assign( TRACKERS [tracker_id] , jsonBody ), null, 4 ) );
		});
	} else {
		response.writeHead( 403 );
		response.end( "403 - Forbidden" );
	}
}
