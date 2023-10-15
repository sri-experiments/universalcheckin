import * as React from "react";
import {
  Box,
  Avatar,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import "beercss";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from '@mui/lab';
import history from "history/browser";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, analytics, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore"; 

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignUp = async (event) => {
    setIsLoading(true)
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get("email").trim().length === 0);
    if (
      data.get("email").trim() !== null &&
      data.get("password").trim() !== null
    ) {
      await createUserWithEmailAndPassword(
        auth,
        data.get("email"),
        data.get("password")
      )
        .then(async (u) => {
          await setDoc(doc(db, "checkin-users", u.user.uid), {
            "email": data.get("email"),
            "uid": u.user.uid,
            "name": "",
          })
          history.replace("/");
          navigate("/");
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
      <Typography component="h1" variant="h5">
        Sign Up
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSignUp}
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
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
        {/* <button type="submit" className="responsive">
          Register
        </button> */}
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
      </Box>
    </Box>
  );
}
