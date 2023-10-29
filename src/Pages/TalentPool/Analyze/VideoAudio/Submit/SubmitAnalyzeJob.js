import React, { Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

import {
    Button, Form,
    FormGroup, Label,
    Input, FormText,
    Row, Col,
    Card, CardBody,
    CardTitle,
} from 'reactstrap';

import {
    fetchCandidatesNames,
    submitVideoAudioJobs
} from '../../../../../Store/Reducers/Data/DataManageOptions';

class SubmitVoiceAudio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectcandidate: '', // Store the selected candidate ID here
            video_file: null,     // Store the selected file here
        };
    }

    componentDidMount() {
        this.props.fetchCandidatesNames();
    }

    handleCandidateChange = (e) => {
        this.setState({ selectcandidate: e.target.value });
    }

    handleFileChange = (e) => {
        this.setState({ video_file: e.target.files[0] });
    }

    submitJob = () => {
        const { selectcandidate, video_file } = this.state;

        if (selectcandidate && video_file) {
            const job = new FormData();
            job.append('video', video_file);
            this.props.submitVideoAudioJobs(job);

            // Reset the form after submission
            this.setState({
                selectcandidate: '',
                video_file: null,
            });
        } else {
            // Handle validation or show an error message
        }
    }

    clearForm = () => {
        this.setState({
            selectcandidate: '',
            video_file: null,
        });

        // Clear the file input field
        document.getElementById('video_file').value = '';
    }

    renderCandidates() {
        const { candidates_names_data } = this.props;

        return (
            <Input
                className="mb-2"
                type="select"
                id="selectcandidate"
                onChange={this.handleCandidateChange}
                value={this.state.selectcandidate}
            >
                <option value="">Select a candidate</option>
                {candidates_names_data.map((candidate) => (
                    <option key={candidate._id} value={candidate._id}>
                        {candidate.candidate_name}
                    </option>
                ))}
            </Input>
        );
    }

    render() {
        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <div>
                        <Row>
                            <Col md="6">
                                <Card className="main-card mb-3">
                                    <CardBody>
                                        <CardTitle>Submit a Candidate</CardTitle>
                                        <Form>
                                            <FormGroup>{this.renderCandidates()}</FormGroup>
                                            <FormGroup>
                                                <Label for="video_file">Meeting Recording Video File</Label>
                                                <Input
                                                    type="file"
                                                    name="file"
                                                    id="video_file"
                                                    onChange={this.handleFileChange}
                                                />
                                                <FormText color="muted">
                                                    Please select the meeting recording file for the selected candidate above.
                                                </FormText>
                                            </FormGroup>
                                            <FormGroup>
                                                <Button
                                                    color="primary"
                                                    className="mt-1"
                                                    onClick={this.submitJob}
                                                >
                                                    Submit
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    className="mt-1"
                                                    onClick={this.clearForm}
                                                >
                                                    Clear
                                                </Button>
                                            </FormGroup>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md="6">
                                <Card className="main-card mb-3">
                                    <CardBody>
                                        <CardTitle>Jobs</CardTitle>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    candidates_names_data: state.DataReducer.candidates_names_data,
});

const mapDispatchToProps = { fetchCandidatesNames, submitVideoAudioJobs };

export default connect(mapStateToProps, mapDispatchToProps)(SubmitVoiceAudio);
