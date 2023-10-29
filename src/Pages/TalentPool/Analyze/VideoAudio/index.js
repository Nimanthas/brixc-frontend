import React, {Fragment} from 'react'

import Tabs from 'react-responsive-tabs';

import PageTitle from '../../../../Layout/AppMain/PageTitle';

// Examples

import SubmitVoiceAudio from './Submit/SubmitAnalyzeJob';

const tabsContent = [
    {
        title: 'Analyze',
        content: <SubmitVoiceAudio/>
    },
    {
        title: 'Jobs Summary',
        content: <SubmitVoiceAudio/>
    },
];

function getTabs() {
    return tabsContent.map((tab, index) => ({
        title: tab.title,
        getContent: () => tab.content,
        key: index,
    }));
}

class VideoAudioAnalyzeControls extends React.Component {

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Analyze Video and Audio"
                    subheading="Submit your video file with audo and identify the emotions and big 5 traits according to emotions"
                    icon="pe-7s-display1 icon-gradient bg-premium-dark"
                />
                <Tabs tabsWrapperClass="body-tabs body-tabs-layout" transform={false} showInkBar={true} items={getTabs()}/>
            </Fragment>
        )
    }
}

export default VideoAudioAnalyzeControls;



