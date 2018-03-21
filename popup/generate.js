var API_URL = "http://localhost:3000";
var credentials = ['***REMOVED***', '***REMOVED***'];
var p = btoa(JSON.stringify(credentials));

var generateButton = $('button#generate');
var generatedForm = $('#generated');
var errorElement = $('#error');
var ccElement = $('#cc');
var expElement = $('#exp');
var ccvElement = $('#ccv');

function pristineState() {
  errorElement.hide();
}

generateButton.click(function() {
  pristineState();
  $.post(API_URL + '/generate', { p: p })
  .done(function(res) {
    console.log('••• res', res);
    ccElement.val(res.cc);
    expElement.val(res.exp.join('/'));
    ccvElement.val(res.ccv);
  })
  .fail(function(err) {
    if(err.error) {
      errorElement.html(err.error)
      errorElement.show();
    } else console.error(err);
  });
});