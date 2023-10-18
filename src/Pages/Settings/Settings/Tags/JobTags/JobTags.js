import React, { Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Row, Col } from 'reactstrap';
import CrudTable from '../../../../../Components/Common/CrudTable'; // Import the new component

const itemsPerPage = 5;

const initialData = [
    { id: 1, tag: 'angry', status: true },
    { id: 2, tag: 'fearful', status: true },
    { id: 3, tag: 'happy', status: true },
    { id: 4, tag: 'surprised', status: true },
    { id: 5, tag: 'sad', status: true },
    { id: 6, tag: 'excited', status: true },
    // Add more data
];

export default class JobTags extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: initialData,
            totalItems: initialData.length,
        };
    }

    // Function to fetch data for the specified page and items per page
    fetchData = (page, itemsPerPage) => {
        // In a real application, you would make an API call to fetch data
        // Here, we simulate pagination by slicing the data
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const newData = initialData.slice(startIndex, endIndex);

        this.setState({ data: newData });
    }

    handleEdit = (id) => {
        // Handle edit action here, e.g., open a modal for editing
        console.log(`Edit item with ID ${id}`);
    }

    handleDelete = (id) => {
        // Handle delete action here, e.g., show a confirmation dialog
        console.log(`Delete item with ID ${id}`);
    }

    handleAdd = () => {
        // Handle add action here, e.g., open a modal for adding a new item
        console.log('Add new item');
    }

    render() {
        const { data, totalItems } = this.state;

        const headers = ['ID', 'Tag', 'Status'];

        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}
                >
                    <div>
                        <Row>
                            <Col md="12">
                                <CrudTable
                                    data={data}
                                    itemsPerPage={itemsPerPage}
                                    headers={headers}
                                    onPageChange={this.fetchData}
                                    totalItems={totalItems}
                                    onEdit={this.handleEdit}
                                    onDelete={this.handleDelete}
                                    onAdd={this.handleAdd}
                                />
                            </Col>
                        </Row>
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}
