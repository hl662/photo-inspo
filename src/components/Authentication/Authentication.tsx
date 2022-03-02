import {Component} from "react";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {Layout, Menu} from "antd";
import Login from "./Login/Login";
import SignUp from "./SignUp/SignUp";

const {Header, Content} = Layout;

export interface AuthTokenProps {
    token: string;
    username: string;
}

interface AuthProps {
    setAuthProps: (props: AuthTokenProps) => void
}


class Authentication extends Component<AuthProps, any> {
    render() {
        return (
            <BrowserRouter>
                <Layout style={{minHeight: "100vh"}}>
                    <Layout>
                        <Header style={{background: "#fff", padding: 0}}>
                            <Menu theme="light" defaultSelectedKeys={["1"]} mode="horizontal">
                                <Menu.Item key="1">
                                    <Link to="/">
                                        <span>Login</span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Link to="/signup">
                                        <span>Signup</span>
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        </Header>
                        <Content style={{margin: "0 16px", background: "#fff"}}>
                            <div style={{padding: 24, background: "#fff", minHeight: 360}}>
                                <Routes>
                                    <Route path="/" element={<Login setAuthProps={this.props.setAuthProps}/>}/>
                                    <Route path="/signup" element={<SignUp setAuthProps={this.props.setAuthProps}/>}/>
                                </Routes>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </BrowserRouter>
        )
    }
}

export default Authentication;