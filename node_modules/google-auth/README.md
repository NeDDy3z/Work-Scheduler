google-auth
===========

Command line tool to retrieve oauth tokens for programmatic access to google services.


## Installation

`npm install -g google-auth`

## Usage

### Obtain Google Client ID & Secret

* Go to https://console.developers.google.com
* If there is not a project there, create a new one 
* Click on the projects name
* Navigate to API & Auth / Credentals 
* Create new client with these options 
![client](http://i.gif.fm/KiiC9.png)
* Record the client secret and id
* Go to https://console.developers.google.com/project/86071142858/apiui/consent
    * make sure the `email` and `product name` fields are filled in

### Running the command line program

```
$ google-auth --id=<client_id> --secret=<client_secret> [services to auth with]
```

If you do not pass in the `id` and `secret` parameters, the app will look for the environmental
variables `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### Example

For example, to authenticate with google drive and google calendar:

```

$ export GOOGLE_CLIENT_ID=<client_id>
$ export GOOGLE_CLIENT_SECRET=<client_secret>
$ google-auth drive calendar

```

this will open a web browser for you to confirm your authentication.

