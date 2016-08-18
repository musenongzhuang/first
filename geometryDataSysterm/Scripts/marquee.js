

var beginX;
var beginY;
var drawable;
var canvas = document.getElementById('c');
function beforeDrawDashedBox(){

    drawable=true;
    beginX=event.clientX;
    beginY=event.clientY;
    canvas.style.cursor="crosshair";
    }
function getDashedBox(){
    var dashedBox=document.getElementById("dashedBox");
    return dashedBox;
    }
function clearDashedBox(){
    if(getDashedBox()!=null){
    document.body.removeChild(getDashedBox());
    }
    }
function drawBox(top,right,buttom,left){
    var relLeft=left<right?left:right;
    var relTop=top<buttom?top:buttom;
    var relWidth=Math.abs(right-left);
    var relHeight=Math.abs(buttom-top);

    var divEl=document.createElement("div");
    divEl.id="dashedBox";
    divEl.style.position="absolute";
    // divEl.style.border="1px black dashed";
    divEl.style.left=relLeft+"px";
    divEl.style.backgroundColor = " rgba(255,255,0,0.5)"; //透明框
    divEl.style.filter="alpha(opacity=10)";
    divEl.style.top=relTop+"px";//不能只有relWidth，必须加上单位
    divEl.style.width=relWidth+"px";
    divEl.style.height=relHeight+"px";
    document.body.appendChild(divEl);
    }
function inDrawDashedBox(){
    if(drawable==true){
    clearDashedBox();
    drawBox(beginY,beginX,event.clientY,event.clientX);
    }
    }
function afterDrawDashedBox(){
    drawable=false;
    clearDashedBox();
    canvas.style.cursor="default";
    }
function loadDashdBoxFn (){
    document.onmousedown=beforeDrawDashedBox;
    document.onmousemove=inDrawDashedBox;
    document.onmouseup=afterDrawDashedBox;
}