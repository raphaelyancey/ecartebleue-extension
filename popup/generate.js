var API_URL = null;
var credentials = null;

var generateButton = $('button#generate');
var generatedForm = $('#generated');
var settingsLink = $('#settings');
var errorElement = $('#error');
var ccElement = $('#cc');
var expElement = $('#exp');
var ccvElement = $('#ccv');
var amountInput = $('#amount_value');
var passwordInput = $('#password');

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

  var amount = amountInput.val();
  var password = passwordInput.val();

  if(!API_URL || !credentials) {
    errorElement.html("Please fill in the settings before generating.")
    errorElement.show();
    loading(false);
    return; 
  }
  
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
    
    // Save auto-destructive state in case the popup gets dismissed
    browser.runtime.sendMessage({
      id: "store",
      data: {
        amount: amount,
        cc: res.cc,
        exp: res.exp,
        ccv: res.ccv
      }
    });

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

// Store amount at every change
amountInput.bind('keyup mouseup', function () {
  var amount = amountInput.val();
  if(!amount) return false;
  browser.runtime.sendMessage({
    id: "store",
    data: {
      amount: amount
    }
  });
});

function load() {
  browser.storage.local.get(['username', 'host', 'last_state'])
  .then(function(items) {
    console.info('Loaded settings.', items);
    credentials = [items.username]; // The password will be pushed after
    API_URL = items.host;
    
    if(items.last_state) {
      var s = items.last_state;
      if('amount' in s) amountInput.val(s.amount);
      if('cc' in s) ccElement.val(s.cc);
      if('exp' in s) expElement.val(s.exp);
      if('ccv' in s) ccvElement.val(s.ccv);
    }

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
load();