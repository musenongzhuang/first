Menubar.Test = function ( editor ) {

    //var signals = editor.signals;
    // event handlers

    function onAddWellClick () {
//        $.ajax({
//            type: "POST", //访问WebService使用Post方式请求
//            contentType: "application/json", //WebService 会返回Json类型
//            url: "../getdata/GetWell.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
//            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
//            //dataType: 'json',
//            success: function (wells) { //回调函数
//                $.each(wells,function(i,well){
//                    var point = new THREE.Vector3();
////            var direction = new THREE.Vector3();
//                    var geometry = new THREE.Geometry();
//                    $.each(well.ps,function(i,v){
////                direction.x = v[0];
////                direction.y = v[1];
////                direction.z = v[2];
////                point.add( direction );
//                        point.x = v[0];
//                        point.y = v[1];
//                        point.z = v[2];
//                        geometry.vertices.push( point.clone() );
//                    });
//                    //var real = well.real ? THREE.LineStrip : THREE.LinePieces;
//                    var real = well.real ? 2 : 1;
//                    var typecolor= parseInt(well.typec);
//                    //var type = THREE.LineStrip;
//                    //var object = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff,linewidth: 2 } ), type );
//                    var object = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: typecolor,linewidth: real } ), THREE.LineStrip );
//                    object.name = well.no;
//                    object.obj_type = 'well';
//                    object.obj_id = well.wid;
//                    object.real = real;
//                    //parentTransform.add( object );
//                    editor.addObject(object);
//
//                    //显示label
//                    var spritey = editor.makeTextSprite(" " + well.no + " ", { fontsize: 32, backgroundColor: {r:255, g:100, b:100, a:1} } );
//                    spritey.name = well.no;
//                    spritey.obj_type = 'well_label';
//                    spritey.position = object.geometry.vertices[0].clone().multiplyScalar(1.1);
//                    //spritey.position.set( well.ps[0][0],well.ps[0][1]+2,well.ps[0][2]);
//                    editor.sceneHelpers.add(spritey);
//                    //显示井口
//                    var sprite = new THREE.Sprite( new THREE.SpriteMaterial( {
//                        map: new THREE.Texture( editor.generateWellStart() ),
//                        blending: THREE.AdditiveBlending
//                    } ) );
//                    sprite.position = object.geometry.vertices[0].clone();
//                    sprite.name = well.no;
//                    sprite.obj_type = 'well_start';
//                    editor.sceneHelpers.add(sprite);
//
//                });
//            }
//        });
        editor.loadWell();

    }

    // configure menu contents
    function onAddWellDetailClick () {
//        $.ajax({
//            type: "POST", //访问WebService使用Post方式请求
//            contentType: "application/json", //WebService 会返回Json类型
//            url: "../getdata/GetDetailWell.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
//            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
//            //dataType: 'json',
//            success: function (wells) { //回调函数
//                $.each(wells,function(i,well){
//                    var next_point = new THREE.Vector3();
//                    var point = new THREE.Vector3();
////            var direction = new THREE.Vector3();
//                    var geometry = new THREE.Geometry();
//                    var next_color,next_value;
//                    $.each(well.ps,function(i,v){
//                        point.x = v[0];
//                        point.y = v[1];
//                        point.z = v[2];
//                        var color_value= parseInt(v[3]) * Math.random();
//                        if (i == 0 ){
//                            geometry.vertices.push(point.clone());
//                            geometry.colors.push(new THREE.Color( color_value ));
//                        }else{
//                            geometry.vertices.push( next_point.clone(),point.clone());
//                            geometry.colors.push(new THREE.Color( next_color ),new THREE.Color( color_value ));
//                            //显示吸附点
//                            var p = new THREE.Sprite( new THREE.SpriteMaterial( {
//                                map: new THREE.Texture( editor.generateSprite(0x11ff00) ),
//                                blending: THREE.AdditiveBlending
//                            } ) );
//                            p.position = point.clone();
//                            p.scale.set(0.2,0.2,1);
//                            p.name = well.no;
//                            p.obj_type = 'well_value_point';
//                            editor.sceneHelpers.add(p);
//                            //显示品味值
//                            var r=next_color>>16;
//                            var g=(next_color & 0x00ffff) >> 8;
//                            var b=(next_color & 0x0000ff);
//                            var value_label = editor.makeTextSprite(next_value, { fontsize: 30, backgroundColor: {r:r, g:g, b:b, a:0.5} } );
//                            value_label.name = well.no;
//                            value_label.obj_type = 'well_value_label';
//                            value_label.scale.set(2,1,1.0);
//                            value_label.position = next_point.clone();
//                            value_label.visible = false;
//                            editor.sceneHelpers.add(value_label);
//
//                        }
//
//                        //保存上一个节点信息
//                        next_point=point;
//                        next_color = color_value;
//                        next_value = v[4];
//                    });
//                    //var type = Math.random() > 0.1 ? THREE.LineStrip : THREE.LinePieces;
//                    var type = THREE.LinePieces;
//                    var real = well.real ? 2 : 1;
//                    //var object = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff,linewidth: 2 } ), type );
//                    var object = new THREE.Line( geometry, new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors,linewidth: real } ), type );
//                    object.name = well.no;
//                    object.obj_type = 'well';
//                    object.obj_id = well.wid;
//                    object.real = real;
//                    //parentTransform.add( object );
//                    editor.addObject(object);
//
//                    //显示label
//                    var spritey = editor.makeTextSprite(" " + well.no + " ", { fontsize: 32, backgroundColor: {r:255, g:100, b:100, a:1} } );
//                    spritey.name = well.no;
//                    spritey.obj_type = 'well_label';
//                    spritey.position = object.geometry.vertices[0].clone().multiplyScalar(1.1);
//                    //spritey.position.set( well.ps[0][0],well.ps[0][1]+2,well.ps[0][2]);
//                    editor.sceneHelpers.add(spritey);
//                    //显示井口
//                    var sprite = new THREE.Sprite( new THREE.SpriteMaterial( {
//                        map: new THREE.Texture( editor.generateWellStart() ),
//                        blending: THREE.AdditiveBlending
//                    } ) );
//                    sprite.scale.set(2,2,1.0);
//                    sprite.position = object.geometry.vertices[0].clone();
//                    sprite.name = well.no;
//                    sprite.obj_type = 'well_start';
//                    editor.sceneHelpers.add(sprite);
//
//                });
//            }
//        });
        editor.loadDetailWell();
    }

    function onAddLineClick () {
        editor.loadLine();

    }

    function onAddObjectClick () {
        editor.loadObject();
    }
    function onAddblockClick () {
//        var p = new THREE.Sprite( new THREE.SpriteMaterial( {
//            map: new THREE.Texture( editor.generateSprite(0xcccccc) ),
//            blending: THREE.AdditiveBlending
//        } ) );
//        p.position.x= editor.world;
//        p.position.z= editor.world;
//        p.position.y= -20;
//        p.scale.set(10,10,1);
//        p.name = 'block';
//        p.obj_type = 'block';
        var SEPARATION = editor.world/ 2;
        var DEEP = 200;
        var AMOUNTX = 20;
        var AMOUNTY = 20;
        var AMOUNTZ = 20;
        material=new THREE.SpriteMaterial( {
            map: new THREE.Texture( editor.generateSprite(0xcccccc) ),
            blending: THREE.AdditiveBlending
        } );
        for ( var iz = 0; iz < DEEP / AMOUNTZ ; iz++ ) {

            for (var ix = 0; ix < SEPARATION * 2 / AMOUNTX; ix++) {

                for (var iy = 0; iy < SEPARATION * 2 / AMOUNTY; iy++) {

                    particle = new THREE.Sprite(material);
//                particle.scale.set(5,5,1);
                    particle.position.x = ix * AMOUNTX - SEPARATION + AMOUNTX / 2;
                    particle.position.z = iy * AMOUNTY - SEPARATION + AMOUNTY / 2;
                    particle.position.y = -(iz * AMOUNTZ) -  AMOUNTZ / 2;
                    editor.sceneHelpers.add(particle);

                }

            }
        }

    }

    var createOption = UI.MenubarHelper.createOption;
    var createDivider = UI.MenubarHelper.createDivider;

    var menuConfig = [
        createOption( '加载矿井', onAddWellClick ),
        createOption( '加载矿井细节', onAddWellDetailClick ),
        createDivider(),
        createOption( '加载线圈', onAddLineClick ),
        createOption( '加载矿体', onAddObjectClick ),
        createOption( '加载块', onAddblockClick )

    ];

    var optionsPanel = UI.MenubarHelper.createOptionsPanel( menuConfig );

    return UI.MenubarHelper.createMenuContainer( '测试', optionsPanel );

};
