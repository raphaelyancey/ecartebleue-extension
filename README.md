# ecartebleue-extension

WebExtension for generating eCarte Bleue numbers in one click using a [ecartebleue-cli-api](https://github.com/raphaelyancey/ecartebleue-cli-api) instance.

<img src="https://images2.imgbox.com/6a/a6/bIQzNw0n_o.png" alt="eCarte Bleue webextension screenshot" />

## Requirements

- Your eCarte Bleue credentials (you must have subscribed to this service via your bank)
- A running [ecartebleue-cli-api](https://github.com/raphaelyancey/ecartebleue-cli-api) instance URL
- Money to spend 💸

## FAQ

#### Are you seriously asking for my eCarte Bleue password?
Yup. But as long as you run your own API server and know how to read its code, there's no doubt I won't see it.

#### Why should I run the server myself?
Because it will be receiving sensitive informations I don't want to take responsibility of. If you're a bit into IT and read the [ecartebleue-cli-api](https://github.com/raphaelyancey/ecartebleue-cli-api) guide, your server should be up **for free** in a few minutes.

#### What is stored?
As WebExtension popups can't be forced to stay open, the amount, card number, expiration date and CCV are stored for a default period of 10s before auto-clearing. Otherwise, these informations would be lost as soon as the popup loose focus (by copy/pasting it in a checkout page for example).
