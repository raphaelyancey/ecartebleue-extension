var saveButton = $('#save');
var clearButton = $('#clear');
var usernameInput = $('#username');
var passwordInput = $('#password');
var hostInput = $('#host');
var result = $('#result');

browser.storage.local.get(['username', 'password', 'host'])
.then(function(items) {
  usernameInput.val(items.username);
  passwordInput.val(items.password);
  hostInput.val(items.host);
});

saveButton.click(function() {
  browser.storage.local.set({
    username: usernameInput.val(),
    password: passwordInput.val(),
    host: hostInput.val() 
  })
  .then(function() {
    result.html('Saved settings (' + (new Date()).toISOString() + ')')
  });
});

clearButton.click(function(e) {
  e.preventDefault();
  browser.storage.local.clear()
  .then(function() {
    result.html('Cleared settings (' + (new Date()).toISOString() + ')')
  })
  .catch(function() {
    result.html("Couldn't clear settings (" + (new Date()).toISOString() + ')')
  });
});