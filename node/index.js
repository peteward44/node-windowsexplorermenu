'use strict';

var fs = require( 'fs-extra' );
var path = require( 'path' );
var edge = require( 'edge' );
var exec = require( 'child_process' ).exec;

var ourDllPath = path.join( __dirname, 'dll', 'windowsexplorermenu-clr.dll' );
var ourSharpDllPath = path.join( __dirname, 'dll', 'SharpShell.dll' );


function register( dllname, options, callback ) {
	var clrMethod = edge.func({
		assemblyFile: ourDllPath,
		typeName: 'windowsexplorermenu_clr.ExplorerMenuInterface',
		methodName: 'Register'
	});
	
	var dll = path.normalize( path.resolve( dllname ) );
	options.dllpath = dll;
	
	fs.ensureDirSync( path.dirname( dll ) );
	fs.copySync( ourDllPath, path.join( path.dirname( dll ), path.basename( ourDllPath ) ) );
	fs.copySync( ourSharpDllPath, path.join( path.dirname( dll ), path.basename( ourSharpDllPath ) ) );

	clrMethod( options, function( err ) {
		callback( err );
	} );
}

exports.register = register;


function unregister( dllname, callback ) {
	// var dll = path.normalize( path.resolve( dllname ) );
	// return exec( ourSrm + ' uninstall "' + dll + '"', { cwd: path.dirname( dll ) }, callback );
	
	var clrMethod = edge.func({
		assemblyFile: ourDllPath,
		typeName: 'windowsexplorermenu_clr.ExplorerMenuInterface',
		methodName: 'Unregister'
	});
	
	var params = {
		dllpath: path.normalize( path.resolve( dllname ) )
	};
	
	clrMethod( params, function( err ) {
		callback( err );
	} );
}

exports.unregister = unregister;

