# @acastellon/ldap

LDAP module to validate and filter roles from a user based on group membership (using activedirectory).

Supports mockup mode for local dev via SERVER_ENVIRONMENT=local .

## Install

```bash
npm install @acastellon/ldap
```

## Config

See config.ldap.template.js (url, baseDN, ROLES map to LDAP groups, MOCKUP_*).

## Usage

```js
const config = require('./config.ldap.template.js');
const ldap = require('@acastellon/ldap')(config);

ldap.getRoles('username').then(roles => console.log(roles.isAdmin));
```

## API
- getRoles(userName): Promise<{user, isXXX: bool, ...}>
- isInGroup, getIMDL, getEmail

## License

MIT
