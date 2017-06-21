'use strict'

const server = require('./server.js')

class ServerlessPlugin {
  constructor (serverless, options) {
    this.serverless = serverless
    this.options = options || {}

    this.commands = {
      'local-alexa-server': {
        usage: 'Runs a local server that serves as a webhook for Alexa',
        lifecycleEvents: [ 'start' ],
        options: {
          port: { usage: 'Port to listen on', shortcut: 'p' }
        }
      }
    }

    this.hooks = {
      'local-alexa-server:start': this.start.bind(this)
    }
  }

  start () {
    let config = {
      port: this.options.port || 5005,
      serverlessConfig: this.serverless.service,
      servicePath: this.serverless.config.servicePath
    }
    let log = msg => this.serverless.cli.log(msg)
    server.start(config, log)
  }
}

module.exports = ServerlessPlugin
