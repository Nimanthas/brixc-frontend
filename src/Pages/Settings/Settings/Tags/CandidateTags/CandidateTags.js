import React, { Fragment } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Card, CardBody, Row, Col, Table } from 'reactstrap';

export default class CandidateTags extends React.Component {
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
                            <Col md="12">
                                <Card className="main-card mb-3">
                                    <CardBody>
                                        <Table bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th className="text-center"># Plan</th>
                                                    <th>Candidate name</th>
                                                    <th className="text-center">Time</th>
                                                    <th className="text-center">Status</th>
                                                    <th className="text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="text-center text-muted">7856345</td>
                                                    <td>
                                                        <div className="widget-content p-0">
                                                            <div className="widget-content-wrapper">
                                                                <div className="widget-content-left mr-3">
                                                                    <div className="widget-content-left">
                                                                        {/*<img width={40} className="rounded-circle" src={avatar4} alt="Avatar" />*/}
                                                                    </div>
                                                                </div>
                                                                <div className="widget-content-left flex2">
                                                                    <div className="widget-heading">Nimantha Hennayake</div>
                                                                    <div className="widget-subheading opacity-7">Software Engineer</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">25/10/2023 10.00 AM</td>
                                                    <td className="text-center">
                                                        <div className="badge badge-warning">Pending</div>
                                                    </td>
                                                    <td className="text-center">
                                                        <button type="button" className="btn btn-primary btn-sm">Details</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
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
