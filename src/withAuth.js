import React from "react";

import { Consumer } from "./context";

export function withAuth(Component) {
  return function AuthComponent(props) {
    return <Consumer>{auth => <Component {...props} auth={auth} />}</Consumer>;
  };
}
