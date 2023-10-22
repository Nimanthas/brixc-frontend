import React, {Fragment} from 'react'

import Tabs from 'react-responsive-tabs';

import PageTitle from '../../../../Layout/AppMain/PageTitle';

// Examples

import JobTags from './JobTags/JobTags';
import CandidateTags from './CandidateTags/CandidateTags';

const tabsContent = [
    {
        title: 'Job Tags',
        content: <JobTags/>
    },
    {
        title: 'Candidate Tags',
        content: <CandidateTags/>
    }
];

function getTabs() {
    return tabsContent.map((tab, index) => ({
        title: tab.title,
        getContent: () => tab.content,
        key: index,
    }));
}

class PageTags extends React.Component {

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Tags"
                    subheading="manage tags"
                    icon="lnr-picture text-danger"
                />
                <Tabs tabsWrapperClass="body-tabs body-tabs-layout" transform={false} showInkBar={true} items={getTabs()}/>
            </Fragment>
        )
    }
}

export default PageTags;



