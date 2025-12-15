import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Card, Grid, Switch } from "@mui/material";
import { AppHeader } from "shared/layout/AppHeader";
import { AppFooter } from "shared/layout/AppFooter";
import { MKBox } from "shared/ui/MKBox";
import { MKButton } from "shared/ui/MKButton";
import { MKTypography } from "shared/ui/MKTypography";
import { MKInput } from "shared/ui/MKInput";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        role
      }
    }
  }
`;

type LoginProps = {
  onLoggedIn: () => void;
};

type LoginData = {
  login: {
    token: string;
    user: {
      id: string;
      username: string;
      role: string;
    };
  };
};

export function Login({ onLoggedIn }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMutation, { loading, error }] = useMutation<LoginData>(LOGIN, {
    onCompleted: data => {
      localStorage.setItem("token", data.login.token);
      localStorage.setItem("user", JSON.stringify(data.login.user));
      onLoggedIn();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    loginMutation({ variables: { username, password } });
  }

  return (
    <>
      <AppHeader />
      <MKBox
        component="main"
        minHeight="100vh"
        sx={theme => ({
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
          px: 2,
        })}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={5} lg={4}>
            <Card>
              <MKBox
                sx={theme => ({
                  background: theme.palette.info.main,
                  color: theme.palette.common.white,
                  px: 3,
                  py: 2,
                  borderTopLeftRadius: theme.shape.borderRadius,
                  borderTopRightRadius: theme.shape.borderRadius,
                  textAlign: "center",
                })}
              >
                <MKTypography variant="h5">Sign in</MKTypography>
              </MKBox>
              <MKBox component="form" onSubmit={handleSubmit} px={3} py={3}>
                <MKBox mb={2}>
                  <MKInput
                    label="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </MKBox>
                <MKBox mb={2}>
                  <MKInput
                    type="password"
                    label="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </MKBox>
                <MKBox display="flex" alignItems="center" mb={2}>
                  <Switch
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    size="small"
                  />
                  <MKTypography variant="body2" sx={{ ml: 1 }}>
                    Remember me
                  </MKTypography>
                </MKBox>
                <MKBox mb={2}>
                  <MKButton type="submit" fullWidth disabled={loading}>
                    Sign in
                  </MKButton>
                </MKBox>
                {error && (
                  <MKTypography variant="body2" color="error">
                    Login failed
                  </MKTypography>
                )}
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
      <AppFooter />
    </>
  );
}
