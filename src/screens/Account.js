import * as React from "react";
import { onAuthStateChanged, updateProfile, sendEmailVerification } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "beercss";
import {
  Typography,
  ListItem,
  ListItemText,
  Stack,
  Button,
  Snackbar,
  Alert,
  AlertTitle,
  ListItemButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import history from 'history/browser';

export default function Account() {
  const isDarkMode = localStorage.getItem('isDarkMode') === 'true'
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [shareCopied, setShareCopied] = React.useState(false);
  const [shareCopiedSuccess, setShareCopiedSuccess] = React.useState(true);
  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [isEmailVerified, setIsEmailVerified] = React.useState(false);
  const [isEditEnabled, setIsEditEnabled] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName !== null) {
          setUserName(user.displayName);
        }
        setUserEmail(user.email);
        setIsEmailVerified(user.emailVerified);
      } else {
        navigate('/auth');
      }
    });
  });

  const updateUserProfile = async () => {
    if (userName.trim().length !== 0) {
      const userRef = doc(db, "checkin-users", auth.currentUser.uid);
      updateProfile(auth.currentUser, {
        displayName: userName,
      })
        .then(async () => {
          await updateDoc(userRef, {
            name: userName,
          }).then(() => {
            setIsSuccess(true);
            setMsg("User Name Updated");
            setIsVisible(true);
            setIsEditEnabled(false);
          });
        })
        .catch((err) => {
          setIsSuccess(true);
          setMsg("An Error Occured, Please Try Again");
          setIsVisible(true);
          setIsEditEnabled(false);
        });
    } else {
      alert("Name cannot be empty");
    }
  };

  return (
    <>
      {isVisible ? (
        <>
          {isSuccess ? (
            <Snackbar
              open={isVisible}
              autoHideDuration={6000}
              onClose={() => setIsVisible(false)}
            >
              <Alert
                onClose={() => setIsVisible(false)}
                severity="success"
                sx={{ width: "100%" }}
              >
                {msg}
              </Alert>
            </Snackbar>
          ) : (
            <Snackbar
              open={isVisible}
              autoHideDuration={6000}
              onClose={() => setIsVisible(false)}
            >
              <Alert
                onClose={() => setIsVisible(false)}
                severity="error"
                sx={{ width: "100%" }}
              >
                {msg}
              </Alert>
            </Snackbar>
          )}
        </>
      ) : null}
      {isVisible ? (
        <>
          {shareCopiedSuccess ? (
            <Snackbar
              open={isVisible}
              autoHideDuration={6000}
              onClose={() => setIsVisible(false)}
            >
              <Alert
                onClose={() => setIsVisible(false)}
                severity="success"
                sx={{ width: "100%" }}
              >
                App URL copied
              </Alert>
            </Snackbar>
          ) : (
            <Snackbar
              open={isVisible}
              autoHideDuration={6000}
              onClose={() => setIsVisible(false)}
            >
              <Alert
                onClose={() => setIsVisible(false)}
                severity="error"
                sx={{ width: "100%" }}
              >
                Couldn't copy url
              </Alert>
            </Snackbar>
          )}
        </>
      ) : null}
      <header style={{ backgroundColor: isDarkMode ? "#282c34" : "#ffffff" }}>
        <nav>
          <a href="/">
            <button className="circle transparent">
              <i style={{ color: isDarkMode ? "#ffffff" : "#000000" }}>
                arrow_back
              </i>
            </button>
          </a>
          <h5
            className="max"
            style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
          >
            Account
          </h5>
        </nav>
      </header>
      <div
        style={{
          padding: 10,
          backgroundColor: isDarkMode ? "#282c34" : "#ffffff",
        }}
      >
        <div className="row">
          <div className="max">
            <Typography
              variant="h5"
              style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
            >
              Account Details
            </Typography>
          </div>
          <button
            className="transparent circle large"
            onClick={() => setIsEditEnabled(true)}
          >
            <i style={{ color: isDarkMode ? "#ffffff" : "#000000" }}>edit</i>
          </button>
        </div>
        <form onSubmit={updateUserProfile}>
          <div
            className="field label border"
            style={{ color: isDarkMode ? "white" : "black" }}
          >
            <input
              id="name"
              name="name"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              disabled={!isEditEnabled}
              label="Name"
              // variant="outlined"
            />
            <label>Name</label>
          </div>
          <ListItem>
            <ListItemText
              style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
              primary="Email"
              secondary={
                <p style={{ color: isDarkMode ? "#ffffff" : "#000000" }}>
                  {userEmail}
                </p>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemButton
              onClick={() => {
                if (!isEmailVerified) {
                  sendEmailVerification(auth.currentUser)
                    .then(() => {
                      setIsSuccess(true);
                      setMsg("Verification Email Sent");
                      setIsVisible(true);
                    })
                    .catch((err) => {
                      setIsSuccess(false);
                      setMsg("Couldn't sent Email");
                      setIsVisible(true);
                    });
                } else {
                  setIsSuccess(true);
                  setMsg("Account Already Verified");
                  setIsVisible(true);
                }
              }}
            >
              <ListItemText
                style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
                primary="Email Verified"
                secondary={
                  <p style={{ color: isDarkMode ? "#ffffff" : "#000000" }}>
                    {isEmailVerified ? "Verified" : "Not Verified"}
                  </p>
                }
              />
            </ListItemButton>
          </ListItem>
          <div className="field middle-align">
            <nav>
              <div className="max">
                <h6 style={{ color: isDarkMode ? "white" : "black" }}>
                  {isDarkMode ? "Dark Mode" : "Light Mode"}
                </h6>
              </div>
              <label className="switch icon">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={() => {
                    if (localStorage.getItem("isDarkMode") === "true") {
                      localStorage.setItem("isDarkMode", "false");
                      window.location.reload();
                    } else {
                      localStorage.setItem("isDarkMode", "true");
                      window.location.reload();
                    }
                  }}
                />
                <span>{isDarkMode ? <i>dark_mode</i> : <i>light_mode</i>}</span>
              </label>
            </nav>
          </div>
          {isEditEnabled ? (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => setIsEditEnabled(false)}
                sx={{ borderRadius: 50 }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => updateUserProfile()}
                variant="contained"
                sx={{ borderRadius: 50 }}
              >
                Save
              </Button>
            </Stack>
          ) : null}
        </form>
        <div className="row">
          <div className="max">
            <Typography
              variant="h5"
              style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
            >
              App Related
            </Typography>
          </div>
        </div>
        <ListItem>
          <ListItemButton
          onClick={() => {
            navigator.clipboard.writeText(`Checkout Universal CheckIn: ${'https://universalcheckin.firebaseapp.com/'}`)
            .then(() => {
              setIsVisible(true);
              setShareCopied(true);
            })
            .catch((err) => {
              setIsVisible(true);
              setShareCopied(true);
              setShareCopiedSuccess(false);
            })
          }}>
            <ListItemText
              style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
              primary="Share"
            />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            href="https://srivats22.notion.site/Privacy-Statement-16551e69af5d4b82b4dc6ae913891d35?pvs=4"
            target="_blank"
          >
            <ListItemText
              style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
              primary="Privacy Statement"
            />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            href="https://srivats22.notion.site/How-it-works-e5d793faf96d4191be1028e8e3dc192f?pvs=4"
            target="_blank"
          >
            <ListItemText
              style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
              primary="How it works"
            />
          </ListItemButton>
        </ListItem>
        <div className="row">
          <div className="max">
            <Typography
              variant="h5"
              style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
            >
              Account Related
            </Typography>
          </div>
        </div>
        <ListItem style={{ color: isDarkMode ? "#ffffff" : "#000000" }}>
          <ListItemButton
            onClick={async () => {
              await auth.signOut();
              history.replace("/acount");
              navigate("/");
            }}
          >
            <i style={{ color: isDarkMode ? "#ffffff" : "#000000" }}>
              exit_to_app
            </i>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            onClick={() => {
              setIsDeleteDialogOpen(true);
            }}
          >
            <i style={{ color: "red" }}>delete_forever</i>
            <ListItemText
              style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
              primary="Delete Account"
            />
          </ListItemButton>
        </ListItem>
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete Account?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This Action Cannot be Undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button className="border" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</button>
            <button style={{ backgroundColor: 'red' }} onClick={async() => {
              await auth.currentUser.delete();
              history.replace("/acount");
              navigate("/");
            }} autoFocus>
              Delete
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
