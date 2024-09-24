import React, { useState, useEffect } from "react";
import SignInForm from "./SignIn";

function SignUpForm() {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    phoneno: "",
    Address:"",
    password:""
  });
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
        <button className="sign">Sign Up</button>
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

export default SignUpForm;
