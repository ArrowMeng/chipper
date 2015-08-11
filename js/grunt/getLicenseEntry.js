// Copyright 2002-2015, University of Colorado Boulder

/**
 * Retrieves the license entry for a media file from license.json.
 * This file is used when loading media files (images, audio,...) via media plugins.
 *
 * A license entry for a media file is found in a license.json file that is in
 * the same directory as the media file. A license entry has the following fields:
 *
 * text - copyright statement or "Public Domain"
 * projectURL - the URL for the resource
 * license - the name of license, such as "Public Domain"
 * notes - additional helpful information about the resource, or ""
 * exception - [optional] description of why the file is being used despite the fact that it doesn't match PhET's licensing policy
 *
 * For an example, see any of the license.json files in a PhET simulation's images directory.
 *
 * @author Sam Reid
 */
(function() {
  'use strict';

  /**
   * Returns a string indicating a problem with licensing for a media file, or null if there is no problem found.
   * The license.json file is consulted.  This function has no side effects (compare to getLicenseEntry above)
   *
   * @param {string} absolutePath - the path for the media file
   * @returns {Object|null} the entry from the license.json file
   *                     or null if the license.json file is missing
   *                     or null if the license.json file exists but has no entry for the given file
   *
   * @private
   */
  function getLicenseEntry( absolutePath ) {

    var lastSlashIndex = absolutePath.lastIndexOf( '/' );
    var prefix = absolutePath.substring( 0, lastSlashIndex );
    var licenseFilename = prefix + '/license.json'; // license.json is a sibling of the media file
    var mediaFilename = absolutePath.substring( lastSlashIndex + 1 ); // field name in license.json

    // read license.json
    var file = null;
    try {
      file = global.fs.readFileSync( licenseFilename, 'utf8' );
    }
    catch( err ) {
      return null;  // File not found
    }
    var json = JSON.parse( file );

    // get the media file's license entry
    var entry = json[ mediaFilename ];
    if ( !entry ) {
      return null; // Not annotated in file
    }
    return entry;
  }

  // browser require.js-compatible definition
  if ( typeof define !== 'undefined' ) {
    define( function() {
      return getLicenseEntry;
    } );
  }

  // Node.js-compatible definition
  if ( typeof module !== 'undefined' ) {
    module.exports = getLicenseEntry;
  }
})();