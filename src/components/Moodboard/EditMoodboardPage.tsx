import React, {Component} from "react";
import Moodboard from "../Data/Moodboard";
import {
    Avatar,
    BackTop,
    Button,
    Card,
    Col,
    Divider,
    Input,
    Layout,
    notification,
    Popconfirm,
    Row,
    Space,
    Tooltip,
    Typography
} from "antd";
import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    LeftCircleFilled,
    LockOutlined,
    UnlockOutlined,
    UpOutlined
} from "@ant-design/icons";
import {red} from "@ant-design/colors";
import {Photo} from "../Data/Photo";
import {AuthTokenProps} from "../Authentication/Authentication";
import Meta from "antd/es/card/Meta";

const {Title, Text} = Typography;
const {Content} = Layout;

interface EditMoodboardPageProps {
    authToken: AuthTokenProps,
    moodboard: Moodboard,
    clearEditedMoodboard: () => void;
}

interface EditMoodboardPageState {
    moodboard: Moodboard,
    isEditingName: boolean,
    editName: string
    edited: boolean
}

export class EditMoodboardPage extends Component<EditMoodboardPageProps, EditMoodboardPageState> {
    constructor(props: EditMoodboardPageProps) {
        super(props);

        this.state = ({
            moodboard: Moodboard.fromJSON(Moodboard.toJSON(this.props.moodboard)),
            editName: "",
            edited: false,
            isEditingName: false,
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

        let cards: JSX.Element[] = [];
        let generateCard = (image: Photo) => {
            let handleCardRemove = () => {
                this.state.moodboard.removeImageLink(image.id);
                this.setState((prevState) => ({
                    ...prevState,
                    edited: true
                }))
                notification.success({
                    message: 'Image Marked for Removal',
                    description: "After finishing editing, this image will be removed.",
                    duration: 1.25,
                })
            }

            let handleSetDefaultImage = () => {
                this.state.moodboard.setDefaultImageId(image.id);
                this.setState((prevState) => ({
                    ...prevState,
                    edited: true
                }))
                notification.success({
                    message: 'Image set to be Default',
                    description: "After finishing editing, this image will be set as default.",
                    duration: 1.25,
                })
            }

            let photographerCredit = `By ${image.photographer}`
            cards.push((
                <Col span={6}>
                    <Card
                        style={{borderRadius: "2rem"}}
                        hoverable
                        cover={<img alt={image.altText} src={image.src}/>}
                        extra={
                            <>
                                <Button disabled={this.state.moodboard.defaultImageId === image.id}
                                        size={"small"} style={{fontWeight: "bold"}}
                                        type={"text"} key={"set"}
                                        onClick={handleSetDefaultImage}>Set
                                    as Default</Button>
                                {this.state.moodboard.defaultImageId === image.id ? <LockOutlined/> :
                                    <UnlockOutlined onClick={handleSetDefaultImage}/>}
                            </>}
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
        const backTopStyle = {
            height: 40,
            width: 40,
            lineHeight: "40px",
            borderRadius: 20,
            backgroundColor: "#000",
            color: "#fff",
            fontSize: 14
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
            notification.success({
                message: 'Cancelled Edits',
                duration: 1.25,
            })
        }
        let handleDeleteMoodboard = () => {
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
                    notification.success({
                        message: 'Moodboard Deleted',
                        duration: 1.25,
                    })
                })
                .catch(error => {
                    notification.error({
                        message: error,
                        duration: 2,
                    })
                    return;
                });
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
                        throw new Error(`Error code ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(() => {
                    this.props.clearEditedMoodboard();
                    notification.success({
                        message: 'Moodboard Edited',
                        duration: 1.25,
                    })
                })
                .catch(error => {
                    notification.error({
                        message: error,
                        duration: 2,
                    })
                    return;
                });
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
                       defaultValue={this.state.moodboard.name}
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
        let defaultImageId = this.state.moodboard.defaultImageId;
        let defaultImageSrc: string = this.state.moodboard.images.has(defaultImageId) ?
            this.state.moodboard.images.get(defaultImageId)!.src : Array.from(this.state.moodboard.images.values())[0].src;
        return (
            <Content style={{margin: "2% 2% 0% 2%"}}>
                <Tooltip title="Back to Gallery" placement={"right"}>
                    <Button style={{
                        borderRadius: "1rem",
                        margin: "1rem 1rem 0.75rem 0.75rem",
                        color: red[4]
                    }} type="text" shape="default"
                            size={"large"}
                            icon={<LeftCircleFilled style={{fontSize: "150%"}}/>}
                            onClick={this.props.clearEditedMoodboard}/>
                </Tooltip>
                <Row>
                    <Col span={24}>
                        <Space style={{width: "100%"}} direction={"vertical"} align={"center"}>
                            <Avatar size={{xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100}} src={defaultImageSrc}/>
                            {this.state.isEditingName ? null :
                                <Title level={3}>{this.state.moodboard.name}</Title>}
                            {this.state.isEditingName ? renderEditInput() : null}

                            <Space direction={"horizontal"} align={"center"}>
                                <Popconfirm title={"Are you sure you want to delete this moodboard?"}
                                            onConfirm={handleDeleteMoodboard}
                                            okText={"Yes"} cancelText={"No"}
                                >
                                    <Button size={"large"}>
                                        <Text>Delete Moodboard</Text>
                                        <DeleteOutlined/>
                                    </Button>
                                </Popconfirm>
                                <Button size={"large"} style={buttonStyle} onClick={handleEnableEdit}>
                                    <Text style={{color: "white"}}>Edit Moodboard's Name</Text>
                                    <EditOutlined/>
                                </Button>

                            </Space>
                            {this.state.edited &&
                                <Space align={"center"}>
                                    <Button style={buttonStyle2} onClick={handleEditCancel}
                                            icon={<CloseOutlined/>}>Cancel</Button>
                                    <Button style={buttonStyle} onClick={handleSaveEdits} icon={<CheckOutlined/>}>Save
                                        Edits</Button>
                                </Space>}
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