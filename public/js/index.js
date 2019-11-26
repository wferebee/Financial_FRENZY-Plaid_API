/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
var createAccount = $("<h1>Create Your Account</h1><div class=\"form-group\"><label for=username>Your Username: </label><input type=text id=username class=form-control><br><label for=name>Your Name: </label><input type=text id=name class=form-control><br><label for=email>Your Email: </label><input type=email class=form-control id=email><br><label for=password>Choose a Password: </label><input type=\"password\" class=form-control id=password><br><label for=confirmPass>Confirm your Password: </label><input type=\"password\" class=form-control id=confirmPass></div><button type=\"submit\" class=\"btn btn-primary\" id=\"nextPart\">Next</button>");


function makeAccount(){
  $("#accountBox").html(createAccount);
}


