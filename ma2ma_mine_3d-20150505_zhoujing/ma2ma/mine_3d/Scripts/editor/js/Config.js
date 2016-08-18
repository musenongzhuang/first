var Config = function () {

	var name = 'threejs-editor';

	var storage = {
	    theme: '../Styles/editor/light.css',
		camera: {
			position: [ 1000, 0, 0 ],
            target: [ 0, 0, 0 ]
        },
        ///////////////////////////视角
        camera_initial: {
            position: [ 1000, 500, 1000 ],
            target: [ 0, 0, 0 ]
        }
       //////////////////////////////////////////
	};

//	if ( window.localStorage[ name ] !== undefined ) {
//
//		var data = JSON.parse( window.localStorage[ name ] );
//
//		for ( var key in data ) {
//
//			storage[ key ] = data[ key ];
//
//		}
//
//	}

	return {

		getKey: function ( key ) {

			return storage[ key ];

		},

		setKey: function ( key, value ) {

			storage[ key ] = value;

			//window.localStorage[ name ] = JSON.stringify( storage );

			//console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved config to LocalStorage.' );

		},

		clear: function () {

			//delete window.localStorage[ name ];

		}

	}

};