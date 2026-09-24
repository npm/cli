// These are config values whose contents should not be displayed.
// This is intentionally broader than nerfDarts because users may have old or
// invalid auth entries that still need to be protected when npm reports config.
const protected = [
  'auth',
  'authToken',
  'certfile',
  'email',
  'keyfile',
  'password',
  'username',
]

const isProtected = (key) => {
  // _password
  if (key.startsWith('_')) {
    return true
  }
  if (protected.includes(key)) {
    return true
  }
  // //localhost:8080/:_password
  if (key.startsWith('//')) {
    if (key.includes(':_')) {
      return true
    }
    // //registry:authToken or //registry:_authToken
    for (const protectedKey of protected) {
      if (key.endsWith(`:${protectedKey}`) || key.endsWith(`:_${protectedKey}`)) {
        return true
      }
    }
  }
  return false
}

module.exports = {
  isProtected,
}
