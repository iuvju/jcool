document.addEventListener('DOMContentLoaded', function () {
  init();
});

var storage = chrome.storage.local || false;
var result = [], msg, add, items, save, status;
function init(){
	add = document.querySelector("#Add");
	items = document.querySelector("#ItemList");
	save = document.querySelector("#Save");
	msg = document.querySelector("#Msg");
	statuses = document.querySelector("#Status");
	add.addEventListener("click", function(){
		addItem(items);
	});

	save.addEventListener("click", function(){
		doSave(items);
	});
	statuses.addEventListener("click", function(){
		changeStatus(statuses);
	})
	renderLit(items);
	setStatus(statuses);
}

// 添加一项映射表单
var addItem = function(d){
	var tpl = document.createElement("div");
	tpl.className = "item";
	tpl.innerHTML = '<input type="checkbox" class="ck"/><input type="text" class="map1 text" placeholder="g.tbcdn.cn"/><input type="text" class="map2 text" placeholder="/ju/dingzhi/1.0.2"/><span>Map -></span><input type="text" class="map3 text" placeholder="minint-quod3i0"/><input type="text" class="map4 text" placeholder="local path"/>';
	d.appendChild(tpl);
};

// 保存映射配置
var doSave = function(d){
	var item = d.querySelectorAll(".item");
	if(!item.length) return;
	item = [].slice.call(item);
	result.length = 0;
	item.forEach(function(l){
		var map1 = l.querySelector('.map1'),
			map2 = l.querySelector('.map2'),
			map3 = l.querySelector('.map3'),
			map4 = l.querySelector('.map4'),
			ck = l.querySelector('.ck');
		if(map1.value && map3.value){
			result.push({
				remote_host: map1.value,
				remote_path: map2.value,
				proxy_host: map3.value,
				proxy_path: map4.value,
				ck: ck.checked
			});
		}
	});
	storage.set({ result : result});
	tip('保存成功', 1000);
}

var tip = function(t, d){
	msg.innerHTML = t;
	if(d){
		setTimeout(function(){
			msg.innerHTML = '';
		}, d);
	}
};
var renderLit = function(d){

	storage.get('result', function(data){
		if(!data['result']) return;
		if(!data.result.length) return;
		d.innerHTML = '';
		var dpl = '';
		data.result.forEach(function(l){
			var tpl = document.createElement("div");
			tpl.className = "item";
			var tmp = '<div class="item">';
			if(l.ck){
				 tmp += '<input type="checkbox" class="ck" checked/>';
			}else{
				tmp += '<input type="checkbox" class="ck"/>';
			}
			l.remote_host = l.remote_host || '';
			l.remote_path = l.remote_path || '';
			l.proxy_host = l.proxy_host || '';
			l.proxy_path = l.proxy_path || '';
			tmp += '<input type="text" class="map1 text" value="' + l.remote_host + '" placeholder="g.tbcdn.cn"/><input type="text" class="map2 text" value="'+l.remote_path+'"placeholder="/ju/dingzhi/1.0.2"/><span>Map -></span><input type="text" class="map3 text" value="' + l.proxy_host + '" placeholder="minint-quod3i0"/><input type="text" class="map4 text" value="' + l.proxy_path + '" placeholder="local path"/>';
			tmp += '</div>';

			dpl += tmp;
		});
		d.innerHTML = dpl;
	});
}

var setStatus = function(d){
	storage.get('status', function(data){
		if(data.status === 'on'){
			d.className = 'on';
		}else{
			d.className = 'off';
		}
		chrome.browserAction.setIcon({path: "img/16_16_" + d.className + ".png"});
	});
}
var changeStatus = function(d){
	if(d.className === 'off'){
		d.className = 'on';
	}else{
		d.className = 'off';
	}
	storage.set({status: d.className});
	chrome.browserAction.setIcon({path: "img/16_16_" + d.className + ".png"});
}