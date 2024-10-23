import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, UploadOutlined, DollarOutlined, BankOutlined, WalletOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import "./sidebar.css";
const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapseChange }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [selectedKey, setSelectedKey] = useState('1'); 

  // Sync the selectedKey current route on component mount and route change
  useEffect(() => {
    switch (location.pathname) {
      case '/dashboard':
        setSelectedKey('1');
        break;
      case '/income':
        setSelectedKey('2');
        break;
      case '/expense':
        setSelectedKey('3');
        break;
      case '/savings':
        setSelectedKey('4');
        break;
      default:
        break;
    }
  }, [location.pathname]); // Re-run on route changes

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key); // Update selected key 
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
      collapsed={collapsed}
      onCollapse={onCollapseChange}
      className="sidebar"
    >
      <div className="sidebar-header">
        <WalletOutlined className="sidebar-icon" />
        {!collapsed && <h2 className="sidebar-title">Budget App</h2>}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]} 
        items={items}
        onClick={handleMenuClick} 
      />
    </Sider>
  );
};

export default Sidebar;