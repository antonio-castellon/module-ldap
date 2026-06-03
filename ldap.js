"use strict";
// -- LDAP Simple access system
//
// Castellon.CH - 2019-2026 (c)
// Author: Antonio Castellon - antonio@castellon.ch
//
// see the template attached for structure file passed to

const ActiveDirectory = require('activedirectory');

/**
 * LDAP role filter.
 * @param {object} setup - LDAP + ROLES + MOCKUP config
 *
 * Supports passwords/username from environment variables (LDAP_PASSWORD etc.)
 * so they don't have to be hardcoded in config files.
 */
module.exports = function(setup = {}) {
  // Shallow copy + env secret resolution (so callers like @acastellon/auth and direct
  // users can omit secrets from their committed config).
  setup = { ...setup };

  function getSecret(provided, ...envNames) {
    if (provided != null && typeof provided === 'string' && provided.length > 0 && !provided.startsWith('<')) {
      return provided;
    }
    for (const envName of envNames) {
      const val = process.env[envName];
      if (val != null && val !== '') {
        return val;
      }
    }
    return provided;
  }

  setup.password = getSecret(setup.password, 'LDAP_PASSWORD', 'AUTH_LDAP_PASSWORD', 'AD_PASSWORD', 'LDAP_BIND_PASSWORD');
  setup.username = getSecret(setup.username, 'LDAP_USERNAME', 'AUTH_LDAP_USERNAME', 'AD_USERNAME', 'LDAP_BIND_USER');

  const model = {};

  const ad = new ActiveDirectory(setup);
  const listOfRoles = Object.keys(setup.ROLES);

  model.LDAP_URL = setup.url;
  model.DOMAIN = setup.DOMAIN;
  model.isInGroup = isInGroup;
  model.getRoles = getRoles;
  model.getIMDL = getIMDL;
  model.getEmail = getEmail;

  /**
   * @param {string} userName
   * @param {string} group
   * @returns {Promise<boolean>}
   */
  function isInGroup(userName, group){
    return new Promise((resolve) => {
      ad.isUserMemberOf(userName, group, (err, isMember) => {
        resolve(isMember);
      });
    });
  }

  function getMockupRoles(userName){
    const roles = { user : userName };
    listOfRoles.forEach((value) => {
      roles['is' + value] = (setup.MOCKUP_ROLES.indexOf(value) >= 0);
    });
    return roles;
  }

  /**
   * Returns role flags. In local env uses MOCKUP_ROLES.
   * @param {string} userName
   * @returns {Promise<object>}
   */
  function getRoles(userName)
  {
    if (process.env.SERVER_ENVIRONMENT === 'local') {
      return Promise.resolve(getMockupRoles(userName));
    }

    return new Promise((resolve) => {
      ad.getGroupMembershipForUser(userName, (err, groups) => {
        const roles = { user : userName };
        listOfRoles.forEach((value) => { roles['is' + value] = false; });

        if (groups) {
          for (const g of groups) {
            const _group = g.cn.toUpperCase();
            listOfRoles.forEach((value) => {
              if (_group.includes( setup.ROLES[value] )) {
                roles['is' + value] = true;
              }
            });
          }
        }
        resolve(roles);
      });
    });
  }

  /**
   * Raw group membership.
   * @param {string} userName
   * @returns {Promise}
   */
  function getIMDL(userName){
    return new Promise((resolve) => {
      ad.getGroupMembershipForUser(userName, (err, groups) => {
        resolve(groups || []);
      });
    });
  }

  /**
   * @param {string} userName
   * @returns {Promise<string>}
   */
  function getEmail(userName){
    return new Promise((resolve, reject) => {
      ad.findUser(userName, (err, user) => {
        if (err) {
          console.log('ERROR: ' +JSON.stringify(err));
          reject('ERROR: ' +JSON.stringify(err));
          return;
        }
        if (! user) {
          resolve('');
        }
        else {
          resolve(JSON.stringify(user.mail));
        }
      });
    });
  }

  return model;
};