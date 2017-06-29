/* global describe it beforeEach afterEach */
const expect = require('chai').expect
const path = require('path')
const sinon = require('sinon')
const Serverless = require('serverless/lib/Serverless')
const AwsProvider = require('serverless/lib/plugins/aws/provider/awsProvider')
const AlexaDevServer = require('../src')

describe('index.js', () => {
  var sandbox, serverless, alexaDevServer

  beforeEach(() => {
    sandbox = sinon.sandbox.create()

    serverless = new Serverless()
    serverless.init()
    serverless.setProvider('aws', new AwsProvider(serverless))
    serverless.config.servicePath = path.join(__dirname, '../test-service')
  })

  afterEach((done) => {
    sandbox.restore()
    done()
  })

  it('should have hooks', () => {
    alexaDevServer = new AlexaDevServer(serverless)
    expect(Object.keys(alexaDevServer.hooks).length).to.not.equal(0)
  })

  it('should start a server and accept requests', () => {
    serverless.service.functions = {
      'MyAlexaSkill': {
        handler: 'handler.basic',
        events: [ 'alexaSkill' ]
      },
      'SomeOtherFunction': {
        handler: 'handler.empty',
        events: [ ]
      }
    }
    alexaDevServer = new AlexaDevServer(serverless)
    // TODO: Check
    return alexaDevServer.hooks['local-alexa-server:start']()
  })

  it('should start a server with a custom port and accept requests', () => {
    serverless.service.functions = {
      'MyAlexaSkill': {
        handler: 'handler.handle',
        events: [ 'alexaSkill' ]
      }
    }
    alexaDevServer = new AlexaDevServer(serverless, {
      port: 5000
    })
    // TODO: Check
    return alexaDevServer.hooks['local-alexa-server:start']()
  })

  it('should start a server with a custom port and accept requests', () => {
    serverless.service.environment = {
      foo: 'bar',
      bla: 'blub'
    }
    serverless.service.functions = {
      'MyAlexaSkill': {
        handler: 'handler.handle',
        events: [ 'alexaSkill' ],
        environment: {
          foo: 'baz'
        }
      }
    }
    alexaDevServer = new AlexaDevServer(serverless)
    // TODO: Check
    return alexaDevServer.hooks['local-alexa-server:start']()
  })

  it('should not start a server if no alexa-functions are specified', () => {
    serverless.service.functions = {
      'SomeHttpFunction': {
        handler: 'handler.empty',
        events: [ 'http' ]
      }
    }
    alexaDevServer = new AlexaDevServer(serverless)
    // TODO: Check
    return alexaDevServer.hooks['local-alexa-server:start']()
  })

})
