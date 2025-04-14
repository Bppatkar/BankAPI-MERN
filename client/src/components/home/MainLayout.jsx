import React, { useState } from "react";
import {
    UserAddOutlined,
    UserOutlined,
    UserSwitchOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import CreateNewUser from "../CreateNewUser";
import Sidebar from "../Sidebar";
import useSidebarState from "../../hooks/useSidebarState";

import "../../App.css";

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = () => {
    const [showForm, setShowForm] = useState(false);
    const [creationConfirmed, setCreationConfirmed] = useState(false);

    const [showUsers, setShowUsers] = useState(false);

    const { setSelectedUser, setCurrentAction } = useSidebarState();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const items = [
        {
            key: "1",
            icon: <UserSwitchOutlined />,
            label: "Users",
            onClick: () => {
                setShowForm(false);
                setShowUsers(true);
                setCreationConfirmed(false);
                setSelectedUser(null);
                setCurrentAction("");
            },
        },

        {
            key: "3",
            icon: <UserAddOutlined />,
            label: "Create User",
            onClick: () => {
                setShowUsers(false);
                setShowForm(true);
                setCreationConfirmed(false);
            },
        },
    ];

    return (
        <Layout>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["4"]}
                    items={items}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                />
                <Content
                    style={{
                        margin: "24px 16px 0",
                    }}
                >
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {showForm && (
                            <CreateNewUser
                                creationConfirmed={creationConfirmed}
                                setCreationConfirmed={setCreationConfirmed}
                            />
                        )}
                        {showUsers && (
                            <div className="bank">
                                <Sidebar
                                    showUsersList={showUsers}
                                    setShowUsersList={setShowUsers}
                                />
                            </div>
                        )}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: "center",
                    }}
                >
                    {/* Ant Design ©{new Date().getFullYear()} Created by Ant UED */}
                </Footer>
            </Layout>
        </Layout>
    );
};
export default MainLayout;