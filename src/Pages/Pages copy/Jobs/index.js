import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Forms

import FormElementsDashboard from "./Dashboard/Dashboard";
import FormElementsManageJobs from "./Jobs/ManageJobs";

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
                    {/* Setting Elements */}
                    <Route path={`${match.url}/jobdashboard`} component={FormElementsDashboard} />
                    <Route path={`${match.url}/managejobs`} component={FormElementsManageJobs} />
                </div>
                <AppFooter />
            </div>
        </div>
    </Fragment>
);

export default JobPosts;