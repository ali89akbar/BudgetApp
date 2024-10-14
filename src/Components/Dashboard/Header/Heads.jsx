import React, { useEffect, useState } from 'react'
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { MenuUnfoldOutlined, MenuFoldOutlined,DownOutlined } from '@ant-design/icons';
import { Layout, Avatar, Menu, Dropdown, Button } from 'antd';
import Item from 'antd/es/list/Item';
import { useAuth } from '../../../context/AuthContext';
const { Header, Content, Footer, Sider } = Layout;
useState
const Heads = ({toggleSidebar,collapsed,setCollapsed}) => {
    const {logout} = useAuth();
    const {user} = useAuth();
    const [name,setName] = useState();
      const menu = (
        <Menu>
          <Menu.Item key="1" onClick={() => console.log('Edit Profile clicked')}>Edit Profile</Menu.Item>
          <Menu.Item key="2" onClick={() => logout()}>Logout</Menu.Item>
        </Menu>
      );
      useEffect(()=>{
        setName(user?.user?.name)
      },[name])
    
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px' }}>{name}</span>
          <Dropdown overlay={menu}>
            <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>
    </Layout>
  )
}

export default Heads;
