import {Component} from "react";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {Layout, Menu, Typography} from "antd";
import Login from "./Login/Login";
import SignUp from "./SignUp/SignUp";

const {Header, Content} = Layout;
const {Text, Title} = Typography;

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
                <Layout style={{
                    minHeight: "100vh",
                    backgroundImage: "url(" + "https://images.pexels.com/photos/7130541/pexels-photo-7130541.jpeg" + ")",
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                }}>
                    <Header style={{background: "#fff", padding: 0}}>
                        <Menu style={{fontWeight: "bold"}} theme="light" defaultSelectedKeys={["1"]}
                              mode="horizontal">
                            <Menu.Item key="1">
                                <Link to="/">
                                    <Text>Login</Text>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to="/signup">
                                    <Text>Signup</Text>
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{
                        margin: "10% 35% 15% 35%",
                    }}>
                        <Title style={{
                            textAlign: "center",
                            color: `#000000`,
                            fontSize: "4rem",
                            fontWeight: "bolder"
                        }}>Photo-Inspo</Title>
                        <div style={{
                            background: "#fff",
                            borderRadius: "5%"
                        }}>
                            <Routes>
                                <Route path="/" element={<Login setAuthProps={this.props.setAuthProps}/>}/>
                                <Route path="/signup" element={<SignUp setAuthProps={this.props.setAuthProps}/>}/>
                            </Routes>
                        </div>
                    </Content>
                </Layout>
            </BrowserRouter>
        )
    }
}

export default Authentication;