import * as React from "react";
import "beercss";
import "../App.css";
import {
  Button,
  Stack,
  Typography,
  Alert,
  Backdrop,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import axios from "axios";
import { db, analytics, auth } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { logEvent } from "firebase/analytics";

export default function CreateCheckin() {
  const isDebugMode = false;
  const [open, setOpen] = React.useState(false);
  const [travelerName, setTravelerName] = React.useState("");
  const [fromAddrs, setFromAddrs] = React.useState("");
  const [toAddrs, setToAddrs] = React.useState("");
  const [isCar, setIsCar] = React.useState(true);
  const [travelTime, setTravelTime] = React.useState("");
  const [isResultAvailable, setIsResultAvailable] = React.useState(false);
  const [arrivalTime, setArrivalTime] = React.useState("");
  const [rawArrivalTime, setRawArrivalTime] = React.useState("");
  const [checkInCopiedSuccess, setCheckInCopiedSuccess] = React.useState(false);
  const isDarkMode = localStorage.getItem("isDarkMode") === "true";

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.displayName !== null
          ? setTravelerName(user.displayName) : setTravelerName("");
      }
    });
  })

  const handleClose = () => {
    setOpen(false);
  };

  const getData = async () => {
    logEvent(analytics, "create_checkin");
    setOpen(true);
    var fromResp = await axios.get(
      `https://api.tomtom.com/search/2/geocode/${fromAddrs}.json?key=${process.env.REACT_TOMTOM_API}`
    );

    var toResp = await axios.get(
      `https://api.tomtom.com/search/2/geocode/${toAddrs}.json?key=${process.env.REACT_TOMTOM_API}`
    );
    if (fromResp.status === 200 && toResp.status === 200) {
      calculateTime(
        fromResp.data["results"][0]["position"]["lat"],
        fromResp.data["results"][0]["position"]["lon"],
        toResp.data["results"][0]["position"]["lat"],
        toResp.data["results"][0]["position"]["lon"]
      );
    }
    if (fromResp.status !== 200 || toResp.status !== 200) {
      console.log("From resp: ", fromResp.data);
      console.log("To resp: ", toResp.data);
      setOpen(false);
    }
  };

  const calculateTime = async (fromLat, fromLon, toLat, toLon) => {
    const data = {
      origins: [
        {
          point: { latitude: fromLat, longitude: fromLon },
        },
      ],
      destinations: [
        {
          point: { latitude: toLat, longitude: toLon },
        },
      ],
      options: {
        departAt: "now",
        traffic: "live",
        travelMode: isCar ? "car" : "pedestrian",
      },
    };

    const stringifiedData = JSON.stringify(data);

    const getTimeData = await fetch(
      `https://api.tomtom.com/routing/matrix/2?key=${process.env.REACT_TOMTOM_API}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: stringifiedData,
      }
    );

    if (getTimeData.status === 200) {
      const d = await getTimeData.json();
      if (d != null) {
        var aTime = d["data"][0]["routeSummary"]["arrivalTime"];
        var createArrivalTime = aTime.split("T")[1].split("-")[0].split(":");
        setArrivalTime(`${createArrivalTime[0]}:${createArrivalTime[1]}`);
        setRawArrivalTime(aTime);
        const timeInSec = d["data"][0]["routeSummary"]["travelTimeInSeconds"];
        const hrs = Math.floor(Number(timeInSec) / 3600);
        const min = Math.floor((Number(timeInSec) % 3600) / 60);
        if (hrs > 0) {
          setTravelTime(`${hrs} hr : ${min} min`);
        } else {
          setTravelTime(`${min} min`);
        }
        setIsResultAvailable(true);
        setOpen(false);
      }
    }

    if (getTimeData.status !== 200) {
      console.log(getTimeData);
      setOpen(false);
    }
  };

  const shareCheckIn = async () => {
    logEvent(analytics, "share_checkin");
    const docRef = await addDoc(collection(db, "checkins"), {
      from: fromAddrs,
      to: toAddrs,
      mode: isCar ? "Car" : "Walk",
      eta: arrivalTime,
      rawArrival: rawArrivalTime,
      name: travelerName,
      uid: auth.currentUser !== null ? `${auth.currentUser.uid}` : "",
    });
    navigator.clipboard.writeText(
      `${window.location.origin}/viewcheckin/${docRef.id}`
    );
    setCheckInCopiedSuccess(true);
  };

  return (
    <>
      <Snackbar
        open={checkInCopiedSuccess}
        autoHideDuration={5000}
        onClose={() => setCheckInCopiedSuccess(false)}
      >
        <Alert
          onClose={() => setCheckInCopiedSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          CheckIn URL Copied To Clipboard
        </Alert>
      </Snackbar>
      {isResultAvailable ? (
        <>
          <div className={isDarkMode ? "App-header" : "App-header-Day"}>
            <div className="medium-height middle-align center-align">
              <div className="center-align">
                <AccessTimeIcon sx={{ fontSize: 100 }} />
                <h5 className="center-align">CheckIn Details</h5>
                <br />
                <Typography variant="body1">From: {fromAddrs}</Typography>
                <Typography variant="body1">To: {toAddrs}</Typography>
                <Typography variant="body1">
                  Transportation Mode: {isCar ? "Car" : "Walk"}
                </Typography>
                <Typography variant="body1">
                  Travel Time: {travelTime}
                </Typography>
                <Typography variant="body1">
                  Estimated Arrival Time: {arrivalTime}
                </Typography>
                <br />
                <Button
                  className="Action-Component-Border-Color"
                  variant="outlined"
                  style={{ borderRadius: 50 }}
                  onClick={() => shareCheckIn()}
                >
                  <i>share</i>
                  <span>Share CheckIn</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={isDarkMode ? "App-header" : "App-header-Day"}>
            <div className="medium-height middle-align center-align">
              <div className="center-align">
                <PersonPinCircleIcon sx={{ fontSize: 100 }} />
                <h5 className="center-align">Create CheckIn</h5>
                <br />
                <div className="field label border">
                  <input
                    id="travelerName"
                    name="name"
                    onChange={(e) => setTravelerName(e.target.value)}
                    value={travelerName}
                    label="Name"
                    variant="outlined"
                  />
                  <label>Name</label>
                </div>
                <Stack className="m l" direction="row" spacing={2}>
                  <div className="field label border">
                    <input
                      id="fromAddrs"
                      name="setAddress"
                      onChange={(e) => setFromAddrs(e.target.value)}
                      value={fromAddrs}
                      label="Start Destination"
                      variant="outlined"
                    />
                    <label>Start Destination</label>
                  </div>
                  <div className="field label border">
                    <input
                      id="toAddress"
                      name="setAddress"
                      onChange={(e) => setToAddrs(e.target.value)}
                      value={toAddrs}
                      label="Destination"
                      variant="outlined"
                    />
                    <label>Destination</label>
                  </div>
                </Stack>
                <Stack class="s" direction="row" spacing={2}>
                  <div className="field label border">
                    <input
                      id="fromAddrs"
                      name="setAddress"
                      onChange={(e) => setFromAddrs(e.target.value)}
                      value={fromAddrs}
                      label="Start Destination"
                      variant="outlined"
                    />
                    <label>Start Destination</label>
                  </div>
                  <div className="field label border">
                    <input
                      id="toAddress"
                      name="setAddress"
                      onChange={(e) => setToAddrs(e.target.value)}
                      value={toAddrs}
                      label="Destination"
                      variant="outlined"
                    />
                    <label>Destination</label>
                  </div>
                </Stack>
                <div className="m l">
                  <br />
                </div>
                <Stack direction="row" spacing={2}>
                  {isCar ? (
                    <div
                      className="chip fill"
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsCar(true)}
                    >
                      <i>done</i>
                      <span>Car</span>
                    </div>
                  ) : (
                    <div
                      className="chip"
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsCar(true)}
                    >
                      <span style={{ color: isDarkMode ? "white" : "black" }}>
                        Car
                      </span>
                    </div>
                  )}
                  {!isCar ? (
                    <div
                      className="chip fill"
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsCar(false)}
                    >
                      <i>done</i>
                      <span>Walk</span>
                    </div>
                  ) : (
                    <div
                      className="chip"
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsCar(false)}
                    >
                      <span style={{ color: isDarkMode ? "white" : "black" }}>
                        Walk
                      </span>
                    </div>
                  )}
                </Stack>
                <br />
                <Button
                  className="Action-Component-Filled-Color"
                  fullWidth
                  variant="contained"
                  style={{ borderRadius: 50 }}
                  onClick={() => getData()}
                >
                  Calculate Time
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
