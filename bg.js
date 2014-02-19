chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        //chrome.tabs.update(sender.tab.id, {url: request.redirect});
        // console.log("Request received");
        var classes;
        var n;
		if(request.method == "getLogin") {
			sendResponse({username: localStorage['username'], password: localStorage['password']});
		}
		//Get The info for find courses page
		else if(request.method == "getSearchInfo") {
			classes = JSON.parse(localStorage["classes"]);
			n = localStorage["classBeingAdded"];
			sendResponse({quarter: localStorage['quarter'], dept: classes[n][0]});
		}
		//Get enrollment code of class
		else if(request.method == "getEnrollCode") {
			classes = JSON.parse(localStorage["classes"]);
			n = localStorage["classBeingAdded"];
			sendResponse({enrollCode: classes[n][1]});
		}
		else if(request.method == "updateClass") {
			classes = JSON.parse(localStorage["classes"]);
			classes[localStorage["classBeingAdded"]][2] = request.value;
			localStorage["classes"] = JSON.stringify(classes);
			n =localStorage["classBeingAdded"];
			n++;
			localStorage["classBeingAdded"] = n;
		}
		else if(request.method == "checkIfDone") {
			n = localStorage["classBeingAdded"];
			count = localStorage["count"];

			if(n>=count) {sendResponse({done: true});}
			else { sendResponse({done:false}); }

		}
		else if(request.method == "redirect") {
			chrome.tabs.update(sender.tab.id, {url: request.redirect});
		}
		else if(request.method == "isOn") {
			var bool;
			if(localStorage["on"] == "true") { bool = true; }
			else { bool = false;}
			sendResponse({isOn: bool});
		}
		else if(request.method == "turnOff") {
			localStorage["on"] = "false";
		}
		else if(request.method == "addClass") {
			classes = JSON.parse(localStorage["classes"]);
			count = localStorage["count"];
			var dept = request.department;
			var code = request.enrollCode;

			if(count == classes.length) {
				sendResponse({message: "You cannot add anymore classes"});
			}
			else if(classAlreadyAdded(dept, code, classes, count)) {
				sendResponse({message: "You have already added this class"})
			}
			else {
				classes[count][0] = dept;
				classes[count][1] = code;
				classes[count][2] = 0;
				count++;
				localStorage["classes"] = JSON.stringify(classes);
				localStorage["count"] = count;
				sendResponse({message: dept + " " + code + " added successfully"});
			}
		}

    });

function classAlreadyAdded(dept, code, classes, count) {
	var i = 0;
	while(i<count) {
		if(classes[i][0] == dept && classes[i][1] == code) { return true;}
		i++;
	}
	return false;
}

