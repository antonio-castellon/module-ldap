# @acastellon/ldap

LDAP module to validate and filter roles from a user based on group membership (using activedirectory).

Supports mockup mode for local dev via SERVER_ENVIRONMENT=local .

Supports passwords and bind credentials from environment variables (LDAP_PASSWORD etc.) to avoid hardcoding secrets in config files.

## Install

```bash
npm install @acastellon/ldap
```

## Config

See config.ldap.template.js (url, baseDN, ROLES map to LDAP groups, MOCKUP_*).

## Secrets from Environment Variables

For production, do not put real `username` / `password` in the config file.

Omit them (or comment them) and the module will read:

- password: `LDAP_PASSWORD`, `AUTH_LDAP_PASSWORD`, `AD_PASSWORD`, `LDAP_BIND_PASSWORD`
- username: `LDAP_USERNAME`, `AUTH_LDAP_USERNAME`, `AD_USERNAME`, `LDAP_BIND_USER`

Example (safe committed config):

```js
module.exports = {
  url: 'ldap://ldap.example.com:389',
  DOMAIN: 'EXAMPLE',
  baseDN: 'dc=example,dc=com',
  // username/password intentionally omitted
  ROLES: { ... }
};
```

Run with the vars set in your environment / systemd / docker / etc.

## Usage

```js
const config = require('./config.ldap.template.js');
const ldap = require('@acastellon/ldap')(config);

ldap.getRoles('username').then(roles => console.log(roles.isAdmin));
```

(For secrets, prefer env vars over values inside config.ldap.template.js — see above.)

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

## Notice and Disclaimer

NOTICE AND DISCLAIMER: This software automatically retrieves, accesses or interacts with external materials. Those retrieved materials are not distributed with this software and are governed solely by separate terms, conditions and licenses. You are solely responsible for finding, reviewing and complying with all applicable terms, conditions, and licenses, and for verifying the security, integrity and suitability of any retrieved materials for your specific use case. This software is provided "AS IS", without warranty of any kind. The author makes no representations or warranties regarding any retrieved materials, and assumes no liability for any losses, damages, liabilities or legal consequences from your use or inability to use this software or any retrieved materials. Use this software and the retrieved materials at your own risk.

External materials module-ldap interacts with at run time:

- Your LDAP directory, under your agreements for that system.
