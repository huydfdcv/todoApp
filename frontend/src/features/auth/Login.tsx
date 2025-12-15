import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Card, Switch, IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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

const SIGNUP = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
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

type SignupData = {
  signup: {
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [signupErrorMessage, setSignupErrorMessage] = useState<string | null>(null);
  const [loginMutation, { loading, error }] = useMutation<LoginData>(LOGIN, {
    onCompleted: data => {
      localStorage.setItem("token", data.login.token);
      localStorage.setItem("user", JSON.stringify(data.login.user));
      onLoggedIn();
    },
  });

  const [signupMutation, { loading: signupLoading, error: signupError }] =
    useMutation<SignupData>(SIGNUP, {
      onCompleted: data => {
        loginMutation({
          variables: {
            username: data.signup.user.username,
            password,
          },
        });
      },
    });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "login") {
      loginMutation({ variables: { username, password } });
      return;
    }
    setSignupErrorMessage(null);
    if (!username || !password) {
      setSignupErrorMessage("Username and password are required");
      return;
    }
    if (password !== confirmPassword) {
      setSignupErrorMessage("Passwords do not match");
      return;
    }
    signupMutation({ variables: { username, password } });
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
        <MKBox sx={{ width: "100%", maxWidth: 480 }}>
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
              <MKTypography variant="h5">
                {mode === "login" ? "Sign in" : "Sign up"}
              </MKTypography>
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
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </MKBox>
                {mode === "signup" && (
                  <MKBox mb={2}>
                    <MKInput
                      type={showConfirmPassword ? "text" : "password"}
                      label="Confirm password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </MKBox>
                )}
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
                  <MKButton
                    type="submit"
                    fullWidth
                    disabled={mode === "login" ? loading : signupLoading}
                  >
                    {mode === "login" ? "Login" : "Sign up"}
                  </MKButton>
                </MKBox>
                {mode === "login" && error && (
                  <MKTypography variant="body2" color="error">
                    Login failed
                  </MKTypography>
                )}
                {mode === "signup" && (signupErrorMessage || signupError) && (
                  <MKTypography variant="body2" color="error">
                    {signupErrorMessage || "Username already exists"}
                  </MKTypography>
                )}
                <MKBox mt={2} textAlign="center">
                  <MKTypography variant="body2">
                    {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                  </MKTypography>
                  <MKButton
                    variant="text"
                    size="small"
                    onClick={() => {
                      setMode(mode === "login" ? "signup" : "login");
                      setSignupErrorMessage(null);
                    }}
                  >
                    {mode === "login" ? "Sign up" : "Back to login"}
                  </MKButton>
                </MKBox>
              </MKBox>
            </Card>
          </MKBox>
      </MKBox>
      <AppFooter />
    </>
  );
}
