//
// Extended tests for ldap module
//
const assert = require('assert');
const config = require('./config.ldap.template.js');
const ldap = require('./ldap.js')(config);

async function run() {
  const roles = await ldap.getRoles('acastellon');
  assert.ok(roles && typeof roles === 'object');
  assert.ok('user' in roles);
  console.log('getRoles basic OK:', Object.keys(roles));

  // In local/mock mode many isXXX will be based on MOCKUP_ROLES
  if (process.env.SERVER_ENVIRONMENT === 'local') {
    console.log('Running in local mock mode');
  }

  console.log('ldap extended tests OK');
}

run().catch(console.error);
