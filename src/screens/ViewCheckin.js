import * as React from "react";
import "../App.css";
import "beercss";
import { doc, getDocFromCache, getDocFromServer } from "@firebase/firestore";
import { analytics, db } from "../firebaseConfig";
import { CircularProgress, Alert, AlertTitle, Divider,
Snackbar } from "@mui/material";
import { logEvent } from "firebase/analytics";

export default function ViewCheckin() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [travelName, setTravelerName] = React.useState("");
  const [checkInData, setCheckInData] = React.useState([]);
  const [showNotiDenied, setShowNotiDenied] = React.useState(false);
  const [checkIsExpired, setCheckIsExpired] = React.useState(false);
  const [triggerNotiAt, setTriggerNotiAt] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    logEvent(analytics, "View_checkin");
    getCheckIn();
  });

  window.onbeforeunload = function () {
    if (triggerNotiAt !== 0) {
      return "You Won't Get Notified If You Leave";
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCheckIn = async () => {
    // https://localhost:3000/viewcheckin/id
    const docId = window.location.href.split("/")[4];
    const docRef = doc(db, "checkins", docId);
    try {
      const docSnap = await getDocFromCache(docRef);
      if (docSnap.exists()) {
        setCheckInData(docSnap.data());
        setTravelerName(docSnap.data()['name']);
        checkExpired(docSnap.data()["eta"], docSnap.data()["rawArrival"]);
      }
    } catch (e) {
      const docSnap = await getDocFromServer(docRef);
      if (docSnap.exists()) {
        setCheckInData(docSnap.data());
        setTravelerName(docSnap.data()['name']);
        checkExpired(docSnap.data()["eta"], docSnap.data()["rawArrival"]);
      }
    }
  };

  const checkExpired = (eta, rawEta) => {
    const currentTime = new Date();
    const estArrivalTime = new Date(rawEta);
    const remaining = ((estArrivalTime - currentTime) / 1000) * 1000;
    const now = new Date();
    const etaTimeParts = eta.split(":");
    const etaDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      etaTimeParts[0],
      etaTimeParts[1]
    );

    if (now > etaDate) {
      setCheckIsExpired(true);
      setIsLoading(false);
    } else {
      setTriggerNotiAt(remaining);
      setCheckIsExpired(false);
      setIsLoading(false);
    }
  };

  const scheduleNoti = async () => {
    logEvent(analytics, "noti_created");
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setOpen(true);
      setTimeout(() => {
        const noti = new Notification("CheckIn", {
          body: `${travelName} should have reached`,
        });
      }, triggerNotiAt);
    } else {
      Notification.requestPermission().then((deniedPerm) => {
        if (deniedPerm === "granted") {
          setOpen(true);
          setTimeout(() => {
            const noti = new Notification("CheckIn", {
              body: `${travelName} should have reached`,
            });
            noti.onclick(() => {
              console.log("Noti clicked");
            });
          }, triggerNotiAt);
        } else {
          setShowNotiDenied(true);
        }
      });
    }
  };

  return (
    <>
      <header>
        <nav>
          <a href="/">
            <button class="circle transparent">
              <i>arrow_back</i>
            </button>
          </a>
        </nav>
      </header>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Notification Scheduled
        </Alert>
      </Snackbar>
      {showNotiDenied ? (
        <>
          <Alert severity="error" sx={{ width: "100%" }}>
            <AlertTitle>Error</AlertTitle>
            Enable Notification Permissions To Get Notified
          </Alert>
        </>
      ) : null}
      <div className="Center-Display-Day">
        <div className="medium-height middle-align center-align">
          <div className="center-align">
            {isLoading ? (
              <>
                <CircularProgress />
              </>
            ) : (
              <>
                {checkIsExpired ? (
                  <>
                    <i className="extra">skull</i>
                    <h5>This CheckIn has expired</h5>
                    <p>
                      Reach out to {checkInData["name"]} to see if they have
                      reached
                    </p>
                  </>
                ) : (
                  <>
                    <i className="extra">mail</i>
                    <h5>
                      {checkInData["name"]}'s ETA is: {checkInData["eta"]}
                    </h5>
                    <p>Want To Get Notified?</p>
                    <div className="space"></div>
                    <nav className="center-align">
                      <button onClick={() => scheduleNoti()}>
                        Get Notifications
                      </button>
                    </nav>
                  </>
                )}
              </>
            )}
            <br />
            <Divider sx={{ marginLeft: 20, marginRight: 20 }} />
            <br />
            Want To Create Your Own CheckIn?
            <br />
            <a href="/createcheckin" target="_blank">
              <button>Create Check In</button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
