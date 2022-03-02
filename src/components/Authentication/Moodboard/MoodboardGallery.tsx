import {Component} from "react";
import {AuthTokenProps} from "../Authentication";
import Moodboard, {MoodboardJSON} from "../../Data/Moodboard";
import {BackTop, Button, Card, Col, Empty, Layout, Row} from "antd";
import {UpOutlined} from "@ant-design/icons";
import {red} from "@ant-design/colors";
import {Photo} from "../../Data/Photo";
import {EditMoodboardPage} from "./EditMoodboardPage";

const {Content} = Layout;

interface MoodboardGalleryProps {
    authToken: AuthTokenProps
}

interface MoodboardGalleryState {
    moodBoards: Moodboard[],
    editMoodboard: Moodboard | undefined
}

class MoodboardGallery extends Component<MoodboardGalleryProps, MoodboardGalleryState> {
    private defaultState: MoodboardGalleryState = {
        moodBoards: [],
        editMoodboard: undefined
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
        }).catch(error => alert(error))
    }

    private getMoodboards(username: string) {
        // Implement loading handler
        this.fetchMoodboards(username).then((moodboards) => {
            this.setState(() => ({
                moodBoards: moodboards
            }))
        }).catch((err) => alert(err))
    }

    private generateCards() {
        const buttonStyle = {
            backgroundColor: red[4],
            borderColor: red[4],
            borderRadius: "1rem"
        }
        let generateCard = (moodboard: Moodboard) => {
            let handleMoodboardEdit = () => {
                this.setState((prevState) => ({
                    ...prevState,
                    editMoodboard: moodboard
                }))
            }
            let defaultImage: Photo = moodboard.defaultImageId !== "" ? moodboard.images.get(moodboard.defaultImageId)! : Array.from(moodboard.images.values())[0];
            return (
                <Col span={6}>
                    <Card
                        cover={<img alt={defaultImage.altText} src={defaultImage.src}/>}
                        actions={[
                            <Button key={"edit"} style={buttonStyle} type={"primary"}
                                    onClick={handleMoodboardEdit}>Edit</Button>
                        ]}
                    >
                    </Card>
                </Col>
            );
        }
        return this.state.moodBoards.map((moodboard: Moodboard) => generateCard(moodboard));
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
                    <span>You don't have any boards saved yet.</span>
                }>
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
            <Content style={{padding: "0.2rem"}}>
                <Row style={{marginTop: "1rem"}} gutter={[16, {xs: 8, sm: 16, md: 24, lg: 32}]}>
                    {this.generateCards()}
                </Row>
                <BackTop>
                    <UpOutlined style={{...backTopStyle, textAlign: "center", justifyContent: "center"}}/>
                </BackTop>
            </Content>
        );
    }


}

export default MoodboardGallery;