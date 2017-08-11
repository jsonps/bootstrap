
// 创建一个mp3播放器
var audioDom = document.createElement('audio');
// 设置音乐地址
//audioDom.src = "mp3/1.mp3";
// 控制自动播放
//audioDom.autoplay = "autoplay";
var mark = 1; //1为顺序播放，2为随机播放  默认为顺序播放

//播放索引
var playIndex = 0;
// 音乐列表的总长度
var len = $('#m-song').children().length;

// 添加音乐
function addMusic(src){
	scrollLrc()
	audioDom.src = src;
}
// 播放音乐
function playMusic(obj){
	audioDom.play();
	repeatName(obj);// 动态替换歌名
}

// 暂停音乐
function stopMusic(){
	audioDom.pause();
}

// 动态替换歌名
function repeatName(obj){
	var name = obj.find("a").text();
	$(".m-name").text(name);
}

//下一首
function nextMusic(){
	//选中音乐
	playIndex = (playIndex == (len-1) ? 0 : ++playIndex);
	var sel = $('#m-song').find('.m-item').eq(playIndex);
	var src = sel.data('src');
	addMusic(src);
	playMusic(sel);
	sel.addClass('m-select').siblings().removeClass('m-select');
	$('#play').hide().prev().show();
}
//上一首

//随机播放
function randomMusic(){
	var random = Math.floor(Math.random()*len);//floor是返回最接近的整数

	playIndex = random;
	var sel = $('#m-song').find('.m-item').eq(playIndex);
	var src = sel.data('src');
	addMusic(src);
	playMusic(sel);
	sel.addClass('m-select').siblings().removeClass('m-select');
	$('#play').trigger('click');
}

//顺序播放

// 监听时间
function timeEvent(){
	// 音频加载完毕监听
	//当浏览器预计能够在不停下来进行缓冲的情况下持续播放指定的音频/视频时，会发生 canplaythrough 事件。
	audioDom.oncanplaythrough = function(){//oncanplaythrough 事件在视频/音频（audio/video）可以正常播放且无需停顿和缓冲时触发。
		// 获取总时长
		var time = this.duration;
		// 格式化时间
		var ftime = formartTime(time);

		$(".m-t-end").text(ftime); //把一首歌的总时间显示
	}

	//Video对象可以通过ontimeupdate事件来报告当前的播放进度，同时通过该事件还可以根据视频播放的情况来控制页面上的其它元素，例如随着视频播放的进度来切换章节、显示额外信息等
	audioDom.ontimeupdate = function(){
	// 获取总时长
	var time = this.duration;
	// 获取播放时长
	var stime = this.currentTime;
	// 格式化时间
	var ftime = formartTime(stime);
	$(".m-t-start").text(ftime);
	// 获取播放进度
	var pbit = stime / time;
	// 计算百分比
	var percent = pbit * 100;
	$(".m_sroll").width(percent+"%");
	$(".m_flag").css("left",(percent)+"%");
	};

	// 音乐播放结束 确定下一首歌是随机播放还是顺序播放
	//onended 事件在视频/音频（audio/video）播放结束时触发。该事件通常用于送类似"感谢观看"之类的消息。
	audioDom.onended = function(){
		if(mark == 1){
			nextMusic();//相当于点击了下一首的按钮
		} else{
			randomMusic();
		}

	};
}
// 格式化为歌曲时间
function formartTime(time){
	var m = Math.floor(time / 60);
	var s = Math.floor(time % 60);
	return (m<10 ? ("0"+m):m) + ":" + (s<10 ? ("0"+s):s);
}

$(function(){
	timeEvent();
	// 点击播放按钮
	$('#play').click(function(){
		// 如果已经有选中播放文件就直接播放
		var sel = $('#m-song').find('.m-select');
		// 取到歌曲路径
		var src = sel.data('src');
		if(!src) //音乐路径不存在
		{
			//如果没有选中，就把第一个播放
			sel = $('#m-song').find('li').eq(0);
			src = sel.data('src');
			sel.addClass('m-select');
		}

		//添加到播放地址
		addMusic(src);
		playMusic(sel);
		//audioDom.src = src;
		//audioDom.play();
		$(this).hide().prev().show();

		// 将索引记录下来
		playIndex = sel.index();
	});

	// 点击暂停按钮
	$('#stop').click(function(){
		stopMusic()
		//audioDom.pause();
		$(this).hide().next().show();
	});

	// 点击音乐列表播放
	$('#m-song').find('.m-item').click(function(){
		// 将索引记录下来
		playIndex = $(this).index();//把这一行放在前面为了防止加载歌词出错(使用的是上一次记录)

		var src = $(this).data('src')
		var sel = $('#m-song').find('.m-item').eq(playIndex);
		//添加到播放地址
		addMusic(src);
		//playMusic(this);//使用this不会动态替换歌名
		playMusic(sel);
		//audioDom.src = src;
		//audioDom.play();
		$(this).addClass('m-select').siblings().removeClass('m-select');

		//播放按钮图案切换（模拟用户点击）
		//$('#play').hide().prev().show();
		$('#play').trigger('click');

		// 将索引记录下来
		//playIndex = $(this).index();

	});

	// 点击下一首
	$(".next").click(function(){
		nextMusic();
	});

	// 点击上一首
	$(".prev").click(function(){
		//选中音乐
		playIndex = (playIndex == 0 ? (len-1) : --playIndex);
		var sel = $('#m-song').find('.m-item').eq(playIndex);
		var src = sel.data('src');
		addMusic(src);
		playMusic(sel);
		sel.addClass('m-select').siblings().removeClass('m-select');
		$('#play').hide().prev().show();
	});

	//顺序播放和随机播放切换
	$('.mark').click(function(){
		mark = $(this).data('mark');
		$('.mark').removeClass('m-btn-mark');//将所有的mark的按钮先去掉m-btn-mark类样式
		$(this).addClass('m-btn-mark');

		if(mark == 2){ //随机播放
			randomMusic();
		} else {  //顺序播放
			nextMusic();
		}
	});

	//点击收缩歌曲列表
	$('.m-shrink').click(function(){
		$('.music-list').animate({left:-310},function(){//left起作用需要定位
			$("#music").animate({width:300});
		});
	});

	//点击展开歌曲列表
	$('.m-expand').click(function(){
		$("#music").animate({width:610});
		$('.music-list').animate({left:0},'slow','linear');
	});

	//拖动播放
	$('.m-t-bar-2').mousedown(function(e){
		// 下面方法先判断是否有歌曲，如果没有直接return 可以封装成一个函数
			var sel = $('#m-song').find('.m-select');
			// 取到歌曲路径
			var src = sel.data('src');
			if(!src) //音乐路径不存在
			{
				return;
			}

		//e = e || event;
		//获取拖动对象
		var _this = $(this);
		//获取鼠标的位置
		var x = e.clientX || e.pageX;
		//获取当前鼠标的位置
		var leftStart = _this.position().left;
		//获取鼠标的终点位置
		var LeftEnd = _this.parent().width() - 10;

		// 先暂停音乐 防止卡顿
		audioDom.pause();

		//拖动元素
		//$('m-t-bar').mouseover(function(e){
		$(document).bind('mousemove',function(e){
			//console.log('over');
			// 获取鼠标拖动最终位置
			var x1 = (e.clientX || e.pageX) - x + leftStart;
			// 判断边界
			if(x1 < 0){x1 = 0;}
			if(x1 > LeftEnd){x1 = LeftEnd;}
			//_this.css('left',x1);
			// 根据拖动的位置除以最大位置得到百分比
			var percent = (x1 / LeftEnd) * 100;
			//根据百分比设置样式
			$('.m_sroll').width(percent+"%");
			$('.m_flag').css('left',(percent)+'%');

			// 音乐文件的时间加载
			audioDom.currentTime = audioDom.duration * (x1 / LeftEnd);//此处有个bug，如果初试没有给audio那么会报错
		}).bind('mouseup',function(){
			// 下面方法先判断是否有歌曲，如果没有直接return
			var sel = $('#m-song').find('.m-select');
			// 取到歌曲路径
			var src = sel.data('src');
			if(!src) //音乐路径不存在
			{
				return;
			}
			//console.log('up');
			// 移除事件
			// 松开鼠标，播放音乐
			audioDom.play();
			//$('#play').trigger('click');
			$('#play').hide().prev().show();
			$(document).unbind('mousemove');
			$(document).unbind('mouseup');
		});

	});

});

//加载歌词
function loadLrc(arg){
	var text = $("#"+arg).val();
	// 把时间个歌词分离出来
	var lrcArr = text.split("[");
	var htmlLrc = "";
	for(var i = 0; i < lrcArr.length; i++){
		// 第二次分割“]”
		var arr = lrcArr[i].split("]");
		// console.log(arr);
		// 取到歌词
		var message = arr[1];

		// 取到时间
		var timer = arr[0].split(".");
		// 取到分钟和秒
		var stime = timer[0].split(":");
		// 转换成秒数
		var ms = stime[0]*60 + stime[1]*1 - 1;//00:00:00最后的00不用管，只需要看分和秒
		//console.log(ms);

		if(message){
			htmlLrc += "<div class='lrcline' id='"+ms+"'>"+message+"</div>";
		}
	}
	// 把解析好的歌词放入div中
	$(".m-con").html(htmlLrc);
}

// 联动歌词
function scrollLrc(){
	switch(playIndex){
		case 0 : loadLrc('lrc-1');
		break;
		case 1 : loadLrc('lrc-2');
		break;
		case 2 : loadLrc('lrc-3');
		break;
		case 3 : loadLrc('lrc-4');
		break;
		case 4 : loadLrc('lrc-5');
		break;
		case 5 : loadLrc('lrc-6');
		break;
	}

	// 联动音乐播放歌词
	audioDom.addEventListener("timeupdate",function(){
		// 获取当前播放时间
		var timer = this.currentTime;
		//console.log(timer);
		// 解析音乐对应的时间
		var m = parseInt(timer / 60);
		var s = parseInt(timer);
		for(var i = 0; i < s; i++){
			$("#"+i).addClass("lrcSel").siblings().removeClass("lrcSel");//一行一行的添加样式 id='"+ms+"'
		}
		var st = m * 60 + s; //歌词条滚动速度
		$(".m-con").scrollTop(st*2);

	});
}

$(function(){

	/*var text = $("#lrc").val();
	// 把时间个歌词分离出来
	var lrcArr = text.split("[");
	var htmlLrc = "";
	for(var i = 0; i < lrcArr.length; i++){
		// 第二次分割“]”
		var arr = lrcArr[i].split("]");
		// console.log(arr);
		// 取到歌词
		var message = arr[1];

		// 取到时间
		var timer = arr[0].split(".");
		// 取到分钟和秒
		var stime = timer[0].split(":");
		// 转换成秒数
		var ms = stime[0]*60 + stime[1]*1 - 1;//00:00:00最后的00不用管，只需要看分和秒
		//console.log(ms);

		if(message){
			htmlLrc += "<div class='lrcline' id='"+ms+"'>"+message+"</div>";
		}
	}
	// 把解析好的歌词放入div中
	$(".m-con").html(htmlLrc);
	*/
	switch(playIndex){
		case 0 : loadLrc('lrc-1');
		break;
		case 1 : loadLrc('lrc-2');
		break;
		case 2 : loadLrc('lrc-3');
		break;
		case 3 : loadLrc('lrc-4');
		break;
		case 4 : loadLrc('lrc-5');
		break;
		case 5 : loadLrc('lrc-6');
		break;
	}

	// 联动音乐播放歌词
	audioDom.addEventListener("timeupdate",function(){
		// 获取当前播放时间
		var timer = this.currentTime;
		//console.log(timer);
		// 解析音乐对应的时间
		var m = parseInt(timer / 60);
		var s = parseInt(timer);
		for(var i = 0; i < s; i++){
			$("#"+i).addClass("lrcSel").siblings().removeClass("lrcSel");//一行一行的添加样式 id='"+ms+"'
		}
		var st = m * 60 + s; //歌词条滚动速度
		$(".m-con").scrollTop(st*2);

	});

});