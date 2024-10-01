import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, UploadOutlined, DollarOutlined, BankOutlined,LogoutOutlined } from '@ant-design/icons';
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
    {
      key: '5',
      icon: <LogoutOutlined />,
      label: 'Logout',
    }
  ];

  return (
    <Layout style={{border:"3px solid green"}}>
      <Sider
        className='sidebar'
        style={{border:"9px solid black"}}
        // width='50px'
       collapsible
       // collapsed={collapsed}
       // onCollapse={handleCollapse}
      >
        <Menu
          theme="dark"
          mode="inline"
          items={items}
          onClick={({ key }) => handleMenuClick(key)} // Handle menu item clicks
        />
      </Sider>
    </Layout>
  );
};

export default Sidebar;
