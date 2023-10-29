import React, { Component } from 'react';
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
import { connect } from 'react-redux';

import {
    fetchCandidates,
    addCandidate,
    editCandidate,
    deleteCandidate,
} from '../../../Store/Reducers/Data/DataManageOptions';
import {
    Row,
    Col,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Input,
} from 'reactstrap';

const itemsPerPage = 5;

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

class ManageCandidates extends Component {
    state = {
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

    componentDidMount() {
        this.props.fetchCandidates();
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

    renderTableHeaders() {
        const { candidates_header } = this.props;

        return (
            <TableRow>
                {candidates_header.map((column) => {
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
        const { candidates_data } = this.props;
        const { itemsPerPage } = this.state;

        return candidates_data
            .slice(0, itemsPerPage)
            .map((item) => (
                <TableRow key={item._id}>
                    {this.props.candidates_header.map((column) => {
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
                            onClick={() => this.handleEdit(item)}
                            variant="contained"
                            color="primary"
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={() => this.handleDelete(item)}
                            variant="contained"
                            color="secondary"
                        >
                            Delete
                        </Button>
                        <Button
                            onClick={() => this.handleScheduleMeeing(item)}
                            variant="contained"
                            color="warning"
                        >
                            Schedule Interviews
                        </Button>
                    </TableCell>
                </TableRow>
            ));
    }

    render() {
        const {
            itemsPerPage,
            isEditing,
            editItem,
            deleteConfirmationOpen,
            addModalOpen,
            newCandidate,
        } = this.state;
        const { candidates_data } = this.props;

        return (
            <div>
                <Row>
                    <Col md="12">
                        <Card className="main-card mb-3">
                            <CardHeader>Candidates</CardHeader>
                            <CardBody>
                                <Row className="mb-3">
                                    <Col md="12" className="text-right">
                                        <Button color="primary" onClick={this.handleAdd}>
                                            Add
                                        </Button>
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
                                        disabled={itemsPerPage >= candidates_data.length}
                                    >
                                        More...
                                    </Button>
                                </Paper>
                                <Modal
                                    open={isEditing}
                                    // onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    {/* Edit modal content */}
                                </Modal>
                                <Modal
                                    open={deleteConfirmationOpen}
                                    // onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    {/* Delete modal content */}
                                </Modal>
                                <Modal
                                    open={addModalOpen}
                                    // onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={style}>
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            Add Candidate
                                        </Typography>
                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                            <div>
                                                <Col>
                                                    <TextField
                                                        label="Name"
                                                        value={newCandidate.candidate_name}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                newCandidate: { ...newCandidate, candidate_name: e.target.value },
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        label="Email"
                                                        value={newCandidate.candidate_email}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                newCandidate: { ...newCandidate, candidate_email: e.target.value },
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        label="Contact Number"
                                                        value={newCandidate.candidate_contact_number}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                newCandidate: { ...newCandidate, candidate_contact_number: e.target.value },
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        label="Job Title"
                                                        value={newCandidate.job_title}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                newCandidate: { ...newCandidate, job_title: e.target.value },
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        label="Status"
                                                        value={newCandidate.candidate_status}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                newCandidate: { ...newCandidate, candidate_status: e.target.value },
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        label="Tags"
                                                        value={newCandidate.tags.join(', ')}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                newCandidate: { ...newCandidate, tags: e.target.value.split(', ') },
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        label="Applied Date"
                                                        value={newCandidate.inbound_date}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                newCandidate: { ...newCandidate, inbound_date: e.target.value },
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        label="Last Update"
                                                        value={newCandidate.last_updated}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                newCandidate: { ...newCandidate, last_updated: e.target.value },
                                                            })
                                                        }
                                                    />
                                                </Col>
                                                <Col>
                                                    <Button onClick={this.handleSaveAdd} variant="contained" color="primary">
                                                        Save
                                                    </Button>
                                                    <Button onClick={this.handleCancelAdd} variant="contained">
                                                        Cancel
                                                    </Button>
                                                </Col>
                                            </div>
                                        </Typography>
                                    </Box>
                                </Modal>
                            </CardBody>
                            <CardFooter className="text-center">
                                {/* Pagination */}
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    candidates_data: state.DataReducer.candidates_data,
    candidates_header: state.DataReducer.candidates_header,
});

const mapDispatchToProps = { fetchCandidates, addCandidate, editCandidate, deleteCandidate };

export default connect(mapStateToProps, mapDispatchToProps)(ManageCandidates);
