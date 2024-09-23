import React, { useEffect, useState } from "react";
import './styles.css'; // For custom styling
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function SignInForm() {
  const [user,setUser]= useState({});

  function handlecallbackResponse(response){
    console.log("Callback response received",response.credential);
    let userObject = jwtDecode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("google-signin").hidden = true;
  }


  useEffect(()=>{
    google.accounts.id.initialize({
      client_id: "181931549693-ajeorkb5hvhacecr2fui08c006pmgvba.apps.googleusercontent.com",
      callback: handlecallbackResponse
    })
    google.accounts.id.renderButton(
      document.getElementById("google-signin"),
      {
       // type: "sign-in",
       // scope: "https://www.googleapis.com/auth/userinfo.email",
        //width: 240,
        //height: 50,
        //longtitle: true,
        theme: "outline",
        size:"large"
        //onsuccess: handlecallbackResponse
      }
    )
    google.accounts.id.prompt();
  },[])


function handleSignOut(e){
  setUser({})
  document.getElementById("google-signin").hidden=false

}
  const [mode, setMode] = useState("");
  const [type, setType] = useState("signIn");
  const [showSignInForm, setShowSignInForm] = useState(false);

  const handleClick = () => {
    setShowSignInForm(true); // Change the state when the button is clicked
  };
  const [state, setState] = React.useState({
    email: "",
    password: ""
  });

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();

    const { email, password } = state;
    alert(`You are logging in with email: ${email} and password: ${password}`);

    for (const key in state) {
      setState({
        ...state,
        [key]: ""
      });
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1 className="heading">Sign in</h1>
        
        <span>or use your account</span>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <a href="#">Forgot your password?</a>
        
        <button>Sign In</button>
        <div className="account-text"
        >  
         <button
                  className="ghos"
                  id="signIn"
                 onClick={handleClick}
                >Sign In</button>
                {showSignInForm && <SignInForm />} {/* Conditionally render the form */}
                </div>

        {/* Separator with OR */}
        <div className="separator">
          <hr className="line" />
          <span className="or-text">OR</span>
          <hr className="line" />
        </div>

        {/* Google Sign-In Button */}
        <div id="google-signin">
       
</div>
{
            Object.keys(user).length !=0  &&
            <button onClick={(e)=> handleSignOut(e)}>Signout</button>

          }
  {user && 
  <div>
    {console.log(user.name)}
    <img src={user.picture} alt="" />
    <h3>{user.name}</h3>
    </div>}

      </form>
    </div>
  );
}

export default SignInForm;
