Sidebar.Operation = function ( editor ) {

    var signals = editor.signals;

    var container = new UI.CollapsiblePanel();
    container.setDisplay( 'none' );

    container.addStatic( new UI.Text( '操作' ) );
    container.add( new UI.Break() );

    var buttons = new UI.Panel();

    var params = new UI.Panel();


    container.add( buttons );
    container.add( params );


    signals.objectSelected.add( function ( object ) {

        updateUI();

    } );
    function updateUI() {

        container.setDisplay( 'none' );
        buttons.clear();
        params.clear();
        var object = editor.selected;
        var p_object = editor.p_selected;
        if ( object !== null ) {

            container.setDisplay( 'block' );

            if (editor.getObjectType( object ) === 'scene'){
                var delete_object = new UI.Button( '删除全部辅助面' ).onClick( function () {
                    var shallowCopy = $.extend({}, object.children);
                    $.each(shallowCopy,function(i,v){
                        if(v.obj_type === 'helper_plane'){
                            editor.removeObject( v );
                        }
                    });
                } );
                buttons.add( delete_object );
            }else{
                var delete_object = new UI.Button( '删除' ).onClick( function () {
                    var post_data= {};
                    post_data.type=editor.getObjectType( object );
                    post_data.name=object.name;
                    post_data.id=object.obj_id || 0;
                    $.ajax({
                        type: "POST", //访问WebService使用Post方式请求
                        contentType: "application/json", //WebService 会返回Json类型
                        url: "../getdata/deleteobject.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                        data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                        dataType: 'json',
                        success: function (res){
                            if (res.result){
                                editor.removeObject( object );
                                editor.select( null );
                            }else{
                                alert(res.message);
                            }

                        }
                    });

                } );
                buttons.add( delete_object );
            }

            if (editor.getObjectType( object ) === 'line' ){
                if(p_object != null && editor.getObjectType( p_object ) === 'line' && p_object != object){
                    var create_object = new UI.Button( '最小距离法' ).onClick( function () {
                        var post_data= {};
                        post_data.alg = 1;
                        post_data.line1=p_object.geometry.vertices;
                        post_data.line2=object.geometry.vertices;
                        $.ajax({
                            type: "POST", //访问WebService使用Post方式请求
                            contentType: "application/json", //WebService 会返回Json类型
                            url: "../getdata/connectline.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                            data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                            dataType: 'json',
                            success: function (object){
                                var loader = new THREE.JSONLoader();
                                var geom = loader.parse(object);
                                var loadedMesh = editor.createMesh(geom.geometry);
                                loadedMesh.name = object.metadata.object_name;
                                loadedMesh.obj_type = 'object';
                                loadedMesh.obj_id = object.metadata.object_id;
                                editor.addObject(loadedMesh);
                            }
                        });
                    } );
                    buttons.add( create_object );

                    var create_object1 = new UI.Button( '最小周长法' ).onClick( function () {
                        var post_data= {};
                        post_data.alg = 2;
                        post_data.line1=p_object.geometry.vertices;
                        post_data.line2=object.geometry.vertices;
                        $.ajax({
                            type: "POST", //访问WebService使用Post方式请求
                            contentType: "application/json", //WebService 会返回Json类型
                            url: "../getdata/connectline.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                            data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                            dataType: 'json',
                            success: function (object){
                                var loader = new THREE.JSONLoader();
                                var geom = loader.parse(object);
                                var loadedMesh = editor.createMesh(geom.geometry);
                                loadedMesh.name = object.metadata.object_name;
                                loadedMesh.obj_type = 'object';
                                loadedMesh.obj_id = object.metadata.object_id;
                                editor.addObject(loadedMesh);
                            }
                        });
                    } );
                    buttons.add( create_object1 );

                }

                var end_point = new UI.Button( '尖灭到点' ).onClick( function () {
                    var post_data= {};
                    post_data.type='point';
                    post_data.line=object.geometry.vertices;
                    post_data.distance=end_size.getValue();
                    post_data.create_pl=create_pl.getValue();
                    $.ajax({
                        type: "POST", //访问WebService使用Post方式请求
                        contentType: "application/json", //WebService 会返回Json类型
                        url: "../getdata/endtopoint.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                        data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                        dataType: 'json',
                        success: function (object){
                            var loader = new THREE.JSONLoader();
                            var geom = loader.parse(object);
                            var loadedMesh = editor.createMesh(geom.geometry);
                            loadedMesh.name = object.metadata.object_name;
                            loadedMesh.obj_type = 'object';
                            loadedMesh.obj_id = object.metadata.object_id;
                            editor.addObject(loadedMesh);

                        }
                    });
                } );
                buttons.add( end_point );
                var end_line = new UI.Button( '尖灭到线' ).onClick( function () {
                    var post_data= {};
                    post_data.type='line';
                    post_data.line=object.geometry.vertices;
                    post_data.distance=end_size.getValue();
                    post_data.create_pl=create_pl.getValue();
                    post_data.line_short=short.getValue();
                    post_data.line_scale_v=scale_v.getValue();
                    post_data.line_point_num=point_num.getValue();
                    $.ajax({
                        type: "POST", //访问WebService使用Post方式请求
                        contentType: "application/json", //WebService 会返回Json类型
                        url: "../getdata/endtoline.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
                        data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
                        dataType: 'json',
                        success: function (object){
                            var loader = new THREE.JSONLoader();
                            var geom = loader.parse(object);
                            var loadedMesh = editor.createMesh(geom.geometry);
                            loadedMesh.name = object.metadata.object_name;
                            loadedMesh.obj_type = 'object';
                            loadedMesh.obj_id = object.metadata.object_id;
                            editor.addObject(loadedMesh);

                        }
                    });
                } );
                buttons.add( end_line );
                //添加参数面板
                var end_size_panel = new UI.Panel();
                var end_size = new UI.Number().setWidth( '150px' );
                end_size_panel.add( new UI.Text( '尖灭距离：' ).setWidth( '90px' ) );
                end_size_panel.add( end_size );
                params.add( end_size_panel );

                var create_pl_panel = new UI.Panel();
                var create_pl =  new UI.Checkbox();
                create_pl_panel.add( new UI.Text( '生成点或线：' ).setWidth( '90px' ) );
                create_pl_panel.add( create_pl );
                params.add( create_pl_panel );

                var scale_panel = new UI.Panel();
                var scale_v = new UI.Number().setWidth( '150px' );
                scale_panel.add( new UI.Text( '缩放比例：' ).setWidth( '90px' ) );
                scale_panel.add( scale_v );
                params.add( scale_panel );

                var short_panel = new UI.Panel();
                var short =  new UI.Checkbox();
                short_panel.add( new UI.Text( '短轴灭线：' ).setWidth( '90px' ) );
                short_panel.add( short );
                params.add( short_panel );

                var point_num_panel = new UI.Panel();
                var point_num = new UI.Number().setWidth( '150px' );
                point_num_panel.add( new UI.Text( '点个数：' ).setWidth( '90px' ) );
                point_num_panel.add( point_num );
                params.add( point_num_panel );



            }else if(editor.getObjectType( object ) === 'well'){

            }
            else{

            }




//            objectVisible.setValue( object.visible );
//
//            try {
//
//                objectUserData.setValue( JSON.stringify( object.userData, null, '  ' ) );
//
//            } catch ( error ) {
//
//                console.log( error );
//
//            }
//
//            objectUserData.setBorderColor( '#ccc' );
//            objectUserData.setBackgroundColor( '' );

            //updateRows();
            //updateTransformRows();

        }

    }

    return container;

}
