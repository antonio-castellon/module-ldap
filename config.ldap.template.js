module.exports = {
      url: 'ldap://<you-server>:389'
      //,secure : true
      ,DOMAIN:'<domain>'
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