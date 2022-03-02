import {Component} from "react";
import Moodboard from "../Data/Moodboard";
import PexelsClient from "../Data/PexelsClient";
import {BackTop, Button, Card, Col, Empty, Layout, Row, Tooltip} from 'antd';
import {LeftCircleFilled, UpOutlined} from "@ant-design/icons";
import {red} from "@ant-design/colors";
import {Photo} from "../Data/Photo";

const {Content} = Layout;

interface SearchResultPageProps {
    searchQuery: string,
    pexelsClient: PexelsClient,
    currentMoodboard: Moodboard
    clearSearchQuery: () => void,
    updateBoardCount: () => void
}

interface SearchResultPageState {
    resultImages: Photo[]
}

// Maybe make own image interfaces
class SearchResultPage extends Component<SearchResultPageProps, SearchResultPageState> {
    getSearchResults(searchQuery: string): void {
        this.props.pexelsClient.searchOnQuery(searchQuery).then((result: Photo[]) => {
            this.setState(() => {
                return {
                    resultImages: result
                }
            })
        }).catch((err) => {
            alert(err);
            this.props.clearSearchQuery();
        });
    }

    constructor(props: SearchResultPageProps) {
        super(props);
        this.state = {
            resultImages: []
        }
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
            }
            return (
                <Col span={6}>
                    <Card
                        cover={<img alt={image.altText} src={image.src}/>}
                        actions={[
                            <Button key={"add"} style={buttonStyle} type={"primary"}
                                    onClick={handleCardAdd}>Pin</Button>
                        ]}
                    >
                    </Card>
                </Col>
            );
        }
        return this.state.resultImages.map((image: Photo) => generateCard(image));
    }

    render() {
        // If images is empty, return a div that says "No images found".
        if (this.state.resultImages.length === 0) {
            return (
                <Empty description={
                    <span>No Images Found.</span>
                }>
                    <Button onClick={this.props.clearSearchQuery} type="primary">Go back to Search</Button>
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
            backgroundColor: red[4],
            borderColor: red[4],
            borderRadius: "1rem",
            margin: "1rem 1rem 0.75rem 0.75rem",
            fontSize: "0.75rem"
        }
        // @ts-ignore
        return (
            <Content style={{padding: "0.2rem"}}>
                <Tooltip title="Back to Search">
                    <Button style={buttonStyle} type="primary" shape="default"
                            size={"middle"}
                            icon={<LeftCircleFilled/>}
                            onClick={this.props.clearSearchQuery}>Back to Search</Button>
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