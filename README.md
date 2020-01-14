# ldap
LDAP generic interface module that filter and returns the available roles depending of previous definition file

the validation is taking the SERVER_ENVIRONMENT variable as a reference, 
in case of value equals to "local", it will not use the ldap validation and it will use 
the mockup users and roles defined in the setup file.

    module.exports = {
          url: 'ldap://<you-server>:389'
          //,secure : true
          ,baseDN: '<baseDN>'
          ,username: '<user>'
          ,password: '<password>'
          ,MOCKUP_USERS : ['acastellon','lskywalker']
          ,MOCKUP_ROLES : ['User','Viewer']
          ,ROLES : {
                'User': 'GR PR DIN USER'
                , 'Admin': 'GR PR DIN ADMINISTRATOR '
                , 'Viewer': 'GR PR DIN VIEWER '
          }
    } 

usage : 

    const setup = require('./config.ldap.js');
    const ldap = require('./ldap.js')(setup);
    
    ldap.getRoles('acastellon')
        .then( function(value) { 
                                    console.log(value); 
                               });
