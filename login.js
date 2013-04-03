var path = window.location.pathname.split( '/' );
var page = path[2].toUpperCase();
if(page.substring(0,5) == "LOGIN"){

	var checkboxes = document.getElementsByTagName('input');
	for (var i=0;i<checkboxes.length;i++)
    	{	
    		var checkbox = checkboxes[i];
    		if(checkbox.getAttribute('type') == 'checkbox')
    		{
    			checkbox.checked = true;
    		}
    	}
    	
   	var username = localStorage["username"];
   	var username_field = document.getElementById("pageContent_userNameText");
   	username_field.value = username;
   	alert(username);

   	var password_field = document.getElementById("pageContent_passwordText")
   	var password = localStorage["password"];
   	password_field.value = password;


}