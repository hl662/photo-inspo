import {Component} from "react";
import {AuthTokenProps} from "../Authentication/Authentication";
import {Button, Input, Layout, Typography} from "antd";
import Moodboard from "../Data/Moodboard";
import SearchResultPage from "./SearchResultPage";
import {PexelsClient} from "../Data/PexelsClient";
import {red} from "@ant-design/colors";
import {SearchOutlined} from "@ant-design/icons";

const {Content} = Layout;
const {Search} = Input;
const {Title} = Typography;

interface SearchPageProps {
    authToken: AuthTokenProps,
    currentMoodboard: Moodboard,
    updateBoardCount: () => void
}

interface SearchPageState {
    searchQuery: string,
}


// retrieve api key from env.json or env variable.
class SearchPage extends Component<SearchPageProps, SearchPageState> {
    private pexelsClient: PexelsClient;

    private defaultState: SearchPageState = {
        searchQuery: "",
    }

    constructor(props: SearchPageProps) {
        super(props);
        this.pexelsClient = new PexelsClient(process.env.REACT_APP_PEXEL_ID);
        this.state = this.defaultState;
    }

    clearSearchQuery = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                searchQuery: ""
            }
        })
    }
    handleSearch = (value: string) => {
        if (value === "") {
            alert("Enter a query!")
            return;
        }
        this.setState((prevState) => {
            return {
                ...prevState,
                searchQuery: value
            }
        });
    }

    render() {
        const searchStyle = {
            margin: "1rem 1rem 0.75rem 0.75rem",
            height: "30%"
        }
        const buttonStyle = {
            backgroundColor: red[4],
            borderColor: red[4],
            color: "#fff",
            borderRadius: "0.2rem"
        }
        if (this.state.searchQuery === "") {
            return (
                <Content style={{margin: "20%"}}>
                    <Title style={{textAlign: "center"}} level={2}>What inspires you?</Title>

                    <Search enterButton={<Button style={buttonStyle} icon={<SearchOutlined/>}/>}
                            style={searchStyle} size={"large"} placeholder="Empire state building"
                            onSearch={this.handleSearch}/>
                </Content>

            );
        }
        return (
            <SearchResultPage clearSearchQuery={this.clearSearchQuery} searchQuery={this.state.searchQuery}
                              pexelsClient={this.pexelsClient}
                              currentMoodboard={this.props.currentMoodboard}
                              updateBoardCount={this.props.updateBoardCount}/>
        )
    }
}

export default SearchPage;