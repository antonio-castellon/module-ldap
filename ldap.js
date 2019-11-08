"use strict";
// -- LDAP Simple access system
//
// Castellon.CH - 2019 (c)
// Author: Antonio Castellon - antonio@castellon.ch
//
// see the template attached for structure file passed to
//
const ActiveDirectory = require('activedirectory');

module.exports = function(setup) {

  const model = {};

  //
  // CONFIGURATION
  //
  const ad = new ActiveDirectory(setup);
  const listOfRoles = Object.keys(setup.ROLES);

  process.env.SERVER_ENVIRONMENT = process.env.SERVER_ENVIRONMENT.trim(); //trick. npm is adding in script a blank character

  //
  // ASSIGNATIONS
  //
  model.LDAP_URL = setup.url;
  model.DOMAIN = setup.DOMAIN;
  model.isInGroup = isInGroup;
  model.getRoles = getRoles;
  model.getIMDL = getIMDL;
  model.getEmail = getEmail;


  //
  //  FUNCTION BODY
  //


  function isInGroup(userName,group){

    return new Promise(function(resolve, reject){
      ad.isUserMemberOf(  userName,  group,
        function(err, isMember) {
          resolve(isMember);
        }
      );
    })

  }

  function getMockupRoles(userName){

    let roles = {  user : userName  }

    listOfRoles.forEach(function(value){
      roles['is' + value] = (setup.MOCKUP_ROLES.indexOf(value) >= 0) ? true : false;
    });

    return roles;

  }


  function getRoles(userName)
  {

    if (process.env.SERVER_ENVIRONMENT == 'local') {
      return new Promise(function (resolve, reject) { resolve(getMockupRoles(userName)); });
    }

    return new Promise(function(resolve, reject) {

      ad.getGroupMembershipForUser(userName, function(err, groups) {

        let roles = { user : userName };

        listOfRoles.forEach(function(value){
          roles['is' + value] = false;
        });

        for (var i in groups) {

          let _group = groups[i].cn.toUpperCase();

          listOfRoles.forEach(function(value){

            if (_group.indexOf( setup.ROLES[value] + process.env.SERVER_ENVIRONMENT) > 0) {
              roles['is' + value] = true;
            }
          });
        }

        resolve(roles);
      })

    })

  }

  function getIMDL(userName){

    return new Promise(function(resolve, reject) {

      ad.getGroupMembershipForUser(userName, function(err, groups) {
        resolve(groups);
      })
    })
  }

  function getEmail(userName){
    return new Promise(function(resolve, reject) {
      ad.findUser(userName, function(err, user) {
        if (err) {
          console.log('ERROR: ' +JSON.stringify(err));
          reject('ERROR: ' +JSON.stringify(err));
          return
        }

        if (! user) {
          //console.log('User: ' + userName + ' not found.');
          resolve('');
        }
        else {
          //console.log('email found : ' + JSON.stringify(user.mail));
          resolve(JSON.stringify(user.mail));
        }
      });
    })
  }

  return model;
}



