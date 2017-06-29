
// Succeed if request object ...
module.exports.alexaSkill = (request, context) => {
  context.succeed()
}

// Returns process.env
module.exports.mirrorEnv = (request, context) => {
  console.log(process.env)
  context.succeed(process.env)
}

// Invokes the fail callback
module.exports.fail = (_, context) => {
  context.fail(new Error('Some reason'))
}

module.exports.empty = () => null

