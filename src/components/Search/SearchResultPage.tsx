import {Component} from "react";
import Moodboard from "../Data/Moodboard";
import PexelsClient from "../Data/PexelsClient";
import {BackTop, Button, Card, Col, Empty, Image, Layout, notification, Row, Space, Spin, Tooltip} from 'antd';
import {LeftCircleFilled, PushpinOutlined, UpOutlined} from "@ant-design/icons";
import {red} from "@ant-design/colors";
import {Photo} from "../Data/Photo";
import Meta from "antd/es/card/Meta";

const {Content} = Layout;

interface SearchResultPageProps {
    searchQuery: string,
    pexelsClient: PexelsClient,
    currentMoodboard: Moodboard
    clearSearchQuery: () => void,
    updateBoardCount: () => void
}

interface SearchResultPageState {
    resultImages: Photo[],
    loading: boolean
}

// Maybe make own image interfaces
class SearchResultPage extends Component<SearchResultPageProps, SearchResultPageState> {


    constructor(props: SearchResultPageProps) {
        super(props);
        this.state = {
            resultImages: [],
            loading: false
        }
    }

    getSearchResults(searchQuery: string): void {
        this.setState((prevState) => ({
            ...prevState,
            loading: true
        }));
        this.props.pexelsClient.searchOnQuery(searchQuery).then((result: Photo[]) => {
            this.setState(() => ({
                resultImages: result,
                loading: false
            }))
        }).catch((err) => {
            notification.error({
                message: err,
                duration: 2,
            })
            this.props.clearSearchQuery();
        });
    }

    componentDidMount() {
        this.getSearchResults(this.props.searchQuery);
    }

    componentDidUpdate(prevProps: Readonly<SearchResultPageProps>, prevState: Readonly<SearchResultPageState>, snapshot?: any) {
        if (this.props.searchQuery !== prevProps.searchQuery) {
            this.getSearchResults(this.props.searchQuery);
        }
    }

    private generateCards() {

        const buttonStyle = {
            backgroundColor: red[4],
            borderColor: red[4],
            borderRadius: "1rem"
        }
        let generateCard = (image: Photo) => {
            let handleCardAdd = () => {
                this.props.currentMoodboard.addImage(image.id.toString(), image);
                this.props.updateBoardCount();
                notification.success({
                    message: 'Pinned',
                    description: "Image pinned to current board!",
                    duration: 1.25,
                })
            }
            let photographerCredit = `By ${image.photographer}`
            return (
                <Col span={6}>
                    <Card
                        style={{borderRadius: "2rem"}}
                        hoverable
                        cover={<Image style={{borderRadius: "1rem 1rem 0rem 0rem"}} alt={image.altText}
                                      src={image.src}/>}
                    >
                        <Meta
                            avatar={<Button key={"add"} style={buttonStyle} type={"primary"}
                                            disabled={this.props.currentMoodboard.images.has(image.id)}
                                            onClick={handleCardAdd} icon={<PushpinOutlined/>}/>}
                            title={image.altText}
                            description={photographerCredit}
                        >

                        </Meta>
                    </Card>
                </Col>
            );
        }
        return this.state.resultImages.map((image: Photo) => generateCard(image));
    }

    render() {
        if (this.state.resultImages.length === 0) {
            return (
                <Empty style={{marginTop: "15%"}} description={
                    <span>No Images Found.</span>
                }>
                    <Space direction={"vertical"}>
                        <Button onClick={this.props.clearSearchQuery} type="primary">Go back to Search</Button>
                        <Spin style={{marginTop: "3%"}} size={"large"} spinning={this.state.loading}/>
                    </Space>

                </Empty>
            )
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

        const buttonStyle = {
            borderRadius: "1rem",
            margin: "1rem 1rem 0.75rem 0.75rem",
            color: red[4]
        }
        // @ts-ignore
        return (
            <Content style={{padding: "1rem"}}>
                <Tooltip title="Back to Search" placement={"right"}>
                    <Button style={buttonStyle} type="text" shape="default"
                            size={"large"}
                            icon={<LeftCircleFilled style={{fontSize: "150%"}}/>}
                            onClick={this.props.clearSearchQuery}/>
                </Tooltip>
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

export default SearchResultPage;