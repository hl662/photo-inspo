import {Component} from "react";
import './Login.css'
import {AuthTokenProps} from "../Authentication";

export interface LoginProps {
    setAuthProps: (props: AuthTokenProps) => void
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

    private login(): void {
        // If state is empty, then alert that field is not filled
        fetch(`https://photo-inspo-backend.herokuapp.com/login?username=${this.state.username}&password=${this.state.password}`, {
            method: "GET",
            mode: 'cors',
            headers: {
                'Content-Type': "application/json",
            },
        }).then((response: Response) => {
            if (!response.ok) {
                throw new Error(`Error code ${response.status}: ${response.statusText}`);
            }
            return response.json();
        }).then((data) => {
            this.props.setAuthProps({token: data.tokenID, username: data.username})
        }).catch(error => alert(error))
    }

    render() {
        let handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
            event.preventDefault();
            this.login();
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