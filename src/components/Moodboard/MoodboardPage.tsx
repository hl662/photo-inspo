import React, {Component} from "react";
import Moodboard from "../Data/Moodboard";
import {
    Avatar,
    BackTop,
    Button,
    Card,
    Col,
    Divider,
    Empty,
    Image,
    Input,
    Layout,
    notification,
    Row,
    Space,
    Typography
} from "antd";
import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    LockOutlined,
    SaveOutlined,
    UnlockOutlined,
    UpOutlined
} from "@ant-design/icons";
import {red} from "@ant-design/colors";
import {Photo} from "../Data/Photo";
import {AuthTokenProps} from "../Authentication/Authentication";
import Meta from "antd/es/card/Meta";

const {Title, Text} = Typography;
const {Content} = Layout;

interface MoodboardPageProps {
    authToken: AuthTokenProps,
    currentMoodboard: Moodboard,
    updateBoardCount: () => void
}

interface MoodboardPageState {
    isEditingName: boolean
    loading: boolean,
    editName: string
}

class MoodboardPage extends Component<MoodboardPageProps, MoodboardPageState> {
    private defaultState: MoodboardPageState = {
        isEditingName: false,
        editName: "",
        loading: false
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
        let cards: JSX.Element[] = [];
        let generateCard = (image: Photo) => {
            let handleCardRemove = () => {
                this.props.currentMoodboard.removeImageLink(image.id);
                this.setState((prevState) => prevState)
                this.props.updateBoardCount();
                notification.success({
                    message: 'Image Removed',
                    description: "Removed from gallery.",
                    duration: 1.25,
                })
            }
            let handleSetDefaultImage = () => {
                this.props.currentMoodboard.setDefaultImageId(image.id);
                this.setState((prevState) => prevState)
                notification.success({
                    message: 'Image set as Default',
                    description: "Success! This image will be shown by default in the gallery.",
                    duration: 1.25,
                })
            }
            let photographerCredit = `By ${image.photographer}`
            cards.push((
                <Col span={6}>
                    <Card
                        style={{borderRadius: "2rem"}}
                        hoverable
                        extra={
                            <>
                                <Button disabled={this.props.currentMoodboard.defaultImageId === image.id}
                                        size={"small"} style={{fontWeight: "bold"}}
                                        type={"text"} key={"set"}
                                        onClick={handleSetDefaultImage}>Set
                                    as Default</Button>
                                {this.props.currentMoodboard.defaultImageId === image.id ? <LockOutlined/> :
                                    <UnlockOutlined onClick={handleSetDefaultImage}/>}
                            </>}
                        cover={<Image style={{borderRadius: "0.5rem 0.5rem 0rem 0rem"}} alt={image.altText}
                                      src={image.src}/>}
                    >
                        <Meta
                            avatar={<Button key={"delete"} style={buttonStyle} icon={<DeleteOutlined/>} type={"primary"}
                                            onClick={handleCardRemove}/>}
                            title={image.altText}
                            description={photographerCredit}
                        />
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

    private handleEditName(value: string) {
        this.props.currentMoodboard.setName(value);
    }


    render() {
        let buttonStyle = {
            backgroundColor: red[4],
            borderColor: red[4],
            color: "#fff",
            borderRadius: "0.2rem",
            margin: "10% 0 0% 0%"
        }
        let handleSaveToGallery = () => {
            if (this.props.currentMoodboard.name === "") {
                notification.warning({
                    message: 'No moodboard name given',
                    description: "You must have a name for your board!",
                    duration: 2,
                })
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
            this.setState((prevState) => ({
                ...prevState,
                loading: true
            }));
            fetch("https://photo-inspo-backend.herokuapp.com/save", requestOptions)
                .then(response => {
                    if (!response.ok) {
                        console.log(response);
                        throw new Error(`Error code ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(() => {
                    notification.success({
                        message: 'Moodboard Saved',
                        description: "Saved to Gallery!",
                        duration: 2,
                    })
                    this.setState((prevState) => ({
                        ...prevState,
                        loading: false
                    }));
                })
                .catch(error => {
                        notification.error({
                            message: error,
                            duration: 2,
                        })
                        return;
                    }
                );
        }
        if (this.props.currentMoodboard.images.size === 0) {
            return (
                <Empty description={
                    <span>You don't have any images pinned yet!.</span>
                }>
                </Empty>
            )
        }

        let confirmEdit = () => {
            this.handleEditName(this.state.editName);
            this.setState((prevState) => ({
                ...prevState,
                editName: "",
                isEditingName: false
            }))
        }
        let cancelEdit = () => {
            this.setState((prevState) => ({
                ...prevState,
                editName: "",
                isEditingName: false
            }))
        }
        let renderEditInput = () => {
            return (
                <Input style={{padding: "0"}}
                       onChange={(e) => this.setState((prevState) => ({
                           ...prevState,
                           editName: e.target.value
                       }))}
                       onPressEnter={confirmEdit}
                       defaultValue={this.props.currentMoodboard.name}
                       addonAfter={
                           <div style={{width: "100%"}}>
                               <CheckOutlined style={{marginLeft: "0%"}} onClick={confirmEdit}/>
                               <Divider type={"vertical"} style={{borderLeft: "1.5px solid rgba(0,0,0,0.4)"}}/>
                               <CloseOutlined onClick={cancelEdit}/>
                           </div>
                       }/>

            )
        }

        let handleEnableEdit = () => {
            this.setState((prevState) => ({
                ...prevState,
                isEditingName: true
            }))
        }
        let defaultImageId = this.props.currentMoodboard.defaultImageId;
        let defaultImageSrc: string = this.props.currentMoodboard.images.has(defaultImageId) ?
            this.props.currentMoodboard.images.get(defaultImageId)!.src : Array.from(this.props.currentMoodboard.images.values())[0].src;
        const backTopStyle = {
            height: 40,
            width: 40,
            lineHeight: "40px",
            borderRadius: 20,
            backgroundColor: "#000",
            color: "#fff",
            fontSize: 14
        }
        return (
            <Content style={{margin: "2% 2% 0% 2%"}}>
                <Row>
                    <Col span={24}>
                        <Space style={{width: "100%"}} direction={"vertical"} align={"center"}>
                            <Avatar size={{xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100}} src={defaultImageSrc}/>
                            {this.state.isEditingName ? null :
                                <Title level={3}>{this.props.currentMoodboard.name}</Title>}
                            {this.state.isEditingName ? renderEditInput() : null}
                            <Space direction={"horizontal"} align={"end"}>
                                <Button size={"large"} style={buttonStyle} onClick={handleEnableEdit}>
                                    <Text style={{color: "white"}}>Edit Moodboard's Name</Text>
                                    <EditOutlined/>
                                </Button>
                                <Button size={"large"} style={buttonStyle} onClick={handleSaveToGallery}>
                                    <Text style={{color: "white"}}>Save to Gallery</Text>
                                    <SaveOutlined/>
                                </Button>

                            </Space>
                        </Space>
                    </Col>
                </Row>
                <Divider style={{borderTop: "1.5px solid rgba(0,0,0,0.4)"}}/>
                {this.generateBoard()}
                <BackTop>
                    <UpOutlined style={{...backTopStyle, textAlign: "center", justifyContent: "center"}}/>
                </BackTop>
            </Content>
        );
    }


}

export default MoodboardPage;