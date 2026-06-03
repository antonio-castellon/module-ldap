"use strict";
// -- LDAP Simple access system
//
// Castellon.CH - 2019-2026 (c)
// Author: Antonio Castellon - antonio@castellon.ch
//
// see the template attached for structure file passed to

const ActiveDirectory = require('activedirectory');

module.exports = function(setup) {

  const model = {};

  const ad = new ActiveDirectory(setup);
  const listOfRoles = Object.keys(setup.ROLES);

  // ASSIGNATIONS
  model.LDAP_URL = setup.url;
  model.DOMAIN = setup.DOMAIN;
  model.isInGroup = isInGroup;
  model.getRoles = getRoles;
  model.getIMDL = getIMDL;
  model.getEmail = getEmail;

  function isInGroup(userName, group) {
    return new Promise((resolve) => {
      ad.isUserMemberOf(userName, group, (err, isMember) => {
        resolve(isMember);
      });
    });
  }

  function getMockupRoles(userName) {
    const roles = { user: userName };
    listOfRoles.forEach((value) => {
      roles['is' + value] = (setup.MOCKUP_ROLES.indexOf(value) >= 0);
    });
    return roles;
  }

  function getRoles(userName) {
    if (process.env.SERVER_ENVIRONMENT === 'local') {
      return Promise.resolve(getMockupRoles(userName));
    }

    return new Promise((resolve) => {
      ad.getGroupMembershipForUser(userName, (err, groups) => {
        const roles = { user: userName };
        listOfRoles.forEach((value) => {
          roles['is' + value] = false;
        });

        if (groups) {
          for (const g of groups) {
            const _group = g.cn.toUpperCase();
            listOfRoles.forEach((value) => {
              if (_group.includes(setup.ROLES[value])) {
                roles['is' + value] = true;
              }
            });
          }
        }
        resolve(roles);
      });
    });
  }

  function getIMDL(userName) {
    return new Promise((resolve) => {
      ad.getGroupMembershipForUser(userName, (err, groups) => {
        resolve(groups || []);
      });
    });
  }

  function getEmail(userName) {
    return new Promise((resolve, reject) => {
      ad.findUser(userName, (err, user) => {
        if (err) {
          console.log('ERROR: ' + JSON.stringify(err));
          reject('ERROR: ' + JSON.stringify(err));
          return;
        }
        if (!user) {
          resolve('');
        } else {
          resolve(JSON.stringify(user.mail));
        }
      });
    });
  }

  return model;
};
