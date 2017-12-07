//import { setTimeout } from "timers";

//import { setInterval } from "timers";


// Userlist data array for filling in info box
var userListData = [];

//Min Players for lobby
var MinPlayers = 4;

//current URL
var WebURL;

//logged-in user
var user;

// DOM Ready =============================================================
$(document).ready(function() {
    
    WebURL = location.href;
    //console.log(WebURL);

    if (WebURL.includes('lobby')) {
      user = $.cookie('user');
      populateTable();
      if ($.cookie('round')) {
        $.cookie('round', 1, {expires: 1});
      }
      if ($.cookie('points')) {
        $.cookie('points', 0, {expires: 1});
      }
      if (user == 'null') {
        alert('Please sign in first before entering the lobby!');
        loginScreen();
      }
    } else if (WebURL.includes('create')) {
      user = null;
      $.cookie('user', user, {expires: 1}); // reset logged-in user as cookie that expires in 1 day
    } else if (WebURL.includes('game')) {
        if (WebURL.includes('over')) {
          user = $.cookie('user');
          populateScoreboard();
        } else {
          //$.cookie('points', this.points, {expires: 1});
          var round = 1;
          if ($.cookie('round')) {
            round = parseInt($.cookie('round')) + 1;
            $.cookie('round', round, {expires: 1});
          } else {
            $.cookie('round', round, {expires: 1});
          } 
          var deadline = new Date(Date.parse(new Date()) + 10 * 1000);
          initializeClock('clockdiv', deadline);
          var now = new Date().getTime();
          var distance = deadline - now;
          if (distance < 0) {
            document.getElementById("ccl").style.display = "none";
            document.getElementById("finish").style.display = "block";
          }
          user = $.cookie('user');

          //game logic
        //var just_keep_swimming = 1;
        if (round <= 10) {
          
          //setInterval(gameScreen, 11000);
          setInterval(function() {
            gameScreen();
             //alert($.cookie('points'));
          }, 11000);
          scoring();
          
        } else {
          $.ajax({
            type: 'POST',
            url: '/users/updatepoints'
        }).done(function( response ) {
        
            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }
        
        });
          gameOverScreen();
        }
        
    
        /*call the scoring function
        if (round <= 10) {
          //reload the page
          //assign answers to Z agian
          //gameScreen();
        } else {
          gameOverScreen();
        }*/
        }

        

    } else {
      //if nothing else, assume it's login page
      user = null;
      $.cookie('user', user, {expires: 1}); // reset logged-in user as cookie that expires in 1 day
    }

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Create Account button click
    $('#btnCreateAccount').on('click', createAccount);

    // Login button click
    $('#btnLogin').on('click', login);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    //Steal Button click
    $('#btnSteal').on('click', steal);

    //Heal Button click
    $('#btnHeal').on('click', heal);

    // Logout button click
    $('#btnLogOut').on('click', function() {
      alert("Thanks for playing!");
      loginScreen();
    });



});

// Functions =============================================================

function scoring() {
  var steals = 0;
  var points = 0;
  var count = 0;
  if (!$.cookie('points')) {
    $.cookie('points', points, {expires: 1});
  }
  points = $.cookie('points');
  //points += 2;
  $.getJSON( '/users/userlist', function( data ) {
            // For each item in our JSON, add a table row and cells to the content string
            
            $.each(data, function(){
              ++count;
                if (this.answer == 'steal') {
                  //alert("HEREH");
                  steals = steals + 1;
                }
                //alert(count + "  = " +  Object.keys(data).length);
                if (count == Object.keys(data).length) {
                  //alert(steals);
                  //alert($.cookie('answer') == 'steal');
                  if (steals >= 2) {
                    //alert("steals greater than 2!");
                    if ($.cookie('answer') == 'steal') { 
                      points = parseInt(points) - 20;
                      
                    } else {
                      points = parseInt(points) + 10;
                      
                    }
                  } else if (steals == 1) {
                    //alert("Only one steal!");
                    if ($.cookie('answer') == 'steal') {
                      points = parseInt(points) + 30;
                      
                    } else {
                      points = parseInt(points) - 10;
                     
                    }
                  } else {
                    //alert("no steals! <3");
                    points = parseInt(points) + 10;
                    
                  }

                 alert("Updating points to: " + points);
                  $.cookie('points', points, {expires: 1});
                }
                //$.cookie('answer', 'Z', {expires: 1});
            });

            

  });
  //alert("count"+ count);
  //alert(Object.keys(data).length)
  
}


function steal() { 
  $.ajax({
    type: 'POST',
    url: '/users/updateanswersteal'
}).done(function( response ) {

    // Check for a successful (blank) response
    if (response.msg === '') {
    }
    else {
        alert('Error: ' + response.msg);
    }
});
  $.cookie('answer', 'steal', {expires: 1});
  
}

function heal() {
  $.ajax({
    type: 'POST',
    url: '/users/updateanswerheal'
}).done(function( response ) {

    // Check for a successful (blank) response
    if (response.msg === '') {
    }
    else {
        alert('Error: ' + response.msg);
    }

});

$.cookie('answer', 'heal', {expires: 1});

}

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

      // Stick our user data array into a userlist variable in the global object
      userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Fill table with data
function populateScoreboard() {
  
      // Empty content string
      var tableContent = '';
  
      // jQuery AJAX call for JSON
      $.getJSON( '/users/userlist', function( data ) {
  
        // Stick our user data array into a userlist variable in the global object
        userListData = data;
  
          // For each item in our JSON, add a table row and cells to the content string
          $.each(data, function(){
              tableContent += '<tr>';
              //tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
              //tableContent += '<td>' + this.email + '</td>';
              //tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
              tableContent += '<td>' + this.username + '</td>';
              tableContent += '<td>' + this.points + '</td>';
              tableContent += '</tr>';
          });
  
          // Inject the whole content string into our existing HTML table
          $('#scoreboard table tbody').html(tableContent);
      });
  };

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoBio').text(thisUserObject.bio);
    $('#userInfoWon').text(thisUserObject.totalwins);
    $('#userInfoPlayed').text(thisUserObject.totalgames);
};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('input#inputUserName').val(),
            'password': $('input#inputUserPassword').val(),
            'fullname': $('input#inputUserFullname').val(),
            'email': $('input#inputUserEmail').val(),
            'bio': $('input#inputUserBio').val(),
            'gender': $('select.selectpicker').find("option:selected").val(),
            'answer': 'Z',
            'points': '-1',
            'totalwins': '0',
            'totalgames': '0'
        }

        var usernameTextbox = $('input#inputUserName').val();

        $.getJSON( '/users/userlist', function( data ) {

          // Stick our user data array into a userlist variable in the global object
          userListData = data;

          //number of iterations in below loop
          var count = 0;
          //flag for existing user
          var userFound = false;

          // For each item in our JSON, see if it matches username and password
          $.each(data, function(){

              ++count;

              if (this.username == usernameTextbox) {
                userFound = true;
              }

              if (count == Object.keys(userListData).length) {
                if (!userFound) {
                  console.log("adding..");
                  $.ajax({
                      type: 'POST',
                      data: newUser,
                      url: '/users/adduser',
                      dataType: 'JSON'
                  }).done(function( response ) {
                      // Check for successful (blank) response
                      if (response.msg === '') {
                          alert('Account created successfully!');
                          loginScreen();
                      }
                      else {
                          // If something goes wrong, alert the error message that our service returned
                          alert('Error: ' + response.msg);
                      }
                  });

                } else {
                  alert("This username is already in-use! Please use another username.")
                }
              }

          });
        });

        // Use AJAX to post the object to our adduser service


        console.log(newUser);
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

// Login User
function login(event) {

    event.preventDefault();

    var usernameTextbox = $('input#inputUserNameLogin').val();
    var passwordTextbox = $('input#inputPasswordLogin').val();
    var userFound = false;
    var count = 0;

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

      // Stick our user data array into a userlist variable in the global object
      userListData = data;

      // For each item in our JSON, see if it matches username and password
      $.each(data, function(){

          ++count;
          if (this.username == usernameTextbox) {
            userFound = true;
            if (this.password == passwordTextbox) {
              //console.log("Render Lobby page");
              $.cookie('user', usernameTextbox, {expires: 1}); // store logged-in user as cookie that expires in 1 day
              $.cookie('fullName', this.fullname, {expires: 1});
              lobbyScreen();
            } else {
              //set password textbox to empty when re-attempting password
              $('input#inputPasswordLogin').val('');
              alert("Password is incorrect!");
            }
            return false;
          }


          if (count == Object.keys(userListData).length) {
            if (!userFound) {
              var confirmation = confirm('No account found! Would you like to make an account?');
              if (confirmation) {
                createAccount();
              }
            }
          }

      });
    });

};

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  var timeinterval = setInterval(updateClock, 1000);
}



function createAccount(event) {
  event.preventDefault();
  createAccount();
}

function createAccount() {
  //console.log("Go to Create Account page");
  window.location.href = "/create";
}

function loginScreen() {
  //console.log("Go to Login Screen page");
  window.location.href = "/";
}

function lobbyScreen() {
  //console.log("Render Login Screen page");
  window.location.href = "/lobby";
}

function gameScreen() {
    //console.log("Render the game page");
    //set the user answer to Z
    
    console.log("Refreshing page...");
    window.location.href = "/game";

}

function gameOverScreen() {
    //console.log("Render the game page");
    //scoring();
    window.location.href = "/gameover";
}

/* Example of how to change answer */
/*
$.ajax({
    type: 'POST',
    url: '/users/updateanswer'
}).done(function( response ) {

    // Check for a successful (blank) response
    if (response.msg === '') {
      alert("Done!");
    }
    else {
        alert('Error: ' + response.msg);
    }

});
*/
