import * as React from "react";
import '../App.css'
import "beercss";
import {
  Alert,
  AlertTitle,
  Typography,
  Stack,
  CircularProgress,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip,
  IconButton,
  ListItemText,
  Button,
  ListItemButton,
} from "@mui/material";
import { FaGithub } from "react-icons/fa";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import "../App.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Landing() {
  const [loading, setLoading] = React.useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = React.useState(false);
  const [isUserNamePresent, setIsUserNamePresent] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isDarkMode, setIsDarkMode] = React.useState(localStorage.getItem('isDarkMode') === 'true');
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
        setIsUserLoggedIn(true);
        user.displayName !== null
          ? setIsUserNamePresent(true)
          : setIsUserNamePresent(false);
      } else {
        setLoading(false);
      }
    });
  });

  return (
    <>
      <header style={{ backgroundColor: isDarkMode ? "#282c34" : "#ffffff" }}>
        <nav>
          <h5
            className="max m l"
            style={{ color: isDarkMode ? "#ffffff" : "#282c34" }}
          >
            Universal Checkin
          </h5>
          <h5
            className="max s"
            style={{ color: isDarkMode ? "#ffffff" : "#282c34" }}
          >
            UC
          </h5>
          {isUserLoggedIn ? (
            <Tooltip title={open ? null : "Account Settings"}>
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {auth.currentUser.displayName === null
                    ? auth.currentUser.email[0]
                    : auth.currentUser.displayName[0]}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem>
                  <a href="/account">
                    <ListItemIcon>
                      <Avatar>
                        {auth.currentUser.displayName === null
                          ? auth.currentUser.email[0]
                          : auth.currentUser.displayName[0]}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        auth.currentUser.displayName === null
                          ? auth.currentUser.email.split("@")[0]
                          : auth.currentUser.displayName
                      }
                      secondary={auth.currentUser.email}
                    />
                  </a>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <a href="/account">
                    <ListItemIcon>
                      <i>manage_accounts</i>
                    </ListItemIcon>
                    <ListItemText primary="Account Settings" />
                  </a>
                </MenuItem>
                <MenuItem href="https://srivats22.notion.site/Privacy-Statement-16551e69af5d4b82b4dc6ae913891d35?pvs=4">
                  <a
                    href="https://srivats22.notion.site/Privacy-Statement-16551e69af5d4b82b4dc6ae913891d35?pvs=4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ListItemIcon>
                      <i>security</i>
                    </ListItemIcon>
                    <ListItemText primary="Privacy" />
                  </a>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={async () => {
                    await auth
                      .signOut()
                      .then(() => {
                        window.location.reload();
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  <ListItemIcon>
                    <i>logout</i>
                  </ListItemIcon>
                  <ListItemText primary="Sign Out" />
                </MenuItem>
              </Menu>
            </Tooltip>
          ) : (
            <a href="/auth">
              <Button
                className="Action-Component-Border-Color"
                variant="outlined"
                style={{ borderRadius: 50 }}
              >
                <i style={{ color: isDarkMode ? "white" : "black" }}>login</i>
                <span style={{ color: isDarkMode ? "white" : "black" }}>
                  Login
                </span>
              </Button>
            </a>
          )}
        </nav>
      </header>
      {!isUserNamePresent && auth.currentUser !== null ? (
        <Alert
          severity="info"
          action={<Button onClick={() => {}}>Continue</Button>}
        >
          <AlertTitle>Complete Account Setup</AlertTitle>
          <strong>Add your name to make checkin's more personalized</strong>
        </Alert>
      ) : null}
      <div className="App">
        <header className={isDarkMode ? "App-header" : "App-header-Day"}>
          {loading ? (
            <>
              <CircularProgress />
            </>
          ) : (
            <>
              <Typography variant="h3">Universal Check In</Typography>
              <p>A product inspired by the iOS 17 Check In feature</p>
              <Stack direction="row" spacing={2}>
                <a href="/createcheckin">
                  <Button
                    className="Action-Component-Border-Color"
                    variant="outlined"
                    style={{ borderRadius: 50 }}
                  >
                    <HowToRegIcon
                      style={{ color: isDarkMode ? "white" : "black" }}
                    />
                    <span style={{ color: isDarkMode ? "white" : "black" }}>
                      Create CheckIn
                    </span>
                  </Button>
                </a>
                {auth.currentUser === null ? (
                  <a href="/auth">
                    <Button
                      className="Action-Component-Border-Color"
                      variant="outlined"
                      style={{ borderRadius: 50 }}
                    >
                      <i style={{ color: isDarkMode ? "white" : "black" }}>
                        login
                      </i>
                      <span style={{ color: isDarkMode ? "white" : "black" }}>
                        Login
                      </span>
                    </Button>
                  </a>
                ) : null}
              </Stack>
            </>
          )}
        </header>
      </div>
    </>
  );
}
