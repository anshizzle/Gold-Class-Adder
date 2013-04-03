function save_options() {
	var username_field = document.getElementById("username");
	var username = username_field.value;
	localStorage["username"] = username;

	var password_field = document.getElementById("password");
	var password = password_field.value;
	localStorage["password"] = password; 

	document.getElementById("response").innerHTML = "Options saved successfully! Good Job!"


}

function restore_options() {
	document.querySelector('#save').addEventListener('click', save_options);
	var username_field = document.getElementById("username");
	username_field.value = localStorage["username"];

	var password_field = document.getElementById("password");
	password_field.value = localStorage["password"];


}

document.addEventListener('DOMContentLoaded', restore_options);
	
