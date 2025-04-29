let width = 64;
let height = 128;

let mode = "draw";//"keshigomu"
let drawWidth = 1;
let keshigomuWidth = 1;

let canvases = [];
let canvasSuu = 0;//canvas追加時に増加
let junban = [];//canvasesは新しく追加したcanvasが後に入る。表示している順番をこの配列で保存する。ただしcanvasesのindex+1であるcanvas.idの配列になる。canvasが撤去された場合、nullに置き換わる。

const prevewCanvas = $("prevewCanvas");
prevewCanvas.width = 0;
prevewCanvas.height = 0;
const prevewCtx = prevewCanvas.getContext("2d");
let prevewFrameRate = 0.25;
let isPrevew = false;
let prevewFrame = 0;

let sukashiMaisuu = 0;

function $(id){
  return document.getElementById(id);
}

function objCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

$("canvasSizeChangeButton").onclick=()=>{
  let con = window.confirm("注意:キャンバスサイズを狭めることで、はみ出た部分のデータは消えてしまいます。よろしいですか?");
  if(con == false)return;
  width = Number( $("canvasSizeInputW").value );
  height = Number( $("canvasSizeInputH").value );
  for (var i = 0; i < canvases.length; i++) {
    canvases[i].sizeChange();
  }
};

$("drawModeButton").onclick = ()=>{
  mode = "draw";
  $("drawModeButton").style.background = "gray";
  $("keshigomuModeButton").style.background = "white";
};
$("keshigomuModeButton").onclick = () => {
  mode = "keshigomu";
  $("drawModeButton").style.background = "white";
  $("keshigomuModeButton").style.background = "gray";
};

$("drawRangeInput").addEventListener("change",()=>{
  drawWidth = $("drawRangeInput").value;
  $("drawRangeSpan").innerText = drawWidth;
});
$("keshigomuRangeInput").addEventListener("change", () => {
  keshigomuWidth = $("keshigomuRangeInput").value;
  $("keshigomuRangeSpan").innerText = keshigomuWidth;
});
$("frameRateInput").addEventListener("change", () => {
  prevewFrameRate = $("frameRateInput").value;
  $("frameRateSpan").innerText = prevewFrameRate;
});
$("sukashiInput").addEventListener("change", () => {
  sukashiMaisuu = $("sukashiInput").value;
  $("sukashiSpan").innerText = sukashiMaisuu;
  for (var i = 0; i < canvases.length; i++) {
    canvases[i].sizeChange();
  };
});

function prevew(){
  if(isPrevew == true){
    isPrevew = false;
    return;
  }
  let _imgDatas = [];
  for (var i = 0; i < canvases.length; i++) {
    let _data = canvases[i].ctx.getImageData(0,0,width,height);
    _imgDatas.push(_data);
  }
  if(_imgDatas.length == 0)return;
  isPrevew = true;
  prevewFrame = 0;
  prevewCanvas.width = width;
  prevewCanvas.height = height;
  let _interval = setInterval(()=>{
    if(isPrevew == false){
      clearInterval(_interval);
      prevewCanvas.width = 0;
      prevewCanvas.height = 0;
    }
    prevewFrame++;
    prevewCtx.putImageData(_imgDatas[Math.floor(prevewFrame % _imgDatas.length)], 0, 0, 0, 0, width, height);
    
  },1000*prevewFrameRate);
}

/*
function setSukashi(){
  isPrevew = false;
  prevewCanvas.width = 0;
  let _canvases = [];
  let _canvasImageDatas = [];
  for (var i = 0; i < junban.length; i++) {
    if(junban[i] == null)continue;
    let num = Number(i + "");
    _canvases.push(canvases[junban[num] -1]);
    canvases[junban[num] -1].sukashiData = [];
    _canvasImageDatas.push(canvases[junban[num] -1].ctx.getImageData(0,0,width,height));
  }
  
  function getDataChangeImage(data,color = "red",opacity){
    //let _data = objCopy(data);
    let _data = data;
    for (var i = 0; i < _data.width*_data*height.length*4; i++) {
      let _target = _data.data[i];
      if(i%4 == 0){//r
        if(color != "red")_data.data[i] = 0;
      }
      if (i % 4 == 1) { //g
        if (color != "green") _data.data[i] = 0;
      }
      if (i % 4 == 2) { //b
        if (color != "blue") _data.data[i] = 0;
      }
      if (i % 4 == 3) { //a
        if (_target != 0) _data.data[i] = Math.floor(255 * opacity);
      }
    }
    prevewCanvas.width = width;
    prevewCanvas.height = height;
    prevewCtx.putImageData(_data);
    let img = new Image();
    img.src = prevewCanvas.toDataUrl("image/png");
    return img;
  }
  
  let canvasIndexMax = _canvases.length -1;
  
  if(sukashiMaisuu >= 1){
    for (var i = 0; i < _canvasImageDatas.length; i++) {
      if(i >= 1)_canvases[i].sukashiData.push(dataChange(_canvasImageDatas[i-1],"blue",0.6));
      if(i <= canvasIndexMax -1)_canvases[i].sukashiData.push(dataChange(_canvasImageDatas[i+1],"red",0.6));
    }
  }
  if (sukashiMaisuu >= 2) {
    for (var i = 0; i < _canvasImageDatas.length; i++) {
      if (i >= 2) _canvases[i].sukashiData.push(dataChange(_canvasImageDatas[i - 2],"blue",0.4));
      if (i <= canvasIndexMax -2) _canvases[i].sukashiData.push(dataChange(_canvasImageDatas[i + 2],"red",0.4));
    }
  }
  if (sukashiMaisuu >= 3) {
    for (var i = 0; i < _canvasImageDatas.length; i++) {
      if (i >= 3) _canvases[i].sukashiData.push(dataChange(_canvasImageDatas[i - 3], "blue", 0.2));
      if (i <= canvasIndexMax - 3) _canvases[i].sukashiData.push(dataChange(_canvasImageDatas[i + 3], "red", 0.2));
    }
  }
  
}

function sukashiOn(){
  
}

function sukashiOff() {
  
}

*/


class Canvas{
  constructor(index){
    this.index = index;
    this.id = canvasSuu +1;
    this.left = index*width;
    this.createCanvas(index);
    this.canvas = $("canvas_" + (canvasSuu+1));
    this.ctx = this.canvas.getContext("2d");
    this.L2canvas = $("canvasL2_" + (canvasSuu + 1));
    this.L2ctx = this.L2canvas.getContext("2d");
    this.L1canvas = $("canvasL1_" + (canvasSuu + 1));
    this.L1ctx = this.L1canvas.getContext("2d");
    this.R2canvas = $("canvasR2_" + (canvasSuu + 1));
    this.R2ctx = this.R2canvas.getContext("2d");
    this.R1canvas = $("canvasR1_" + (canvasSuu + 1));
    this.R1ctx = this.R1canvas.getContext("2d");
    
    this.drawing = false;
    this.lastXY = {x:0,y:0};//消しゴム時に使用
    
    this.sukashiData = [];
    
    // タッチしたときに描画開始
    this.canvas.addEventListener('touchstart', (e) => {
      var x = 0, y = 0;
      const offset = this.canvas.getBoundingClientRect();
    	x = event.changedTouches[0].pageX;
      y = event.changedTouches[0].pageY;
      x = x - offset.left - window.pageXOffset;
      y = y - offset.top - window.pageYOffset;
      this.drawing = true;
      if(mode == "draw"){
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
      }else if(mode == "keshigomu"){
        this.lastXY.x=x;
        this.lastXY.y=y;
        this.kesu(x,y);
      }
      this.allCanvaUpdate();
    });

    // 動かしている間、線を描く
    this.canvas.addEventListener('touchmove', (e) => {
      if (!this.drawing) return;
      var x = 0, y = 0;
      const offset = this.canvas.getBoundingClientRect();
    	x = event.changedTouches[0].pageX;
      y = event.changedTouches[0].pageY;
      x = x - offset.left - window.pageXOffset;
      y = y - offset.top - window.pageYOffset;
      event.preventDefault();
      this.ctx.lineTo(x, y);
      if(mode == "draw"){
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = drawWidth;
        this.ctx.stroke();
      }else if(mode == "keshigomu"){
        let points = [[x,y]];
        points.push([(x + this.lastXY.x)/2,(y+this.lastXY.y)/2]);
        points.push([(points[1][0] + this.lastXY.x)/2,(points[1][1] +this.lastXY.y)/2]);
        points.push([(points[1][0] + x)/2,(points[1][1] +y)/2]);
        points.push([(points[2][0] + this.lastXY.x)/2,(points[2][1] +this.lastXY.y)/2]);
        points.push([(points[1][0] + points[2][0])/2,(points[1][1] +points[2][1])/2]);
        points.push([(points[1][0] + points[3][0])/2,(points[1][1] +points[3][1])/2]);
        points.push([(points[0][0] + points[2][0])/2,(points[0][1] +points[2][1])/2]);
        for (var i = 0; i < points.length; i++) {
          this.kesu(points[i][0],points[i][1]);
        }
        this.lastXY.x = x;
        this.lastXY.y = y;
      }
      this.allCanvaUpdate();
      
    },
    { passive: false }
    );

    // 離したら描画終了
    this.canvas.addEventListener('touchend', () => {
      this.ctx.closePath();
      this.drawing = false;
    });
  }
  
  kesu(x,y){
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.arc(x, y, keshigomuWidth, 0, 2 * Math.PI);
      this.ctx.clip()
      this.ctx.clearRect(0, 0, width, height);
      this.ctx.closePath();
      this.ctx.restore();
    
  }
  
  allCanvaUpdate(){
    let _canvasArr = ["L2","L1","R2","R1"];
    for (var i = 0; i < 4; i++) {
      let _d = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
      for (var j = 0; j < _d.width * _d.height * 4; j += 4) {
        if(_d.data[j+3] == 0)continue;
        if(i <= 1){
          _d.data[j] = 0;
          _d.data[j+1] = 0;
          _d.data[j+2] = 255;
        }
        if(i >= 2){
          _d.data[j] = 255;
          _d.data[j+1] = 0;
          _d.data[j+2] = 0;
        }
        if(i % 2 == 0 ){
          _d.data[j+3] = Math.floor(225 * 0.2);
        }
        if (i % 2 == 1 ) {
          _d.data[j+3] = Math.floor(225 * 0.4);
        }
      }
      this[_canvasArr[i] + "ctx"].putImageData(_d,0,0);
    }
    
    
  }
  
  createCanvas(id =0){
    //押したボタンの右に,canvasと撤去ボタンと追加ボタンを作成。
    //それらのidの末尾はlastButtonValue +1。
    //canvasは末尾1からとなる。
    let div = document.getElementById("canvasDiv");
    div.style.height = height + 50 + "px";
    let canvasArr = ["L2","L1","","R1","R2"];
    for (var i = 0; i < canvasArr.length; i++) {
      let ca = document.createElement("canvas");
      ca.style.position = "absolute";
      ca.width = width;
      ca.height = height;
      ca.style.left = this.left + width*i + "px";
      ca.id = "canvas" + canvasArr[i] + "_" + (canvasSuu + 1);
      if(sukashiMaisuu == 1 && (i==0 || i== 4))ca.style.visibility = "hidden";
      if(sukashiMaisuu == 0 && i!=2)ca.style.visibility = "hidden";
      if(i == 2)div.appendChild(ca);
      if(i!= 2)div.prepend(ca);
    }
    
    
    /*
    let bu = document.createElement("button");
    bu.id = "addCanvasButton" + (lastButtonValue + 1);
    bu.value = lastButtonValue + 1;
    bu.onclick = addCanvas;
    bu.textContent = "→追加";
    bu.style.position = "absolute";
    bu.style.left = 50 + "px";
    bu.style.top = 0 + "px";
    $("canvas" + (lastButtonValue + 1)).after(bu);
    let bu2 = document.createElement("button");
    bu2.id = "removeCanvasButton" + (lastButtonValue +1);
    bu2.value = lastButtonValue +1;
    bu2.onclick = removeCanvas;
    bu2.textContent = "↓撤去";
    bu2.style.position = "absolute";
    bu2.style.left = 0 + "px";
    bu2.style.top = 0 + "px";
    $("canvas" + (lastButtonValue+1) ).after(bu2);
    */
    
  }
  
  sizeChange(){
    document.getElementById("canvasDiv").style.height = height + 50 + "px";
    let _data = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
    let _w = this.canvas.width;
    let _h = this.canvas.height;
    this.left = width * this.index;
    let _canvases = [this.L2canvas,this.L1canvas,this.canvas,this.R1canvas,this.R2canvas];
    for (var i = 0; i < _canvases.length; i++) {
      _canvases[i].width = width;
      _canvases[i].height = height;
      _canvases[i].style.left = this.left + width * i + "px";
      if(sukashiMaisuu == 1 && (i == 0 || i == 4))_canvases[i].style.visibility = "hidden";
      if(sukashiMaisuu == 1 && (i != 0 && i != 4))_canvases[i].style.visibility = "";
      if(sukashiMaisuu == 0 && i !=2)_canvases[i].style.visibility = "hidden";
      if(sukashiMaisuu == 2)_canvases[i].style.visibility = "";
    }
    
    this.ctx.putImageData(_data,0,0,0,0,_w,_h);
    this.allCanvaUpdate();
  }
  /*
  drawSukashi(){
    let _data = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
    for (var i = 0; i < this.sukashiData.length; i++) {
      this.ctx.putImageData(this.sukashiData[i],0,0,0,0,width,height);
    }
    this.ctx.putImageData(_data,0,0,0,0,width,height);
  }
  */
  /*
  removeSukashi(){
    let _data = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
    for (var i = 0; i < _data.width * _data.height * 4; i+=4) {
      if(_data.data[i] == _data.data[i+1] && _data.gata[i] == _data.data[i+2] && _data.data[i] == _data.data[i+3] ){
        //なにもしない
      }else{
        _data.data[i] = 0;
        _data.data[i+1] = 0;
        _data.data[i+2] = 0;
        _data.data[i+3] = 0;
      }
    }
    this.ctx.putImageData(_data,0,0,0,0,width,height);
  }
  */
}



function addCanvas(event){
  let v = canvasSuu;
  let _c = new Canvas(v);
  canvases.push(_c);
  /*
  if(v!= 0)junban.splice(junban.indexOf(v)+1,0,canvasSuu+1);
  if(v== 0)junban.splice(0,0,canvasSuu+1);
  */
  canvasSuu++;
  
}
/*
function removeCanvas(event){
  let v = Number(event.target.value);
  canvases[junban.indexOf(v -1)] = null;
  junban[junban.indexOf(v)] = null;
  $("canvas" + v).remove();
  $("addCanvasButton" + v).remove();
  $("removeCanvasButton" + v).remove();
}
*/
function dl1(){
  let con = window.confirm("ダウンロードしますか?");
  if(con == false)return;
  let _n = $("hozonNumberInput").value;
  if(_n <= 0 || _n > canvases.length || _n == "")return;
  
  
    let a = document.createElement("a");
    a.href = canvases[_n -1].canvas.toDataURL("image/png", 1);
    let _name = "animation_" + _n;
    a.download = _name + ".png";
    a.click();
  
  
}
