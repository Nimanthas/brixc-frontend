import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Forms
import FormElementsManageCandidates from "./Candidates/ManageCandidates";

// Layout

import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';
import AppFooter from '../../Layout/AppFooter';

const JobPosts = ({ match }) => (
    <Fragment>
        <AppHeader />
        <div className="app-main">
            <AppSidebar />
            <div className="app-main__outer">
                <div className="app-main__inner">
                    {/* Candidate Elements */}
                    <Route path={`${match.url}/managecandidates`} component={FormElementsManageCandidates} />
                </div>
                <AppFooter />
            </div>
        </div>
    </Fragment>
);

export default JobPosts;