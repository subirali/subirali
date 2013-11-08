// Copyright 2002-2013, University of Colorado Boulder

/**
 * Common drag handler for mass nodes.  Positions the corresponding model
 * element based on the movement of the mouse, and also sets and clears the
 * property that indicates whether or not the mass is being controlled by the
 * user.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Imports
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  function MassDragHandler( mass, mvt ) {
    SimpleDragHandler.call( this, {

      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,

      // Handler that moves the particle in model space.
      translate: function( translationParams ) {
        mass.position = mass.position.plus( mvt.viewToModelDelta( translationParams.delta ) );
        return translationParams.position;
      },

      start: function( event, trail ) {
        mass.userControlled = true;
      },

      end: function( event, trail ) {
        mass.userControlled = false;
      }
    } );
  }

  return inherit( SimpleDragHandler, MassDragHandler );
} );

