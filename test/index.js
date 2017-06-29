/* global describe it beforeEach afterEach */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const fetch = require('node-fetch')
const path = require('path')
const sinon = require('sinon')
const Serverless = require('serverless/lib/Serverless')
const AwsProvider = require('serverless/lib/plugins/aws/provider/awsProvider')
const AlexaDevServer = require('../src')

chai.use(chaiAsPromised)
const expect = chai.expect

describe('index.js', () => {
  var sandbox, serverless, alexaDevServer

  const sendAlexaRequest = (port) => {
    return fetch(`http://localhost:${port}/MyAlexaSkill`, { method: 'POST', body: '{}' })
  }

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
        handler: 'handler.alexaSkill',
        events: [ 'alexaSkill' ]
      },
      'SomeOtherFunction': {
        handler: 'handler.empty',
        events: [ ]
      }
    }
    alexaDevServer = new AlexaDevServer(serverless)
    alexaDevServer.hooks['local-alexa-server:start']()
    return sendAlexaRequest(5005).then(result =>
      expect(result.ok).equal(true)
    )
  })

  it('should start a server with a custom port and accept requests', () => {
    serverless.service.functions = {
      'MyAlexaSkill': {
        handler: 'handler.alexaSkill',
        events: [ 'alexaSkill' ]
      }
    }
    alexaDevServer = new AlexaDevServer(serverless, { port: 5006 })
    alexaDevServer.hooks['local-alexa-server:start']()
    return sendAlexaRequest(5006).then(result =>
      expect(result.ok).equal(true)
    )
  })

  it('should set environment variables correctly', () => {
    serverless.service.environment = {
      foo: 'bar',
      bla: 'blub'
    }
    serverless.service.functions = {
      'MyAlexaSkill': {
        handler: 'handler.mirrorEnv',
        events: [ 'alexaSkill' ],
        environment: {
          foo: 'baz'
        }
      }
    }
    alexaDevServer = new AlexaDevServer(serverless, { port: 5007 })
    alexaDevServer.hooks['local-alexa-server:start']()
    return sendAlexaRequest(5007).then(result => {
      expect(result.ok).equal(true)
      return result.json()
    }).then(json => {
      expect(json.foo).equal('baz')
      expect(json.bla).equal('blub')
    })
  })

  it('should not start a server if no alexa-functions are specified', () => {
    serverless.service.functions = {
      'SomeHttpFunction': {
        handler: 'handler.empty',
        events: [ 'http' ]
      }
    }
    alexaDevServer = new AlexaDevServer(serverless, { port: 5008 })
    alexaDevServer.hooks['local-alexa-server:start']()
    // Expect rejection of request as no server is running on port 5008
    return expect(sendAlexaRequest(5008)).to.be.rejected
  })

  it('should handle failures', () => {
    serverless.service.functions = {
      'SomeHttpFunction': {
        handler: 'handler.fail',
        events: [ 'alexaSkill' ]
      }
    }
    alexaDevServer = new AlexaDevServer(serverless, { port: 5009 })
    alexaDevServer.hooks['local-alexa-server:start']()
    return sendAlexaRequest(5009).then(result =>
      expect(result.ok).equal(false)
    )
  })
})
