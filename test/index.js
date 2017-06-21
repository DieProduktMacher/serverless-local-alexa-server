/* global describe it beforeEach afterEach */
const expect = require('chai').expect
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
  })

  afterEach((done) => {
    sandbox.restore()
    done()
  })

  it('should have hooks', () => {
    alexaDevServer = new AlexaDevServer(serverless)
    expect(Object.keys(alexaDevServer.hooks).length).to.not.equal(0)
  })

  it('should start a server', () => {
    alexaDevServer = new AlexaDevServer(serverless)
    // TODO: Write tests
    return alexaDevServer.hooks['local-alexa-server:start']()
  })

  it('should start a server with a custom port', () => {
    alexaDevServer = new AlexaDevServer(serverless)
    // TODO: Write tests
    return alexaDevServer.hooks['local-alexa-server:start']()
  })

  it('should not start a server if no alexa-functions are specified', () => {
    alexaDevServer = new AlexaDevServer(serverless)
    // TODO: Write tests
    return alexaDevServer.hooks['local-alexa-server:start']()
  })

  it('should handle requests', () => {
    alexaDevServer = new AlexaDevServer(serverless)
    // TODO: Write tests
    return alexaDevServer.hooks['local-alexa-server:start']()
  })
})
