Sidebar.Menu = function ( editor ) {
    var meshCount = 0;
    var mesh_x;
    var mesh_y;
    var mesh_z;
    var mesh_width;
    var mesh_height;
    var signals = editor.signals;

    var container = new UI.CollapsiblePanel();
    container.setCollapsed( true );

    container.addStatic( new UI.Text( '线编辑' ) );
    container.add( new UI.Break() );

    var buttons = new UI.Panel();

    var params = new UI.Panel();


    container.add( buttons );
    container.add( params );

    var select_focus = new UI.Button('选点').onClick(onSelectFocus);
    buttons.add(select_focus);
    var add_helper_plane = new UI.Button( '添加辅助面' ).onClick( onHelperPlaneClick );
    buttons.add( add_helper_plane );
    var add_line = new UI.Button( '画线圈' ).onClick( onDrawLineClick );
    buttons.add( add_line );
    var measure = new UI.Button( '测量' ).onClick( onMeasureClick );
   buttons.add( measure );
    var add_particle = new UI.Button('添加粒子').onClick(onParticleClick);
    buttons.add(add_particle);

    //var helper_plane_view = new UI.Button('正视辅助面').onClick(onViewHelperPlaneClick);
    //buttons.add(helper_plane_view);

    var helper_plane_reverseView = new UI.Button('反向查看').onClick(onReverseViewHelperPlaneClick);
    buttons.add(helper_plane_reverseView);
    var helper_plane_return = new UI.Button('返回模式').onClick(onReturnHelperPlaneClick);
    buttons.add(helper_plane_return);
//////////////////////////////////////////////////////////////////////////////0401增加按钮
     /*var helper_plane_up = new UI.Button('↑移动').onClick( function(){
        signals.helperPlaneUpDown.dispatch("up");
    });
    buttons.add(helper_plane_up);
    var helper_plane_down = new UI.Button('↓移动').onClick( function(){
        signals.helperPlaneUpDown.dispatch("down");
    });
    buttons.add(helper_plane_down);

    var helper_plane_add = new UI.Button('+宽度').onClick( function(){
        signals.helperPlaneWidthChange.dispatch("add");
    });
    buttons.add(helper_plane_add);
    var helper_plane_reduce = new UI.Button('-宽度').onClick( function(){
        signals.helperPlaneWidthChange.dispatch("reduce");
    });
    buttons.add(helper_plane_reduce);*/
    var helper_plane_up = new UI.Button('↑移动').onClick(onHelperPlaneUp);
    buttons.add(helper_plane_up);
    var helper_plane_down = new UI.Button('↓移动').onClick(onHelperPlaneDown);
    buttons.add(helper_plane_down);
    var helper_plane_add = new UI.Button('+宽度').onClick(onHelperPlaneWidthAdd);
    buttons.add(helper_plane_add);
    var helper_plane_reduce = new UI.Button('-宽度').onClick(onHelperPlaneWidthReduce);
    buttons.add(helper_plane_reduce);
  //////////////////////////////////////////////////////////////////////////0401增加按钮


    function onParticleClick(){
        signals.operModeChanged.dispatch('particle');
    }

    function onSelectFocus() {
        var geometry = new THREE.PlaneGeometry(2000, 2000, 10, 10);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00,  opacity: 0, transparent: true,side: THREE.DoubleSide  });
        var mesh = new THREE.Mesh( geometry, material );
        mesh.rotation.x = Math.PI / 2;
        //mesh.name = 'p' + (++ meshCount);
        mesh.obj_type = 'horizontal_plane';
        editor.addObject( mesh );
        signals.operModeChanged.dispatch('plane');
    }

    function onHelperPlaneClick(){

        signals.helperPlaneCreate.dispatch(50);    //50为辅助面height


    }

    function onDrawLineClick () {
        editor.select( null );
        signals.operModeChanged.dispatch( 'draw_line' );
    }

    function onMeasureClick() {
        editor.select(null);
        signals.operModeChanged.dispatch( 'measure' );

    }

    function onViewHelperPlaneClick() {
        var target = [mesh_x, mesh_y, mesh_z];
        //var mesh_size = [mesh_width, mesh_height];
        signals.helpPlaneChanged.dispatch(target, mesh_width, mesh_height, 'forward');

        //editor.selectByUuid(geometry_id);
        //console.log(editor.selectByUuid(geometry_id));
    }
    function onReturnHelperPlaneClick(){
        signals.helperPlaneReturn.dispatch('rotate');
    }

    function onReverseViewHelperPlaneClick() {
        //var target = [mesh_x, mesh_y, mesh_z];
        //var mesh_size = [mesh_width, mesh_height];
        signals.helperPlaneReverse.dispatch(50);            //50为辅助面height

    }

    ///////////////////////////////////////////////0401
    function onHelperPlaneUp(){
        var obj = editor.selected;
        obj.position.y = obj.position.y + 50;
        signals.helperPlaneUpDown.dispatch('up');
    }

    function onHelperPlaneDown(){
        var obj = editor.selected;
        obj.position.y = obj.position.y - 50;
        signals.helperPlaneUpDown.dispatch('down');
    }
    function onHelperPlaneWidthAdd(){
        var obj = editor.selected;
        var geometry = new THREE.PlaneGeometry(obj.geometry.parameters.width + 50, obj.geometry.parameters.height, obj.geometry.parameters.heightSegments, obj.geometry.parameters.widthSegments);
        var material = obj.material;
        var mesh = new THREE.Mesh( geometry, material );
        mesh.rotation.x = obj.rotation.x;
        mesh.rotation.y = obj.rotation.y;
        mesh.rotation.z = obj.rotation.z;
        mesh.position = obj.position;
        mesh.name = obj.name;
        editor.removeObject(obj);
        mesh.obj_type = 'helper_plane';
        editor.addObject( mesh );
        editor.selected = mesh;
    }
    function onHelperPlaneWidthReduce(){
        var obj = editor.selected;
        var geometry = new THREE.PlaneGeometry(obj.geometry.parameters.width - 50, obj.geometry.parameters.height, obj.geometry.parameters.heightSegments, obj.geometry.parameters.widthSegments);
        var material = obj.material;
        var mesh = new THREE.Mesh( geometry, material );
        mesh.rotation.x = obj.rotation.x;
        mesh.rotation.y = obj.rotation.y;
        mesh.rotation.z = obj.rotation.z;
        mesh.position = obj.position;
        mesh.name = obj.name;
        editor.removeObject(obj);
        mesh.obj_type = 'helper_plane';
        editor.addObject( mesh );
        editor.selected = mesh;
    }
    ///////////////////////////////////////////////0401
    return container;

}
