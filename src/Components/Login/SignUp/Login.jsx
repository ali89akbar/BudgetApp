import React, { useState, useEffect } from "react";
import "./styles.css";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";

export default function Login() {

  const [type, setType] = useState("signIn");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOnClick = (text) => {
    setType(text);
  };

  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");

  return (
    <div className="App">
      <div className={containerClass} id="container">
        {type === "signIn" && (
          <>
            <SignInForm />
            {isMobile && (
              <div className="mobile-buttons">
                <p>Don't have an account?</p>
                <button
                  className="ghost mobile-button"
                  onClick={() => handleOnClick("signUp")}
                >
                  Sign Up
                </button>
              </div>
            )}
          </>
        )}

        {type === "signUp" && (
          <>
            <SignUpForm />
            {isMobile && (
              <div className="mobile-buttons">
                <p>Already have an account?</p>
                <button
                  className="ghost mobile-button"
                  onClick={() => handleOnClick("signIn")}
                >
                  Sign In
                </button>
              </div>
            )}
          </>
        )}

        {/* Overlay container for non-mobile views */}
        {!isMobile && (
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome to Budget Tracker App</h1>
                <p>
                  To keep connected with us please login with your personal info
                </p>
                <button
                  className="ghost"
                  id="signIn"
                  onClick={() => handleOnClick("signIn")}
                >
                  Sign In
                </button>
              </div>

              <div className="overlay-panel overlay-right">
                <h1>
Get Started</h1>
                <p>Take control of your finances, one step at a time.Enter your personal details and start your journey with Budget Tracker App</p>                <button
                  className="ghost"
                  id="signUp"
                  onClick={() => handleOnClick("signUp")}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
