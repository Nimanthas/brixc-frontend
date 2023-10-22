import React, {Fragment} from 'react'

import Tabs from 'react-responsive-tabs';

import PageTitle from '../../../../Layout/AppMain/PageTitle';

import Departments from './Page/Departments';

const tabsContent = [
    {
        title: 'Departments',
        content: <Departments/>
    }
];

function getTabs() {
    return tabsContent.map((tab, index) => ({
        title: tab.title,
        getContent: () => tab.content,
        key: index,
    }));
}

class FormElementsLayouts extends React.Component {

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Departments"
                    subheading=""
                    icon="pe-7s-graph text-success"
                />
                <Tabs tabsWrapperClass="body-tabs body-tabs-layout" transform={false} showInkBar={true} items={getTabs()}/>
            </Fragment>
        )
    }
}

export default FormElementsLayouts;



