import React, { useState } from "react";
import SignInForm from "./SignIn";

function SignUpForm() {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: ""
  });
  const [showSignInForm, setShowSignInForm] = useState(false);

  const handleClick = () => {
    setShowSignInForm(true); // Change the state when the button is clicked
  };
  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = evt => {
    evt.preventDefault();

    const { name, email, password } = state;
    alert(
      `You are sign up with name: ${name} email: ${email} and password: ${password}`
    );

    for (const key in state) {
      setState({
        ...state,
        [key]: ""
      });
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1 className="heading">Create Account</h1>
        <div className="social-container">
          <a href="#" className="social">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
        <span>or use your email for registration</span>
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
          placeholder="Email"
        />
        <input
          type="text"
          name="Phone no"
          value={state.name}
          onChange={handleChange}
          placeholder="Phone no"
        />
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Address"
        />
        
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button>Sign Up</button>
        <div className="account-text"
        >  
         <button
                  className="ghos"
                  id="signIn"
                 onClick={handleClick}
                >Sign In</button>
                {showSignInForm && <SignInForm />} {/* Conditionally render the form */}
                </div>
                <div className="separator">
          <hr className="line" />
          <span className="or-text">OR</span>
          <hr className="line" />
        </div>

        {/* Google Sign-In Button */}
        <div class="google-signin">
  <div class="google-btn">
    <i class="fa fa-google"></i>
    <span class="google-text">Sign in with Google</span>
  </div>
</div>
      </form>
 

    </div>
  );
}

export default SignUpForm;
