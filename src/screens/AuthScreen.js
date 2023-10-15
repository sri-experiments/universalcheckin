import * as React from "react";
import '../App.css'
import {
  Chip,
  Stack,
  Link,
  CssBaseline,
  paperClasses,
  Grid,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "@material/web/chips/filter-chip.js";
import "beercss";
import Login from "../component/Login";
import Signup from "../component/Signup";

export default function AuthScreen() {
  const [index, setIndex] = React.useState(0);

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1604357209793-fca5dca89f97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2864&q=80)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stack direction="row" spacing={2}>
            <Chip
              label="Login"
              icon={index === 0 ? <i>done</i> : null}
              variant={index === 0 ? "filled" : "outlined"}
              sx={{ borderRadius: "10px" }}
              onClick={() => {
                setIndex(0);
              }}
            />
            <Chip
              label="Sign Up"
              icon={index === 1 ? <i>done</i> : null}
              variant={index === 1 ? "filled" : "outlined"}
              sx={{ borderRadius: "10px" }}
              onClick={() => {
                setIndex(1);
              }}
            />
          </Stack>
          {index === 0 ? <Login /> : <Signup />}
        </Box>
      </Grid>
    </Grid>
  );
}
