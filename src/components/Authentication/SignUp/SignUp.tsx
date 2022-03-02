import React, {Component} from "react";
import './SignUp.css'
import {AuthTokenProps} from "../Authentication";

export interface LoginProps {
    setAuthProps: (props: AuthTokenProps) => void
}

interface LoginState {
    username: string;
    password: string;
    confirmPassword: string;
}

class SignUp extends Component<LoginProps, LoginState> {
    private defaultState: LoginState = {
        username: "",
        password: "",
        confirmPassword: ""
    }

    componentDidMount() {
        this.state = this.defaultState;
    }


    render() {
        let handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (this.state.password !== this.state.confirmPassword) {
                alert("Passwords don't match.")
            }
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            let raw = JSON.stringify({
                "username": this.state.username,
                "password": this.state.password
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
        return (
            <div className="login-wrapper">
                <h1>Please Signup</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        <p>Username</p>
                        <input id="usernameInput" type="text"
                               onChange={(e) => this.setState((prevState) =>
                                   ({
                                       ...prevState,
                                       username: e.target.value
                                   }))}
                        />
                    </label>
                    <label>
                        <p>Password</p>
                        <input id="password" type="password"
                               onChange={(e) => this.setState((prevState) =>
                                   ({
                                       ...prevState,
                                       password: e.target.value
                                   }))}
                        />
                    </label>
                    <label>
                        <p>Confirm Password</p>
                        <input id="confirmPassword" type="password"
                               onChange={(e) => this.setState((prevState) =>
                                   ({
                                       ...prevState,
                                       confirmPassword: e.target.value
                                   }))}
                        />
                    </label>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>

            </div>
        )
    }
}

export default SignUp;