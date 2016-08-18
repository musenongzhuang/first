// 横向与纵向的格子数量
var row = 10;
var col = 20;
//var size = 20;

// 获取画布上下文
var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
// 获取画布长宽
var wid=canvas.offsetWidth;
var hei=canvas.offsetHeight;
// 计算格子大小
var cell_width = ~~ (wid / col);
var cell_height = ~~ (hei / row);

// 二位数组保存每个格子状态
var state = new Array(row);
for (var y = 0; y < row; ++y) {
    state[y] = new Array(col);
}


// 画网格
function drawBoard(w,h,c_width,c_height){
    for (var x = 0; x <= w; x += c_width) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
    }


    for (var x = 0; x <= h; x += c_height) {
        ctx.moveTo(0,  x);
        ctx.lineTo(w, x);
    }
    ctx.strokeStyle = "black";
    ctx.stroke();
}
drawBoard(wid,hei,cell_width,cell_height);
//使用颜色选择插件
$('#colorpickerHolder2').ColorPicker({
    flat: true,
    color: '#00ff00',
    onSubmit: function(hsb, hex, rgb) {
        $('#colorSelector2 div').css('backgroundColor', '#' + hex);
    }
});
var widt = false;
$('#colorSelector2').bind('click', function() {
    $('#colorpickerHolder2').stop().animate({height: widt ? 0 : 173}, 500);
    widt = !widt;
});
$('#colorpickerHolder2>div').css('position', 'absolute');

// 鼠标点击事件
$(canvas).click(function(e) {

    // 填充颜色
    function fill(s, gx, gy) {
        ctx.fillStyle = s;
        ctx.fillRect(gx * cell_width, gy * cell_height, cell_width, cell_height);
    }

    // 获得鼠标位置
    var mx = e.offsetX;
    var my = e.offsetY;

    // 计算网格位置
    var gx = ~~ (mx / cell_width);
    var gy = ~~ (my / cell_height);

    // 如果鼠标点击的位置出格
    if (gx < 0 || gx >= col || gy < 0 || gy >= row) {
        return;
    }
    var color_v = $('#colorSelector2 div').css('backgroundColor');
    if (state[gy][gx] != undefined) {
//        fill('blue', gx, gy);
//        setTimeout(function() {
//            fill(color_v, gx, gy)
//        }, 1000);
        alert(state[gy][gx].zone);
    }
    state[gy][gx] = {zone:1,color:color_v};
    fill(color_v, gx, gy);
});