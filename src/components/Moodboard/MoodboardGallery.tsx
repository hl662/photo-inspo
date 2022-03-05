import React, {Component} from "react";
import {AuthTokenProps} from "../Authentication/Authentication";
import Moodboard, {MoodboardJSON} from "../Data/Moodboard";
import {BackTop, Button, Card, Col, Empty, Image, Layout, notification, Row, Space, Spin} from "antd";
import {EditOutlined, UpOutlined} from "@ant-design/icons";
import {red} from "@ant-design/colors";
import {Photo} from "../Data/Photo";
import {EditMoodboardPage} from "./EditMoodboardPage";
import Meta from "antd/es/card/Meta";

const {Content} = Layout;

interface MoodboardGalleryProps {
    authToken: AuthTokenProps
}

interface MoodboardGalleryState {
    moodBoards: Moodboard[],
    editMoodboard: Moodboard | undefined,
    loading: boolean,
    visible: boolean
}

class MoodboardGallery extends Component<MoodboardGalleryProps, MoodboardGalleryState> {
    private defaultState: MoodboardGalleryState = {
        moodBoards: [],
        editMoodboard: undefined,
        loading: false,
        visible: false
    }

    constructor(props: MoodboardGalleryProps) {
        super(props);
        this.state = this.defaultState;
        this.clearEditedMoodboard = this.clearEditedMoodboard.bind(this);
    }

    private clearEditedMoodboard() {
        this.setState((prevState) => ({
            ...prevState,
            editMoodboard: undefined
        }))
    }

    private async fetchMoodboards(username: string): Promise<Moodboard[]> {
        this.setState((prevState) => ({
            ...prevState,
            loading: true,
        }));
        let result: Moodboard[] = [];
        return fetch(`https://photo-inspo-backend.herokuapp.com/moodboards?username=${username}`, {
            method: "GET",
        }).then((response: Response) => {
            if (!response.ok) {
                throw new Error(`Error code ${response.status}: ${response.statusText}`);
            }
            return response.json();
        }).then((data) => {
            if (data.count === 0) {
                return result;
            }
            return data.moodboards.map((moodboard: any) => {
                let returnBody: MoodboardJSON = {
                    name: moodboard.name,
                    images: moodboard.images,
                    defaultImageId: moodboard.defaultImageId ? moodboard.defaultImageId : ""
                }
                return Moodboard.fromJSON(returnBody);
            });
        }).catch(error => {
            notification.error({
                message: error,
                duration: 2,
            })
            return;
        })
    }

    private getMoodboards(username: string) {
        // Implement loading handler
        this.fetchMoodboards(username).then((moodboards) => {
            this.setState(() => ({
                moodBoards: moodboards,
                loading: false
            }))
        }).catch((err) => {
                notification.error({
                    message: err,
                    duration: 2,
                })
                return;
            }
        )
    }


    componentDidMount() {
        this.getMoodboards(this.props.authToken.username);
    }

    // Maybe don't need this?
    componentDidUpdate(prevProps: Readonly<MoodboardGalleryProps>, prevState: Readonly<MoodboardGalleryState>, snapshot?: any) {
        if (prevState.editMoodboard !== this.state.editMoodboard) {
            this.getMoodboards(this.props.authToken.username);
        }
    }


    render() {

        let generateCards = () => {
            const buttonStyle = {
                backgroundColor: red[4],
                borderColor: red[4],
                borderRadius: "1rem"
            }
            let generateCard = (moodboard: Moodboard) => {
                let setVisible = (vis: boolean) => {
                    this.setState((prevState) => ({
                        ...prevState,
                        visible: vis
                    }))
                }
                let handleMoodboardEdit = () => {
                    this.setState((prevState) => ({
                        ...prevState,
                        editMoodboard: moodboard
                    }))
                }
                let generatePreviewImages = (images: Map<string, Photo>) => {
                    let imageElements: JSX.Element[] = [];
                    images.forEach((image: Photo) => {
                        imageElements.push((
                            <Image src={image.src}/>
                        ));
                    });
                    return imageElements.map((card: JSX.Element) => card);
                }

                let defaultImage: Photo = moodboard.images.get(moodboard.defaultImageId) !== undefined ? moodboard.images.get(moodboard.defaultImageId)! : Array.from(moodboard.images.values())[0];
                return (
                    <Col span={6}>
                        <Card
                            style={{borderRadius: "2rem"}}
                            hoverable={true}
                            cover={
                                <>
                                    <Image preview={{visible: this.state.visible}} onClick={() => setVisible(true)}
                                           style={{borderRadius: "0.5rem 0.5rem 0rem 0rem"}} alt={defaultImage.altText}
                                           src={defaultImage.src}/>
                                    <div style={{display: 'none'}}>
                                        <Image.PreviewGroup preview={{
                                            visible: this.state.visible,
                                            onVisibleChange: vis => setVisible(vis)
                                        }}>
                                            {generatePreviewImages(moodboard.images)}
                                        </Image.PreviewGroup>
                                    </div>

                                </>
                            }
                        >
                            <Meta title={moodboard.name}
                                  avatar={<Button key={"edit"} style={buttonStyle} icon={<EditOutlined/>}
                                                  type={"primary"}
                                                  onClick={handleMoodboardEdit}/>}
                            />
                        </Card>
                    </Col>
                );
            }
            return this.state.moodBoards.map((moodboard: Moodboard) => generateCard(moodboard));
        }
        const backTopStyle = {
            height: 40,
            width: 40,
            lineHeight: "40px",
            borderRadius: 20,
            backgroundColor: "#000",
            color: "#fff",
            fontSize: 14
        }
        // if no boards found, render different content.
        if (this.state.moodBoards.length === 0) {
            return (
                <Empty description={
                    <span>You don't have any boards saved yet!</span>
                }>
                    <Space direction={"vertical"}>
                        <Spin style={{marginTop: "3%"}} size={"large"} spinning={this.state.loading}/>
                    </Space>
                </Empty>
            )
        }
        if (this.state.editMoodboard !== undefined) {
            return (
                <EditMoodboardPage authToken={this.props.authToken} clearEditedMoodboard={this.clearEditedMoodboard}
                                   moodboard={this.state.editMoodboard}/>
            );
        }
        return (

            // Make one whole col that is just the name and the delete mood board button in the center.
            <Content style={{padding: "2%"}}>
                <Row gutter={[16, {xs: 8, sm: 16, md: 24, lg: 32}]}>
                    {generateCards()}
                </Row>
                <BackTop>
                    <UpOutlined style={{...backTopStyle, textAlign: "center", justifyContent: "center"}}/>
                </BackTop>
            </Content>
        );
    }


}

export default MoodboardGallery;