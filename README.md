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

### getRoles(userName): Promise<{user: string, isXXX: boolean, ...}>

Main method. Returns user + boolean flags for each key in ROLES.

- In local mode: driven purely by MOCKUP_ROLES.
- Otherwise: queries ActiveDirectory groups and matches against ROLES values (case-insensitive contains).

### isInGroup(userName, group): Promise<boolean>

### getIMDL(userName): Promise<groups[]>
Raw membership.

### getEmail(userName): Promise<string>

Also exposes: LDAP_URL, DOMAIN on the instance.

## License

MIT
