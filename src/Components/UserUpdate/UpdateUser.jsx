
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom'; // For getting user ID from URL and navigation
import { ArrowLeftOutlined } from '@ant-design/icons'; // Import the arrow icon
import { useAuth } from '../../context/AuthContext';


const UpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({}); 
  const navigate = useNavigate();
  const [id, setId] = useState();
  const {updateUser}= useAuth();
  const [form] = Form.useForm(); 

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/auth/gets`, {
        method: "GET",
        headers: {
          token: `${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setId(data.id);
        setUserData(data);
        const { password, ...userWithoutPassword } = data; 
        form.setFieldsValue(userWithoutPassword); 
      } else {
        message.error('Failed to fetch user data.');
      }
    } catch (error) {
      message.error('An error occurred while fetching user data.');
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': `${localStorage.getItem('token')}`, // Include token for authentication
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('User updated successfully.');
        setUserData(data);
        updateUser(data)
        fetchUserData();
        form.setFieldsValue(data);
     navigate('/dashboard')
      } else {
        message.error(data.message || 'Failed to update user.');
      }
    } catch (error) {
      message.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/dashboard')} 
        style={{ marginBottom: '20px' }}
      >
        Back to Dashboard
      </Button>
      <Form
  name="update-user-form"
  form={form}
  onFinish={onFinish}
  layout="vertical"
  style={{ maxWidth: 600, margin: 'auto' }}
>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: false }]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: false }]}
        >
          <Input placeholder="Enter your address" />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="password"
          rules={[{ required: false, min: 6, message: 'Password must be at least 6 characters' }]}
        >
        <Input.Password
          placeholder="Enter new password (optional)"
          visibilityToggle={true} // This enables the eye icon for toggling visibility
        />
       </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block style={{ backgroundColor: "#1890ff" }}>
            Update User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateUser;