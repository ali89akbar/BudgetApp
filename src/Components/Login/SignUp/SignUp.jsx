import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

function SignUpForm({ type, setType, isMobile, setIsMobile }) {
  const [state, setState] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: ""
  });
  const [emailError,setEmailError]= useState(null);
  const [passwordError,setPasswordError]= useState(null);
  const [user, setUser] = useState({});

  // Google Sign-In callback
  async function handlecallbackResponse(response) {
    console.log("Callback response received", response.credential);

    let userObject = jwtDecode(response.credential);
    console.log(userObject);

    // Send Google user data to the backend for authentication/registration
   await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userObject.name,
        email: userObject.email,
        password: "123", // Not needed for Google
        google_id: userObject.sub,
        signup_method: "google",
        phone: "",
        address: ""
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.message === "User registered successfully." || data.message === "Email already exists.") {
          alert(data.message)
          setUser(userObject);
          document.getElementById("google-signin").hidden = true;
        } else {
          alert(data.message);
        }
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    // Google Sign-In initialization
    google.accounts.id.initialize({
      client_id: "181931549693-ajeorkb5hvhacecr2fui08c006pmgvba.apps.googleusercontent.com",
      callback: handlecallbackResponse,
    });

    // Render the Google Sign-In button
    google.accounts.id.renderButton(
      document.getElementById("google-signin"),
      {
        theme: "outline",
        size: "large"
      }
    );
    google.accounts.id.prompt();
  }, []);

  // Handle sign-out
  function handleSignOut() {
    setUser({});
    document.getElementById("google-signin").hidden = false;
  }

  // Handle form input changes
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  const handleBlur = () => {
    const { email } = state;
    if (!validateEmail(email)) {
      setEmailError("Invalid Email");
    } else {
      setEmailError(null);
    }

  };

const handleBlurpass=()=>{
  const { password } = state;
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError(null);
    }
}
  // Handle form submission for manual sign-up
  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { name, email, password, phone, address } = state;
    let valid = true;
    if (!validateEmail(email)) {
      setEmailError("Email is not valid");
      valid = false;
    } else {
      setEmailError(null);
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    } else {
      setPasswordError(null);
    }
    if (!valid) {
      return;
    }
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          address,
          google_id: "", // Not used for manual sign-up
          signup_method: "email"
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert("User registered successfully!");
      } else {
        alert(data.message || "Error during registration.");
      }

    } catch (error) {
      console.error("Error:", error);
    }

    // Clear the form after submission
    for (const key in state) {
      setState({
        ...state,
        [key]: ""
      });
    }
  };

  const handleOnClick = (text) => {
    setType(text);
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1 className="heading">Create Account</h1>
        
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
          className={emailError ? "input-error" : ""} // Add this line
        />
        {emailError && <p className="error-message">{emailError}</p>}
        <input
          type="text"
          name="phone"
          value={state.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <input
          type="text"
          name="address"
          value={state.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          onBlur={handleBlurpass}
          placeholder="Password"
        />
        {passwordError && <p className="error-message">{passwordError}</p>}
        <button className="btns">Sign Up</button>

        {type === "signUp" && isMobile && (
          <div className="account-text" style={{ display: "flex", gap: "5px" }}>
            <p>Already have an account?</p>
            <button
              className="btns"
              onClick={() => handleOnClick("signIn")}
            >
              Sign In
            </button>
          </div>
        )}

        <div className="separator">
          <hr className="line" />
          <span className="or-text">OR</span>
          <hr className="line" />
        </div>

        {/* Google Sign-In Button */}
        <div id="google-signin"></div>

        {Object.keys(user).length !== 0 && (
          <button className="btns" onClick={handleSignOut}>Sign out</button>
        )}

        {user && (
          <div>
            <img src={user.picture} alt={user.name} />
            <h3>{user.name}</h3>
          </div>
        )}
      </form>
    </div>
  );
}

export default SignUpForm;