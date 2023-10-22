import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import React, { Suspense, lazy, Fragment } from 'react';

import {
    ToastContainer,
} from 'react-toastify';

const Dashboards = lazy(() => import('../../Pages/Dashboards'));
const Reports = lazy(() => import('../../Pages/Reports'));

const Widgets = lazy(() => import('../../Pages/Widgets'));
const Settings = lazy(() => import('../../Pages/Settings'));
const Components = lazy(() => import('../../Pages/Components'));
const Charts = lazy(() => import('../../Pages/Charts'));
const Forms = lazy(() => import('../../Pages/Forms'));
const Tables = lazy(() => import('../../Pages/Tables'));

const AppMain = () => {

    return (
        <Fragment>
            {/* Reports */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Please wait while we load all the Reports
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/reports" component={Reports} />
            </Suspense>

            {/* Components */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Please wait while we load all the Components
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/components" component={Components} />
            </Suspense>

            {/* Forms */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Please wait while we load all the Forms
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/forms" component={Forms} />
            </Suspense>

            {/* Charts */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-3">
                            Please wait while we load all the Charts
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/charts" component={Charts} />
            </Suspense>

            {/* Tables */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-5">
                            Please wait while we load all the Tables
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/tables" component={Tables} />
            </Suspense>

            {/* Settings */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-3">
                            Please wait while we load all the settings
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/settings" component={Settings} />
            </Suspense>

            {/* Dashboard Widgets */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-3">
                            Please wait while we load all the Dashboard Widgets examples
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/widgets" component={Widgets} />
            </Suspense>

            {/* Dashboards */}

            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <h6 className="mt-3">
                            Please wait while we load all the Dashboards
                        </h6>
                    </div>
                </div>
            }>
                <Route path="/dashboards" component={Dashboards} />
            </Suspense>

            <Route exact path="/" render={() => (
                <Redirect to="/dashboards/basic" />
            )} />
            <ToastContainer />
        </Fragment>
    )
};

export default AppMain;