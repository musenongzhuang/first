var Toolbar = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();

	var buttons = new UI.Panel();
	container.add( buttons );

    // grid
    var size = new UI.Integer( 1000 ).onChange( updategrid );
    size.dom.style.width = '42px';
    buttons.add( new UI.Text( '区域大小: ' ) );
    buttons.add( size );
    var grid = new UI.Integer( 20 ).onChange( updategrid );
    grid.dom.style.width = '42px';
    buttons.add( new UI.Text( '网格大小: ' ) );
    buttons.add( grid );
    var viewgrid = new UI.Checkbox( true ).onChange( updategrid );
    buttons.add( viewgrid );
    buttons.add( new UI.Text( '显示网格' ) );

    buttons.add( new UI.Text( '|||' ) );

	// translate / rotate / scale

	/*var translate = new UI.Button( '移动' ).onClick( function () {

		signals.transformModeChanged.dispatch( 'translate' );

	});
	buttons.add( translate );

	var rotate = new UI.Button( '旋转' ).onClick( function () {

		signals.transformModeChanged.dispatch( 'rotate' );

	} );
	buttons.add( rotate );

	var scale = new UI.Button( '缩放' ).onClick( function () {

		//signals.transformModeChanged.dispatch( 'scale' );
        signals.transformPerspective.dispatch();

	} );
	buttons.add( scale );




	var snap = new UI.Checkbox( false ).onChange( update );
	buttons.add( snap );
	buttons.add( new UI.Text( '吸附' ) );

	var local = new UI.Checkbox( false ).onChange( update );
	buttons.add( local );
	buttons.add( new UI.Text( '区域' ) );*/

    var view = new UI.Checkbox( false ).onChange( updateview );
    //view.dom.style.width = '30px';
    buttons.add( view );
    buttons.add( new UI.Text( '黑色主题' ) );

    //buttons.add(new UI.Break());


    var visual_above = new UI.Button( '↓').onClick( function(){
        signals.viewChanged.dispatch("camera_above");
    });
    //buttons.add(new UI.Text('视角：'))
    buttons.add(visual_above);

    var visual_left = new UI.Button( '→').onClick( function(){
        signals.viewChanged.dispatch("camera_left");
    });
    buttons.add(visual_left);

    var visual_below = new UI.Button('↑').onClick( function(){
        signals.viewChanged.dispatch("camera_below");
    });
    buttons.add(visual_below);

    var visual_right = new UI.Button( '←').onClick( function(){
        signals.viewChanged.dispatch("camera_right");
    });
    buttons.add(visual_right);

    var visual_front = new UI.Button('×').onClick( function(){
        signals.viewChanged.dispatch("camera_front");
    });
    buttons.add(visual_front);

    var visual_back = new UI.Button( '•').onClick( function(){
        signals.viewChanged.dispatch("camera_back");
    });
    buttons.add(visual_back);

    var visual_initial = new UI.Button('原始视角').onClick( function() {
        signals.viewChanged.dispatch("camera_initial");
    });
    buttons.add(visual_initial);

    ///////////////////////////////////////////////////////////////////////0501转换相机
    var orthographic_camera = new UI.Button('正交投影相机').onClick( function(){
        signals.changeCamera.dispatch("orthographic_camera");
    });
    buttons.add(orthographic_camera);

    var perspective_camera = new UI.Button('透视投影相机').onClick( function(){
        signals.changeCamera.dispatch("perspective_camera");
    })
    buttons.add(perspective_camera);
    //////////////////////////////////////////////////////////////////////////////////////////


   // buttons.add(new UI.Break());


    /*var level_all = new UI.Checkbox( true ).onChange( updatelevel );
     buttons.add( level_all );
     buttons.add( new UI.Text( '全部图层' ) );

    var level_mine = new UI.Checkbox(false).onChange(updatelevel);
    buttons.add( level_mine );
    buttons.add( new UI.Text( '矿井图层' ) );

    var level_line = new UI.Checkbox(false).onChange(updatelevel);
    buttons.add( level_line );
    buttons.add( new UI.Text( '矿体线圈' ) );

    var level_entity = new UI.Checkbox(false).onChange(updatelevel);
    buttons.add( level_entity );
    buttons.add( new UI.Text( '矿体实体' ) );*/



    function updategrid() {
        editor.world=size.getValue();
        signals.gridChanged.dispatch( {all: size.getValue(),cell: grid.getValue(),view: viewgrid.getValue() } );
    }
	/*function update() {
		signals.snapChanged.dispatch( snap.getValue() === true ? grid.getValue() : null );
		signals.spaceChanged.dispatch( local.getValue() === true ? "local" : "world" );

	}*/
    function updateview() {
        if(view.getValue() === true){
            editor.setTheme( '../Styles/editor/dark.css' );
            editor.config.setKey( 'theme', '../Styles/editor/dark.css' );
        }
        else
        {
            editor.setTheme('../Styles/editor/light.css');
            editor.config.setKey('theme', '../Styles/editor/light.css');
        }

    }

    /*function updatelevel() {

        var levelType = "0";
        var levels = [];
        editor.select( null );
        if(level_all.getValue() === true){
            levels.push(0);
        }
        if(level_mine.getValue() === true){
            levels.push(1);
        }
        if(level_line.getValue() === true){
            levels.push(2);
        }
        if(level_entity.getValue() === true){
            levels.push(3);
        }


        levelType = levels.join("_");
        signals.levelChanged.dispatch(levelType);
        editor.config.setKey( 'level', levelType);
    }*/



	//update();

	return container;

}
