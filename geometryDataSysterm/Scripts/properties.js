/**
 * Created by wjinxiang on 2015/5/19.
 */
var properties=function() {
    // 横向与纵向的格子数量
    this.row = 2;
    this.col = 2;

   //初始化行、列的坐标
    this.yCoordinate_list = [0, 200, 350, 700];//坐标系上y轴上坐标，应该由后台给出
    this.xCoordinate_list = [0, 250, 350, 700];//坐标系上x轴上坐标，应该由后台给出


    this.colList = "";
    this.rowList = "";
    this.zoneStr = "";
    this.colorStr = "";
    this.xStr = "";
    this.yStr = "";
    this.rowIndex = 0;
    this.selectRow = 0; //行选中的是第几行
    this.drawColLine = false;
    this.drawRowLine = false;
    this.clearColLine = false;
    this.clearRowLine = false;
    this.fillGrid = true;


    this.cGetRow = 0;
    this.selectSum = 0;
    this.selectColor = "";
    this.zoomName = "";


};
properties.prototype = {
//画网格
    //画网格
    drawBoard:function(w, h, xLists, yLists) {
        // 获取画布上下文
        var canvas = document.getElementById('c');
        var ctx = canvas.getContext('2d');
        ctx.beginPath(); //只有加了封闭的路径，才能不受之外图形的干扰，否则被删掉的线条将会重新出现
        //先画列,根据x轴上坐标
        for (var i = 0; i < xLists.length; i++) {
            ctx.moveTo(xLists[i], 0);
            ctx.lineTo(xLists[i], h);
        }
        //再画行，根据y轴上坐标
        for (var j = 0; j < yLists.length; j++) {
            ctx.moveTo(0, yLists[j]);
            ctx.lineTo(w, yLists[j]);
        }
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
    },

//初始化Zone
    initZone: function () {
        var pp = this;
        var strProperty = $("#phyProperty option:selected").val();
        var strLayer = $("#layer option:selected").val();
        var zoneParam = "";
        $('#zoneBody > tr').remove(); //消除原有的tbody中残留的tr
        pp.rowIndex = 0; //不同的物性下不同的table中rowIndex要重置
        pp.selectColor = ""; //不同的物性下颜色要重置
        $.ajax({
//            url: "GridJson.ashx",
//            data: { "property": strProperty, "option": "getZone" },
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/initZone.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            async:false,
            success: function (res) {
                for (var i = 0; i < res.zoneNames.length; i++) {
                    var zonename = res.zoneNames[i];
                    var zoneColor = res.zoneColors[i];
                    if (strProperty == 4) { //Inital_Head Zone
                        zoneParam = res.zoneParams[i][0];
                    }
                    else if (strProperty == 5) {//Stotage Zone
                        zoneParam = res.zoneParams[i][0] + "," + res.zoneParams[i][1] + "," + res.zoneParams[i][2] + "," + res.zoneParams[i][3];
                    }
                    else {
                        zoneParam = res.zoneParams[i][0] + "," + res.zoneParams[i][1] + "," + res.zoneParams[i][2];
                    }
                    var oTable = document.getElementById("oTable");
                    var tBodies = oTable.tBodies;
                    var tbody = tBodies[0];
                    var tr = tbody.insertRow(tbody.rows.length);
                    var td_1 = tr.insertCell(0);
                    td_1.innerHTML = '<input type="checkbox" id="number" class="number" name="number" onclick="checkRows()" value="1">'; //在innerHTML中添加标签

                    var td_2 = tr.insertCell(1);
                    var divContent = document.createElement("div");
                    divContent.className = "zoneName";
                    divContent.id = "zone" + pp.rowIndex;
                    divContent.innerText = zonename;
                    td_2.appendChild(divContent);

                    var td_3 = tr.insertCell(2);
                    var inputColor = document.createElement("input");
                    $(inputColor).attr("disabled", true);
                    inputColor.className = "input_cxcolor";
                    inputColor.id = "color" + pp.rowIndex;
                    if (zoneColor == "none") {
                        zoneColor = "#c0c0c0";
                    };
                    inputColor.style.background = zoneColor;

                    td_3.appendChild(inputColor);

                    var td_4 = tr.insertCell(3);
                    var divParams = document.createElement("div");
                    divParams.className = "zoneParam";
                    divParams.id = "param" + pp.rowIndex;
                    divParams.innerText = zoneParam;
                    td_4.appendChild(divParams);
                    pp.rowIndex++;
                }
                if (strLayer != "-1") {//0的时候为选层
                    initGrid(); //换物性的同时换画布
                }
                $(function () { //切记不同js文件的共享与独立功能
                    $('#zoneBody tr').bind("click", function () {
                        pp.drawColLine = false;
                        pp.drawRowLine = false;
                        pp.fillGrid = true;
                        pp.selectRow = window.event.srcElement.parentElement.parentElement.rowIndex;
                        pp.selectColor = $(".input_cxcolor").eq(pp.selectRow - 1).css("background-color");
                        pp.zoneName = $(".zoneName").eq(pp.selectRow - 1)[0].innerText;
                        if (pp.selectRow == 0 || pp.selectRow == 1) {
                            $("#lbZoneAlert")[0].innerText = "系统默认zone不可选！";
                            $("#lbZoneAlert").css("color", "red");
                            setTimeout(function () { $("#lbZoneAlert")[0].innerText = ''; }, 5000);
                            return;
                        }
                        $("#lbZoneAlert")[0].innerText = "进入录入状态！";
                        $("#lbZoneAlert").css("color", "blue");
                        setTimeout(function () { $("#lbZoneAlert")[0].innerText = ''; }, 5000);
                        $("#zoneCurrentColor").css("background-color", pp.selectColor);
                        $("#lbZone")[0].innerText = pp.zoneName;
                        $("#zoneCurrentColor").removeAttr("placeholder");
                    })
                });
            }
        });
        console.log(strProperty);
        console.log(strLayer);
    },

//初始化层
    initLayer: function () {
        var pp = this;
        $.ajax({
            //         url: 'GridJson.ashx',
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/initLayer.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            async:false,
            success: function (res) {
                //动态展示layer,显示纵向边界层，例如40索引必须出现41层，将所有items改为items+1
                var items = res.laynum;
                for (var i = 0; i < items; i++) {
                    var option = document.createElement("option");
                    option.value = i;
                    option.innerHTML = "第" + (i+1)+"层";
                    document.getElementById("layer").appendChild(option);
                }
            }
        });
    },
//清除画布
    clearGrid:function() {
        //var size = 20;
        // 获取画布上下文
        var canvas = document.getElementById('c');
        var ctx = canvas.getContext('2d');
        // 获取画布长宽
        var wid = canvas.offsetWidth;
        var hei = canvas.offsetHeight;
        ctx.clearRect(0, 0, wid, hei);
    },

    //找到坐标索引
    findCoordinateIndex:function(xlist, ylist, mx, my, coordinateTag) {
        var gx = 0;
        var gxIndex = 0;
        var gy = 0;
        var gyIndex = 0;
        //寻找标准x轴坐标
        for (var i = 0; i < xlist.length; i++) {
            if (mx >= xlist[i] && mx < xlist[i + 1]) {
                if (coordinateTag == 0) { //0表示获得起点标准坐标
                    gx = xlist[i]; //起点获得左上坐标
                    gxIndex = i;
                }
                if (coordinateTag == 1) { //1表示获得终点标准坐标
                    gx = xlist[i + 1]; //终点获得右下坐标
                    gxIndex = i + 1;
                }

            }

        }

        //寻找标准的y轴坐标
        for (var j = 0; j < ylist.length; j++) {
            if (my >= ylist[j] && my < ylist[j + 1]) {
                if (coordinateTag == 0) {
                    gy = ylist[j];
                    gyIndex = j;
                }
                if (coordinateTag == 1) {
                    gy = ylist[j + 1];
                    gyIndex = j + 1;
                }

            }
        }
        return gx + "|" + gxIndex + "|" + gy + "|" + gyIndex;
    },


//改变行、列,同步更改x,y标准坐标列
    changeCoordinate:function(cX, cY, isDrawX, isDrawY, changeCol, changeRow, index, xList, yList) {
        if (isDrawX == true) {   //改变的是列线，相当于改变了x坐标
            if (changeCol == 0) {       //0表示增加列，即增加了x坐标
                //变化x轴上坐标(此处暂为增加)
                for (var i = 0; i <= xList.length; i++) {
                    if (cX < xList[i]) {
                        xList.splice(i, 0, cX); //只要一插入数后就跳出
                        break;
                    }
                    if (xList[i] == undefined) {
                        xList.push(cX);
                        break;
                    }
                }
            }
            else if (changeCol == 1) {
                //鼠标落下的时候就已经定位过鼠标点击的坐标了
                xList.splice(index, 1);
            }
            else {
                return;
            }
        }
        if (isDrawY == true) {
            if (changeRow == 0) {
                //变化y轴上坐标(此处暂为增加)
                for (var j = 0; j <= yList.length; j++) {
                    if (cY < yList[j]) {
                        yList.splice(j, 0, cY); //只要一插入数后就跳出
                        break;
                    }
                    if (yList[j] == undefined) {
                        yList.push(cY);
                        break;
                    }
                }
            }
            else if (changeRow == 1) {
                yList.splice(index, 1);
            }
            else {
                return;
            }
        }
        return xList + "|" + yList;
    },
//初始化网格画布
    initGrid: function () {
        var strLayer = $("#layer option:selected").val();   //获得选中的值为（单值）
        var strProperty = $("#phyProperty option:selected").val();   //获得选中的值
        var isOldCanvas = "";
        var layerStr = "";
        var blockPara = "";
        var xWidths = new Array();
        var yHeights = new Array();
        var pp=this;
        $.ajax({
//            url: "GridJson.ashx",
//            data: { "layer": strLayer, "property": strProperty, "option": "initGrid" },
            type: "POST", //访问WebService使用Post方式请求
            contentType: "application/json", //WebService 会返回Json类型
            url: "../getdata/initGrid.json", //调用WebService的地址和方法名称组合 ---- WsURL/方法名
            data: "{}", //这里是要传递的参数，格式为 data: "{paraName:paraValue}",下面将会看到
            async:false,
            success: function (res) {
                if (res) {
                    alert("进入清理画布！");
                    pp.clearGrid(); //只是画布，无网格
                    pp.colList = res.collist; //数据库中存的的标准x坐标
                    pp.rowList = res.rowlist; //y坐标
                    pp.drawGrid(pp.rowList, pp.colList, xWidths, yHeights, false); //此处插入xWidths，yHeights空数组
                    if (res.is_old_canvas == "true") { //如果所选层有旧画布，初始化旧画布.将每个block的属性初始化。
                        alert("进入初始化Grid！");
                        $("#reset").attr('disabled', 'disabled');
                        for (var i = 0; i < res.colorStr.length; i++) {
                            var drawColor = res.colorStr[i];
                            var startY = res.blockPara[i][0];
                            var startX = res.blockPara[i][1];
                            //寻找起点坐标startY及startX在标准列中的索引
                            var indexInfo = pp.findCoordinateIndex(pp.colList, pp.rowList, startX, startY, 0).split('|');
                            var xWidthIndex = parseInt(indexInfo[1]);
                            var yHeightIndex = parseInt(indexInfo[3]);

                            if (xWidths[xWidthIndex] == NaN) {
                                xWidths[xWidthIndex] = 0;
                            }
                            if (yHeights[yHeightIndex] == NaN) {
                                yHeights[yHeightIndex] = 0;
                            }
                            //                                alert("xWidths:" + xWidths + ";" + "yHeights:" + yHeights);
                            pp.reDrawGrid(startX, startY, xWidths[xWidthIndex], yHeights[yHeightIndex], drawColor); //重新填充颜色
                        }
                        alert("Grid初始化成功！");
                    }
                    else {

                        $("#reset").removeAttr('disabled');
                    }
                }
            }

        });
    },

//重置画布
    reDrawGrid:function(sx, sy, wid, height, color) {
        // 获取画布上下文
        var canvas = document.getElementById('c');
        var ctx = canvas.getContext('2d');

        //填充格子的内容
        if (color == "none" || color == undefined) {
            return;
        }
        else {
            ctx.fillStyle = color;
            ctx.fillRect(sx, sy, wid, height);
        }
    },



    drawGrid:function(rows, cols, xWidths, yHeights, isReset) {
        //初始化二维数组
        var state = new Array();
        var pp=this;

        // 获取画布上下文
        var canvas = document.getElementById('c');
        var ctx = canvas.getContext('2d');

        // 获取画布长宽
        var wid = canvas.offsetWidth;
        var hei = canvas.offsetHeight;


        //初始化行、列的坐标
        var xCoordinate_list = cols; //坐标系上x轴上坐标，应该由后台给出
        var yCoordinate_list = rows; //坐标系上y轴上坐标，应该由后台给出

        //初始化行间距和列间距
        for (var i = 0; i < xCoordinate_list.length; i++) {
            xWidths.push(Math.abs(xCoordinate_list[i + 1] - xCoordinate_list[i]));
        }
        for (var j = 0; j < yCoordinate_list.length; j++) {
            yHeights.push(Math.abs(yCoordinate_list[j + 1] - yCoordinate_list[j]));
        }
        if (isReset == false) {
            pp.drawBoard(wid, hei, xCoordinate_list, yCoordinate_list);
        }
        //             二位数组保存每个格子状态
        //            var state = new Array(yCoordinate_list.length);
        //            for (var y = 0; y <yCoordinate_list.length; ++y) {
        //                state[y] = new Array(xCoordinate_list.length);
        //                        }
        var state = new Array();
        for (var y = 0; y < 100000; ++y) {
            state[y] = new Array();
        }

        //鼠标按下实现记录起始坐标
        var mxStart = 0;
        var myStart = 0;
        var mxEnd = 0;
        var myEnd = 0;
        var gxStart = 0;
        var gyStart = 0;
        var gxEnd = 0;
        var gyEnd = 0;
        var gxStartIndex = 0;
        var gxEndIndex = 0;
        var gyStartIndex = 0;
        var gyEndIndex = 0;
        var color_v = "";
        var cellWidth = 0;
        var cellHeight = 0;

        //画不均匀网格(增加减少行、列)
        $("#drawColLine").click(function () {
            pp.drawColLine = true;
            pp.drawRowLine = false;
            pp.clearColLine = false;
            pp.clearRowLine = false;
            pp.fillGrid = false;

        });
        $("#drawRowLine").click(function () {
            pp.drawRowLine = true;
            pp.drawColLine = false;
            pp.clearColLine = false;
            pp.clearRowLine = false;
            pp.fillGrid = false;
        });

        $("#clearColLine").click(function () {
            pp.drawRowLine = false;
            pp.drawColLine = false;
            pp.clearColLine = true;
            pp.clearRowLine = false;
            pp.fillGrid = false;
        });

        $("#clearRowLine").click(function () {
            pp.drawRowLine = false;
            pp.drawColLine = false;
            pp.clearColLine = false;
            pp.clearRowLine = true;
            pp.fillGrid = false;

        });
        var clearLineType = 0;
        canvas.onmousedown = function (e) {

            //获得起始坐标
            mxStart = e.offsetX;
            myStart = e.offsetY;


            //寻找起点x轴、y轴上的标准坐标
            var startInfo = pp.findCoordinateIndex(xCoordinate_list, yCoordinate_list, mxStart, myStart, 0).split('|');
            gxStart = startInfo[0];
            gxStartIndex = parseInt(startInfo[1]);
            gyStart = startInfo[2];
            gyStartIndex = parseInt(startInfo[3]);

            //                return gx + "|" + gxIndex + "|" + gy + "|" + gyIndex

        }
        canvas.onmouseup = function (e) {
            //获得起始坐标
            var drawStartX = e.offsetX;
            var drawStartY = e.offsetY;
            //画列线,增加了x轴坐标
            if (pp.drawColLine == true && pp.drawRowLine == false && pp.clearColLine == false && pp.clearRowLine == false && pp.fillGrid == false) {
                ctx.moveTo(drawStartX, 0);
                ctx.lineTo(drawStartX, hei);
                xCoordinate_list = pp.changeCoordinate(drawStartX, drawStartY, true, false, 0, undefined, undefined, xCoordinate_list, yCoordinate_list).split('|')[0].split(',');
                ctx.strokeStyle = "black";
                ctx.stroke();
            }
            //画行线，增加了y轴坐标
            if (pp.drawColLine == false && pp.drawRowLine == true && pp.clearColLine == false && pp.clearRowLine == false && pp.fillGrid == false) {
                ctx.moveTo(0, drawStartY);
                ctx.lineTo(wid, drawStartY);
                yCoordinate_list = pp.changeCoordinate(drawStartX, drawStartY, false, true, undefined, 0, undefined, xCoordinate_list, yCoordinate_list).split('|')[1].split(',');
                //                    alert("改变后的yCoordinate_list:" + yCoordinate_list);
                ctx.strokeStyle = "black";
                ctx.stroke();
                //                    alert("yCoordinate_list" + yCoordinate_list);
            }

            //擦除列线，减少x轴坐标（没问题）
            if (pp.drawColLine == false && pp.drawRowLine == false && pp.clearColLine == true && pp.clearRowLine == false && pp.fillGrid == false) {
                //                    alert("原始xCoordinate_list:" + xCoordinate_list);
                var clearXIndex = pp.findCoordinateIndex(xCoordinate_list, yCoordinate_list, drawStartX, drawStartY, 0).split('|')[1]; //找起点坐标（左上角坐标）
                //                    alert("clearXIndex:" + clearXIndex);
                xCoordinate_list_array = pp.changeCoordinate(drawStartX, drawStartY, true, false, 1, undefined, clearXIndex, xCoordinate_list, yCoordinate_list).split('|')[0];
                xCoordinate_list = xCoordinate_list_array.split(',');
                clearLineType = 0;
                //                    alert("减少后xCoordinate_list:" + xCoordinate_list);
                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: "GridJson.ashx",
                    data: { "xCoordinate_list": xCoordinate_list_array, "yCoordinate_list": yCoordinate_list, "clearLineType": clearLineType, "option": "clearLine" }, //clearLine为0为删除列线，1为删除行线
                    success: function (res) {
                        xCoordinate_list = res.editXList;
                        if (res.isClear == "false") {
                            alert(res.amassage);
                        }
                        else {
                            initGrid();
                            alert(res.amassage);
                        }
                    }
                });
            }

            //擦除行线，减少y轴坐标
            if (pp.drawColLine == false && pp.drawRowLine == false && pp.clearColLine == false && pp.clearRowLine == true && pp.fillGrid == false) {
                var clearYIndex = pp.findCoordinateIndex(xCoordinate_list, yCoordinate_list, drawStartX, drawStartY, 0).split('|')[3];
                //                    alert("clearYIndex:" + clearYIndex);
                yCoordinate_list_array = pp.changeCoordinate(drawStartX, drawStartY, false, true, undefined, 1, clearYIndex, xCoordinate_list, yCoordinate_list).split('|')[1];
                yCoordinate_list = yCoordinate_list_array.split(',');
                clearLineType = 1;
                //                    alert("yCoordinate_list:" + yCoordinate_list);
                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: "GridJson.ashx",
                    data: { "xCoordinate_list": xCoordinate_list, "yCoordinate_list": yCoordinate_list_array, "clearLineType": clearLineType, "option": "clearLine" }, //clearLine为0为删除列线，1为删除行线
                    success: function (res) {
                        yCoordinate_list = res.editYList;
                        if (res.isClear == "false") {
                            alert(res.amassage);
                        }
                        else {
                            initGrid();
                            alert(res.amassage);
                        }

                    }
                });
            }

            if (pp.fillGrid == true) {
                //终点坐标
                mxEnd = e.offsetX;
                myEnd = e.offsetY;

                //寻找终点x轴、y轴上的标准坐标(获得的gxEnd，gxStart，gyEnd，gyStart为标准坐标)
                var endInfo = pp.findCoordinateIndex(xCoordinate_list, yCoordinate_list, mxEnd, myEnd, 1).split('|');
                gxEnd = endInfo[0];
                gxEndIndex = parseInt(endInfo[1]); //虽然js为弱类型，但是有时候需要强制转换
                gyEnd = endInfo[2];
                gyEndIndex = parseInt(endInfo[3]);

                cellWidth = Math.abs(gxEnd - gxStart);
                cellHeight = Math.abs(gyEnd - gyStart);
                color_v = pp.selectColor;

                function fill(s, gx, gy) {
                    ctx.fillStyle = s;
                    ctx.fillRect(gx, gy, cellWidth, cellHeight);
                }
                if ((color_v == "" || color_v == undefined) && pp.fillGrid == true) {
                    alert("请选择对应的zone！");
                    return;
                }
                for (var i = gxStartIndex; i < gxEndIndex; i++) //
                {
                    for (var j = gyStartIndex; j < gyEndIndex; j++) {
                        //此处为同色同zone名,也可缓存多色zone，但是以同色zone为一组，一组组记录
                        state[j][i] = { zone: pp.zoneName, yCoordinate: yCoordinate_list[j], xCoordinate: xCoordinate_list[i], color: color_v, isEditBlock: "true" }; //不可以在color后添加其他属性，原因不明
                        pp.zoneStr += "&" + state[j][i].zone;
                        pp.colorStr += "&" + state[j][i].color;
                        pp.xStr += "&" + state[j][i].xCoordinate;
                        pp.yStr += "&" + state[j][i].yCoordinate;
                    }
                }
                pp.colList = xCoordinate_list; //变化后新的x，y标准坐标
                pp.rowList = yCoordinate_list;
                fill(color_v, gxStart, gyStart);
            }
        }
    },

//保存block值
save:function() {
    var pp=this;
    var strLayer = $("#layer option:selected").val();
    var strProperty = $("#phyProperty option:selected").val();
    $.ajax({
        type: "post",
        dataType: "json",
        url: "GridJson.ashx",
        data: { "gridState": pp.zoneStr + "|" + pp.colorStr + "|" + pp.xStr + "|" + pp.yStr + "|" + pp.colList + "|" + pp.rowList, "property": strProperty, "layer": strLayer, "option": "save" },
        success: function (res) {
            if (res) {
                pp.zoneStr = ""; //冲掉画布上原先的值
                pp.colorStr = "";
                pp.xStr = "";
                pp.yStr = "";
                alert("保存成功！")
            }
        },
        error: function () {
            alert("网络传输错误，保存失败！")
        }
    });
},

    //用冒泡排序法对获得的值进行排序
 sort:function(cGetRows) {
    // alert( Object.prototype.toString.call(cGetRows) === "[object Array]");//判断变量是否为数组
    for (var i = 0; i < cGetRows.length - 1; i++) {
        for (var j = 0; j < cGetRows.length - i; j++) //内层循环负责对比相邻的两个数，并把最大的排在后面
        {
            if (cGetRows[j + 1] == undefined || cGetRows[j] == undefined) {
                break;
            }
            var foreNum = parseInt(cGetRows[j].toString(), 10); //使用parseInt必须里面的参数为字符串型的
            var laterNum = parseInt(cGetRows[j + 1].toString(), 10);
            if (foreNum > laterNum) {
                var temp = cGetRows[j]; //此处切记不可以用一个foreNum保存值，它只能传递值，改变foreNum，只是暂时的，并不会实质性的改到cGetRows的数组里的
                cGetRows[j] = cGetRows[j + 1];
                cGetRows[j + 1] = temp;
            }
        }
    }
    return cGetRows;
},

    //去重算法实现字符串中重复的字符
 removeRepeatStr:function(cGetRows) {
    for (var i = 1; i < cGetRows.length - 1; i++) {
        for (var j = i + 1; j < cGetRows.length; j++) {
            if (cGetRows[j] == cGetRows[i]) {
                cGetRows.splice(j, 1); //删除之后，数组长度随之减少
                cGetRows.splice(i, 1); //删除之后，数组长度随之减少
                i--; //后面索引前移
                break;
            }
        }
    }
    return cGetRows;
},

 checkRows:function() {
     var pp=this;
    pp.selectRow = window.event.srcElement.parentElement.parentElement.rowIndex;
    if (pp.selectRow == 0) {
        var c = document.getElementsByName("number"); //形成document.element的数组集合，即使是一个元素也是从0开始索引的数组集合
        for (var i = 1; i <= c.length; i += 1) {
            if (c[0].checked == true) {
                c[i - 1].checked = true; //全选中
            }
            else {
                c[i - 1].checked = false; //取消选中
            }
        }
    }
    else {
        pp.cGetRow += "|" +pp.selectRow;
    }
},

//增加Zone
 addZone:function() {
     var pp=this;
    var strProperty = $("#phyProperty option:selected").val();
    var oTable = document.getElementById("oTable");
    var tBodies = oTable.tBodies;
    var tbody = tBodies[0];
//            $('#paraSettings > tr').remove();

    var tr = tbody.insertRow(tbody.rows.length);
    var td_1 = tr.insertCell(0);
    td_1.innerHTML = '<input type="checkbox" id="number" class="number" name="number" onclick="checkRows()" value="1">'; //在innerHTML中添加标签

    var td_2 = tr.insertCell(1);
    var divContent = document.createElement("div");
    $(divContent).attr("contentEditable", true);
    divContent.className = "zoneName";
    divContent.id = "zone" + pp.rowIndex;
    divContent.innerText = "新建参数";
    td_2.appendChild(divContent);

    var td_3 = tr.insertCell(2);
    var inputColor = document.createElement("input");
    $(inputColor).attr("contentEditable", true);
    inputColor.className = "input_cxcolor";
    inputColor.id = "color" + pp.rowIndex;
    td_3.appendChild(inputColor);

    var td_4 = tr.insertCell(3);
    var divParams = document.createElement("div");
    $(divParams).attr("contentEditable", true);
    divParams.className = "zoneParam";
    divParams.id = "param" + pp.rowIndex;
    if (strProperty == 4) {
        divParams.innerText = "0";
    }
    else if (strProperty == 5) {
        divParams.innerText = "0,0,0,0";
    }
    else {
        divParams.innerText = "0,0,0";
    }
    td_4.appendChild(divParams);
    pp.rowIndex++;
    $(function () {
        zoneName = "";
        $(".zoneParam").click(function () {
            var trHTML = "";
            $('#paraSettings > tr').remove();
//                    alert("被点击");
            switch(strProperty){
                case "1":
                    console.log("气候");
                    trHTML = "<tr><td>风量:</td><td><input type='text' id='input1'></td></tr><tr><td>风荷载:</td><td><input type='text' id='input2'></td></tr><tr><td>暴雨强度:</td><td><input type='text' id='input3'></td></tr>";
                    break;
                case "2":
                    trHTML = "<tr><td>平原比例:</td><td><input type='text' id='input1'></td></tr><tr><td>高原比例:</td><td><input type='text' id='input2'></td></tr><tr><td>盆地比例:</td><td><input type='text' id='input3'></td></tr><tr><td>山地比例:</td><td><input type='text' id='input4'></td></tr><tr><td>丘陵比例:</td><td><input type='text' id='input5'></td></tr>";
                    break;
                case "3":
                    trHTML = "<tr><td>平原比例:</td><td><input type='text' id='input1'></td></tr><tr><td>高原比例:</td><td><input type='text' id='input2'></td></tr><tr><td>盆地比例:</td><td><input type='text' id='input3'></td></tr><tr><td>山地比例:</td><td><input type='text' id='input4'></td></tr><tr><td>丘陵比例:</td><td><input type='text' id='input5'></td></tr>";
                    break;
                case "4":
                    trHTML = "<tr><td>陆生动物比例:</td><td><input type='text' id='input1'></td></tr><tr><td>水生动物比例:</td><td><input type='text' id='input2'></td></tr><tr><td>飞禽类动物比例:</td><td><input type='text' id='input3'></td></tr><tr><td>两栖类动物比例:</td><td><input type='text' id='input4'></td></tr>";
                    break;
                case "5":
                    trHTML = "<tr><td>草比例:</td><td><input type='text' id='input1'></td></tr><tr><td>桦树比例:</td><td><input type='text' id='input2'></td></tr><tr><td>松树比例:</td><td><input type='text' id='input3'></td></tr>";
                    break;
                case "6":
                    trHTML = "<tr><td>平原比例:</td><td><input type='text' id='input1'></td></tr><tr><td>高原比例:</td><td><input type='text' id='input2'></td></tr><tr><td>盆地比例:</td><td><input type='text' id='input3'></td></tr><tr><td>山地比例:</td><td><input type='text' id='input4'></td></tr><tr><td>丘陵比例:</td><td><input type='text' id='input5'></td></tr>";
                    break;
                case "7":
                    trHTML = "<tr><td>渗透系数x:</td><td><input type='text' id='input1'></td></tr><tr><td>渗透系数y:</td><td><input type='text' id='input2'></td></tr><tr><td>渗透系数z:</td><td><input type='text' id='input3'></td></tr><tr><td>所含物质种类:</td><td><input type='text' id='input4'></td></tr><tr><td>所含物质比例:</td><td><input type='text' id='input5'></td></tr>";
                    break;
                defalut:
                    trHTML = "<tr><td>渗透系数x:</td><td><input type='text' id='input1'></td></tr><tr><td>渗透系数y:</td><td><input type='text' id='input2'></td></tr><tr><td>渗透系数z:</td><td><input type='text' id='input3'></td></tr><tr><td>所含物质种类:</td><td><input type='text' id='input4'></td></tr><tr><td>所含物质比例:</td><td><input type='text' id='input5'></td></tr>";
                    break;
            }
            $("#paraSettings").append(trHTML);
            $("#myModal").modal("toggle");
        });
        $('.input_cxcolor').bind('change', function () {
            console.log("color");
            pp.selectColor = this.value;
            pp.zoneName = document.getElementById("zone" + (pp.rowIndex - 1)).innerText;
            $("#zoneCurrentColor").css("background-color", pp.selectColor);
            $("#lbZone")[0].innerText = zoneName;
            $("#zoneCurrentColor").removeAttr("placeholder");
        });
        $('.input_cxcolor').eq(-1).cxColor(function (api) {
        });
        $('#zoneBody tr').bind("click", function () {
            pp.drawColLine = false;
            pp.drawRowLine = false;
            pp.fillGrid = true;
            pp.selectRow = window.event.srcElement.parentElement.parentElement.rowIndex;
            pp.selectColor = $(".input_cxcolor").eq(pp.selectRow - 1).css("background-color");
            pp.zoneName = $(".zoneName").eq(pp.selectRow - 1)[0].innerText;
            if (pp.selectRow == 0 || pp.selectRow == 1) {
                $("#lbZoneAlert")[0].innerText = "系统默认zone不可选！";
                $("#lbZoneAlert").css("color", "red");
                setTimeout(function () { $("#lbZoneAlert")[0].innerText = ''; }, 5000);
                return;
            }
            $("#lbZoneAlert")[0].innerText = "进入录入状态！";
            $("#lbZoneAlert").css("color", "blue");
            setTimeout(function () { $("#lbZoneAlert")[0].innerText = ''; }, 5000);
            $("#zoneCurrentColor").css("background-color", pp.selectColor);
            $("#lbZone")[0].innerText = zoneName;
            $("#zoneCurrentColor").removeAttr("placeholder");
        });
    });
},

//移除单个Zone
 removeZone:function() {
   var pp=this;
    var tb = document.getElementById("oTable");
    var strProperty = $("#phyProperty option:selected").val();
    var deleteZoneNames = $(".zoneName").eq(pp.rowIndex - 1)[0].innerText + "&";
    //            alert(deleteZoneNames);
    $.ajax({
        url: 'GridJson.ashx',
        data: { "property": strProperty, "deleteZoneNames": deleteZoneNames, "option": "deleteZone", "deleRowIndex": pp.rowIndex },
        dataType: 'json',
        type: "GET",
        success: function (res) {
            var deleZones = res.deleteIndex;
            if (deleZones == "") {
                $("#lbZoneAlert")[0].innerText = "已启用zone不可删！";
                $("#lbZoneAlert").css("color", "red");
                setTimeout(function () { $("#lbZoneAlert")[0].innerText = ''; }, 5000);
                $(".number").attr("checked", false);
                return;
            }
            for (var i = 0; i < deleZones.length; i++) {
                if (res.state[i] == "true") {
                    if (pp.rowIndex == 0) {
                        return; //th标题不可以删除
                    }
                    tb.deleteRow(pp.rowIndex);
                    pp.rowIndex--;
                }
            }
            $("#lbZoneAlert")[0].innerText = res.amessage;
            $("#lbZoneAlert").css("color", "green");
            setTimeout(function () { $("#lbZoneAlert")[0].innerText = ''; }, 5000);
        }
    });
    deleteZoneNames = ""; //用完要冲掉旧值
},

 //移除多个Zone
 removeZones:function() {
     var pp=this;
    var strProperty = $("#phyProperty option:selected").val();
    var tb = document.getElementById("oTable");
    var deledRow = 0;
    var cGetRowSingle = 0;
    var deleteZoneNames = "";
    var deleteRowIndex = "";
    var deleteResult = "";



    //获得删除全部的zoneNames
    if (pp.selectRow == 0) { //选中第0行
        for (var i = 1; i <= pp.rowIndex; i++) {
            deleteRowIndex += i + "&";
            deleteZoneNames += $(".zoneName").eq(i - 1)[0].innerText + "&";
        }
    }

    else {
        var cGetRows = pp.cGetRow.split('|');
        cGetRows =pp.removeRepeatStr(cGetRows);
        cGetRows = pp.sort(cGetRows);
        for (var i = 1; i < cGetRows.length; i++) {
            deleteRowIndex += cGetRows[i] + "&";
            deleteZoneNames += $(".zoneName").eq(cGetRows[i] - 1)[0].innerText + "&";
        }
    }
    $.ajax({
        url: 'GridJson.ashx',
        data: { "property": strProperty, "deleteZoneNames": deleteZoneNames, "option": "deleteZone", "deleRowIndex": deleteRowIndex },
        dataType: 'json',
        type: "GET",
        success: function (res) {
            var deleZones = res.deleteIndex;
            if (deleZones == "") {
                $("#lbZoneAlert")[0].innerText = "已启用zone不可删！";
                $("#lbZoneAlert").css("color", "red");
                setTimeout(function () { $("#lbZoneAlert")[0].innerText = ''; }, 5000);
            }
            else {
                for (i = 0; i < deleZones.length; i++) {
                    cGetRowSingle = deleZones[i] - deledRow;
                    ++deledRow; //已经删行数
                    tb.deleteRow(cGetRowSingle); //删除第几行
                }
               pp.rowIndex = pp.rowIndex - deledRow;
                $("#lbZoneAlert")[0].innerText = "仅" + res.deleteZones + "可删除！其余已启用";
                $("#lbZoneAlert").css("color", "orange");
                setTimeout(function () { $("#lbZoneAlert")[0].innerText = ''; }, 5000);
                //                        alert("删除" + res.deleteZones + "成功！" + ";" + "其余zone已启用" + "," + "无法删除！");
            }
            $(".number").attr("checked", false);
        }
    });
    pp.selectSum = 0;
    pp.cGetRow = 0;
    deleteZoneNames = "";
    deleteRowIndex = "";

},

 //保存Zone
saveZone:function() {//点了save后zone不可修改，同时页面上的不可改还没有实现
    var pp=this;
    var strProperty = $("#phyProperty option:selected").val();
    pp.zoneName = "";
    pp.selectColor = "";
    var zoneParam = "";
    for (var i = 1; i < pp.rowIndex; i++) {
        var singleZoneName = $(".zoneName").eq(i)[0].innerText;
        var singleZoneColor = $(".input_cxcolor").eq(i).val();
        var singleZoneParam = $(".zoneParam").eq(i)[0].innerText;
        if (singleZoneName == undefined || singleZoneName == null) {
            continue;
        }
        pp.zoneName += singleZoneName + "|"; //将特殊符号放在后面，可以将空引号永远都在数组的最后一个位置
        pp.selectColor += singleZoneColor + "|";
        zoneParam += singleZoneParam + "|";
    }
    $.ajax({
        url: 'GridJson.ashx',
        data: { "zoneName": pp.zoneName, "zoneColor": pp.selectColor, "zoneParam": pp.zoneParam, "property": strProperty, "option": "saveZone" },
        dataType: 'json',
        type: "GET",
        success: function (res) {
            $("#lbZoneAlert")[0].innerText = "保存成功！";
            $("#lbZoneAlert").css("color", "green");
            setTimeout(function () { $("#lbZoneAlert")[0].innerText = ''; }, 5000);
            pp.selectColor = "";
            $("#zoneCurrentColor").css("background-color", pp.selectColor);
            $("#lbZone")[0].innerText = "";
            $("#zoneCurrentColor").attr("placeholder", "please choose zone");
        }
    });
},


//参数提交
paraSubmit:function() {
    var pp=this;
    var paramString = "";
    var strProperty = $("#phyProperty option:selected").val();
    if (strProperty == 4) {
        paramString = $("#inithead").val();
    }
    else if (strProperty == 5) {
        paramString = $("#ss").val() + "," + $("#sy").val() + "," + $("#eff").val() + "," + $("#tot").val();
    }
    else {
        paramString = $("#input1").val() + "," + $("#input2").val() + "," + $("#input3").val();
    }

    $(".zoneParam").eq(pp.rowIndex - 1).text(paramString);
    $('#paraSettings > tr').remove();
    $("#myModal").modal("toggle");
}




}




