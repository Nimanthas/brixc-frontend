import React, { Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux'; // Import connect from react-redux
import { Row, Col } from 'reactstrap';
import CrudTable from '../../../../../Components/Common/CrudTable';
import { fetchTagData, addTag, editTag, deleteTag } from '../../../../../Store/Reducers/Data/DataManageOptions'; // Import Redux actions

const itemsPerPage = 5;

class JobTags extends React.Component {
    componentDidMount() {
        // Fetch data when the component mounts
        this.props.fetchTagData();
    }

    // Function to fetch data for the specified page and items per page
    fetchData = (page, itemsPerPage) => {
        // You can remove this function as it is no longer needed
    }

    handleEdit = (tag_id) => {
        // Dispatch the editTag action when the user edits an item
        this.props.editTag(tag_id);
    }

    handleDelete = (tag_id) => {
        // Dispatch the deleteTag action when the user deletes an item
        this.props.deleteTag(tag_id);
    }

    handleAdd = () => {
        // Dispatch the addTag action when the user adds a new item
        const newItem = {
            id: this.props.tag_data.length + 1, // You might want to generate a unique ID
            tag: 'New Tag', // Modify as needed
            status: true, // Modify as needed
        };
        this.props.addTag(newItem);
    }

    render() {
        const { tag_data, totalItems } = this.props; // Get tag_data from Redux state

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
                                    data={tag_data} // Use data from Redux state
                                    itemsPerPage={itemsPerPage}
                                    headers={headers}
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

const mapStateToProps = (state) => ({
    tag_data: state.tag_data, // Map the tag_data from Redux state to props
    totalItems: state.tag_data.length, // Calculate total items
});

const mapDispatchToProps = { fetchTagData, addTag, editTag, deleteTag };

export default connect(mapStateToProps, mapDispatchToProps)(JobTags); // Connect the component to the Redux store
