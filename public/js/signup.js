/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
$(document).ready(function() {
  // Getting references to our form and input
  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
function validateSignUp(){
  var stillgood = true;
  if($("#user-name-input").val()===""){
    $("#username-tip").html("Please provide a username");
    stillgood=false;
  }
  else{
    $("#username-tip").html("");
  }
  if($("#name-input").val()===""){
    $("#name-tip").html("Please provide a name");
    stillgood=false;
  }
  else{
    $("#name-tip").html("");
  }
  if($("#email-input").val()===""){
    $("#email-tip").html("Please provide an email");
    stillgood=false;
  }
  else{
    $("#email-tip").html("");
  }
  if($("#password-input").val()===""){
    $("#password-tip").html("Please provide a password");
    stillgood=false;
  }
  else{
    $("#password-tip").html("");
  }
  if($("#password-input").val()===$("#confirmPassword").val()&&stillgood){

    return true;
  }
  else{
    return false;
  }
}
(function($) {
  var handler = Plaid.create({
    clientName: "Plaid Quickstart",
    // Optional, specify an array of ISO-3166-1 alpha-2 country
    // codes to initialize Link; European countries will have GDPR
    // consent panel
    countryCodes: ["US"],
    env: "development",
    // Replace with your public_key from the Dashboard
    key: "d709a077c62c423a5d9652fa75e96b",
    product: ["transactions"],
    // Optional, use webhooks to get transaction and error updates
    webhook: "https://requestb.in",
    // Optional, specify a language to localize Link
    language: "en",
    // Optional, specify userLegalName and userEmailAddress to
    // enable all Auth features
    onLoad: function() {
      // Optional, called when Link loads
    },
    onSuccess: function(public_token, metadata) {
      var email = $("#email-input").val();
      var name = $("#name-input").val();
      var user = $("#user-name-input").val();
      var password = $("#password-input").val();
      // Send the public_token to your app server.
      // The metadata object contains info about the institution the
      // user selected and the account ID or IDs, if the
      // Select Account view is enabled.
      $.post("/get_access_token", {
        public_token: public_token,
      }).then(function(token){
        $.post("/api/signup", {
          username:user,
          name:name,
          email:email,
          password:password,
          public_token: token
        }).then(function(data) {
          window.location.replace(data);
          // If there's an error, handle it by throwing up a boostrap alert
        }).catch(handleLoginErr);});
    },
    onExit: function(err, metadata) {
      // The user exited the Link flow.
      if (err != null) {
        // The user encountered a Plaid API error prior to exiting.
      }
      // metadata contains information about the institution
      // that the user selected and the most recent API request IDs.
      // Storing this information can be helpful for support.
    },
    onEvent: function(eventName, metadata) {
      // Optionally capture Link flow events, streamed through
      // this callback as your users connect an Item to Plaid.
      // For example:
      // eventName = "TRANSITION_VIEW"
      // metadata  = {
      //   link_session_id: "123-abc",
      //   mfa_type:        "questions",
      //   timestamp:       "2017-09-14T14:42:19.350Z",
      //   view_name:       "MFA",
      // }
    }
  });

  $("#link-button").on("click", function(e) {
    if(validateSignUp()){
      handler.open();
    }
    else{
      alert("Your passwords do not match and/or you have not provided the required information.");
    }
  });
})(jQuery);
