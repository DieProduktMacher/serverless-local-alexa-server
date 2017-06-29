
// Succeed if request object has correct form
module.exports.alexaSkill = (request, context) => {
  if (!request.session) {
    context.fail(new Error('session-object not in request JSON'))
  } else if (!request.request) {
    context.fail(new Error('request-object not in request JSON'))
  } else if (request.version !== '1.0') {
    context.fail(new Error('version not 1.0'))
  } else {
    context.succeed()
  }
}

// Returns process.env
module.exports.mirrorEnv = (request, context) => {
  context.succeed(process.env)
}

// Invokes the succeed callback
module.exports.succeed = (_, context) => {
  context.succeed()
}

// Invokes the fail callback
module.exports.fail = (_, context) => {
  context.fail(new Error('Some reason'))
}
