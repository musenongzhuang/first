Sidebar.Object3D = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.CollapsiblePanel();
	container.setDisplay( 'none' );

	var objectType = new UI.Text().setTextTransform( 'uppercase' );
	container.addStatic( objectType );
	container.add( new UI.Break() );
    //console.log(objectType);



//////////////////////////////////////////////////////////////////////////////////////////////郭佳宁：新建采区，抽注单元
    //scope
    var options = ['采区', '抽注单元'];
    var selectScopeRow = new UI.Panel();
    var selectScope = new UI.Select().setOptions(options).setWidth('150px').setColor('#444').setFontSize('12px').onChange(onselectScopeChange);
    selectScopeRow.add(new UI.Text('区域').setWidth('90px'));
    selectScopeRow.add(selectScope);
    selectScopeRow.setDisplay("none");//默认不可见
    container.add(selectScopeRow);

    // name
    var objectNameRow = new UI.Panel();
    var objectName = new UI.Input().setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( function () {
        editor.setObjectName( editor.selected, objectName.getValue() );

    } );
    objectNameRow.add( new UI.Text( '名字' ).setWidth( '90px' ) );
    objectNameRow.add( objectName );
    container.add( objectNameRow );

    //type
    var selectedTypeRow = new UI.Panel();
    var typeOptions=[];
//    var selectType = new UI.Select().setOptions(typeOptions).setWidth('150px').setColor('#444').setFontSize('12px').onChange(onselectScopeChange);
    var selectType = new UI.Select().setOptions(options).setWidth('150px').setColor('#444').setFontSize('12px').onChange(onselectScopeChange);
    selectedTypeRow.add(new UI.Text('类型').setWidth('90px'));
    selectedTypeRow.add(selectType);
    selectedTypeRow.setDisplay("none");//默认不可见
    container.add(selectedTypeRow);

    //state
    var selectedStateRow = new UI.Panel();
    var stateOptions=[];
//    var selectState = new UI.Select().setOptions(stateOptions).setWidth('150px').setColor('#444').setFontSize('12px').onChange(onselectScopeChange);
    var selectState = new UI.Select().setOptions(options).setWidth('150px').setColor('#444').setFontSize('12px').onChange(onselectScopeChange);
    selectedStateRow.add(new UI.Text('状态').setWidth('90px'));
    selectedStateRow.add(selectState);
    selectedStateRow.setDisplay("none");//默认不可见
    container.add(selectedStateRow);


    //parent_type
    var selectedParentRow = new UI.Panel();
    // var MineralName = new UI.Select().setOptions(editor.all_bb).setWidth('150px').setColor('#444').setFontSize('12px').onChange(selectMineralObject);
    var areaOptions=[];
//    var selectParent = new UI.Select().setOptions(areaOptions).setWidth('150px').setColor('#444').setFontSize('12px').onChange(onselectScopeChange);
    var selectParent = new UI.Select().setOptions(options).setWidth('150px').setColor('#444').setFontSize('12px').onChange(onselectScopeChange);
    selectedParentRow.add(new UI.Text('所属采区').setWidth('90px'));
    selectedParentRow.add(selectParent);
    selectedParentRow.setDisplay("none");//默认不可见
    container.add(selectedParentRow);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	// parent
	var objectParentRow = new UI.Panel();
	var objectParent = new UI.Select().setWidth( '150px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( update );

	objectParentRow.add( new UI.Text( '上级对象' ).setWidth( '90px' ) );
	objectParentRow.add( objectParent );


	// position
    var objectPositionRow = new UI.Panel();
	var objectPositionX = new UI.Number().setWidth( '50px' ).onChange( update );
	var objectPositionY = new UI.Number().setWidth( '50px' ).onChange( update );
	var objectPositionZ = new UI.Number().setWidth( '50px' ).onChange( update );

    objectPositionRow.add( new UI.Text( '位置' ).setWidth( '90px' ) );
    objectPositionRow.add( objectPositionX, objectPositionY, objectPositionZ );
    container.add( objectPositionRow );



	// visible
	var objectVisibleRow = new UI.Panel();
	var objectVisible = new UI.Checkbox().onChange( update );

	objectVisibleRow.add( new UI.Text( '是否可见' ).setWidth( '90px' ) );
	objectVisibleRow.add( objectVisible );

	container.add( objectVisibleRow );

	// user data
	var objectUserDataRow = new UI.Panel();
	var objectUserData = new UI.TextArea().setWidth( '150px' ).setHeight( '40px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( update );
	objectUserData.onKeyUp( function () {

		try {

			JSON.parse( objectUserData.getValue() );
			objectUserData.setBorderColor( '#ccc' );
			objectUserData.setBackgroundColor( '' );

		} catch ( error ) {

			objectUserData.setBorderColor( '#f00' );
			objectUserData.setBackgroundColor( 'rgba(255,0,0,0.25)' );

		}

	} );
	objectUserDataRow.add( new UI.Text( '描述' ).setWidth( '90px' ) );
	objectUserDataRow.add( objectUserData );

	container.add( objectUserDataRow );

    /////////////////////////////////////////////////////////////////////郭佳宁：新建采区，抽注单元
    //create
    var createRow = new UI.Panel();
    var create= new UI.Button('新建').onClick(onCreateClick);
    createRow.add(create);
    createRow.setDisplay("none");//默认不可见
    container.add(createRow);
    /////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////郭佳宁：新建采区，抽注单元
    //区域改变
    function onselectScopeChange(){
        //默认为采区
        if (selectScope.dom.value == 0) {//采区
            selectedParentRow.setDisplay("none");
            //typeOptions会改变为editor.scopeAType/editor.scopeUType
        }
        else {//抽注单元
            selectedParentRow.setDisplay("block");
            //加载类型
            //typeOptions会改变为editor.scopeAType/editor.scopeUType
//            if(editor.scopeUType!=null){
//
//            }
//            else{
//                initTypes("unit");
//            }
            //加载采区
//            initAreas();
        }
    }
    //加载采区
    function initAreas() {
//        var post_data = {};
//        post_data.cur_batch = editor.cur_batch + "";
//        $.ajax({
//            type: "POST", //访问WebService使用Post方式请求
//            contentType: "application/json", //WebService 会返回Json类型
//            url: "../getdata/WellInfo2.asmx/GetUnits", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
//            data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
//            dataType: 'json',
//            success: function (res) {
//                if (res.result) {
//                    console.log("result",res);
//                }
//                else {
//                }
//            },
//            error: function (res) {
//
//            },
//            complete: function (res) {
//
//            }
//        });


    }
    //加载状态+editor.scopeState
    function initStates(){
        $.ajax({
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/WellInfo2.asmx/GetStates", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            dataType: 'json',
            async: false,
            success: function (states) { //回调函数

            }
        });

    }
    //加载类型+editor.scopeAType+editor.scopeUType
    function initTypes(scopeType){
        var cur_url="";
        if(scopeType="unit"){
            cur_url="GetUnitTypes";
        }
        else{
            cur_url="GetMiningAreaTypes";
        }
        $.ajax({
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/WellInfo2.asmx/"+cur_url, //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            dataType: 'json',
            async: false,
            success: function (tupes) { //回调函数
//                typeOptions
            }
        });
    }
    //采区和抽注单元侧边栏
    function addAreaAndUnitUI(){
        container.setDisplay( 'none' );

        var object = editor.selected;

        if ( object !== null ) {

            container.setDisplay( 'block' );
            //加载默认信息(采区)
            initStates();
            initTypes("area");
            //侧边栏名
            objectType.setValue("采区和抽注单元");
            //选中物名
            objectName.setValue( object.name );
            //类型
            selectedTypeRow.setDisplay("block");
            //状态
            selectedStateRow.setDisplay("block");
            //区域
            selectScopeRow.setDisplay("block");
            //新建
            createRow.setDisplay("block");
            if ( object.parent !== undefined ) {

                objectParent.setValue( object.parent.id );

            }


            //显示坐标
            if (editor.getObjectType( object ) === 'well' || editor.getObjectType( object ) === 'line' ){
                objectPositionX.setValue( object.geometry.vertices[0].x );
                objectPositionY.setValue( object.geometry.vertices[0].y );
                objectPositionZ.setValue( object.geometry.vertices[0].z );
            }else{
                objectPositionX.setValue( object.position.x );
                objectPositionY.setValue( object.position.y );
                objectPositionZ.setValue( object.position.z );
            }
            objectVisible.setValue( object.visible );
            try {

                objectUserData.setValue( JSON.stringify( object.userData, null, '  ' ) );

            } catch ( error ) {

                console.log( error );

            }
            objectUserData.setBorderColor( '#ccc' );
            objectUserData.setBackgroundColor( '' );

        }
    }
    //新建区域
    function onCreateClick(){
//        //名字
//        var object_name=objectName.getValue();
//        //类型
//        var object_type=selectType.getValue();
//        //状态
//        var object_state=selectState.getValue();
//        //区域
//        var cur_url="";
//        var post_data = {};
//        if (selectScope.dom.value == 1) {//抽注单元
//            //所属采区
//            var object_selectParent=selectParent.getValue();
//            cur_url="AddUnit";
//            post_data.object_id = editor.selected.obj_id || 0;
//            post_data.unit_name = object_name;
//            post_data.unit_type = object_type;
//            post_data.unit_state = object_state;
//            post_data.area_id = object_selectParent;
//        }
//        else{ //采区
//            cur_url="AddMiningArea";
//            post_data.object_id = editor.selected.obj_id || 0;
//            post_data.area_name = object_name;
//            post_data.area_type = object_type;
//            post_data.area_state = object_state;
//            post_data.cur_batch = editor.cur_batch + "";
//        }
//        $.ajax({
//            type: "POST", //访问WebService使用Post方式请求
//            contentType: "application/json", //WebService 会返回Json类型
//            url: "../getdata/WellInfo2.asmx/" + cur_url, //调用WebService的地址和方法名称组合 ---- WsURL/方法名
//            data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
//            dataType: 'json',
//            success: function (res) {
//                console.log(res);
//            },
//            error: function (res) {
//
//            },
//            complete: function (res) {
//
//            }
//        });

    }

    //选中物体（选中闭合的辅助线）
    signals.objectSelected.add( function ( object ) {
        //整合时改成这样
//        if (editor.getObjectType(object) === 'hline' && (editor.lineType(object) == "close")) {
        if (editor.getObjectType(object) === 'line' && (editor.lineType(object) == "close")) {
            addAreaAndUnitUI();//增加采区和抽注单元侧边栏，默认是采区
        }
        else{
            updateUI();
        }
    } );
    //////////////////////////////////////////////////////////////////////////////////////////


	function updateScaleX() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleX.getValue() / object.scale.x;

			objectScaleY.setValue( objectScaleY.getValue() * scale );
			objectScaleZ.setValue( objectScaleZ.getValue() * scale );

		}

		update();

	}

	function updateScaleY() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleY.getValue() / object.scale.y;

			objectScaleX.setValue( objectScaleX.getValue() * scale );
			objectScaleZ.setValue( objectScaleZ.getValue() * scale );

		}

		update();

	}

	function updateScaleZ() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleZ.getValue() / object.scale.z;

			objectScaleX.setValue( objectScaleX.getValue() * scale );
			objectScaleY.setValue( objectScaleY.getValue() * scale );

		}

		update();

	}

	function update() {

		var object = editor.selected;

		if ( object !== null ) {

			if ( object.parent !== undefined ) {

				var newParentId = parseInt( objectParent.getValue() );

				if ( object.parent.id !== newParentId && object.id !== newParentId ) {

					editor.parent( object, editor.scene.getObjectById( newParentId, true ) );

				}

			}

			object.position.x = objectPositionX.getValue();
			object.position.y = objectPositionY.getValue();
			object.position.z = objectPositionZ.getValue();

			object.visible = objectVisible.getValue();

			try {

				object.userData = JSON.parse( objectUserData.getValue() );

			} catch ( exception ) {

				console.warn( exception );

			}

			signals.objectChanged.dispatch( object );

		}

	}

	// events



	signals.sceneGraphChanged.add( function () {

		var scene = editor.scene;

		var options = {};

		options[ scene.id ] = 'Scene';

		( function addObjects( objects ) {

			for ( var i = 0, l = objects.length; i < l; i ++ ) {

				var object = objects[ i ];

				options[ object.id ] = object.name;

				addObjects( object.children );

			}

		} )( scene.children );

		objectParent.setOptions( options );

	} );

	signals.objectChanged.add( function ( object ) {

		if ( object !== editor.selected ) return;

		updateUI();



	} );

 /*   if (editor.getObjectType(object) === 'line' && (editor.lineType(object) == "close")) {
        console.log("线圈");
        updateUI();
    }*/
	function updateUI() {
        console.log("采区");
		container.setDisplay( 'none' );

		var object = editor.selected;

		if ( object !== null ) {

			container.setDisplay( 'block' );

            //侧边栏名
            if (editor.getObjectType(object) === 'line' && (editor.lineType(object) == "close")) {
                objectType.setValue("采区和抽注单元" );
                console.log("线圈");
            }
            else{
                objectType.setValue( editor.getObjectTypeName( object ) );
            }
            //选中物名
			objectName.setValue( object.name );

			if ( object.parent !== undefined ) {

				objectParent.setValue( object.parent.id );

			}

            if (editor.getObjectType( object ) === 'well' || editor.getObjectType( object ) === 'line' ){
                objectPositionX.setValue( object.geometry.vertices[0].x );
                objectPositionY.setValue( object.geometry.vertices[0].y );
                objectPositionZ.setValue( object.geometry.vertices[0].z );
            }else{
                objectPositionX.setValue( object.position.x );
                objectPositionY.setValue( object.position.y );
                objectPositionZ.setValue( object.position.z );
            }


			objectVisible.setValue( object.visible );

			try {

				objectUserData.setValue( JSON.stringify( object.userData, null, '  ' ) );

			} catch ( error ) {

				console.log( error );

			}

			objectUserData.setBorderColor( '#ccc' );
			objectUserData.setBackgroundColor( '' );

			//updateRows();
			//updateTransformRows();

		}

	}


	return container;

}
