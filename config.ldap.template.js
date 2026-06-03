module.exports = {
  url: 'ldap://<you-server>:389',
  // secure: true,
  DOMAIN: '<domain>',
  baseDN: '<baseDN>',
  // username: '<user>',                 // prefer env for real deployments
  // password: '<password>',             // NEVER hardcode real secrets
  //
  // The module supports reading from env automatically:
  //   username <- LDAP_USERNAME, AUTH_LDAP_USERNAME, AD_USERNAME, LDAP_BIND_USER
  //   password <- LDAP_PASSWORD, AUTH_LDAP_PASSWORD, AD_PASSWORD, LDAP_BIND_PASSWORD
  //
  // You can safely omit username/password from this file when using env vars.
  MOCKUP_USERS: ['acastellon', 'lskywalker'],
  MOCKUP_ROLES: ['User', 'Viewer'],
  ROLES: {
    'User': 'GR PR DIN USER',
    'Admin': 'GR PR DIN ADMINISTRATOR ',
    'Viewer': 'GR PR DIN VIEWER '
  }
};