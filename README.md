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

**Example (with minimal setup):**

```js
const config = require('./config.ldap.template.js');
const ldap = require('@acastellon/ldap')(config);

ldap.getRoles('acastellon')
  .then(roles => {
    console.log('User:', roles.user);
    console.log('Is Admin?', roles.isAdmin);
  })
  .catch(err => console.error(err));
```

### isInGroup(userName, group): Promise<boolean>

**Example (with minimal setup):**

```js
const config = require('./config.ldap.template.js');
const ldap = require('@acastellon/ldap')(config);

ldap.isInGroup('acastellon', 'GR PR DIN ADMINISTRATOR')
  .then(isMember => console.log('Is member of group?', isMember))
  .catch(err => console.error(err));
```

### getIMDL(userName): Promise<groups[]>

Raw membership.

**Example (with minimal setup):**

```js
const config = require('./config.ldap.template.js');
const ldap = require('@acastellon/ldap')(config);

ldap.getIMDL('acastellon')
  .then(groups => console.log('Groups:', groups))
  .catch(err => console.error(err));
```

### getEmail(userName): Promise<string>

**Example (with minimal setup):**

```js
const config = require('./config.ldap.template.js');
const ldap = require('@acastellon/ldap')(config);

ldap.getEmail('acastellon')
  .then(email => console.log('Email:', email))
  .catch(err => console.error(err));
```

Also exposes: LDAP_URL, DOMAIN on the instance.

## License

MIT
