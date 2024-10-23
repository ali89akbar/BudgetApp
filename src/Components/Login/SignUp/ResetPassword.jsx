import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(''); // Store token from URL
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location (URL)

  useEffect(() => {
    // Extract the token from the query string
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get('token');
    console.log(tokenFromURL)
    if (tokenFromURL) {
      setToken(tokenFromURL);
    } else {
      message.error('Invalid or missing token');
      navigate('/'); // Redirect to home or error page if no token is found
    }
  }, [location, navigate]);

  const onFinish = async (values) => {
    const { newPassword } = values;

    try {
      setLoading(true);

      const response = await fetch('/api/password/reset', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Password reset successfully');
        navigate('/'); // Navigate to login page after success
      } else {
        message.error(data.error || 'Failed to reset password');
      }
    } catch (error) {
      message.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">

    <Form
      name="reset-password-form"
      onFinish={onFinish}
      layout="vertical"
      className='reset-Input'
    >
      <Form.Item
        label="New Password"
        name="newPassword"
        rules={[
          { required: true, message: 'Please enter your new password' },
          { min: 6, message: 'Password must be at least 6 characters' },
        ]}
      >
        <Input.Password placeholder="Enter new password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} style={{backgroundColor:"#1890ff"}}
        >
          Reset Password
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default ResetPassword;

