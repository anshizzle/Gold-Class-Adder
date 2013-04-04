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
    
 /* chrome.extension.sendRequest({method: "getStatus"}, function(response) {
    console.log(response.status);
  });*/

   	var username = localStorage["username"];
   	var username_field = document.getElementById("pageContent_userNameText");
   	username_field.value = username;
   

   	var password_field = document.getElementById("pageContent_passwordText")
   	var password = localStorage["password"];
   	password_field.value = password;
}
//If you're on the search for courses page, search for the course we want.
else if(page.substring(0,5) == "BASIC") {

    var dept = "CMPSC";

    $('select#pageContent_subjectAreaDropDown > option[value="' + dept + '"]').prop('selected', true);
    document.getElementById('pageContent_searchButton').click();

}
//Results Page: Find the course we want to add and hit the add button.
else if(page.substring(0,5) == "RESUL") {
   var enrollCode = "07773";

   //var link = $("td:contains('" + enrollCode +  "')").parent().children().last().children("a").attr('href');
   //chrome.extension.sendRequest({redirect: link});

} 
else {
   chrome.extension.sendRequest({redirect: "https://my.sa.ucsb.edu/gold/BasicFindCourses.aspx"});


}