import React from "react";
import PropTypes from "prop-types";

import { Consumer } from "./context";

export default class AuthConsumer extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  render() {
    const { children } = this.props;
    return <Consumer>{props => children({ ...props })}</Consumer>;
  }
}
