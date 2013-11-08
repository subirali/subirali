// Copyright 2002-2013, University of Colorado Boulder

/**
 * This class defines a Scenery node that represents a model element in the
 * view, and the particular model element itself contains an image that is used
 * as the primary representation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var MassDragHandler = require( 'BALANCING_ACT/common/view/MassDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  // Strings & Images
  var defaultImage = require( 'image!BALANCING_ACT/default-image.png' );
  var unknownMassString = require( 'string!BALANCING_ACT/unknownMassLabel' );
  var pattern0Value1UnitsString = require( 'string!BALANCING_ACT/pattern0Value1Units' );
  var kgString = require( 'string!BALANCING_ACT/kg' );

  /**
   * @param mvt
   * @param imageMass
   * @param massLabelVisibleProperty
   * @constructor
   */
  function ImageMassNode( mvt, imageMass, massLabelVisibleProperty ) {
    Node.call( this, { cursor: 'pointer', pickable: true } );
    var thisNode = this;

    // Add the mass indicator label.  Note that it is positioned elsewhere.
    var massLabel = new Text( { font: new PhetFont( 14 ) } );
    if ( imageMass.isMystery ) {
      massLabel.text = unknownMassString;
    }
    else {
      var valueText = Number( imageMass.mass ).toFixed( 2 );
      massLabel.text = StringUtils.format( pattern0Value1UnitsString, valueText, kgString );
    }
    thisNode.addChild( massLabel );

    // Observe changes to mass indicator visibility.
    massLabelVisibleProperty.link( function( visible ) {
      massLabel.visible = visible;
    } );

    var imageNode = new Image( defaultImage );
    // Observe image changes.
    imageMass.imageProperty.link( function( image ) {
      imageNode.setScaleMagnitude( 1 );
      imageNode.setImage( image );
      var scalingFactor = Math.abs( mvt.modelToViewDeltaY( imageMass.height ) ) / imageNode.height;
      // Debug printouts for indicating whether the image for this
      // node starts at a reasonable size.
      if ( scalingFactor > 2 || scalingFactor < 0.5 ) {
        console.log( 'Warning: Scaling factor is too large or small, drawing size should be adjusted.  Scaling factor = ' + scalingFactor );
        console.log( '   Image type = ' + typeof( image ) );
      }
      if ( scalingFactor > 1 ) {
        console.log( 'Scaling image up, factor = ' + scalingFactor );
        console.log( '   Image type = ' + typeof( image ) );
      }
      imageNode.scale( scalingFactor );
      updatePositionAndAngle();
    } );

    // Function for updating position and angle, used in multiple places below.
    function updatePositionAndAngle() {
      thisNode.rotation = 0;

      // Position the label to be centered above the center of mass, as
      // opposed to the center of the image node.
      massLabel.centerX = imageNode.width / 2 + mvt.modelToViewDeltaX( imageMass.centerOfMassXOffset );

      // Set overall position.  Recall that positions in the model are defined
      // as the center bottom of the item.
      thisNode.centerX = mvt.modelToViewX( imageMass.position.x - imageMass.centerOfMassXOffset );
      thisNode.bottom = mvt.modelToViewY( imageMass.position.y );

      // Set the rotation.  Rotation point is also center bottom.
      thisNode.rotateAround( new Vector2( thisNode.centerX + mvt.modelToViewDeltaX( imageMass.centerOfMassXOffset ) ), imageMass.rotationalAngle );
    }

    // Add the image node.
    thisNode.addChild( imageNode );

    // Observe height changes.
    imageMass.heightProperty.link( function( newHeight ) {
      imageNode.setScaleMagnitude( 1 );
      var scalingFactor = Math.abs( mvt.modelToViewDeltaY( newHeight ) ) / imageNode.height;
      imageNode.scale( scalingFactor );
      updatePositionAndAngle();
    } );

    // Observe position changes.
    imageMass.positionProperty.link( function() {
      updatePositionAndAngle();
    } );

    // Observe rotational angle changes.
    imageMass.rotationalAngleProperty.link( function() {
      updatePositionAndAngle();
    } );

    // Add the mouse event handler.
    thisNode.addInputListener( new MassDragHandler( imageMass, mvt ) );
  }

  return inherit( Node, ImageMassNode );
} );