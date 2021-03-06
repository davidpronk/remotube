var express =         require( 'express' );
var path =            require( 'path' );
var favicon =         require( 'serve-favicon' );
var logger =          require( 'morgan' );
var cookieParser =    require( 'cookie-parser' );
var compass =         require( 'node-compass' );
var mustacheExpress = require( 'mustache-express' );

var index =           require( './routes/index' );
var control =         require( './routes/control' );

var app = express();

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.set( 'ipaddress', ipaddress );
app.set( 'port', port );

// view engine setup
app.engine( 'html', mustacheExpress() );
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'html' );

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

//app.use(logger('dev'));
//app.use(cookieParser());
//app.use(compass({mode: 'expanded'}));


app.use( '/static', express.static( path.join( __dirname, 'static' ) ) );

app.use( '/control', control );
app.use( '/', index );



// catch 404 and forward to error handler
app.use(function( req, res, next ) {
    var err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
});

// error handlers

// development error handler
// will print stacktrace
if ( app.get( 'env' ) === 'development' ) {
    app.use(function( err, req, res, next ) {
        res.status( err.status || 500 );
        res.render( 'error', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use( function( err, req, res, next ) {
    res.status( err.status || 500) ;
    res.render( 'error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
