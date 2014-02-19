var classes, count;

/**

	CLASSES ARRAY
	Classes[i][0] = DEPARTMENT
	Classes[i][1] = ENROLL CODE
	Classes[i][2] = VALUE INDICATING IF TRIED OR ADDED
		0 = NOT TRIED
		1 = TRIED AND FULL
		-1 = TRIED AND NEED ADD CODE
		2 = ADDED

**/



function save_options() {
	var username_field = document.getElementById("username");
	var username = username_field.value;
	localStorage["username"] = username;

	if(!("classBeingAdded" in localStorage)) {
		localStorage["classBeingAdded"] = 0;
	}

	var password_field = document.getElementById("password");
	var password = password_field.value;
	localStorage["password"] = password;


	var quarter_field = document.getElementById("quarter");
	var qtr = $("#quarter").val();
	var yr = $("#quarter_year").val();
	localStorage["quarter"] = yr+qtr;

	localStorage["count"] = count;
	localStorage["classes"] = JSON.stringify(classes);
	localStorage["classBeingAdded"] = 0;
	refresh_classes();
	rewrite_classes();


	document.getElementById("response").innerHTML = "Options saved successfully! Good Job!";


	if(newPassTime()) {
		//Test code that creates an alarm for a minute from now
		// var d = new Date();
		// var min = d.getMinutes() + 1;
		// var timestamp = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), min, 0, 0);

	// 	localStorage["month"], localStorage["date"], localStorage["year"], 
	//	localStorage["hour"], localStorage["minute"]

		localStorage["month"] = $("#month").val();
		localStorage["date"] = $("#date").val();
		localStorage["year"] = $("#year").val();
		localStorage["hour"] = $("#hour").val();
		localStorage["min"] = $("#min").val();

		var timestamp = new Date(localStorage["year"], localStorage["month"], localStorage["date"], localStorage["hour"], localStorage["min"], 0, 0);

		

		chrome.alarms.clearAll();
		chrome.alarms.create('PassTime', {
				when: timestamp.valueOf()
		});
		// console.log("alarm created");
		chrome.alarms.onAlarm.addListener(function() {
			run_now();
		});
	}
}


function run_now() {
	refresh_classes();
	localStorage["classBeingAdded"] = 0;

	localStorage["on"] = "true";
	chrome.tabs.create({url: "https://my.sa.ucsb.edu/gold/Login.aspx"});

}

function restore_options() {

	$("#save").click(function() { save_options(); });
	$("#add").click(function() {add_class(); });
	// $("#delete").click(function() { delete_class(); });
	$("#run_now").click(function() { run_now(); });

	$("#date").val(localStorage["date"]);
	$("#year").val(localStorage["year"]);
	$("#hour").val( localStorage["hour"]);
	$("#min").val(localStorage["min"]);
	$('#month > option[value="' + localStorage["month"] +  '"]').prop('selected', true);

	var username_field = document.getElementById("username");
	username_field.value = localStorage["username"];

	var password_field = document.getElementById("password");
	password_field.value = localStorage["password"];

	// var quarter_field = document.getElementById("quarter");
	// quarter_field.value = localStorage["quarter"];

	var quarter = localStorage["quarter"];
	var qtr = quarter.substr(quarter.length-1);
	var year = quarter.substr(0, quarter.length-1);
	$("#quarter").val(qtr);
	$("#quarter_year").val(year);

	if("classes" in localStorage) {
		classes = JSON.parse(localStorage["classes"]);
		count = localStorage["count"];

		rewrite_classes();
		// for(i = 0; i<count; i++) {
		// 	$("#classes").append('<option value= "' + i + '">' + classes[i][0] + classes[i][1] + "</option>" );
		// }
	}
	else {

		classes = new Array(5);
		count = 0;

		for(i=0; i<5; i++) {
			classes[i] = new Array(3);
		}

	}

	$("#manual_add_link").click(function() {
		// alert("test");
		$("#manual_add").slideDown(500);
	});
}

//Takes cents in integer and returns string "$xx.xx"
function convertToMoney(amount) {
	amount = amount.toString();
	var cents = amount.substr(amount.length-2, amount.length);
	var dollars = amount.substr(0, amount.length-2);
	return "$" + dollars + "." + cents;

}

//Returns true if pass time was changed
function newPassTime() {
	// localStorage["month"], localStorage["date"], localStorage["year"], 
	//localStorage["hour"], localStorage["minute"]

	if(localStorage["month"] != $("#month").val()) { return true; }
	if(localStorage["date"] != $("#date").val()) { return true; }
	if(localStorage["year"] != $("#year").val()) { return true; }
	if(localStorage["hour"] != $("#hour").val()) { return true; }
	if(localStorage["min"] != $("#min").val()) { return true; }
	return false;

}

function add_class() {
	event.preventDefault();
	classes[count][0] =  $("#goldAdder_subjectAreaDropDown").val();
	classes[count][1] = $("#enrollCode").val();
	classes[count][2] = 0;
	count++;

	rewrite_classes();
	// $("#classes").append('<option value= "' + count +  '">' + classes[count][0] + " " +  classes[count][1] + "</option>" );
}

function delete_class(dept, code) {
	event.preventDefault();
	// val = parseInt(val);
	var val = 0;
	var check = true;
	while(check) {
		if(classes[val][0] == dept && classes[val][1] == code) {
			check = false;
		}
		else { val++; }
	}

	console.log(val);

	//Remove class from array
	classes[val][0] = null;
	classes[val][1] = null;


	//Shift array back one
	for( i=val; i<count-1; i++) {
		classes[i][0] = classes[i+1][0];
		classes[i][1] = classes[i+1][1];
	}


	count--;

	//Rewrite Classes Options
	rewrite_classes();
	//console.log(val);


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



//Rewrite all the classes
function rewrite_classes() {
	$("#classes").empty();
	if(count == 0) {
		innerHTML = '<tr> <td colspan="4"> No Classes </td> </tr>';
		$("#classes").append(innerHTML);
	}
	else {
		for(i = 0; i<count; i++) {
			var innerHTML = '<tr data-dept="' + classes[i][0] + '" data-code="' + classes[i][1] + '">';
			innerHTML += '<td>' + classes[i][0] + '</td><td>' + classes[i][1] + '</td><td>';
			innerHTML += added_text(classes[i][2]) + "</td>";
			innerHTML += '<td><a href="#" class="delete_link">Delete</a></td>'
			$("#classes").append(innerHTML);

		}
	}
	$(".delete_link").click(function() { 

		var dept = $(this).parent().parent().data("dept");
		var code = $(this).parent().parent().data("code");
		delete_class(dept, code); 
	});

	// $("#classes").append('<option value= "' + count +  '">' + classes[count][0] + " " +  classes[count][1] + "</option>" );
}

//Treat all classes as if they haven't been tried.
function refresh_classes() {

	for(i = 0; i<count; i++) {
		classes[i][2] = 0;
	}
}


document.addEventListener('DOMContentLoaded', restore_options);
