Menubar.Add = function ( editor ) {

	var meshCount = 0;
    var signals = editor.signals;
	// event handlers


	function onHelperPlaneClick () {

		var width = 2000;
		var height = 200;

		var widthSegments = 10;
		var heightSegments = 10;

		var geometry = new THREE.PlaneGeometry( width, height, widthSegments, heightSegments );
		var material = new THREE.MeshBasicMaterial({ color: 0x00ff00,  opacity: 0.1, transparent: true,side: THREE.DoubleSide  });
		var mesh = new THREE.Mesh( geometry, material );
        mesh.position.y=-100;
        //mesh.doubleSided = true;
		mesh.name = 'p' + ( ++ meshCount );
        mesh.obj_type = 'helper_plane';
		editor.addObject( mesh );
		//editor.select( mesh );

	}

	function onDrawLineClick () {

//		var width = 100;
//		var height = 100;
//		var depth = 100;
//
//		var widthSegments = 1;
//		var heightSegments = 1;
//		var depthSegments = 1;
//
//		var geometry = new THREE.BoxGeometry( width, height, depth, widthSegments, heightSegments, depthSegments );
//		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
//		mesh.name = 'Box ' + ( ++ meshCount );
//
//		editor.addObject( mesh );
//		editor.select( mesh );
        editor.select( null );
        signals.operModeChanged.dispatch( 'draw_line' );

	}

	// configure menu contents

	var createOption = UI.MenubarHelper.createOption;
	var createDivider = UI.MenubarHelper.createDivider;

	var menuConfig = [
		createOption( '添加辅助面', onHelperPlaneClick ),
		createOption( '画线圈', onDrawLineClick ),
		createDivider()
	];

	var optionsPanel = UI.MenubarHelper.createOptionsPanel( menuConfig );

	return UI.MenubarHelper.createMenuContainer( '线编辑', optionsPanel );

}
