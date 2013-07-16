var 
	storage = chrome.storage.local;



chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {

		
	}
);


chrome.extension.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(msg) {

		

	});
});

var page = chrome.extension.getViews();;
console.log(page);