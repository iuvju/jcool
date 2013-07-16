document.addEventListener('DOMContentLoaded', function () {
  init();
});

var storage = chrome.storage.local || false;
var result = [], msg, add, items, save;
function init(){
	add = document.querySelector("#Add");
	items = document.querySelector("#ItemList");
	save = document.querySelector("#Save");
	msg = document.querySelector("#Msg");
	add.addEventListener("click", function(){
		addItem(items);
	});

	save.addEventListener("click", function(){
		doSave(items);
	});
	renderLit(items);
}

// 添加一项映射表单
var addItem = function(d){
	var tpl = document.createElement("div");
	tpl.className = "item";
	tpl.innerHTML = '<input type="checkbox" class="ck"/><input type="text" class="map1 text" placeholder="g.tbcdn.cn"/><span>Map -></span><input type="text" class="map2 text" placeholder="minint-quod3i0"/>';
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
			ck = l.querySelector('.ck');
		if(map1.value && map2.value){
			result.push({
				map1: map1.value,
				map2: map2.value,
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
			tmp += '<input type="text" class="map1 text" value="' + l.map1 + '" placeholder="g.tbcdn.cn"/><span>Map -></span><input type="text" class="map2 text" value="' + l.map2 + '" placeholder="minint-quod3i0"/>';
			tmp += '</div>';

			dpl += tmp;
		});
		d.innerHTML = dpl;
	});
}