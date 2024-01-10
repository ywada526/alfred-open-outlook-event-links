# alfred-open-outlook-event-links

[Alfred](https://alfredapp.com) workflow to open Outlook event links.

## Install

```sh
npm install --global alfred-open-outlook-event-links
```

*Requires [Node.js](https://nodejs.org) 18+ and [Alfred](https://www.alfredapp.com/) 4 or later with the paid [Powerpack](https://www.alfredapp.com/powerpack/).*

## Usage

In Alfred, you can use the following commands:

* `ool`:
  * Lists the Outlook events for the rest of today
  * Selecting a event and pressing <kbd>enter</kbd> will open any links in the event in a browser
* `ood`:
  * Logs out
* `ooa [your_access_token]`
  * Sets the access token to be used in workaround mode (mentioned later)

### Workaround for organization accounts

If your Microsoft account is an organizational account, administrative consent may be required for app access permissions ([risk-based step-up consent](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/configure-risk-based-step-up-consent)).

In this case, you can also pass the access token directly to the app at your own risk.

1. Set the value of the environment variable `USE_ACCESS_TOKEN_DIRECTLY` to `1` ([ref](https://www.alfredapp.com/help/workflows/advanced/variables/#environment))
1. Set the access token using the `ooa [your_access_token]` command
