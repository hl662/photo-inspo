import {Component, Dispatch, SetStateAction} from "react";
import './Login.css'
import {AuthenticationProps} from "../App";

export interface LoginProps {
    setAuthProps: Dispatch<SetStateAction<AuthenticationProps>>;
}

interface LoginState {
    username: string;
    password: string;
}

class Login extends Component<LoginProps, LoginState> {
    private defaultState: LoginState = {
        username: "",
        password: ""
    }

    componentDidMount() {
        this.state = this.defaultState;
    }


    render() {
        let handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
            event.preventDefault();
            console.log(this.state.username);
            console.log(this.state.password);
            this.props.setAuthProps({token: "HIIIII"})
        }
        return (
            <div className="login-wrapper">
                <h1>Please Log In</h1>
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
                        <input id="passwordInput" type="password"
                               onChange={(e) => this.setState((prevState) =>
                                   ({
                                       ...prevState,
                                       password: e.target.value
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

export default Login;