//
// test module
//
const config = require('./config.ldap.template.js');
const ldap = require('./ldap.js')(config);

ldap.getRoles('acastellon').then(console.log).catch(console.error);
