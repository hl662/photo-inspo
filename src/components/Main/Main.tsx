import {Badge, Layout, Menu, Typography} from "antd";
import React, {Component} from "react";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import SearchPage from "../Search/SearchPage";
import MoodboardPage from "../Authentication/Moodboard/MoodboardPage";
import MoodboardGallery from "../Authentication/Moodboard/MoodboardGallery";
import Authentication, {AuthTokenProps} from "../Authentication/Authentication";
import Moodboard from "../Data/Moodboard";

const {Header, Content} = Layout;
const {Text} = Typography;


interface MainState {
    currentMoodboard: Moodboard;
    authToken: AuthTokenProps;
}

class Main extends Component<any, MainState> {
    private defaultAuthToken: AuthTokenProps = {
        token: "",
        username: ""
    }

    constructor(props: any) {
        super(props);
        this.state = {
            currentMoodboard: new Moodboard(),
            authToken: this.defaultAuthToken
        };
        this.setAuthProps = this.setAuthProps.bind(this);
        this.signOut = this.signOut.bind(this);
        this.updateBoardCount = this.updateBoardCount.bind(this);
    }

    private setAuthProps(newAuthTokenProps: AuthTokenProps) {
        this.setState(() => ({
            currentMoodboard: new Moodboard(),
            authToken: newAuthTokenProps
        }))
    }

    private signOut() {
        this.setState(() => ({
            currentMoodboard: new Moodboard(),
            authToken: this.defaultAuthToken
        }));
    }

    updateBoardCount() {
        this.setState((prevState) => prevState);
    }

    // Use SubMenu to make the logout button be margin-right/ right aligned?
    render() {
        // https://www.pluralsight.com/guides/how-to-set-react-router-default-route-redirect-to-home
        // TODO: Use above to fix the redirection of signout to login.
        if (this.state.authToken.token === "") {
            return <Authentication setAuthProps={this.setAuthProps}/>;
        } else {
            return (
                <BrowserRouter>
                    <Layout style={{minHeight: "100vh"}}>
                        <Layout>
                            <Header style={{background: "#fff", padding: 0}}>
                                <Menu theme="light" defaultSelectedKeys={["1"]} mode="horizontal">
                                    <Menu.Item key="1">
                                        <Link to="/">
                                            <span>Search</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                        <Badge offset={[8, 0]} showZero size={"small"}
                                               title={"Current Number of Images"}
                                               count={this.state.currentMoodboard.images.size}>
                                            <Link to="/current-moodboard">
                                                <Text>Current Moodboard</Text>
                                            </Link>
                                        </Badge>
                                    </Menu.Item>
                                    <Menu.Item key="3">
                                        <Link to="/moodboards">
                                            <span>My Moodboards</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item onClick={this.signOut} key="4">
                                        <span>Sign Out</span>
                                    </Menu.Item>
                                </Menu>
                            </Header>
                            <Content style={{margin: "0 0%", background: "#fff"}}>
                                <Routes>
                                    <Route path="/" element={<SearchPage authToken={this.state.authToken}
                                                                         currentMoodboard={this.state.currentMoodboard}
                                                                         updateBoardCount={this.updateBoardCount}/>}/>
                                    <Route path="/current-moodboard"
                                           element={<MoodboardPage authToken={this.state.authToken}
                                                                   currentMoodboard={this.state.currentMoodboard}
                                                                   updateBoardCount={this.updateBoardCount}/>}/>
                                    <Route path="/moodboards"
                                           element={<MoodboardGallery authToken={this.state.authToken}/>}/>
                                </Routes>
                            </Content>
                        </Layout>
                    </Layout>
                </BrowserRouter>
            )
        }

    }
}

export default Main;