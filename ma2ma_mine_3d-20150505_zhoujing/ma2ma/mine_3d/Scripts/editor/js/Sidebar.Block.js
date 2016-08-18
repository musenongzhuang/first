Sidebar.Block = function ( editor ) {
    var signals = editor.signals;

    var container = new UI.CollapsiblePanel();
    container.setCollapsed( true );

    container.addStatic( new UI.Text( '储量估算' ) );
    container.add( new UI.Break() );

    var buttons = new UI.Panel();

    var params = new UI.Panel();


    container.add( buttons );
    container.add( params );

    var add_block = new UI.Button( '生成块模型' ).onClick( onAddblockClick );
    buttons.add( add_block );
    var limit_block = new UI.Button( '块模型约束' ).onClick( onAddLimitClick );
    buttons.add( limit_block );
    var jvlimi = new UI.Button( '距离幂方法' ).onClick( onAddjvlimiClick );
    buttons.add( jvlimi );
    var kelige = new UI.Button( '克里格方法' ).onClick( onAddkeligeClick );
    buttons.add( kelige );

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
    function onAddLimitClick () {
        var points,particle;
        var material=new THREE.SpriteMaterial( {
            map: new THREE.Texture( editor.generateSprite(0xcccccc) ),
            blending: THREE.AdditiveBlending
        } );
        $.ajax({
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/GetObject.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            //dataType: 'json',
            async:false,
            success: function (objects) { //回调函数
                var loader = new THREE.JSONLoader();
                $.each(objects,function(i,object){
                    var geom = loader.parse(object);
                    points = THREE.GeometryUtils.randomPointsInGeometry( geom.geometry, 1000 );
                    for (var i = 0; i < points.length; i++) {

                        particle = new THREE.Sprite(material);
                        particle.scale.set(0.5,0.5,1);
                        particle.position.x = points[ i ].x;
                        particle.position.z = points[ i ].z;
                        particle.position.y = points[ i ].y;
                        editor.sceneHelpers.add(particle);

                    }
                });
            }
        });
    }
    function onAddjvlimiClick () {
        var points,particle;
        $.ajax({
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/GetObject.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            //dataType: 'json',
            async:false,
            success: function (objects) { //回调函数
                var loader = new THREE.JSONLoader();
                $.each(objects,function(i,object){
                    var geom = loader.parse(object);
                    points = THREE.GeometryUtils.randomPointsInGeometry( geom.geometry, 1000 );
                    for (var i = 0; i < points.length; i++) {
//                        var color=parseInt(Math.random() * 0x808008 + 0x808080);
                        particle = new THREE.Sprite(new THREE.SpriteMaterial( {
                            map: new THREE.Texture( editor.generateSprite(0x808008+i*1000) ),
                            blending: THREE.AdditiveBlending
                        } ));
                        particle.scale.set(0.5,0.5,1);
                        particle.position.x = points[ i ].x;
                        particle.position.z = points[ i ].z;
                        particle.position.y = points[ i ].y;
                        editor.sceneHelpers.add(particle);

                    }
                });
            }
        });
    }
    function onAddkeligeClick () {
        var points,particle;
        $.ajax({
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/GetObject.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            //dataType: 'json',
            async:false,
            success: function (objects) { //回调函数
                var loader = new THREE.JSONLoader();
                $.each(objects,function(i,object){
                    var geom = loader.parse(object);
                    points = THREE.GeometryUtils.randomPointsInGeometry( geom.geometry, 1000 );
                    for (var i = 0; i < points.length; i++) {
//                        var color=parseInt(Math.random() * 0x808008 + 0x808080);
                        particle = new THREE.Sprite(new THREE.SpriteMaterial( {
                            map: new THREE.Texture( editor.generateSprite(0x808008+i*10000) ),
                            blending: THREE.AdditiveBlending
                        } ));
                        particle.scale.set(0.5,0.5,1);
                        particle.position.x = points[ i ].x;
                        particle.position.z = points[ i ].z;
                        particle.position.y = points[ i ].y;
                        editor.sceneHelpers.add(particle);

                    }
                });
            }
        });
    }
    return container;

}
