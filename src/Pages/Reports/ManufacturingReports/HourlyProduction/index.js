import React, { Component, Fragment } from 'react';
import { Button } from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col,
    Card, CardBody,
    CardTitle, Form,
    FormGroup, Label,
    Input, FormText
} from 'reactstrap';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';

import { UpdateFilters, SearchData } from '../../../../Store/Actions/CommonDataActions';
import { renderField } from '../../../../Components/Common/FormFields';

const data = [
    { name : 'K01', id: 1}, { name : 'K02', id: 2}, { name : 'K03', id: 3}
]

class HourlyProduction extends Component {
    state = {
        facid: 1,
        styleid: 1,
        sheduleid: 1,
        opeartionid: 1,
    }

    componentDidMount() {
        this.props.UpdateFilters();
    }

    handleSubmit = () => {
        this.props.SearchData(this.state);
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
                    <Row>

                        <Col lg="3">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Filters</CardTitle>
                                    <Form>
                                        <FormGroup>
                                            <Label for="factory">Factory</Label>
                                            <Field 
                                                input={{
                                                }}
                                                name="title"
                                                component={renderField} 
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="shedule">Shedule</Label>
                                        </FormGroup>
                                        <Button color="primary" className="mt-1" onClick={this.handleSubmit}>Search</Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="9">
                            <Card className="main-card mb-3">
                                <CardBody>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
};

const  validate = (values) => {
    console.log(values);
}

const mapStateToProps = state => ({
    id: state.Factories.id,
});

const mapDispatchToProps = dispatch => ({
    UpdateFilters: () => dispatch(UpdateFilters()),
    SearchData: (data) => dispatch(SearchData(data))
});

export default reduxForm({
    form: 'HourlyProductionFilters',
    validate
})(connect(mapStateToProps, mapDispatchToProps)(HourlyProduction));
