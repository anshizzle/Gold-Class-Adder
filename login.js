var path = window.location.pathname.split( '/' );
var page = path[2].toUpperCase();
chrome.extension.sendRequest({method: "checkIfDone"}, function(response) {
   console.log("is it done?" + response.done);
  if(response.done) {
    chrome.extension.sendRequest({method: "turnOff"});
  }
});


chrome.extension.sendRequest({method: "isOn"}, function(response) {
  // console.log(response.isOn);
  if(response.isOn) { 

    //On the login page, Log User Iin
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
            // console.log("tst");

     chrome.extension.sendRequest({method: "getLogin"}, function(response) {
        // console.log(response.username);
        var username_field = document.getElementById("pageContent_userNameText");
        username_field.value = response.username;

        //console.log(response.password);
        var password_field = document.getElementById("pageContent_passwordText");
        // var password = localStorage["password"];
        password_field.value = response.password;
      });
        
        setTimeout(function() { $("#pageContent_loginButton").click() }
          , '1000');

    }
    //On home page, go to the course search page
    else if(page.substring(0,4) == "HOME") {
      console.log("on home page");
      // $(document).ready(function() { $("#ctl06").click(); });
      $("#ctl06").click();
      // __doPostBack('ctl00$ctl06','');
      var theForm = document.forms['MainForm'];
      if (!theForm) {
        theForm = document.MainForm;
      }
      theForm.__EVENTTARGET.value = 'ctl00$ctl06';
      theForm.__EVENTARGUMENT.value = '';
      theForm.submit();

    }

    //If you're on the search for courses page, search for the course we want.
    else if(page.substring(0,5) == "BASIC") {
        var dept, quarter;

        chrome.extension.sendRequest({method: "getSearchInfo"}, function(response) {
          //Get the  search info To Register For
          quarter = response.quarter;
          dept = response.dept;
        });

        setTimeout(function() {
          $('#pageContent_quarterDropDown > option[value="' + quarter +  '"]').prop('selected', true);
          $('select#pageContent_subjectAreaDropDown > option[value="' + dept + '"]').prop('selected', true);
          document.getElementById('pageContent_searchButton').click();
        }, '1000');

    }
    //Results Page: Find the course we want to add and hit the add button.
    else if(page.substring(0,5) == "RESUL") {
       var enrollCode;

       //Can't add classes
       if($(".aspNetDisabled").length != 0 )
       {
         chrome.extension.sendRequest({method: "turnOff"});
       } 
       else {
        chrome.extension.sendRequest({method: "getEnrollCode"}, function(response) {
          //Get the enrollment code
          enrollCode = response.enrollCode;
        });

        setTimeout(function() {
         $("td:contains('" + enrollCode +  "')").parent().children().last().children("a").addClass('GoldAdderClass');
         document.getElementsByClassName("GoldAdderClass")[0].click();
        }, '1000');
      }

    }
    else if(page.substring(0,5) == "ADDST") {
      //If class cannot be added
      console.log("Class is being added");
      if($("td:contains('cannot')").length != 0) { 
        console.log("Class cannot be added");
        chrome.extension.sendRequest({method: "updateClass", value: 1});
        console.log("Class was updated");
        chrome.extension.sendRequest({method: "redirect", redirect: "https://my.sa.ucsb.edu/gold/BasicFindCourses.aspx"});
      }
      else if($("td:contains('Approval Code')").length != 0) {
        chrome.extension.sendRequest({method: "updateClass", value: -1});
        chrome.extension.sendRequest({method: "redirect", redirect: "https://my.sa.ucsb.edu/gold/BasicFindCourses.aspx"});
      }
      else {
        document.getElementById("pageContent_AddToScheduleButton").click();
      } 

    }
    //On schedule page
    else if(page.substring(0,5) == "STUDE") {
      if( $("span:contains('successfully added')").length !== 0) {
        chrome.extension.sendRequest({method: "updateClass", value: 2}, function(response) {
        });
      }

      chrome.extension.sendRequest({method: "checkIfDone"}, function(response) {
        // console.log("is it done?" + response.done);
        if(!response.done) {
           chrome.extension.sendRequest({method: "redirect", redirect: "https://my.sa.ucsb.edu/gold/BasicFindCourses.aspx"});
        }
        else {
          chrome.extension.sendRequest({method: "turnOff"});
        }
      });

    }
    //On some other page
    else {
     chrome.extension.sendRequest({method: "checkIfDone"}, function(response) {
        // console.log("is it done?" + response.done);
        if(!response.done) {
           chrome.extension.sendRequest({method: "redirect", redirect: "https://my.sa.ucsb.edu/gold/BasicFindCourses.aspx"});
        }
        else {
          chrome.extension.sendRequest({method: "turnOff"});
        }
      });
    }
  }
  //If extension is not set to run and you're on the course results page
  //Insert a "Add To Fools Gold Button"
  else {
    if(page.substring(0,5) == "RESUL") {
      var dept = $("#pageContent_criteriaLabel").first().html().split('-').pop().split(',')[0]
      dept = dept.substr(1, dept.length);
      $(".aspNetDisabled").each(function() { 

        var code = $(this).parent().parent().children().eq(1).html().replace("&nbsp;", "");
        if(jQuery.isNumeric(code)) {
          var url  = chrome.extension.getURL('/img/gold.jpg');
          var html = '<img class="gold_class_adder" alt="Add to Fools Gold" data-dept="' + dept + '"';
          html+= 'data-code="' + code + '" src="' + url + '">';
          $(this).parent().css("text-align", "center");
          $(this).parent().html(html);
        }

      });

      $(".gold_class_adder").click(function() {
        var dept = $(this).data("dept");
        var code = $(this).data("code");

        chrome.extension.sendRequest({
          method: "addClass",
          department: dept,
          enrollCode: code
        }, function(response) {
          window.setTimeout(function() { alert(response.message); } , 1);

        });
      });
    }
  }
});
