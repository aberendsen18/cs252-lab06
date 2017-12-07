

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
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

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
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
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

//user login
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

function createAccount(event) {
    event.preventDefault();
    createAccount();
  }

function createAccount() {
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

    } else if (WebURL.includes('game')) {
        if (WebURL.includes('over')) {
          user = $.cookie('user');
        } else {
          var deadline = new Date(Date.parse(new Date()) + 60 * 1000);
          initializeClock('clockdiv', deadline);
          user = $.cookie('user');
        }

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
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

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
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
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

//user login
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
    window.location.href = "/game";

}

function gameOverScreen() {
    //console.log("Render the game page");
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
