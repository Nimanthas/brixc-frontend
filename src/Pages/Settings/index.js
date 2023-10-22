import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

// Forms

import FormElementsUserSettings from "./Settings/UserSettings";
import FormElementsJobTypes from "./Settings/JobTypes";
import FormElementsDepartments from "./Settings/Departments";
import PageTags from "./Settings/Tags";

// Layout

import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';
import AppFooter from '../../Layout/AppFooter';

const Settings = ({match}) => (
    <Fragment>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">
                    {/* Setting Elements */}
                    <Route path={`${match.url}/usersettings`} component={FormElementsUserSettings}/>
                    <Route path={`${match.url}/jobtypes`} component={FormElementsJobTypes}/>
                    <Route path={`${match.url}/departments`} component={FormElementsDepartments}/>
                    <Route path={`${match.url}/tags`} component={PageTags}/>
                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Settings;