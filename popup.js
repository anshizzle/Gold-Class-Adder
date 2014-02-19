document.addEventListener('DOMContentLoaded', setup_popup);

function setup_popup() {


	var username = localStorage["username"];
	$("#username").append(username);
	var quarter = localStorage["quarter"];
	$("#quarter").append(quarter_text(quarter));

	var timestamp = new Date(localStorage["year"], localStorage["month"], localStorage["date"], localStorage["hour"], localStorage["min"], 0, 0);
	$("#pass").append(timestamp.toLocaleDateString() + " " + timestamp.toLocaleTimeString());


	//Add all the classes
	var classes = JSON.parse(localStorage["classes"]);
	var count = localStorage["count"];

	for(i=0; i< count; i++) { 
		var html = "<tr><td>"
		html += classes[i][0] + "</td><td>" + classes[i][1] + "</td>";
		html += "<td>" + added_text(classes[i][2]) + "</td></tr>";
		$('#classes').append(html);
	}



	$(".options_link").click(function() {
		chrome.tabs.create({
			url: chrome.extension.getURL("options.html")
		});
	});
}

//Text for the added state of a class
	// 	0 = NOT TRIED
	// 	1 = TRIED AND FULL
	// 	-1 = TRIED AND NEED ADD CODE
	// 	2 = ADDED
function added_text(num) {
	if(num == 0) { return "Not Tried"; }
	else if(num == 1) { return "Tried and Failed"; }
	else if(num == 2) { return "Class Successfully Added"; }
	else { return "Unknown Error"; }

}

function quarter_text(quarter) {
	var arr = ["Winter", "Spring", "Summer", "Fall"]
	var qtr = quarter.substr(quarter.length-1);
	var year = quarter.substr(0, quarter.length-1);

	return arr[qtr-1] + " " + year;
}