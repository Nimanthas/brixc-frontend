import React, { Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
    Button, Form,
    FormGroup, Label,
    Input, FormText,
    Row, Col,
    Card, CardBody,
    CardTitle,
} from 'reactstrap';

import { connect } from 'react-redux';

import {
    fetchCandidatesNames,
    submitVideoAudioJobs
} from '../../../../../Store/Reducers/Data/DataManageOptions';

class SubmitVoiceAudio extends React.Component {

    componentDidMount() {
        this.props.fetchCandidatesNames();
    }

    renderCandidates() {
        const { candidates_names_data } = this.props;

        return (
            <Input className="mb-2" type="select" id="selectcandidate">
                <option>Select a candidate</option>
                {candidates_names_data.map((candidate) => {
                    return (
                        <option key={candidate._id}>{candidate.candidate_name}</option>
                    );
                })}
            </Input>
        );
    }

    submitJob() {
        const job = new FormData();
        //formData.append('candidate_id', selectcandidate.value);
        this.props.submitVideoAudioJobs(job);
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
                                                <Label for="videoFile">Meeting Recording Video File</Label>
                                                <Input type="file" name="file" id="videoFile" />
                                                <FormText color="muted">
                                                    Please select the meeting recording file for the selected candidate above.
                                                </FormText>
                                            </FormGroup>
                                            <Button color="primary" className="mt-1">Submit</Button>
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
