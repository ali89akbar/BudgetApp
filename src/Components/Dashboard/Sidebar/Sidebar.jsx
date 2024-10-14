import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, UploadOutlined, DollarOutlined, BankOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import "./sidebar.css";

const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapseChange }) => {
  const navigate = useNavigate();

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
    <Sider
      style={{paddingTop:"25px"}}
      collapsed={collapsed}
      onCollapse={onCollapseChange} // Handle sidebar collapse toggle
      className="sidebar"
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        items={items}
        onClick={({ key }) => handleMenuClick(key)} // Handle menu item clicks
      />
    </Sider>
  );
};

export default Sidebar;