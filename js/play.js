//获取绘画canvas
var canvas = $('#canvas')[0]; //JQ得到是一个数组
var cxt = canvas.getContext("2d");



//-------------设置关卡--------
var level;
if(parseInt(window.location.href.split("#")[1])){
	level = parseInt(window.location.href.split("#")[1]);
}else{
	level = 1;
}


//设置七个关卡的参数
//-------initNum：转动球数量；waitNum：等待球数量；speed：转动速度-----------
var levelArray = [
    {"initNum":4, "waitNum":10, "speed":95, "backgroundColor":"#f2f5fa"},
    {"initNum":5, "waitNum":10, "speed":90, "backgroundColor":"#8cc613"},  
    {"initNum":6, "waitNum":10, "speed":85, "backgroundColor":"orange"},
    {"initNum":7, "waitNum":8, "speed":80, "backgroundColor":"yellow"},
    {"initNum":8, "waitNum":8, "speed":75, "backgroundColor":"#fca453"},  
    {"initNum":9, "waitNum":7, "speed":70, "backgroundColor":"#dd4f43"},
    {"initNum":10, "waitNum":6, "speed":60, "backgroundColor":"red"}
];


//取本关卡的背景色
var background = levelArray[level-1].backgroundColor;
//----------------------------------设置中间大球---------------------
var centerX = 300;//大圆圆心x坐标
var centerY = 200;//大圆圆心y坐标
var centerRiuds = 50;//大圆半径

//-----------------------------------绘制中间大球---------------------
function big(){
	$('#canvas').css("background-color",background);
	// $('#canvas').css({"background-color":"red"});  这种设置也行
	cxt.save();
	cxt.beginPath();
	cxt.arc(centerX, centerY, centerRiuds, 0, Math.PI * 2, true);
	cxt.closePath();
	cxt.fillStyle = "#88d0ff";
	cxt.fill();

	cxt.beginPath();
	cxt.arc(centerX, centerY, 30, 0, Math.PI * 2, true);
	cxt.closePath();
	cxt.fillStyle = "white";
	cxt.fill();
	//---------------------------------绘制大球中间关卡数----------------- 
	var txt = (level) + ""; //加上空字符串，将数字转换成字符串
	cxt.textAlign = "center";
	cxt.textBaseline = "middle";
	cxt.font = "bold 50px sans-serif";
	cxt.fillStyle = "#EED5B7";
	cxt.fillText(txt, centerX, centerY);  
	cxt.restore();
}


//设置小圆半径，转动圆和等待圆
var ballRadius = 10;

//----------------------------设置转动球---------------------
var runballs = []; //转动球
var runballnum = levelArray[level-1].initNum;//设置转动球数组长度
var lineLen = 130;//设置大球圆心与转动球之间的距离
//设置转动数组添加旋转角度
for(var i=0;i<runballnum;i++){
	var angle = (360/runballnum)*(i+1);
	runballs.push({"angle":angle,"numStr":i+1, "isNew": 0});  
	//向转动球数组中添加两个属性，角度，编号（默认空）
	//比如第一关3个球，这三个的角度分别是 120,240,360
}

//---------------------------- 绘制转动球--------------------
function drawRunBall(deg){
	//转动球数组进行遍历，并绘画处理
	runballs.forEach(function(e) { //遍历绘制runball数组所有小球
		cxt.save();
		cxt.globalCompositeOperation = "destination-over";//设置图形组合，原图之下绘制新图
		e.angle = e.angle+deg; 
		//定时器按关卡等级的速度每次加10度，就有转动的效果
		//初始化时，deg是0
		if(e.angle>=360){
			e.angle = 0;
		}

		//绘制大球小球之间的线段
		cxt.moveTo(centerX, centerY); //起点是原心的坐标
		//比如第一关，静态初始化第一个球角度120，角度转换成PI的形式
		var rad = 2 * Math.PI * e.angle / 360; 
		//第一个球的x坐标取cos，y坐标取sin
		var x = centerX + lineLen * Math.cos(rad);
		var y = centerY + lineLen * Math.sin(rad);
		cxt.lineTo(x, y); //线段终点坐标
		//新插入的小球，保留原来的蓝色，旧的元素还是黑色
		cxt.strokeStyle =  (e.isNew > 0 ?  "#88d0ff" : "black");
		cxt.stroke();
		cxt.restore();

		//绘制线段终点的小球，用xy坐标
		cxt.beginPath();
		cxt.arc(x, y, ballRadius, 0, Math.PI * 2, true);
		cxt.closePath();
		cxt.fillStyle =  (e.isNew > 0 ?  "#88d0ff" : "black");
		cxt.fill();
		if(e.numStr!="") { //运动球也给个编号，调试方便
			cxt.textAlign = "center";
			cxt.textBaseline = "middle";
			cxt.font = "12px sans-serif";
			cxt.fillStyle = "#fff";
			cxt.fillText(e.numStr, x, y);  
		}
		
	});
}


//----------------------设置等待球---------------------
var waitballs = []; //等待球
var waitOffset = 260;//设置等待球距离上方的距离，大于圆心y值200
var waitballlen = levelArray[level-1].waitNum;//设置等待球数组长度
//设置等待球数组添加数字文本
for(var i=waitballlen;i>0;i--){
	waitballs.push({"angle":"","numStr":i, "isNew": 1});
	 //i递减，所以等待求数字从大到小
}

//----------------------绘制等待球---------------------
var waitx = centerX;//绘制等待球的X坐标，原心坐标
var waity = waitOffset + lineLen;//绘制等待球的Y坐标

function drawWaitBall(){
	// cxt.fillStyle="red";
	// cxt.fillRect(0,350,400,350); 找到等待球的区域
	cxt.clearRect(0,345,900,400);   //因为游戏中要重绘等待区，所以必须清空
	waitballs.forEach(function(e) {
		cxt.beginPath();
		cxt.arc(waitx, waity, ballRadius, 0, Math.PI * 2, true);
		cxt.closePath();
		cxt.fillStyle = "#88d0ff";
		cxt.fill();
		//等待球编号
		if(e.numStr!="") { 
			cxt.textAlign = "center";
			cxt.textBaseline = "middle";
			cxt.font = "12px sans-serif";
			cxt.fillStyle = "#fff";
			cxt.fillText(e.numStr, waitx, waity);  
		}
		waity += 3 * ballRadius; 
		//下一个等待球圆心到上一个等待球圆心，每次y坐标加3倍的小圆半径
	});
}



//--------------------初始化所有内容--------------------
function init(deg){
	cxt.clearRect(0,0,600,700);  //清空全部画布
	big();  //绘制中间大球
	drawRunBall(deg);  //初始化转动球，偏移角度为0
	drawWaitBall();  //初始化等待球
}
init(0);


//---------------------让转动球runball动起来，并判断是否闯关成功----------------------------
setInterval(function(){
	cxt.clearRect(0,0,600,345);  //每次清空转动球区域
	big();  //绘制中间大球
	drawRunBall(10);  //每次让转动球，顺时针加10度
 
 	if(state==0){
		alert("  (╥╯^╰╥)   (╥╯^╰╥)  闯关失败   (╥╯^╰╥)   (╥╯^╰╥)");
		window.location.href = "index.html#"+level;
	}else if(state==1){
		alert("ヾ(✿ﾟ▽ﾟ)ノ  ヾ(✿ﾟ▽ﾟ)ノ  闯关成功     ヾ(✿ﾟ▽ﾟ)ノ  ヾ(✿ﾟ▽ﾟ)ノ");
		level++;
		window.location.href = "index.html#"+level;
	}
},levelArray[level-1].speed);   //循环的时间取决于关卡等级



//-------------------点击添加---------------------------
var state;//用于成功或失败
//canvas的点击事件
canvas.onclick = function(){   
	if(waitballs.length==0) return;  //没有等待球，return不执行这个点击事件

	var ball = waitballs.shift();//等待球顶部移除一个，并将其返回
	ball.angle = 90;//设置移除的等待球的角度，竖直向上插入的，角度为90
	var faild = true;//成功或失败跳出循环
	//-----------判断是否闯关成功-------------
	runballs.forEach(function(e, index) {
		if(!faild) return;
		if(Math.abs(e.angle - ball.angle)/2 < 180 * ballRadius/ (lineLen*Math.PI)) {
			//夹角的一半，小于转动圆tan的那个角度，就是碰上了，插入失败
			//tan(x) 在x很小时，约等于 x； 应该会180，不是老师写的360哦
			state = 0;  //闯关失败
			faild = false;
		} else if(index === runballs.length - 1 && waitballs.length === 0) {
				//这个元素的索引index为最后一个，即runball遍历完了，且等待球没了
				faild = false;
				state = 1;  //闯关成功
		}
	});

	runballs.push(ball);//转动球数组中添加刚才移除的等待球
	//必须得重新绘制等待球
	waity = lineLen + waitOffset; //因为之前绘制等待球时，这个公有变量一直在增大，所以重置下
	drawWaitBall();   
	//重新绘制转动球
	drawRunBall(0);
}

