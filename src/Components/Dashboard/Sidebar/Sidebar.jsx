import React, {useEffect, useState} from 'react'
import Cards from '../Card.jsx'
import { Modal } from 'antd'
import AddExpenseModal from '../../Modals/addExpense.jsx'
import AddIncomeModal from '../../Modals/addIncome.jsx'
import Tables from '../Transaction table/Table.jsx';
import { UploadOutlined, UserOutlined, VideoCameraOutlined, DollarOutlined, BankOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const items = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
  (icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `nav ${index + 1}`,
  }),
);
import "./sidebar.css"
const Sidebar = ({ onCollapseChange }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = (value) => {
    setCollapsed(value);
    onCollapseChange(value); // Notify parent component
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
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
    </Layout>
  );
};

export default Sidebar;
