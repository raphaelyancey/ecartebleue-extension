var API_URL = "http://localhost:3000";
var credentials = null;

var generateButton = $('button#generate');
var generatedForm = $('#generated');
var settingsLink = $('#settings');
var errorElement = $('#error');
var ccElement = $('#cc');
var expElement = $('#exp');
var ccvElement = $('#ccv');

function pristineState() {
  errorElement.hide();
}

function loading(state) {
  if(state) {
    generateButton.attr('disabled', true);
    $('.ready', generateButton).hide();
    $('.loading', generateButton).show();
  } else {
    generateButton.attr('disabled', false);
    $('.ready', generateButton).show();
    $('.loading', generateButton).hide();
  }
}

generateButton.click(function() {
  
  pristineState();
  loading(true);

  var amount = $('#amount_value').val();
  var password = $('#password').val();

  if(!amount || !password) {
    errorElement.html("Please fill in the amount and your eCarte Bleue password.")
    errorElement.show();
    loading(false);
    return;
  }

  credentials.push(password);
  credentials = btoa(JSON.stringify(credentials));

  $.post(API_URL + '/generate', { p: credentials, a: amount })
  .done(function(res) {
    ccElement.val(res.cc);
    expElement.val(res.exp.join('/'));
    ccvElement.val(res.ccv);
  })
  .fail(function(err) {
    console.error(err);
    if(err.responseJSON && 'error' in err.responseJSON) {
      errorElement.html(err.responseJSON.error)
      errorElement.show();
    } else {
      errorElement.html("An unknown error occured. Is the API host up and running?")
      errorElement.show();
    }
  })
  .always(function() {
    loading(false);
  });

});

settingsLink.click(function() {
  browser.runtime.openOptionsPage();
});

function loadCredentials() {
  browser.storage.local.get(['username', 'host'])
  .then(function(items) {
    credentials = [items.username];
    API_URL = items.host;
    console.info('Loaded settings.');
    generateButton.attr('disabled', false);
  })
  .catch(function() {
    console.info('Failed loading settings or non-existent.');
    errorElement.html("The settings are empty or couldn't be loaded.")
    errorElement.show();
    generateButton.attr('disabled', true);
  });
}

// ---------------------------------------------------------

errorElement.hide();
generateButton.attr('disabled', true);
loadCredentials();