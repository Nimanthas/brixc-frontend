import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Row,
    Col,
    Table,
    Card,
    CardBody,
    CardHeader,
    Pagination,
    PaginationItem,
    PaginationLink,
    Input,
    CardFooter,
    Button,
} from 'reactstrap';

import {
    fetchTagData,
    addTag,
    editTag,
    deleteTag,
} from '../../../../src/Store/Reducers/Data/DataManageOptions';

const itemsPerPage = 5;

class Dashboard extends Component {
    componentDidMount() {
        this.props.fetchTagData();
    }

    handleEdit = (tag_id) => {
        this.props.editTag(tag_id);
    }

    handleDelete = (tag_id) => {
        this.props.deleteTag(tag_id);
    }

    handleAdd = () => {
        const newItem = {
            id: 0,
            tag: 'New Tag', // Modify as needed
            status: true, // Modify as needed
        };
        this.props.addTag(newItem);
    }

    renderTableRows() {
        const { tag_data } = this.props;

        if (!tag_data) {
            return null;
        }

        return tag_data.map((item) => (
            <tr key={item._id}>
                {Object.keys(item).map((key) => (
                    <td key={key} className="text-center">{item[key]}</td>
                ))}
                <td className="text-center">
                    <Button color="info" size="sm" onClick={() => this.handleEdit(item._id)}>Edit</Button>
                    <Button color="danger" size="sm" onClick={() => this.handleDelete(item._id)}>Delete</Button>
                </td>
            </tr>
        ));
    }

    render() {
        return (
            <div>
                <Row>
                    <Col md="12">
                        <Card className="main-card mb-3">
                            <CardHeader>Manage Tag Data</CardHeader>
                            <CardBody>
                                <Row className="mb-3">
                                    <Col md="6">
                                        <Input type="select" style={{ width: '100px' }} value="5">
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                        </Input>
                                    </Col>
                                    <Col md="6" className="text-right">
                                        <Button color="primary" onClick={this.handleAdd}>
                                            Add
                                        </Button>
                                        <Button color="success">
                                            Export
                                        </Button>
                                    </Col>
                                </Row>
                                <Table bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th className="text-center">ID</th>
                                            <th className="text-center">Name</th>
                                            <th className="text-center">Type</th>
                                            <th className="text-center">Last Updated</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderTableRows()}
                                    </tbody>
                                </Table>
                            </CardBody>
                            <CardFooter className="text-center">
                                <Pagination>
                                    <PaginationItem>
                                        <PaginationLink previous />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink next />
                                    </PaginationItem>
                                </Pagination>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    tag_data: state.DataReducer.tag_data,
});

const mapDispatchToProps = { fetchTagData, addTag, editTag, deleteTag };

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
