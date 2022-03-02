import React, {Component} from "react";
import Moodboard from "../../Data/Moodboard";
import {Button, Card, Col, Layout, Row, Space, Typography} from "antd";
import {CheckOutlined, CloseOutlined, DeleteOutlined} from "@ant-design/icons";
import {red} from "@ant-design/colors";
import {Photo} from "../../Data/Photo";
import {AuthTokenProps} from "../Authentication";

const {Title, Text} = Typography;
const {Content} = Layout;

interface EditMoodboardPageProps {
    authToken: AuthTokenProps,
    moodboard: Moodboard,
    clearEditedMoodboard: () => void;
}

interface EditMoodboardPageState {
    moodboard: Moodboard,
    edited: boolean
}

export class EditMoodboardPage extends Component<EditMoodboardPageProps, EditMoodboardPageState> {
    constructor(props: EditMoodboardPageProps) {
        super(props);

        this.state = ({
            moodboard: Moodboard.fromJSON(Moodboard.toJSON(this.props.moodboard)),
            edited: false
        });
    }

    private generateBoard() {
        return (
            <Row style={{marginTop: "1rem"}} gutter={[16, {xs: 8, sm: 16, md: 24, lg: 32}]}>
                {this.generateCards()}
            </Row>
        );
    }

    private generateCards() {
        const buttonStyle = {
            backgroundColor: red[4],
            borderColor: red[4],
            borderRadius: "1rem",
            margin: "1rem 1rem 0.75rem 0.75rem",
            fontSize: "0.5rem"

        }

        const buttonStyle2 = {
            borderRadius: "1rem",
            margin: "1rem 1rem 0.75rem 0.75rem",
            fontSize: "0.5rem"
        }

        let cards: JSX.Element[] = [];
        let generateCard = (image: Photo) => {
            let handleCardRemove = () => {
                this.state.moodboard.removeImageLink(image.id);
                this.setState((prevState) => ({
                    ...prevState,
                    edited: true
                }))
            }

            let handleSetDefaultImage = () => {
                this.state.moodboard.setDefaultImageId(image.id);
                this.setState((prevState) => ({
                    ...prevState,
                    edited: true
                }))
            }

            // If cards image.id === this.props.currentMoodboard.defaultImageId, add a tag on img that says Default.
            let isDisabled = this.state.moodboard.defaultImageId === image.id;
            cards.push((
                <Col span={6}>
                    <Card
                        cover={<img alt={image.altText} src={image.src}/>}
                        actions={[
                            <Button key={"add"} style={buttonStyle} icon={<DeleteOutlined/>} type={"primary"}
                                    onClick={handleCardRemove}/>,
                            <Button key={"set"} style={buttonStyle2} disabled={isDisabled}
                                    onClick={handleSetDefaultImage}>Set
                                Default</Button>
                        ]}
                    >
                    </Card>
                </Col>
            ));

        }
        this.state.moodboard.images.forEach((image: Photo) => {
            generateCard(image)
        })
        return cards.map((card: JSX.Element) => card);
    }

    private handleEditName(name: string) {
        this.state.moodboard.setName(name);
        this.setState((prevState) => ({
            ...prevState,
            edited: true
        }))
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
        let buttonStyle2 = {
            borderRadius: "1rem",
            margin: "1rem 1rem 0.75rem 0.75rem",
            fontSize: "0.75rem"
        }

        let handleEditCancel = () => {
            this.setState(() => ({
                moodboard: Moodboard.fromJSON(Moodboard.toJSON(this.props.moodboard)),
                edited: false
            }))
        }
        let handleDeleteMoodboard = () => {
            // TODO: Add an alert pop up confirming the delete in this page, and in gallery, add a modal pop up and a delete feature.
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "username": this.props.authToken.username,
                "name": this.props.moodboard.name
            });

            var requestOptions: RequestInit = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://photo-inspo-backend.herokuapp.com/delete", requestOptions)
                .then(response => {
                    if (!response.ok) {
                        console.log(response);
                        throw new Error(`Error code ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(() => {
                    this.props.clearEditedMoodboard();
                })
                .catch(error => alert(error));
        }
        let handleSaveEdits = () => {
            let oldName = this.props.moodboard.name;
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            let moodboardJSON = Moodboard.toJSON(this.state.moodboard);
            let userName = this.props.authToken.username;
            let raw: string = JSON.stringify({
                ...moodboardJSON,
                username: userName,
                oldName: oldName
            })
            let requestOptions: RequestInit = {
                method: 'POST',
                mode: 'cors',
                headers: myHeaders,
                body: raw,
            };

            fetch("https://photo-inspo-backend.herokuapp.com/update", requestOptions)
                .then(response => {
                    if (!response.ok) {
                        console.log(response);
                        throw new Error(`Error code ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(() => {
                    this.props.clearEditedMoodboard();
                })
                .catch(error => alert(error));
        }

        return (<Content>
                <Button onClick={this.props.clearEditedMoodboard}>Back to Gallery</Button>
                <Button onClick={handleDeleteMoodboard}>
                    <Text>Delete Moodboard</Text>
                    <DeleteOutlined/>
                </Button>
                <Title level={3}>Current Moodboard</Title>
                <Text editable={editConfig}>{this.state.moodboard.name}</Text>
                {this.generateBoard()}
                {this.state.edited &&
                    <Space>
                        <Button style={buttonStyle2} onClick={handleEditCancel} icon={<CloseOutlined/>}/>
                        <Button style={buttonStyle} onClick={handleSaveEdits} icon={<CheckOutlined/>}/>
                    </Space>}

            </Content>
        );
    }


}