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
    fetchJobResult,
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

const job_result_header = [
    {
        "header_name": "Angry",
        "header_value": "angry",
        "hidden": false,
        "sortable": false,
        "filterable": false,
        "type": "text",
        "editable": false
    },
    {
        "header_name": "Disgust",
        "header_value": "disgust",
        "hidden": false,
        "sortable": false,
        "filterable": false,
        "type": "text",
        "editable": false
    },
    {
        "header_name": "Fear",
        "header_value": "fear",
        "hidden": false,
        "sortable": false,
        "filterable": false,
        "type": "text",
        "editable": true
    },
    {
        "header_name": "Happy",
        "header_value": "happy",
        "hidden": false,
        "sortable": false,
        "filterable": false,
        "type": "text",
        "editable": true
    },
    {
        "header_name": "Neutral",
        "header_value": "neutral",
        "hidden": false,
        "sortable": false,
        "filterable": false,
        "type": "text",
        "editable": true
    },
    {
        "header_name": "Sad",
        "header_value": "sad",
        "hidden": false,
        "sortable": false,
        "filterable": false,
        "type": "text",
        "editable": true
    },
    {
        "header_name": "Surprise",
        "header_value": "surprise",
        "hidden": false,
        "sortable": false,
        "filterable": false,
        "type": "text",
        "editable": true
    }
]

const job_trait_header = [
    {
        "header_name": "Agreeableness",
        "header_value": "agreeableness",
        "hidden": false,
        "sortable": false,
        "filterable": false,
        "type": "text",
        "editable": false
    },
    {
        "header_name": "Conscientiousness",
        "header_value": "conscientiousness",
        "hidden": false,
        "sortable": false,
        "filterable": false,
        "type": "text",
        "editable": false
    },
    {
        "header_name": "Extroversion",
        "header_value": "extroversion",
        "hidden": false,
        "sortable": false,
        "filterable": false,
        "type": "text",
        "editable": true
    },
    {
        "header_name": "Neuroticism",
        "header_value": "neuroticism",
        "hidden": false,
        "sortable": false,
        "filterable": false,
        "type": "text",
        "editable": true
    },
    {
        "header_name": "Neutral",
        "header_value": "neutral",
        "hidden": false,
        "sortable": false,
        "filterable": false,
        "type": "text",
        "editable": true
    },
    {
        "header_name": "Openness",
        "header_value": "openness",
        "hidden": false,
        "sortable": false,
        "filterable": false,
        "type": "text",
        "editable": true
    }
]

class ViewAnalyzeJob extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectpendingjob: '', // Store the selected candidate ID here
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

    handlePendingJonChange = (e) => {
        this.setState({ selectpendingjob: e.target.value });
    }

    handleFileChange = (e) => {
        this.setState({ video_file: e.target.files[0] });
    }

    // submitJob = () => {
    //     const { selectpendingjob, video_file } = this.state;

    //     if (selectpendingjob && selectpendingjob != "blank" && video_file) {
    //         const job = new FormData();
    //         job.append('video', video_file);
    //         this.props.submitVideoAudioJobs(job, selectpendingjob);

    //         this.clearForm();
    //     } else {
    //         // Handle validation or show an error message
    //         this.clearForm();
    //     }
    // }

    clearForm = () => {
        this.setState({
            selectpendingjob: '',
            video_file: null,
        });

        // Clear the file input field
        document.getElementById('video_file').value = '';
        this.props.fetchPendingJobs();

    }

    renderPendingJobs() {
        const { outstanding_jobs } = this.props;

        if (!outstanding_jobs) {
            return null; // Handle the case when the data is undefined
        }

        return (
            <Input
                className="mb-2"
                type="select"
                id="selectpendingjob"
                onChange={this.handlePendingJonChange}
                value={this.state.selectpendingjob}
            >
                <option value="blank">Select a job</option>
                {outstanding_jobs.map((job) => (
                    <option key={job.task_id} value={job.task_id}>
                        {job.task_id}
                    </option>
                ))}
            </Input>
        );
    }

    renderTableHeaders(outstanding_jobs_header) {

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
            </TableRow>
        );
    }

    renderTableRows(outstanding_jobs, outstanding_jobs_header) {
        const { itemsPerPage } = this.state;

        if (!outstanding_jobs) {
            return null; // Handle the case when the data is undefined
        }


        return outstanding_jobs
            .slice(0, itemsPerPage)
            .map((item) => (
                <TableRow key={item._id}>
                    {outstanding_jobs_header.map((column) => {
                        if (column.hidden) return null;
                        return (
                            <TableCell key={column.header_value}>
                                {column.type === 'array'
                                    ? item[column.header_value].map((tag) => tag.tag_name).join(', ')
                                    : item[column.header_value]}
                            </TableCell>
                        );
                    })}
                </TableRow>
            ));
    }

    handleJobSearch() {
        const { selectpendingjob } = this.state;

        if (!selectpendingjob) {
            return null; // Handle the case when the data is undefined
        }

        this.props.fetchJobResult(selectpendingjob);
    }


    render() {
        const {
            itemsPerPage,
            deleteConfirmationOpen,
        } = this.state;
        const { outstanding_jobs, outstanding_jobs_header, average_job_result, job_result, traits, dominant_trait } = this.props;

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
                            <Col md="12">
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
                                                    <TableHead>{this.renderTableHeaders(outstanding_jobs_header)}</TableHead>
                                                    <TableBody>{this.renderTableRows(outstanding_jobs, outstanding_jobs_header)}</TableBody>
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
                            <Col md="12">
                                <Col md="12">
                                    <Card className="main-card mb-3">
                                        <CardBody>
                                            <CardTitle>View Job</CardTitle>
                                            <Row className="mb-3">
                                                <Col md="12" className="text-right">
                                                    <FormGroup>{this.renderPendingJobs()}</FormGroup>
                                                    <Button color="success" onClick={() => this.handleJobSearch()}>
                                                        Search
                                                    </Button>
                                                    <Button color="success">
                                                        Export
                                                    </Button>
                                                    <Button color="success" onClick={() => this.handleAnalyzeTraits()}>
                                                        Analyze Traits
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Row className="mb-3">
                                                        Status: {traits.length > 0 ? "Completed" : "Task not found or not completed yet. Failed to get result"}
                                                    </Row>
                                                    <Row className="mb-3">
                                                        Dominant Trait: {dominant_trait[0]}
                                                    </Row>
                                                    <Row className="mb-3">
                                                        Overall Traits Breakdown
                                                    </Row>
                                                    <Paper>
                                                        <Table>
                                                            <TableHead>{this.renderTableHeaders(job_trait_header)}</TableHead>
                                                            <TableBody>{this.renderTableRows(traits, job_trait_header)}</TableBody>
                                                        </Table>
                                                    </Paper>
                                                    <Row className="mb-3">
                                                        Overall Emotion Breakdown
                                                    </Row>
                                                    <Paper>
                                                        <Table>
                                                            <TableHead>{this.renderTableHeaders(job_result_header)}</TableHead>
                                                            <TableBody>{this.renderTableRows(average_job_result, job_result_header)}</TableBody>
                                                        </Table>
                                                    </Paper>
                                                    <Row className="mb-3">
                                                        Frame Wise Breakdown
                                                    </Row>
                                                    <Paper>
                                                        <Table>
                                                            <TableHead>{this.renderTableHeaders(job_result_header)}</TableHead>
                                                            <TableBody>{this.renderTableRows(job_result, job_result_header)}</TableBody>
                                                        </Table>
                                                        <Button
                                                            onClick={() => this.setState({ itemsPerPage: itemsPerPage + 5 })}
                                                            disabled={itemsPerPage >= job_result.length}
                                                        >
                                                            More...
                                                        </Button>
                                                    </Paper>
                                                </Col>
                                            </Row>
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
    average_job_result: state.DataReducer.average_job_result,
    job_result: state.DataReducer.job_result,
    traits: state.DataReducer.traits,
    dominant_trait: state.DataReducer.dominant_trait,
});

const mapDispatchToProps = { fetchCandidatesNames, fetchJobResult, fetchPendingJobs };

export default connect(mapStateToProps, mapDispatchToProps)(ViewAnalyzeJob);
