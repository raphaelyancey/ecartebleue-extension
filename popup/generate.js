var API_URL = "http://localhost:3000";
***REMOVED***
var p = btoa(JSON.stringify(credentials));

var generateButton = $('button#generate');
var generatedForm = $('#generated');
var errorElement = $('#error');
var ccElement = $('#cc');
var expElement = $('#exp');
var ccvElement = $('#ccv');

errorElement.hide();

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
  $.post(API_URL + '/generate', { p: p })
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
    }
  })
  .always(function() {
    loading(false);
  });
});