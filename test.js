//
// test module
//
const setup = require('./config.ldap.js');
const ldap = require('./ldap.js')(setup);

ldap.getRoles('acastellon').then(function(value) { console.log(value); });
ldap.getIMDL('acastellon').then(function(value) { console.log(value[0]); });
ldap.getEmail('acastellon').then(function(value) { console.log('@email : ' + value); });
