import * as React from "react";
import {
  Box,
  Avatar,
  Button,
  Grid,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "beercss";
import { useNavigate } from "react-router-dom";
import history from "history/browser";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, analytics } from "../firebaseConfig";

const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const [isForgotPwd, setIsForgotPwd] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = (event) => {
    setIsLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log("Handle Login");
    console.log(data.get("email").trim().length === 0);
    if (
      data.get("email").trim() !== null &&
      data.get("password").trim() !== null
    ) {
      signInWithEmailAndPassword(auth, data.get("email"), data.get("password"))
        .then(() => {
          history.replace("/");
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handlePwdReset = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log("Handle Pwd reset");
    console.log(data);
    if (data.get("email").trim() !== null) {
      sendPasswordResetEmail(auth, data.get("email"))
        .then(() => {
          console.log("email sent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      {isForgotPwd ? (
        <>
          <Stack direction="row" spacing={2}>
            <button
              className="transparent circle large"
              onClick={() => setIsForgotPwd(false)}
            >
              <i className="responsive">arrow_back_ios_new</i>
            </button>
            <Typography component="h1" variant="h5">
              Forgot Password
            </Typography>
          </Stack>
        </>
      ) : (
        "Login"
      )}
      <Box
        component="form"
        noValidate
        onSubmit={isForgotPwd ? handlePwdReset : handleLogin}
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          color="primary"
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        {isForgotPwd ? null : (
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
        )}
        {isForgotPwd ? (
          <button type="submit" className="responsive">
            Reset Password
          </button>
        ) : (
          // <button type="submit" className="responsive">
          //   Sign In
          // </button>
          <LoadingButton
            type="submit"
            size="small"
            loading={isLoading}
            variant="contained"
            fullWidth
            sx={{ borderRadius: 50 }}
          >
            <span>Register</span>
          </LoadingButton>
        )}
        {isForgotPwd ? null : (
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Button
                variant="text"
                onClick={() => {
                  setIsForgotPwd(true);
                }}
              >
                Forgot Password
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
