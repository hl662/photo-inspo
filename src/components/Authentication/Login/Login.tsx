import {Component} from "react";
import './Login.css'
import {AuthTokenProps} from "../Authentication";
import {Button, Checkbox, Form, Input, message, notification, Spin, Typography} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {red} from "@ant-design/colors";

const {Title} = Typography;

export interface LoginProps {
    setAuthProps: (props: AuthTokenProps) => void
}

interface LoginState {
    loading: boolean
}

class Login extends Component<LoginProps, LoginState> {

    constructor(props: LoginProps | Readonly<LoginProps>) {
        super(props);
        this.state = {
            loading: false
        }
    }

    private login(username: string, password: string): void {
        // If state is empty, then alert that field is not filled
        this.setState((prevState) => ({
            ...prevState,
            loading: true
        }))
        fetch(`https://photo-inspo-backend.herokuapp.com/login?username=${username}&password=${password}`, {
            method: "GET",
            mode: 'cors',
            headers: {
                'Content-Type': "application/json",
            },
        }).then((response: Response) => {
            this.setState((prevState) => ({
                ...prevState,
                loading: false
            }))
            if (!response.ok) {
                if (response.status === 400) {
                    message.error("No username found!");
                    throw Error("");
                }
            }
            return response.json();
        }).then((data) => {
            this.props.setAuthProps({token: data.tokenID, username: data.username})
        }).catch(() => {
            notification.error({
                message: 'Invalid Username',
                description: "No user found.",
                duration: 2,
            })
            return;
        });
    }

    render() {
        let handleSubmit = (values: { username: string; password: string; }) => {
            let username = values.username;
            let password = values.password;
            this.login(username, password);
        }
        let buttonStyle = {
            left: "41%",
            bottom: "30%",
            backgroundColor: red[4],
            borderColor: red[4],
            color: "#fff",
        }
        return (
            <>
                <Title level={2} style={{textAlign: "center", paddingTop: "4%", marginBottom: "5%"}}>Log In</Title>
                <Form style={{padding: "0 1rem 0 1rem"}} name={"login"} initialValues={{remember: true}}
                      onFinish={handleSubmit} size={"middle"}>
                    <Form.Item hasFeedback={true} name={"username"}
                               rules={[{required: true, message: 'Please enter your username!'}]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                    </Form.Item>
                    <Form.Item hasFeedback={true}
                               name="password"
                               rules={[{required: true, message: 'Please enter your password!'}]}
                    >
                        <Input.Password prefix={<LockOutlined/>} placeholder={"Password"}/>
                    </Form.Item>
                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button style={{...buttonStyle, textAlign: "center", position: "absolute"}} type="primary"
                                htmlType="submit"
                                className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
                <Spin style={{margin: "0 0 3% 48%"}} spinning={this.state.loading} delay={500}/>
            </>
        );
    }
}

export default Login;