import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { message, Form, Input, Button, Row, Col } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useAuth } from "../../../context/AuthContext";

function SignUpForm({ type, setType, isMobile, setIsMobile }) {
  const [user, setUser] = useState({});
  const { login } = useAuth();
  const [emailError, setEmailError] = useState();

  // Google Sign-In callback
  function handlecallbackResponse(response) {
    let userObject = jwtDecode(response.credential);
    setUser(userObject);
    localStorage.setItem("token", response.credential);
    document.getElementById("google-signin").hidden = true;

    fetch('/api/auth/google-login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token: response.credential })
    }).then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          login(data.token);
        } else {
          message.error("Google Login Error");
        }
      });
  }

  useEffect(() => {
    // Google Sign-In initialization
    google.accounts.id.initialize({
      client_id: "181931549693-ajeorkb5hvhacecr2fui08c006pmgvba.apps.googleusercontent.com",
      callback: handlecallbackResponse,
    });

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

  // Handle form submission
  const handleOnSubmit = async (values) => {
    const { name, email, password, phone, address } = values;
    
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
        message.success("User registered successfully!");
      } else {
        message.error(data.message || "Error during registration.");
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOnClick = (text) => {
    setType(text);
  };

  return (
    <div className="form-container sign-up-container">
        <Form
        className="forms"
    onFinish={handleOnSubmit}
  >
        <h1 className="heading">Create Account</h1>

        <Form.Item
          name="name"  
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input 
          className="custom-password-input"
          placeholder="Name"
           />
        </Form.Item>

        <Form.Item
          name="email"
       
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please input a valid email!' }
          ]}
        >
          <Input 
          className="custom-password-input"
          placeholder="Email"/>
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[
            { required: true, message: 'Please input your phone number!' },
            { len: 11, message: 'Phone number must be 11 digits!' }
          ]}
        >
          <Input
          className="custom-password-input"
          placeholder="Phone"
           />
        </Form.Item>

        <Form.Item
          name="address"
          rules={[{ required: true, message: 'Please input your address!' }]}
        >
          <Input 
          className={emailError ? "input-error" : "custom-password-input"}
          placeholder="Address"/>
        </Form.Item>

        <Form.Item
  name="password"
  rules={[
    { required: true, message: 'Please input your password!' },
    { min: 6, message: 'Password must be at least 6 characters!' }
  ]}
  hasFeedback
>
  <Input.Password
    className="custom-password-input"
    placeholder="Password"
    iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
  />
        </Form.Item>

        <Form.Item
  name="confirmPassword"
  dependencies={['password']}
  hasFeedback
  rules={[
    { required: true, message: 'Please confirm your password!' },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('The two passwords do not match!'));
      },
    }),
  ]}
>
  <Input.Password
    className="custom-password-input"
    placeholder="Confirm Password"
    iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
  />
        </Form.Item>

        <Button type="primary" htmlType="submit" className="btns" >
          Sign Up
        </Button>

        {type === "signUp" && isMobile && (
          <div className="account-text" >
            <p>Already have an account?</p>
            <Button
              type="link"
              onClick={() => handleOnClick("signIn")}
              className="btns"
              style={{ color: "white" }}
            >
              Sign In
            </Button>
          </div>
        )}

        <div className="separator">
          <hr className="line" />
          <span className="or-text">OR</span>
          <hr className="line" />
        </div>

        <div id="google-signin"></div>

        {Object.keys(user).length !== 0 && (
          <Button type="link" onClick={handleSignOut}>Sign out</Button>
        )}

        {user && (
          <div>
            <img src={user.picture} alt={user.name} />
            <h3>{user.name}</h3>
          </div>
        )}
      </Form>
    </div>
  );
}

export default SignUpForm;

