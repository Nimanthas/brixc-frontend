import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

// Analyzers
import VideoAudioAnalyzeControls from "./Analyze/VideoAudio/index";
import TextAnalyzeControls from "./Analyze/Text/index";

// Layout
import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';
import AppFooter from '../../Layout/AppFooter';

const TalenPool = ({ match }) => (
    <Fragment>
        <AppHeader />
        <div className="app-main">
            <AppSidebar />
            <div className="app-main__outer">
                <div className="app-main__inner">
                    {/* Talent Pool Elements */}
                    <Route path={`${match.url}/videoaudio`} component={VideoAudioAnalyzeControls} />
                    <Route path={`${match.url}/text`} component={TextAnalyzeControls} />
                </div>
                <AppFooter />
            </div>
        </div>
    </Fragment>
);

export default TalenPool;