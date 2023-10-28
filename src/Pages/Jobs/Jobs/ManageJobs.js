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
    fetchJobPosts,
    addJobPost,
    editJobPost,
    deleteJobPost,
} from '../../../../src/Store/Reducers/Data/DataManageOptions';
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

class ManageJobs extends Component {
    state = {
        editItem: null,
        isEditing: false,
        deleteConfirmationOpen: false,
        addModalOpen: false, // Added state for the "Add" modal
        itemsPerPage: itemsPerPage,
        newJobPost: { // Added state for new job post
            job_title: '',
            job_description: '',
            specialization: '',
            salary: '',
            currency: '',
        },
    };

    componentDidMount() {
        this.props.fetchJobPosts();
    }

    handleEdit = (item) => {
        this.setState({ isEditing: true, editItem: { ...item } });
    };

    handleSaveEdit = () => {
        this.props.editJobPost(this.state.editItem);
        this.setState({ isEditing: false, editItem: null });
    };

    handleCancelEdit = () => {
        this.setState({ isEditing: false, editItem: null });
    };

    handleDelete = (item) => {
        this.setState({ deleteConfirmationOpen: true, deleteItem: item });
    };

    handleConfirmDelete = () => {
        this.props.deleteJobPost(this.state.deleteItem);
        this.setState({ deleteConfirmationOpen: false, deleteItem: null });
    };

    handleCancelDelete = () => {
        this.setState({ deleteConfirmationOpen: false, deleteItem: null });
    };

    handleAdd = () => {
        this.setState({ addModalOpen: true });
    };

    handleSaveAdd = () => {
        this.props.addJobPost(this.state.newJobPost);
        this.setState({ addModalOpen: false, newJobPost: { /* Reset the new job post fields */ } });
    };

    handleCancelAdd = () => {
        this.setState({ addModalOpen: false, newJobPost: { /* Reset the new job post fields */ } });
    };

    handleChangeItemsPerPage = (event) => {
        this.setState({ itemsPerPage: event.target.value });
    };

    renderTableHeaders() {
        const { job_posts_header } = this.props;

        return (
            <TableRow>
                {job_posts_header.map((column) => {
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
        const { job_posts_data } = this.props;
        const { itemsPerPage } = this.state;

        return job_posts_data
            .slice(0, itemsPerPage)
            .map((item) => (
                <TableRow key={item._id}>
                    {this.props.job_posts_header.map((column) => {
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
            newJobPost,
        } = this.state;
        const { job_posts_data } = this.props;

        return (
            <div>
                <Row>
                    <Col md="12">
                        <Card className="main-card mb-3">
                            <CardHeader>Job Posts</CardHeader>
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
                                        disabled={itemsPerPage >= job_posts_data.length}
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
                                            Add Job Post
                                        </Typography>
                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                            <div>
                                                <Col>
                                                    <TextField
                                                        label="Title"
                                                        value={newJobPost.job_title}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                newJobPost: { ...newJobPost, job_title: e.target.value },
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        label="Description"
                                                        value={newJobPost.job_description}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                newJobPost: {
                                                                    ...newJobPost,
                                                                    job_description: e.target.value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        label="Specialization"
                                                        value={newJobPost.specialization}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                newJobPost: {
                                                                    ...newJobPost,
                                                                    specialization: e.target.value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        label="Salary"
                                                        value={newJobPost.salary}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                newJobPost: { ...newJobPost, salary: e.target.value },
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        label="Currency"
                                                        value={newJobPost.currency}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                newJobPost: { ...newJobPost, currency: e.target.value },
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
    job_posts_data: state.DataReducer.job_posts_data,
    job_posts_header: state.DataReducer.job_posts_header,
});

const mapDispatchToProps = { fetchJobPosts, addJobPost, editJobPost, deleteJobPost };

export default connect(mapStateToProps, mapDispatchToProps)(ManageJobs);
