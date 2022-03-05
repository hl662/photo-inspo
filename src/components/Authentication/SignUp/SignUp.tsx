import React, {Component} from "react";
import './SignUp.css'
import {AuthTokenProps} from "../Authentication";
import {Button, Form, Input, Spin, Typography} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {red} from "@ant-design/colors";

const {Title} = Typography;

export interface SignUpProps {
    setAuthProps: (props: AuthTokenProps) => void
}

interface SignUpState {
    loading: boolean
}

class SignUp extends Component<SignUpProps, SignUpState> {

    constructor(props: SignUpProps | Readonly<SignUpProps>) {
        super(props);
        this.state = {
            loading: false
        }
    }

    private signUp(username: string, password: string) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let raw = JSON.stringify({
            "username": username,
            "password": password
        });

        let requestOptions: RequestInit = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://photo-inspo-backend.herokuapp.com/signup", requestOptions)
            .then(response => {
                if (!response.ok) {
                    console.log(response);
                    throw new Error(`Error code ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                this.props.setAuthProps({token: data.tokenID, username: data.username});
            })
            .catch(error => alert(error));
    }

    render() {
        let buttonStyle = {
            left: "41%",
            bottom: "30%",
            backgroundColor: red[4],
            borderColor: red[4],
            color: "#fff",
        }
        let handleSubmit = (values: { username: string; password: string; }) => {
            let username = values.username;
            let password = values.password;
            this.signUp(username, password);
        }
        return (
            <>
                <Title level={2} style={{textAlign: "center", paddingTop: "4%", marginBottom: "5%"}}>Sign Up</Title>
                <Form style={{padding: "0 1rem 0 1rem"}} name={"signUp"} onFinish={handleSubmit}
                      size={"middle"}
                >
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter a username!',
                            },
                        ]}
                        hasFeedback={true}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder={"Password"}/>
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder={"Confirm Password"}/>
                    </Form.Item>
                    <Form.Item>
                        <Button style={{...buttonStyle, textAlign: "center", position: "absolute"}} type="primary"
                                htmlType="submit">
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
                <Spin spinning={this.state.loading} delay={500}/>
            </>
        )
    }
}

export default SignUp;