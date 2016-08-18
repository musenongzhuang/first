Sidebar.AreaAndUnit = function (editor) {

    //signal
    var signals = editor.signals;

    //container
    var container = new UI.CollapsiblePanel();
    container.setDisplay('none');
    container.addStatic(new UI.Text('采区和抽注单元'));
    container.add(new UI.Break());

    //scopeParams+scopeButtons
    var buttons = new UI.Panel();
    var params = new UI.Panel();
    container.add(params);
    container.add(buttons);//区域操作

    /**************************************************scopeParamsDetail*********************************************************************/
    //scope
    var options = ['采区', '抽注单元'];
    var selectScopeRow = new UI.Panel();
    var selectScope = new UI.Select().setOptions(options).setWidth('150px').setColor('#444').setFontSize('12px').onChange(onselectScopeChange);
    selectScopeRow.add(new UI.Text('区域').setWidth('90px'));
    selectScopeRow.add(selectScope);
    params.add(selectScopeRow);

    // name
    var objectNameRow = new UI.Panel();
    var objectName = new UI.Input().setWidth('150px').setColor('#444').setFontSize('12px').onChange(update);
    objectNameRow.add(new UI.Text('名字').setWidth('90px'));
    objectNameRow.add(objectName);
    params.add(objectNameRow);

    //type
    var selectedTypeRow = new UI.Panel();
    var selectType = new UI.Select().setWidth('150px').setColor('#444').setFontSize('12px').onChange(update);
    selectedTypeRow.add(new UI.Text('类型').setWidth('90px'));
    selectedTypeRow.add(selectType);
    params.add(selectedTypeRow);

    //state
    var selectedStateRow = new UI.Panel();
    var selectState = new UI.Select().setWidth('150px').setColor('#444').setFontSize('12px').onChange(update);
    selectedStateRow.add(new UI.Text('状态').setWidth('90px'));
    selectedStateRow.add(selectState);
    params.add(selectedStateRow);


    //parent_type_area(scope=unit: visible)
    var selectedAParentRow = new UI.Panel();
    var selectAParent = new UI.Select().setWidth('150px').setColor('#444').setFontSize('12px').onChange(initUnits);
    selectedAParentRow.add(new UI.Text('所属采区').setWidth('90px'));
    selectedAParentRow.add(selectAParent);
    selectedAParentRow.setDisplay("none"); //默认不可见
    params.add(selectedAParentRow);

    // color
    var materialColorRow = new UI.Panel();
    var materialColor = new UI.Color().onChange(update);
    materialColorRow.add(new UI.Text('颜色').setWidth('90px'));
    materialColorRow.add(materialColor);
    params.add(materialColorRow);

    // position
    var objectPositionRow = new UI.Panel();
    var objectPositionX = new UI.Number().setWidth('50px').onChange(update);
    var objectPositionY = new UI.Number().setWidth('50px').onChange(update);
    var objectPositionZ = new UI.Number().setWidth('50px').onChange(update);
    objectPositionRow.add(new UI.Text('位置').setWidth('90px'));
    objectPositionRow.add(objectPositionX, objectPositionY, objectPositionZ);
    params.add(objectPositionRow);

    // visible
    var objectVisibleRow = new UI.Panel();
    var objectVisible = new UI.Checkbox().onChange(update);
    objectVisibleRow.add(new UI.Text('是否可见').setWidth('90px'));
    objectVisibleRow.add(objectVisible);
    params.add(objectVisibleRow);

    // user data
    var objectUserDataRow = new UI.Panel();
    var objectUserData = new UI.TextArea().setWidth('150px').setHeight('40px').setColor('#444').setFontSize('12px').onChange(update);
    objectUserData.onKeyUp(function () {
        objectUserData.setBorderColor('#ccc');
        objectUserData.setBackgroundColor('');
    });
    objectUserDataRow.add(new UI.Text('描述').setWidth('90px'));
    objectUserDataRow.add(objectUserData);
    params.add(objectUserDataRow);
    /**********************************************************************************************************************************/

    /***********************************************scopeButtonsDetail******************************************************************/
    //create
    var createRow = new UI.Panel();
    var create = new UI.Button('新建').onClick(onCreateClick);
    createRow.add(create);
    buttons.add(createRow);

    //update
    //no button,autoUpdate——update()
    /**********************************************************************************************************************************/

    /**************************************************scopeButtonsEvent***************************************************************/
    //scopeChange
    function onselectScopeChange() {
        if (selectScope.dom.value == 0) {//采区(默认)
            //类型
            var typeOptions = initTypes("area");
            selectType.setOptions(typeOptions);
            selectedAParentRow.setDisplay("none");
        }
        else {//抽注单元

            //类型
            var typeOptions = initTypes("unit");
            selectType.setOptions(typeOptions);

            //所属采区
            var areaOptions = initAreas();
            selectAParent.setOptions(areaOptions);
        }
    }
    //init Areas(sql)
    function initAreas() {
        var resAreas = {};
        var post_data = {};
        post_data.cur_batch = editor.cur_batch + "";
        $.ajax({
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/WellInfo2.asmx/GetMiningAreas", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            dataType: 'json',
            async: false,
            success: function (areas) {
                if (areas.as.length != 0) {
                    resAreas = areas.as;
                }
                else {
                    alert("请新建采区！");
                }
            },
            error: function (areas) {

            }
        });
        return resAreas;
    }
    //init unit(sql)(select area)
    function initUnits() {
        var resUnits = {};
        var post_data = {};
        post_data.cur_batch = editor.cur_batch + "";
        post_data.areaId = selectAParent.getValue();
        $.ajax({
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/WellInfo2.asmx/GetUnits", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            dataType: 'json',
            success: function (units) {

                if (units.as.length != 0) {
                    resUnits = units.as;
                    selectUParent.setOptions(resUnits);
                }
                else {
                    alert("请新建此采区下的抽注单元！");
                }
            },
            error: function (areas) {

            }
        });
        update();
    }
    //init States(sql)
    function initStates() {
        var resStates = {};
        $.ajax({
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/WellInfo2.asmx/GetStates", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            dataType: 'json',
            async: false,
            success: function (states) { //回调函数

                resStates = states.as;
            }
        });
        return resStates;
    }
    //init type(sql)(unitType/areaType)
    function initTypes(scopeType) {
        var cur_url = "";
        var resTypes = {};
        if (scopeType == "unit") {
            cur_url = "GetUnitTypes";
        }
        else {
            cur_url = "GetMiningAreaTypes";
        }
        $.ajax({
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/WellInfo2.asmx/" + cur_url, //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            dataType: 'json',
            async: false,
            success: function (types) { //回调函数

                resTypes = types.as;
            }
        });
        return resTypes;
    }
    //update sidebar_ AreaAndUnit
    function updateAUUI(scopeType) {
        container.setDisplay('none');

        var object = editor.selected;
        console.log("addUI", object);
        var stateOptions = [];
        var typeOptions = [];
        if (object !== null) {
            container.setDisplay('block');
            //加载默认信息(采区)
            stateOptions = initStates();
            //侧边栏名
            objectType.setValue("采区和抽注单元");
            //选中物名
            objectName.setValue(object.name);
            //状态
            selectState.setOptions(stateOptions);
            selectState.setValue(object.state);
            selectedStateRow.setDisplay("block");
            //新建+更新+所属采区
            switch (scopeType) {
                case "area":
                    create.dom.innerText = "更新";
                    selectScope.dom.value = 0;
                    break;
                case "unit":
                    create.dom.innerText = "更新";
                    selectScope.dom.value = 1;
                    //所属采区
                    console.log("sparent", object.sparent);
                    var areaOptions = initAreas();
                    selectAParent.setOptions(areaOptions);
                    selectAParent.setValue(object.sparent);
                    selectedAParentRow.setDisplay("block");
                    break;
                default:
                    create.dom.innerText = "新建";
            }
            //类型
            if (selectScope.dom.value == 0) {

                typeOptions = initTypes("area");
            }
            else {

                typeOptions = initTypes("unit");
            }
            selectType.setOptions(typeOptions);
            selectType.setValue(object.stypeDetail);
            selectedTypeRow.setDisplay("block");
            //区域
            selectScopeRow.setDisplay("block");
            createRow.setDisplay("block");

            if (object.parent !== undefined) {

                objectParent.setValue(object.parent.id);
            }
            //父节点
            selectedUParentRow.setDisplay('none');

            //显示坐标
            objectPositionX.setValue(object.geometry.vertices[0].x);
            objectPositionY.setValue(object.geometry.vertices[0].y);
            objectPositionZ.setValue(object.geometry.vertices[0].z);

            //显示材质（颜色）
            var material;
            material = object.material;
            if (material !== undefined && material.color !== undefined) {

                materialColor.setHexValue(material.color.getHexString());

            }
            objectVisible.setValue(object.visible);
            objectUserData.setValue(object.des || '');
            objectUserData.setBorderColor('#ccc');
            objectUserData.setBackgroundColor('');

            try {

                objectUserData.setValue(JSON.stringify(object.userData, null, '  '));

            } catch (error) {

                console.log(error);

            }
            objectUserData.setBorderColor('#ccc');
            objectUserData.setBackgroundColor('');

        }
    }
    //create new scope
    function onCreateClick() {
        //名字
        var object_name = objectName.getValue();
        //类型
        var object_type = selectType.getValue();
        //状态
        var object_state = selectState.getValue();
        //区域
        var cur_url = "";
        var post_data = {};
        post_data.id = editor.selected.obj_id || 0;
        post_data.name = object_name;
        post_data.scope_type = object_type;
        post_data.scope_state = object_state;
        post_data.cur_batch = editor.cur_batch + "";
        if (selectScope.dom.value == 1) {//抽注单元
            //所属采区
            var object_selectAParent = selectAParent.getValue();
            if (create.dom.innerText == "更新") {
                cur_url = "UpdateUnit";
            }
            else {
                cur_url = "AddUnit";
            }
            post_data.area_id = object_selectAParent;
        }
        else { //采区
            if (create.dom.innerText == "更新") {
                cur_url = "UpdateArea";
            }
            else {
                cur_url = "AddMiningArea";
            }
        }
       /* $.ajax({
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/WellInfo2.asmx/" + cur_url, //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: $.toJSON(post_data), //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            dataType: 'json',
            success: function (res) {
                if (res.result) {

                }
                else {
                    alert(res.message);
                }
            },
            error: function (res) {

            }
        });*/

    }
    //update monogoData+sqlData
    //auline(update)///hline(delete hline,create auline)///line(delete line,create auline)
    function update() {
        var object = editor.selected;
        if (object !== null) {
            object.visible = objectVisible.getValue();
            if (editor.getObjectType(object) === 'line'||editor.getObjectType(object) === 'hline'||editor.getObjectType(object) === 'auline') {
                editor.updateAULineInfo(object, objectName.getValue(), objectUserData.getValue(), materialColor.getHexValue(), selectType.getValue(), selectState.getValue());
            }  else {
            }
        }
    }
    /***************************************************************************************************************************/

    /******************************************signal Events******************************************************************/
    signals.objectSelected.add(function (object) {
        var objectType = editor.getObjectType(object);
        console.log("objectType", objectType);
        if ((objectType == 'auline' || objectType == 'hline' || objectType == 'line') && (editor.lineType(object) == "close")) {
            var selectObjectType = object.stype;
            updateAUUI(selectObjectType); //增加采区和抽注单元侧边栏，默认是采区
        }
    });
    signals.objectChanged.add(function (object) {
        if (object !== editor.selected) return;
        var objectType = editor.getObjectType(object);
        if ((objectType == 'auline' || objectType == 'hline' || objectType == 'line') && (editor.lineType(object) == "close")) {
            var selectObjectType = object.stype;
            updateAUUI(selectObjectType); //增加采区和抽注单元侧边栏，默认是采区
        }
    });
    /***************************************************************************************************************************/

    return container;

}
