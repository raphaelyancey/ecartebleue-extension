var saveButton = $('#save');
var clearButton = $('#clear');
var usernameInput = $('#username');
var passwordInput = $('#password');
var hostInput = $('#host');
var countdownInput = $('#countdown');
var result = $('#result');

browser.storage.local.get(['username', 'host', 'clear_state_countdown'])
.then(function(items) {
  usernameInput.val(items.username);
  hostInput.val(items.host);
  countdownInput.val(items.clear_state_countdown);
});

saveButton.click(function() {
  if(!usernameInput.val() || !hostInput.val() || !countdownInput.val()) return false;
  browser.storage.local.set({
    username: usernameInput.val(),
    host: hostInput.val(),
    clear_state_countdown: parseInt(countdownInput.val())
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