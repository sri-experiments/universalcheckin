import * as React from "react";
import logo from "./logo.svg";
import "./App.css";
import "beercss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "./Loader";

const Landing = React.lazy(() => import("./screens/Landing"));
const CreateCheckin = React.lazy(() => import("./screens/CreateCheckin"));
const ViewCheckin = React.lazy(() => import("./screens/ViewCheckin"));
const AuthScreen = React.lazy(() => import("./screens/AuthScreen"));
const Account = React.lazy(() => import("./screens/Account"));

function App() {
  const isDarkMode = localStorage.getItem('isDarkMode') === 'true'
  return (
    <React.Suspense fallback={<Loader />}>
      <Router>
        <div style={{ backgroundColor: isDarkMode ? "#282c34" : "#ffffff" }}>
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route exact path="/auth" element={<AuthScreen />} />
            <Route exact path="/createcheckin" element={<CreateCheckin />} />
            <Route exact path="/viewcheckin/:id" element={<ViewCheckin />} />
            <Route exact path="/account" element={<Account />} />
          </Routes>
        </div>
      </Router>
    </React.Suspense>
  );
}

export default App;
