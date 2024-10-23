import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd'; 
import './styles.css';

const Forget = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('/api/password/forget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }), 
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Password reset link sent to your email');
      } else {
        message.error(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      message.error('Failed to send password reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 400, margin: 'auto' }} 
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button
            style={{backgroundColor:"#1890ff"}}
            type="primary"
            htmlType="submit"
            loading={loading} 
            block
          >
            Send Reset Link
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Forget;

