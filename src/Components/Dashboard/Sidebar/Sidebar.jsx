import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, UploadOutlined, DollarOutlined, BankOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import "./sidebar.css";

const { Sider } = Layout;

const Sidebar = ({ onCollapseChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleCollapse = (value) => {
    setCollapsed(value);
    onCollapseChange(value); // Notify parent component
  };

  const handleMenuClick = (key) => {
    switch (key) {
      case '1':
        navigate('/dashboard');
        break;
      case '2':
        navigate('/income');
        break;
      case '3':
        navigate('/expense');
        break;
      case '4':
        navigate('/savings');
        break;
      default:
        break;
    }
  };

  const items = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: 'Dashboard',
    },
    {
      key: '2',
      icon: <DollarOutlined />,
      label: 'Income',
    },
    {
      key: '3',
      icon: <UploadOutlined />,
      label: 'Expense',
    },
    {
      key: '4',
      icon: <BankOutlined />,
      label: 'Savings',
    },
  ];

  return (
    <Layout className='layout-container'>
      <Sider
        className='sidebar'
        collapsible
        collapsed={collapsed}
        onCollapse={handleCollapse}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={({ key }) => handleMenuClick(key)} // Handle menu item clicks
        />
      </Sider>
    </Layout>
  );
};

export default Sidebar;
