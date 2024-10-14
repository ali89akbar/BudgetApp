import React, { useContext, useEffect, useState } from "react";
import './styles.css'; // For custom styling
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../context/AuthContext";
import { Input, Form, Button, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

function SignInForm({ type, setType, isMobile, setIsMobile }) {
  const { login } = useAuth();
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [users, setUser] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userObject = jwtDecode(token);
      setUser(userObject);
      console.log("Sign In Users", userObject);
    }
  }, []);

  function handlecallbackResponse(response) {
    console.log("Callback response received", response.credential);
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
          console.log(jwtDecode(data.token));
          login(data.token);
        } else {
          console.error("Google Login Error");
          alert("Google Login Error");
        }
      });
  }

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: "181931549693-ajeorkb5hvhacecr2fui08c006pmgvba.apps.googleusercontent.com",
      callback: handlecallbackResponse
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

  function handleSignOut(e) {
    setUser({});
    document.getElementById("google-signin").hidden = false;
    localStorage.removeItem('token');
  }

  const [form] = Form.useForm();

  const handleOnSubmit = async (values) => {
    const { email, password } = values;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        return;
      }

      const data = await response.json();
      const token = data.token;
      login(token);
      setError(null);
      message.success("Login successful!");
    } catch (error) {
      setError("Error");
      console.error(error);
      message.error("An error occurred during login.");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleOnClick = (text) => {
    setType(text);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="form-container sign-in-container">
      <Form
        form={form}
        onFinish={handleOnSubmit}
        onFinishFailed={onFinishFailed}
        initialValues={{
          email: "",
          password: ""
        }}
      >
        <h1 className="heading">Sign in</h1>
        {error && <p className="error-message">{error}</p>}

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Invalid email format!" }
          ]}
        >
          <Input
            className="custom-password-input"
            placeholder="Email"
            type="email"
          />
        </Form.Item>

        <Form.Item

          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters long!" }
          ]}
        >
          <Input.Password
            className="custom-password-input"
            placeholder="Password"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Link to="/forget">Forgot your password?</Link>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="btns">
            Sign In
          </Button>
        </Form.Item>

        {type === "signIn" && isMobile && (
          <div className="account-text" style={{ display: "flex", gap: "5px" }}>
            <p>Don't have an account?</p>
            <Button className="btns" style={{color:"white"}} type="link" onClick={() => handleOnClick("signUp")}>
              Sign Up
            </Button>
          </div>
        )}

        <div className="separator">
          <hr className="line" />
          <span className="or-text">OR</span>
          <hr className="line" />
        </div>

        <div id="google-signin"></div>

        {Object.keys(users).length !== 0 && (
          <Button type="default" onClick={handleSignOut} className="btns">
            Sign Out
          </Button>
        )}

        {users && (
          <div>
            <img src={users.picture} alt="" />
            <h3>{users.name}</h3>
          </div>
        )}
      </Form>
    </div>
  );
}

export default SignInForm;