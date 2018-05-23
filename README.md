# Reach Auth0 Lock

A simple React wrapper for Auth0 Lock using React Context API.

## Usage

The library exposes three components; a provider, a consumer and a higher-order-component (HOC).

### AuthProvider

This component should be mounted as far out as you need it. In many cases, this would mean as part of the composition root of your application, example:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "react-auth0-lock";

import App from "./App";

ReactDOM.render(
  <AuthProvider clientId={AUTH0_CLIENT_ID} domain={AUTH0_DOMAIN}>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);
```

The `AuthProvider` component has the following properties:

#### `clientId` {String} (required)

Your application clientId in Auth0.

#### `domain` {String} (required)

Your Auth0 domain. Usually _your-account.auth0.com_.

#### `options` {Object} (optional)

Allows you to customize the Auth0 Lock dialog's appearance and behavior. See [Auth0 Lock Customization](https://github.com/auth0/lock#customization) for details.

#### `showLock` {Boolean} (default: false)

Whether of not the Auth0 Lock should be shown when the user is not authorized.

#### `storageKey` {String} (default: "auth:auth0")

The key which to store the `access_token`, `id_token` and `expires_at` from the Auth0 Authentication Response.

### AuthConsumer

Used for consuming authentication _anywhere_ in your application. This should always be used nested of a `AuthProvider`. It is a component, which children is invoked, using a function with the authentication result.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { AuthConsumer } from "react-auth0-lock";

export default class App extends React.Component {
  render() {
    return (
      <AuthConsumer>
        {({ isAuthenticated, accessToken, logout, login }) => {
          return isAuthenticated ? (
            <p>
              The user is authenticated!
              <button onClick={() => logout("http://localhost:8080")}>
                Logout
              </button>
            </p>
          ) : (
            <p>
              The user is not authenticated.{" "}
              <button onClick={() => login()}>Login</button>
            </p>
          );
        }}
      </AuthConsumer>
    );
  }
}
```

The `AuthConsumer´ component exposes a child function with the following properties:

#### `auth.isAuthenticated` {Boolean}

Whether the user is currently authenticated.

#### `auth.accessToken` {String}

The access token for the authenticated user.

#### `auth.idToken` {String}

The Open ID Connect token for the authenticated user.

#### `auth.expiresAt` {Integer}

The timestamp in seconds for when the token expires. Note that the `AuthProvider` will automatically renew tokens.

#### `auth.profile` {Object}

The user info profile object from the autenticated user.

#### `auth.login()` {Function}

A function which displays the Auth0 Lock interface.

#### `auth.logout(returnTo)` {Function}

A function which logs out a user and redirects to the provided URL.

#### `auth.lock` {Object}

A reference for the original Auth0 Lock instance. You can access any method or property on the Auth0 Lock object using this.

### withAuth(Component)

A higher-order-component (HOC) which injects the the above `auth` object from `AuthConsumer` into the wrapped component.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { withAuth } from "react-auth0-lock";

class App extends React.Component {
  render() {
    const { auth } = this.props;
    return <p>Is the user authenticated? {auth.isAuthenticated}</p>;
  }
}

export default withAuth(App);
```

## Contribution

Features, bugfixes and alike is always welcome and appreciated.

## License

MIT
