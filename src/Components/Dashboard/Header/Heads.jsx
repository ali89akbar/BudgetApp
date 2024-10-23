import React, { useEffect, useState } from 'react'
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { MenuUnfoldOutlined, MenuFoldOutlined,DownOutlined } from '@ant-design/icons';
import { Layout, Avatar, Menu, Dropdown, Button } from 'antd';
import Item from 'antd/es/list/Item';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;
useState
const Heads = ({toggleSidebar,collapsed,setCollapsed,name}) => {
    const {logout} = useAuth();
    const {user} = useAuth();
    const navigate = useNavigate();
    const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => navigate("/update")}>Edit Profile</Menu.Item>
      <Menu.Item key="2" onClick={() => logout()}>Logout</Menu.Item>
    </Menu>
    );
  
   

  return (
    <Layout>
      <Header
        className='header-div'
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
        />
        <div className='header-area'>
          <span className='header-name'>{name}</span>
          <Dropdown overlay={menu}>
            <Avatar className='avator' icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>
    </Layout>
  )
}

export default Heads;
