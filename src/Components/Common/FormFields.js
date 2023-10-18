import React, { Fragment } from 'react';
import { Input, FormFeedback, FormText } from 'reactstrap';

const renderField = ({ input, meta: { touched, error, warning }, ...custom }) => { 
    return (
        <Fragment>
            <Input {...(touched ? { valid: !error } : {})} {...input} {...custom} />
            {error && <FormFeedback>{error}</FormFeedback>}
            {!error && warning && <FormText>{warning}</FormText>}
        </Fragment>
    )
};

const renderRadioField = ({ value, input, ...custom }) => (
    <Input type="radio" checked={value === input.value} {...input} {...custom} />
);

const renderCheckbox = ({ input: { value, onChange } }) => (
    <Input type="checkbox" checked={!!value} onChange={onChange} />
);

const renderSelectField = ({ input, meta: { touched, error }, children, ...custom }) => (
    <Input type="select" {...(touched ? { valid: !error } : {})} {...input} {...custom}>
        {children}
    </Input>
);

const renderTableWithPagination = ({ input, meta: { touched, error }, children, ...custom }) => (
    <Input type="table" {...(touched ? { valid: !error } : {})} {...input} {...custom}>
        {children}
        {error && <FormFeedback>{error}</FormFeedback>}
        {!error && warning && <FormText>{warning}</FormText>}
        <Pagination />
    </Input>
);

export {
    renderField, renderTableWithPagination, renderRadioField, renderCheckbox, renderSelectField
}
