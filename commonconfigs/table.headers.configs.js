module.exports = {
    "job_posts_data_headers": [
        { "header_name": "Job ID", "header_value": "_id", "hidden": true, "sortable": false, "filterable": false, "type": "text", "editable": false },
        { "header_name": "External Job ID", "header_value": "job_external_id", "hidden": true, "sortable": false, "filterable": false, "type": "text", "editable": false },
        { "header_name": "Title", "header_value": "job_title", "hidden": false, "sortable": false, "filterable": false, "type": "text", "editable": true },
        { "header_name": "Description", "header_value": "job_description", "hidden": false, "sortable": false, "filterable": false, "type": "text", "editable": true },
        { "header_name": "Specialization", "header_value": "specialization", "hidden": false, "sortable": false, "filterable": false, "type": "text", "editable": true },
        { "header_name": "Salary", "header_value": "salary", "hidden": false, "sortable": false, "filterable": false, "type": "number", "editable": true },
        { "header_name": "Currency", "header_value": "currency", "hidden": false, "sortable": false, "filterable": false, "type": "text", "editable": true },
        { "header_name": "Status", "header_value": "job_status", "hidden": false, "sortable": false, "filterable": false, "type": "text", "editable": false },
        { "header_name": "Tags", "header_value": "tags", "hidden": false, "sortable": false, "filterable": false, "type": "array", "editable": false },
        { "header_name": "Last Update", "header_value": "last_updated", "hidden": false, "sortable": false, "filterable": false, "type": "text", "editable": false },
        { "header_name": "Job Type", "header_value": "job_type", "hidden": false, "sortable": false, "filterable": false, "type": "text", "editable": true },
        { "header_name": "Location", "header_value": "location_address", "hidden": false, "sortable": false, "filterable": false, "type": "text", "editable": false }
    ],
    "candidates_data_headers": [
        { "header_name": "Candidate ID", "header_value": "_id", "hidden": true, "sortable": false, "filterable": false, "type": "text", "editable": false },
        { "header_name": "Candidate Job ID", "header_value": "candidate_external_id", "hidden": true, "sortable": false, "filterable": false, "type": "text", "editable": false },
        { "header_name": "Name", "header_value": "candidate_name", "hidden": false, "sortable": false, "filterable": false, "type": "text", "editable": true },
        { "header_name": "Email", "header_value": "candidate_email", "hidden": false, "sortable": false, "filterable": false, "type": "text", "editable": true },
        { "header_name": "Contact Number", "header_value": "candidate_contact_number", "hidden": false, "sortable": false, "filterable": false, "type": "text", "editable": true },
        { "header_name": "Job Title", "header_value": "job_title", "hidden": false, "sortable": false, "filterable": false, "type": "text", "editable": true },
        { "header_name": "Status", "header_value": "candidate_status", "hidden": false, "sortable": false, "filterable": false, "type": "number", "editable": true },
        { "header_name": "Tags", "header_value": "tags", "hidden": false, "sortable": false, "filterable": false, "type": "array", "editable": false },
        { "header_name": "Applied Date", "header_value": "inbound_date", "hidden": false, "sortable": false, "filterable": false, "type": "text", "editable": false },
        { "header_name": "Last Update", "header_value": "last_updated", "hidden": false, "sortable": false, "filterable": false, "type": "text", "editable": false }
    ]
}
