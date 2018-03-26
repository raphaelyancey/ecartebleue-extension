var currentCountdown = null;

function storageCountdown() {
  
  browser.storage.local.get("clear_state_countdown")
  .then(function(items) {
    
    if('clear_state_countdown' in items) s = 10*1000;
    else s = items.clear_state_countdown*1000; // Seconds to milliseconds
    
    if(currentCountdown) {
      window.clearTimeout(currentCountdown);
      console.log('Cleared previous countdown.');
    }

    currentCountdown = window.setTimeout(function() {
      browser.storage.local.set({ last_state: null })
      .then(function() {
        console.info('Last state has been cleared.');
      })
      .catch(function() {
        console.error("Couldn't clear last state.");
      });
    }, s);

  });
}

function handleMessage(message, sender, answer) {

  if(!('id' in message)) return false;
  
  if(message.id == 'store') {
    if('data' in message) {
      browser.storage.local.set({
        last_state: {
          amount: message.data.amount,
          cc: message.data.cc,
          exp: message.data.exp,
          ccv: message.data.ccv
        }
      })
      .then(storageCountdown);
    } else console.error('No data in message.');
  }

  else if(message.id == 'fetch') {
    browser.storage.local.get(['last_state'])
    .then(function(storedState) {
      answer(storedState);
    })
    .catch(function() {
      console.info("No state was stored.");
    });
  }
}

browser.runtime.onMessage.addListener(handleMessage);