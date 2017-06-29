Serverless Local Alexa Server Plugin (Beta)
=======

This plugin exposes your Alexa skill functions as local HTTP endpoints, removing the need to deploy every change to AWS Lambda. You can connect these endpoints to your Alexa skill to via forwardhq, ngrok or any other forwarding tool.

This package requires node >= 6.0


# How To

### 1. Install the plugin

```sh
npm install git+ssh@github.com:DieProduktMacher/serverless-local-alexa-server.git --save-dev
```

### 2. Add the plugin to your serverless configuration file

*serverless.yml* configuration example:

```yaml
provider:
  name: aws
  runtime: nodejs4.3

functions:
  hello:
    handler: handler.hello
    events:
      - alexaSkill

# Add serverless-local-alexa-server to your plugins:
plugins:
  - serverless-local-alexa-server
```

### 3. Start the server

```sh
serverless local-alexa-server
```

On default the server listens on port 5005. You can specify another one with the *--port* argument:

```sh
serverless local-alexa-server --port 5000
```

To automatically restart the server when files change, you may use nodemon:

```sh
nodemon --exec "serverless local-alexa-server" -e "js yml json"
```

### 4. Share localhost with the internet

For example with forwardhq:

```sh
forward 5005
```

### 5. Configure AWS to use your HTTPS endpoint

In the Configuration pane, select HTTPS as service endpoint type and specify the forwarded endpoint URL.

As method for SSL Certificate validation select *My development endpoint is a sub-domain of a domain that has a wildcard certificate from a certificate authority*.


# TODO

* Automatic tests
* Support for environment variables


# License & Credits

Licensed under the MIT license.

Created and maintained by [DieProduktMacher](http://www.dieproduktmacher.com).
