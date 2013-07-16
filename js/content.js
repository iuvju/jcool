// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


var URLParser = function(url) {

    this._fields = {
        'Username' : 4,
        'Password' : 5,
        'Port' : 7,
        'Protocol' : 2,
        'Host' : 6,
        'Pathname' : 8,
        'URL' : 0,
        'Querystring' : 9,
        'Fragment' : 10
    };

    this._values = {};
    this._regex = null;
    this.version = 0.1;
    this._regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;
    for(var f in this._fields)
    {
        this['get' + f] = this._makeGetter(f);
    }

    if (typeof url != 'undefined')
    {
        this._parse(url);
    }
}
URLParser.prototype.setURL = function(url) {
    this._parse(url);
}

URLParser.prototype._initValues = function() {
    for(var f in this._fields)
    {
        this._values[f] = '';
    }
}
URLParser.prototype.setValue = function(type, value) {
	this._values[type] = value;
}

URLParser.prototype._parse = function(url) {
    this._initValues();
    var r = this._regex.exec(url);
    if (!r) throw "DPURLParser::_parse -> Invalid URL";

    for(var f in this._fields) if (typeof r[this._fields[f]] != 'undefined')
    {
        this._values[f] = r[this._fields[f]];
    }
}
URLParser.prototype._makeGetter = function(field) {
    return function() {
        return this._values[field];
    }
}



var storage = chrome.storage.local;
var css_link = [];
var init = function(){
    storage.get('status', function(data){
        if(data.status === 'on'){
            css_link = document.querySelectorAll("link");
            if(!css_link.length) return;
            css_link = [].slice.call(css_link);
            storage.get('result', function(data){
                if(!data['result']) return;
                if(!data.result.length) return;
                act(data.result);
            });
        }
    });

}

var act = function(data){
	css_link.forEach(function(item){
        var href = item.href;
		var url = new URLParser(href);
		var host = url.getHost();
        var new_host = checkStat(data, host);
        if(new_host){
           href = href.replace(new_host.remote_host, new_host.proxy_host);
           href = href.replace(new_host.remote_path, new_host.proxy_path);
           href = href.replace('-min', '');
           item.href = href;
		}
	});
}

var checkStat = function(data, host){
	var res = false;
	data.forEach(function(item){
		if(item.ck && item.remote_host === host){
			res = item;
			return res;
		}
	});
	return res;
}

init();
