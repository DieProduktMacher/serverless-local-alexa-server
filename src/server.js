'use strict'

const Express = require('express')
const BodyParser = require('body-parser')
const path = require('path')

// Collects all Alexa endpoints from the serverless config object
const getEndpoints = (serverlessConfig, servicePath) => {
  return Object.keys(serverlessConfig.functions).map(name => (
    { name: name, config: serverlessConfig.functions[name] }
  )).filter(lambda =>
    lambda.config.events.indexOf('alexaSkill') > -1
  ).map(lambda => {
    let handlerParts = lambda.config.handler.split('.')
    return {
      lambdaName: lambda.name,
      path: `/${lambda.name}`,
      modulePath: path.join(servicePath, handlerParts[0]),
      functionName: handlerParts[1],
      environment: Object.assign({}, serverlessConfig.provider.environment, lambda.config.environment)
    }
  })
}

// Executes the lambda function behind an endpoint
const executeLambda = (endpoint, request, defaultEnvironment) => {
  return new Promise((resolve, reject) => {
    let lambdaFunction = require(endpoint.modulePath)[endpoint.functionName]
    process.env = Object.assign({}, endpoint.environment, defaultEnvironment)
    lambdaFunction(request.body, { succeed: resolve, fail: reject })
  })
}

// Start the server
module.exports.start = (options, log) => {
  let endpoints = getEndpoints(options.serverlessConfig, options.servicePath)
  if (endpoints.length === 0) {
    log('No Lambdas with Alexa events found')
    return
  }

  process.env.IS_OFFLINE = true
  let defaultEnvironment = Object.assign({}, process.env)

  let app = Express()
  app.use(BodyParser.json())
  endpoints.forEach(endpoint => {
    app.post(endpoint.path, (request, response) => {
      executeLambda(endpoint, request, defaultEnvironment).then(result => {
        log(`Responded to ${endpoint.lambdaName}`)
        response.send(result)
      }).catch(error => {
        log(`Error responding to ${endpoint.lambdaName}:`)
        log(`  ${error}`)
        response.send(error)
      })
    })
  })
  app.listen(options.port, _ => {
    const baseUrl = `http://localhost:${options.port}`
    endpoints.forEach(endpoint => {
      log(`${endpoint.lambdaName} -> ${baseUrl}${endpoint.path}`)
    })
  })
}
