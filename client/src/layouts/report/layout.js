import PropTypes from "prop-types";
import { AuthGuard } from "src/guards/auth-guard";

// TODO: Change subtitle text

export const Layout = (props) => {
  const { children } = props;

  return <AuthGuard>{children}</AuthGuard>;
};

Layout.prototypes = {
  children: PropTypes.node,
};
