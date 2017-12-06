
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

    populateTable();

    WebURL = location.href;
    //console.log(WebURL);

    if (WebURL.includes('lobby')) {
      user = $.cookie('user');
      if (user == 'null') {
        alert('Please sign in first before entering the lobby!');
        loginScreen();
      }
    } else if (WebURL.includes('create')) {
      user = null;
      $.cookie('user', user, {expires: 1}); // reset logged-in user as cookie that expires in 1 day
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

    // Logout button click
    $('#btnLogOut').on('click', function() {
      alert("Thanks for playing!");
      loginScreen();
    });



});

// Functions =============================================================

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
