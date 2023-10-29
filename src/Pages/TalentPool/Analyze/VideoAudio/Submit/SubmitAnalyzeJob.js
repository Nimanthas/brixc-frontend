import React, { Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

import {
    Form,
    FormGroup, Label,
    Input, FormText,
    Row, Col,
    Card, CardBody,
    CardTitle,
    CardHeader,
    CardFooter,
} from 'reactstrap';

import {
    fetchCandidatesNames,
    submitVideoAudioJobs,
    fetchPendingJobs
} from '../../../../../Store/Reducers/Data/DataManageOptions';
import {
    ToastContainer,
    toast,
    Bounce,
    Slide,
    Flip,
    Zoom
} from 'react-toastify';

import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Button,
    Modal,
    TextField,
    Typography,
    Box,
} from '@material-ui/core';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const itemsPerPage = 5;

class SubmitVoiceAudio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectcandidate: '', // Store the selected candidate ID here
            video_file: null,     // Store the selected file here
            editItem: null,
            isEditing: false,
            deleteConfirmationOpen: false,
            addModalOpen: false, // Added state for the "Add" modal
            itemsPerPage: itemsPerPage,
            newCandidate: { // Added state for a new candidate
                candidate_name: '',
                candidate_email: '',
                candidate_contact_number: '',
                job_title: '',
                candidate_status: 0,
                tags: [],
                inbound_date: '',
                last_updated: '',
            },
        };
    }

    handleEdit = (item) => {
        this.setState({ isEditing: true, editItem: { ...item } });
    };

    handleSaveEdit = () => {
        this.props.editCandidate(this.state.editItem);
        this.setState({ isEditing: false, editItem: null });
    };

    handleCancelEdit = () => {
        this.setState({ isEditing: false, editItem: null });
    };

    handleDelete = (item) => {
        this.setState({ deleteConfirmationOpen: true, deleteItem: item });
    };

    handleConfirmDelete = () => {
        this.props.deleteCandidate(this.state.deleteItem);
        this.setState({ deleteConfirmationOpen: false, deleteItem: null });
    };

    handleCancelDelete = () => {
        this.setState({ deleteConfirmationOpen: false, deleteItem: null });
    };

    handleAdd = () => {
        this.setState({ addModalOpen: true });
    };

    handleSaveAdd = () => {
        this.props.addCandidate(this.state.newCandidate);
        this.setState({ addModalOpen: false, newCandidate: { /* Reset the new candidate fields */ } });
    };

    handleCancelAdd = () => {
        this.setState({ addModalOpen: false, newCandidate: { /* Reset the new candidate fields */ } });
    };

    handleChangeItemsPerPage = (event) => {
        this.setState({ itemsPerPage: event.target.value });
    };

    handleScheduleMeeing = (item) => {
        console.log(item);
        this.setState({ addModalOpen: false, candidate: item });
    };

    componentDidMount() {
        this.props.fetchCandidatesNames();
        this.props.fetchPendingJobs();
    }

    handleCandidateChange = (e) => {
        this.setState({ selectcandidate: e.target.value });
    }

    handleFileChange = (e) => {
        this.setState({ video_file: e.target.files[0] });
    }

    submitJob = () => {
        const { selectcandidate, video_file } = this.state;

        if (selectcandidate && selectcandidate != "blank" && video_file) {
            const job = new FormData();
            job.append('video', video_file);
            this.props.submitVideoAudioJobs(job, selectcandidate);

            this.clearForm();
        } else {
            // Handle validation or show an error message
            this.clearForm();
        }
    }

    clearForm = () => {
        this.setState({
            selectcandidate: '',
            video_file: null,
        });

        // Clear the file input field
        document.getElementById('video_file').value = '';
        this.props.fetchPendingJobs();

    }

    renderCandidates() {
        const { candidates_names_data } = this.props;

        if (!candidates_names_data) {
            return null; // Handle the case when the data is undefined
        }

        return (
            <Input
                className="mb-2"
                type="select"
                id="selectcandidate"
                onChange={this.handleCandidateChange}
                value={this.state.selectcandidate}
            >
                <option value="blank">Select a candidate</option>
                {candidates_names_data.map((candidate) => (
                    <option key={candidate._id} value={candidate._id}>
                        {candidate.candidate_name}
                    </option>
                ))}
            </Input>
        );
    }

    renderTableHeaders() {
        const { outstanding_jobs_header } = this.props;

        if (!outstanding_jobs_header) {
            return null; // Handle the case when the data is undefined
        }

        return (
            <TableRow>
                {outstanding_jobs_header.map((column) => {
                    if (column.hidden) return null;
                    return (
                        <TableCell key={column.header_value}>{column.header_name}</TableCell>
                    );
                })}
                <TableCell>Actions</TableCell>
            </TableRow>
        );
    }

    renderTableRows() {
        const { outstanding_jobs } = this.props;
        const { itemsPerPage } = this.state;

        if (!outstanding_jobs) {
            return null; // Handle the case when the data is undefined
        }


        return outstanding_jobs
            .slice(0, itemsPerPage)
            .map((item) => (
                <TableRow key={item._id}>
                    {this.props.outstanding_jobs_header.map((column) => {
                        if (column.hidden) return null;
                        return (
                            <TableCell key={column.header_value}>
                                {column.type === 'array'
                                    ? item[column.header_value].map((tag) => tag.tag_name).join(', ')
                                    : item[column.header_value]}
                            </TableCell>
                        );
                    })}
                    <TableCell>
                        <Button
                            onClick={() => this.handleDelete(item)}
                            variant="contained"
                            color="secondary"
                        >
                            Delete
                        </Button>
                    </TableCell>
                </TableRow>
            ));
    }

    render() {
        const {
            itemsPerPage,
            deleteConfirmationOpen,
        } = this.state;
        const { outstanding_jobs } = this.props;

        if (!outstanding_jobs) {
            return null; // Handle the case when the data is undefined
        }

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
                                        <CardTitle>Submit a analyze Job</CardTitle>
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
                                <Col md="12">
                                    <Card className="main-card mb-3">
                                        <CardBody>
                                        <CardTitle>In Progress Jobs</CardTitle>
                                            <Row className="mb-3">
                                                <Col md="12" className="text-right">
                                                    <Button color="success">
                                                        Export
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <Paper>
                                                <Table>
                                                    <TableHead>{this.renderTableHeaders()}</TableHead>
                                                    <TableBody>{this.renderTableRows()}</TableBody>
                                                </Table>
                                                <Button
                                                    onClick={() => this.setState({ itemsPerPage: itemsPerPage + 5 })}
                                                    disabled={itemsPerPage >= outstanding_jobs.length}
                                                >
                                                    More...
                                                </Button>
                                            </Paper>
                                            <Modal
                                                open={deleteConfirmationOpen}
                                                // onClose={handleClose}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                {/* Delete modal content */}
                                            </Modal>
                                        </CardBody>
                                        <CardFooter className="text-center">
                                            {/* Pagination */}
                                        </CardFooter>
                                    </Card>
                                </Col>
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
    outstanding_jobs_header: state.DataReducer.outstanding_jobs_header,
    outstanding_jobs: state.DataReducer.outstanding_jobs,
});

const mapDispatchToProps = { fetchCandidatesNames, submitVideoAudioJobs, fetchPendingJobs };

export default connect(mapStateToProps, mapDispatchToProps)(SubmitVoiceAudio);
