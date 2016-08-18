var Editor = function () {

	var SIGNALS = signals;


	this.signals = {

		// actions

		playAnimations: new SIGNALS.Signal(),

		// notifications

		themeChanged: new SIGNALS.Signal(),

		transformModeChanged: new SIGNALS.Signal(),
        operModeChanged: new SIGNALS.Signal(),
		snapChanged: new SIGNALS.Signal(),
        gridChanged: new SIGNALS.Signal(),
		spaceChanged: new SIGNALS.Signal(),
		rendererChanged: new SIGNALS.Signal(),
        levelChanged: new SIGNALS.Signal(),

		sceneGraphChanged: new SIGNALS.Signal(),

		cameraChanged: new SIGNALS.Signal(),
        /////////////////////////////////////视角，辅助面
        viewChanged: new SIGNALS.Signal(),
        helpPlaneChanged: new SIGNALS.Signal(),
        helperPlaneReturn: new SIGNALS.Signal(),
        helperPlaneCreate: new SIGNALS.Signal(),
        helperPlaneReverse: new SIGNALS.Signal(),
        /////////////////////////////////////////////////////
        /////////////////////////////////////////0401修改
        helperPlaneUpDown: new SIGNALS.Signal(),
        helperPlaneWidthChange: new SIGNALS.Signal(),
        /////////////////////////////////////////0401修改

        /////////////////////////////////////////0501转换相机
        changeCamera: new SIGNALS.Signal(),
        ////////////////////////////////////////////

		objectSelected: new SIGNALS.Signal(),
		objectAdded: new SIGNALS.Signal(),
		objectChanged: new SIGNALS.Signal(),
		objectRemoved: new SIGNALS.Signal(),

		helperAdded: new SIGNALS.Signal(),
		helperRemoved: new SIGNALS.Signal(),


		materialChanged: new SIGNALS.Signal(),
		fogTypeChanged: new SIGNALS.Signal(),
		fogColorChanged: new SIGNALS.Signal(),
		fogParametersChanged: new SIGNALS.Signal(),
		windowResize: new SIGNALS.Signal(),

        transformPerspective: new SIGNALS.Signal()

	};
	
	this.config = new Config();
//	this.storage = new Storage();
	this.loader = new Loader( this );

	this.scene = new THREE.Scene();
	this.sceneHelpers = new THREE.Scene();                  //虚拟场景

	this.object = {};
	this.geometries = {};
	this.materials = {};
	this.textures = {};

	this.selected = null;
    this.p_selected = null;
    this.draw_line_count=0;
	this.helpers = {};
    this.addStatus = 0;

    this.world=1000;

};

Editor.prototype = {

	setTheme: function ( value ) {

	    document.getElementById('theme').href = value;

		this.signals.themeChanged.dispatch( value );

	},

	setScene: function ( scene ) {

		this.scene.name = scene.name;
		this.scene.userData = JSON.parse( JSON.stringify( scene.userData ) );

		// avoid render per object

		this.signals.sceneGraphChanged.active = false;

		while ( scene.children.length > 0 ) {

			this.addObject( scene.children[ 0 ] );

		}

		this.signals.sceneGraphChanged.active = true;
		this.signals.sceneGraphChanged.dispatch();

	},

	//

	addObject: function ( object ) {

		var scope = this;

		object.traverse( function ( child ) {

			if ( child.geometry !== undefined ) scope.addGeometry( child.geometry );
			if ( child.material !== undefined ) scope.addMaterial( child.material );
//			scope.addHelper( child );

		} );

		this.scene.add( object );

		this.signals.objectAdded.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	setObjectName: function ( object, name ) {

		object.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	removeObject: function ( object ) {

		if ( object.parent === undefined ) return; // avoid deleting the camera or scene

		//if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;

		var scope = this;

		object.traverse( function ( child ) {

//			scope.removeHelper( child );

		} );

		object.parent.remove( object );
        //删除井的辅助信息
        if (object.obj_type == 'well'){
            var shallowCopy = $.extend({}, editor.sceneHelpers.children);
            $.each(shallowCopy,function(i,v){
                if (v.obj_type === 'well_label' || v.obj_type === 'well_start' || v.obj_type === 'well_value_point' || v.obj_type === 'well_value_label'){
                    if (v.name == object.name) {
                        editor.sceneHelpers.remove(v);
                    }
                }
            });
        }
		this.signals.objectRemoved.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	addGeometry: function ( geometry ) {

		this.geometries[ geometry.uuid ] = geometry;

	},

	setGeometryName: function ( geometry, name ) {

		geometry.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	addMaterial: function ( material ) {

		this.materials[ material.uuid ] = material;

	},

	setMaterialName: function ( material, name ) {

		material.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	addTexture: function ( texture ) {

		this.textures[ texture.uuid ] = texture;

	},

	//

//	addHelper: function () {
//
//		var geometry = new THREE.SphereGeometry( 20, 4, 2 );
//		var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
//
//		return function ( object ) {
//
//			var helper;
//
//			if ( object instanceof THREE.Camera ) {
//
//				helper = new THREE.CameraHelper( object, 10 );
//
//			} else if ( object instanceof THREE.PointLight ) {
//
//				helper = new THREE.PointLightHelper( object, 10 );
//
//			} else if ( object instanceof THREE.DirectionalLight ) {
//
//				helper = new THREE.DirectionalLightHelper( object, 20 );
//
//			} else if ( object instanceof THREE.SpotLight ) {
//
//				helper = new THREE.SpotLightHelper( object, 10 );
//
//			} else if ( object instanceof THREE.HemisphereLight ) {
//
//				helper = new THREE.HemisphereLightHelper( object, 10 );
//
//			} else {
//
//				// no helper for this object type
//				return;
//
//			}
//
//			var picker = new THREE.Mesh( geometry, material );
//			picker.name = 'picker';
//			picker.userData.object = object;
//			picker.visible = false;
//			helper.add( picker );
//
//			this.sceneHelpers.add( helper );
//			this.helpers[ object.id ] = helper;
//
//			this.signals.helperAdded.dispatch( helper );
//
//		};
//
//	}(),

//	removeHelper: function ( object ) {
//
//		if ( this.helpers[ object.id ] !== undefined ) {
//
//			var helper = this.helpers[ object.id ];
//			helper.parent.remove( helper );
//
//			delete this.helpers[ object.id ];
//
//			this.signals.helperRemoved.dispatch( helper );
//
//		}
//
//	},

	//

	parent: function ( object, parent ) {

		if ( parent === undefined ) {

			parent = this.scene;

		}

		parent.add( object );

		this.signals.sceneGraphChanged.dispatch();

	},

	//

	select: function ( object ) {
        this.p_selected = this.selected;
		this.selected = object;

		if ( object !== null ) {

			this.config.setKey( 'selected', object.uuid );

		} else {

			this.config.setKey( 'selected', null );

		}

		this.signals.objectSelected.dispatch( object );

	},

	selectById: function ( id ) {

		var scope = this;

		this.scene.traverse( function ( child ) {

			if ( child.id === id ) {

				scope.select( child );

			}

		} );

	},

	selectByUuid: function ( uuid ) {

		var scope = this;

		this.scene.traverse( function ( child ) {

			if ( child.uuid === uuid ) {

				scope.select( child );

			}

		} );

	},

	deselect: function () {

		this.select( null );

	},

	// utils

	getObjectType: function ( object ) {

		var types = {

			'well': '井',
			'scene': '区域',
			'line': '线圈',
			'helper_plane': '辅助面',
            'object': '矿体'


		};

		for ( var type in types ) {

			if ( object.obj_type === type ) return type;

		}
        return 'default';

	},
    getObjectTypeName: function ( object ) {

        var types = {

            'well': '井',
            'scene': '区域',
            'line': '线圈',
            'helper_plane': '辅助面',
            'object': '矿体'

        };

        for ( var type in types ) {

            if ( object.obj_type === type ) return types[type];

        }
        return '未知';

    },

	getGeometryType: function ( geometry ) {

		var types = {

			'BoxGeometry': THREE.BoxGeometry,
			'CircleGeometry': THREE.CircleGeometry,
			'CylinderGeometry': THREE.CylinderGeometry,
			'ExtrudeGeometry': THREE.ExtrudeGeometry,
			'IcosahedronGeometry': THREE.IcosahedronGeometry,
			'LatheGeometry': THREE.LatheGeometry,
			'OctahedronGeometry': THREE.OctahedronGeometry,
			'ParametricGeometry': THREE.ParametricGeometry,
			'PlaneGeometry': THREE.PlaneGeometry,
			'PolyhedronGeometry': THREE.PolyhedronGeometry,
			'ShapeGeometry': THREE.ShapeGeometry,
			'SphereGeometry': THREE.SphereGeometry,
			'TetrahedronGeometry': THREE.TetrahedronGeometry,
			'TextGeometry': THREE.TextGeometry,
			'TorusGeometry': THREE.TorusGeometry,
			'TorusKnotGeometry': THREE.TorusKnotGeometry,
			'TubeGeometry': THREE.TubeGeometry,
			'Geometry': THREE.Geometry,
			'BufferGeometry': THREE.BufferGeometry

		};

		for ( var type in types ) {

			if ( geometry instanceof types[ type ] ) return type;

		}

	},

	getMaterialType: function ( material ) {

		var types = {

			'LineBasicMaterial': THREE.LineBasicMaterial,
			'LineDashedMaterial': THREE.LineDashedMaterial,
			'MeshBasicMaterial': THREE.MeshBasicMaterial,
			'MeshDepthMaterial': THREE.MeshDepthMaterial,
			'MeshFaceMaterial': THREE.MeshFaceMaterial,
			'MeshLambertMaterial': THREE.MeshLambertMaterial,
			'MeshNormalMaterial': THREE.MeshNormalMaterial,
			'MeshPhongMaterial': THREE.MeshPhongMaterial,
			'ParticleSystemMaterial': THREE.ParticleSystemMaterial,
			'ShaderMaterial': THREE.ShaderMaterial,
			'SpriteCanvasMaterial': THREE.SpriteCanvasMaterial,
			'SpriteMaterial': THREE.SpriteMaterial,
			'Material': THREE.Material

		};

		for ( var type in types ) {

			if ( material instanceof types[ type ] ) return type;

		}

	},

    makeTextSprite: function ( message, parameters ) {

        if ( parameters === undefined ) parameters = {};

        var fontface = parameters.hasOwnProperty("fontface") ?
            parameters["fontface"] : "Arial";

        var fontsize = parameters.hasOwnProperty("fontsize") ?
            parameters["fontsize"] : 18;

        var borderThickness = parameters.hasOwnProperty("borderThickness") ?
            parameters["borderThickness"] : 4;

        var borderColor = parameters.hasOwnProperty("borderColor") ?
            parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
            parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

        //var spriteAlignment = parameters.hasOwnProperty("alignment") ?
        //	parameters["alignment"] : THREE.SpriteAlignment.topLeft;

//        var spriteAlignment = THREE.SpriteAlignment.topLeft;


        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;

        // get size data (height depends only on font size)
        var metrics = context.measureText( message );
        var textWidth = metrics.width;

        // background color
        context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
            + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
            + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;
        (function (ctx, x, y, w, h, r){
            ctx.beginPath();
            ctx.moveTo(x+r, y);
            ctx.lineTo(x+w-r, y);
            ctx.quadraticCurveTo(x+w, y, x+w, y+r);
            ctx.lineTo(x+w, y+h-r);
            ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
            ctx.lineTo(x+r, y+h);
            ctx.quadraticCurveTo(x, y+h, x, y+h-r);
            ctx.lineTo(x, y+r);
            ctx.quadraticCurveTo(x, y, x+r, y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        })(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
        // 1.4 is extra height factor for text below baseline: g,j,p,q.

        // text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";

        context.fillText( message, borderThickness, fontsize + borderThickness);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial(
            { map: texture, useScreenCoordinates: false, alignment: new THREE.Vector2( 1, 1 ) } );
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(4,2,1.0);
        return sprite;
    },
    generateSprite: function (color) {

        var canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        //var color= 0x11ff11;
        var context = canvas.getContext('2d');
        var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, '#'+color.toString(16));
        //gradient.addColorStop(0.2, '#'+Math.floor(color * 0.5).toString(16));
        //gradient.addColorStop(0.4, '#'+Math.floor(color * 0.2).toString(16));
//        gradient.addColorStop(0.2, '#00'+color.toString(16).slice(2));
//        gradient.addColorStop(0.4, '#00'+color.toString(16).slice(2));
        gradient.addColorStop(0.2, '#'+color.toString(16));
        gradient.addColorStop(0.4, '#'+color.toString(16));
        gradient.addColorStop(1, 'rgba(0,0,0,1)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        return canvas;
    },
    generateWellStart: function () {

        var canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;

        var context = canvas.getContext('2d');
        var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        return canvas;
    },
    createMesh: function (geometry) {
        // assign two materials
    //        var meshMaterial = new THREE.MeshNormalMaterial();
    //        meshMaterial.side = THREE.DoubleSide;
    //        var wireFrameMaterial = new THREE.MeshBasicMaterial();
    //        wireFrameMaterial.wireframe = true;
        // create a multimaterial
    //        var mesh = THREE.SceneUtils.createMultiMaterialObject(
    //            geometry, [meshMaterial,wireFrameMaterial]);
        var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({ color: 0xffff55,side: THREE.DoubleSide  }) );
        return mesh;
    },
    lineType: function (line) {
        points = line.geometry.vertices;
        if (points.length == 2 && !points[0].equals(points[1])) {
            return 'segment';
        } else if (points.length == 3 && points[0].equals(points[2])) {
            return 'segment';
        } else if (points.length < 2) {
            return 'point';
        } else if (points.length == 2 && points[0].equals(points[1])) {
            return 'point';
        } else if (points.length > 2 && !points[0].equals(points[points.length - 1])) {
            return 'open';
        } else {
            return 'close';
        }
    },
    loadWell: function () {
        var ed=this;
        $.ajax({
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/GetWell.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            //dataType: 'json',
            async:false,
            success: function (wells) { //回调函数
                $.each(wells,function(i,well){
                    var point = new THREE.Vector3();
//            var direction = new THREE.Vector3();
                    var geometry = new THREE.Geometry();
                    $.each(well.ps,function(i,v){
//                direction.x = v[0];
//                direction.y = v[1];
//                direction.z = v[2];
//                point.add( direction );
                        point.x = v[0];
                        point.y = v[1];
                        point.z = v[2];
                        geometry.vertices.push( point.clone() );
                    });
                    //var real = well.real ? THREE.LineStrip : THREE.LinePieces;
                    var real = well.real ? 2 : 1;
                    var typecolor= parseInt(well.typec);
                    //var type = THREE.LineStrip;
                    //var object = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff,linewidth: 2 } ), type );
                    var object = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: typecolor,linewidth: real } ), THREE.LineStrip );
                    object.name = well.no;
                    object.obj_type = 'well';
                    object.obj_id = well.wid;
                    object.real = real;
                    //parentTransform.add( object );
                    ed.addObject(object);

                    //显示label
                    var spritey = ed.makeTextSprite(" " + well.no + " ", { fontsize: 32, backgroundColor: {r:255, g:100, b:100, a:1} } );
                    spritey.name = well.no;
                    spritey.obj_type = 'well_label';
                    spritey.position = object.geometry.vertices[0].clone().multiplyScalar(1.1);
                    //spritey.position.set( well.ps[0][0],well.ps[0][1]+2,well.ps[0][2]);
                    ed.sceneHelpers.add(spritey);
                    //显示井口
                    var sprite = new THREE.Sprite( new THREE.SpriteMaterial( {
                        map: new THREE.Texture( ed.generateWellStart() ),
                        blending: THREE.AdditiveBlending
                    } ) );
                    sprite.position = object.geometry.vertices[0].clone();
                    sprite.name = well.no;
                    sprite.obj_type = 'well_start';
                    ed.sceneHelpers.add(sprite);
                    this.addStatus = 1;

                });
            }
        });
    },
    loadDetailWell: function () {
        var ed=this;
        $.ajax({
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/GetDetailWell.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            //dataType: 'json',
            async:false,
            success: function (wells) { //回调函数
                $.each(wells,function(i,well){
                    var next_point = new THREE.Vector3();
                    var point = new THREE.Vector3();
                    var geometry = new THREE.Geometry();
                    var next_color,next_value;
                    $.each(well.ps,function(i,v){
                        point.x = v[0];
                        point.y = v[1];
                        point.z = v[2];
                        var color_value= parseInt(v[3]) * Math.random();
                        if (i == 0 ){
                            geometry.vertices.push(point.clone());
                            geometry.colors.push(new THREE.Color( color_value ));
                        }else{
                            geometry.vertices.push( next_point.clone(),point.clone());
                            geometry.colors.push(new THREE.Color( next_color ),new THREE.Color( color_value ));
                            //显示吸附点
                            var p = new THREE.Sprite( new THREE.SpriteMaterial( {
                                map: new THREE.Texture( ed.generateSprite(0x11ff00) ),
                                blending: THREE.AdditiveBlending
                            } ) );
                            p.position = point.clone();
                            p.scale.set(0.2,0.2,1);
                            p.name = well.no;
                            p.obj_type = 'well_value_point';
                            ed.sceneHelpers.add(p);
                            //显示品味值
                            var r=next_color>>16;
                            var g=(next_color & 0x00ffff) >> 8;
                            var b=(next_color & 0x0000ff);
                            var value_label = ed.makeTextSprite(next_value, { fontsize: 30, backgroundColor: {r:r, g:g, b:b, a:0.5} } );
                            value_label.name = well.no;
                            value_label.obj_type = 'well_value_label';
                            value_label.scale.set(2,1,1.0);
                            value_label.position = next_point.clone();
                            value_label.visible = false;
                            ed.sceneHelpers.add(value_label);
                            this.addStatus = 2;

                        }

                        //保存上一个节点信息
                        next_point=point;
                        next_color = color_value;
                        next_value = v[4];
                    });
                    //var type = Math.random() > 0.1 ? THREE.LineStrip : THREE.LinePieces;
                    var type = THREE.LinePieces;
                    var real = well.real ? 2 : 1;
                    //var object = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff,linewidth: 2 } ), type );
                    var object = new THREE.Line( geometry, new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors,linewidth: real } ), type );
                    object.name = well.no;
                    object.obj_type = 'well';
                    object.obj_id = well.wid;
                    object.real = real;
                    //parentTransform.add( object );
                    ed.addObject(object);

                    //显示label
                    var spritey = ed.makeTextSprite(" " + well.no + " ", { fontsize: 32, backgroundColor: {r:255, g:100, b:100, a:1} } );
                    spritey.name = well.no;
                    spritey.obj_type = 'well_label';
                    spritey.position = object.geometry.vertices[0].clone().multiplyScalar(1.1);
                    //spritey.position.set( well.ps[0][0],well.ps[0][1]+2,well.ps[0][2]);
                    ed.sceneHelpers.add(spritey);
                    //显示井口
                    var sprite = new THREE.Sprite( new THREE.SpriteMaterial( {
                        map: new THREE.Texture( ed.generateWellStart() ),
                        blending: THREE.AdditiveBlending
                    } ) );
                    sprite.scale.set(2,2,1.0);
                    sprite.position = object.geometry.vertices[0].clone();
                    sprite.name = well.no;
                    sprite.obj_type = 'well_start';
                    ed.sceneHelpers.add(sprite);

                });
            }
        });
    },
    loadLine: function(){
        var ed=this;
        $.ajax({
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/GetLine.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            //dataType: 'json',
            async:false,
            success: function (lines) { //回调函数
                $.each(lines,function(i,line){
                    var point = new THREE.Vector3();
                    var geometry = new THREE.Geometry();
                    $.each(line.ps,function(i,v){
                        point.x = v[0];
                        point.y = v[1];
                        point.z = v[2];
                        geometry.vertices.push( point.clone() );
                    });
                    var draw_line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff,linewidth: 2 } ), THREE.LineStrip );
                    draw_line.name =line.name;
                    draw_line.obj_type = 'line';
                    draw_line.obj_id = line.lid;
                    ed.addObject(draw_line);
                    ed.draw_line_count++;
                    this.addStatus = 3;
                });
            }
        });
    },
    loadObject: function () {
        var ed=this;
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
                    var loadedMesh = ed.createMesh(geom.geometry);
                    loadedMesh.name = object.metadata.object_name;
                    loadedMesh.obj_type = 'object';
                    loadedMesh.obj_id = object.metadata.object_id;
                    ed.addObject(loadedMesh);
                    this.addStatus = 4;
                });
            }
        });
    }


}
