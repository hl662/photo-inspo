import React, {Component} from "react";
import Moodboard from "../../Data/Moodboard";
import {Button, Card, Col, Layout, Row, Typography} from "antd";
import {DeleteOutlined, SaveOutlined} from "@ant-design/icons";
import {red} from "@ant-design/colors";
import {Photo} from "../../Data/Photo";
import {AuthTokenProps} from "../Authentication";

const {Title, Text} = Typography;
const {Content} = Layout;

interface MoodboardPageProps {
    authToken: AuthTokenProps,
    currentMoodboard: Moodboard,
    updateBoardCount: () => void
}

interface MoodboardPageState {
    isEditingName: boolean,
}

class MoodboardPage extends Component<MoodboardPageProps, MoodboardPageState> {
    private defaultState: MoodboardPageState = {
        isEditingName: false
    }

    constructor(props: MoodboardPageProps) {
        super(props);
        this.state = this.defaultState;
    }

    private generateCards() {
        const buttonStyle = {
            backgroundColor: red[4],
            borderColor: red[4],
            borderRadius: "1rem",
            margin: "1rem 1rem 0.75rem 0.75rem",
            fontSize: "0.75rem"
        }
        const buttonStyle2 = {
            borderRadius: "1rem",
            margin: "1rem 1rem 0.75rem 0.75rem",
            fontSize: "0.75rem"
        }
        let cards: JSX.Element[] = [];
        let generateCard = (image: Photo) => {
            let handleCardRemove = () => {
                this.props.currentMoodboard.removeImageLink(image.id);
                this.setState((prevState) => prevState)
                this.props.updateBoardCount();
            }
            let handleSetDefaultImage = () => {
                this.props.currentMoodboard.setDefaultImageId(image.id);
                this.setState((prevState) => prevState)
            }
            // If cards image.id === this.props.currentMoodboard.defaultImageId, add a tag on img that says Default.
            cards.push((
                <Col span={6}>
                    <Card
                        cover={<img alt={image.altText} src={image.src}/>}
                        actions={[
                            <Button key={"add"} style={buttonStyle} icon={<DeleteOutlined/>} type={"primary"}
                                    onClick={handleCardRemove}/>,
                            <Button key={"set"} style={buttonStyle2} onClick={handleSetDefaultImage}>Set
                                Default</Button>
                        ]}
                    >
                    </Card>
                </Col>
            ));
        }
        this.props.currentMoodboard.images.forEach((image: Photo) => {
            generateCard(image)
        })
        return cards.map((card: JSX.Element) => card);
    }

    private generateBoard() {
        return (
            <Row style={{marginTop: "1rem"}} gutter={[16, {xs: 8, sm: 16, md: 24, lg: 32}]}>
                {this.generateCards()}
            </Row>
        );
    }

    private handleEditName(name: string) {
        this.props.currentMoodboard.setName(name);
        this.setState(prevState => prevState);
    }


    render() {
        let editConfig = {
            autoSize: true,
            onChange: (value: string) => this.handleEditName(value)
        }
        let buttonStyle = {
            backgroundColor: red[4],
            borderColor: red[4],
            color: "#fff",
            borderRadius: "0.2rem",

        }
        let handleSaveToGallery = () => {
            if (this.props.currentMoodboard.name === "") {
                alert("You must have a name for your board!");
                return;
            }
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            let moodboardJSON = Moodboard.toJSON(this.props.currentMoodboard);
            let userName = this.props.authToken.username;
            let raw: string = JSON.stringify({
                ...moodboardJSON,
                username: userName
            })
            let requestOptions: RequestInit = {
                method: 'POST',
                mode: 'cors',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://photo-inspo-backend.herokuapp.com/save", requestOptions)
                .then(response => {
                    if (!response.ok) {
                        console.log(response);
                        throw new Error(`Error code ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    alert(data.message)
                })
                .catch(error => alert(error));
        }
        // If moodboard has no images, then return a different screen saying empty!
        return (
            <Content style={{margin: "20%"}}>
                <Title level={3}>Current Moodboard</Title>
                <Text editable={editConfig}>{this.props.currentMoodboard.name}</Text>
                {this.generateBoard()}
                <Button style={buttonStyle} onClick={handleSaveToGallery}>
                    <Text style={{color: "white"}}>Save to Gallery</Text>
                    <SaveOutlined/>
                </Button>
            </Content>
        );
    }


}

export default MoodboardPage;