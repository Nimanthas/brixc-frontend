const base_api_url = 'http://localhost:8280/';

// Start: Actions
// Start: Master 
// Start: Manage Tags
export const FETCH_TAG_DATA = 'FETCH_TAG_DATA';
export const ADD_TAG = 'ADD_TAG';
export const EDIT_TAG = 'EDIT_TAG';
export const DELETE_TAG = 'DELETE_TAG';

export function fetchTagData() {
    return (dispatch) => {
        fetch(`${base_api_url}settings/gettags/0`)
            .then((response) => response.json())
            .then((data) => dispatch({ type: FETCH_TAG_DATA, payload: data.data }));
    };
}

export function addTag(item) {
    return (dispatch) => {
        fetch(`${base_api_url}settings/gettags/0`)
            .then((response) => response.json())
            .then(() => {
                fetch(`${base_api_url}settings/gettags/0`)
                    .then((response) => response.json())
                    .then((data) => dispatch({ type: ADD_TAG, payload: data.data }));
            });
    };
}

export function editTag(item) {
    return { type: EDIT_TAG, payload: item };
}

export function deleteTag(id) {
    return { type: DELETE_TAG, payload: id };
}
// End: Manage Tags


// End: Master

// Start: Manage Jobs
export const FETCH_JOB_POSTS = 'FETCH_JOB_POSTS';
export const ADD_JOB_POST = 'ADD_JOB_POST';
export const EDIT_JOB_POST = 'EDIT_JOB_POST';
export const DELETE_JOB_POST = 'DELETE_JOB_POST';

export function fetchJobPosts() {
    return (dispatch) => {
        fetch(`${base_api_url}managejobs/getjobposts/0`)
            .then((response) => response.json())
            .then((data) => dispatch({ type: FETCH_JOB_POSTS, payload: data }));
    };
}

export function addJobPost(item) {
    return (dispatch) => {
        fetch(`${base_api_url}managejobs/managejobposts`)
            .then((response) => response.json())
            .then(() => {
                fetch(`${base_api_url}managejobs/getjobposts/0`)
                    .then((response) => response.json())
                    .then((data) => dispatch({ type: ADD_JOB_POST, payload: data }));
            });
    };
}

export function editJobPost(item) {
    return { type: EDIT_JOB_POST, payload: item };
}

export function deleteJobPost(id) {
    return { type: DELETE_JOB_POST, payload: job_id };
}
// End: Manage Jobs
// End: Actions


//Start: Reducer
export default function reducer(state = {
    tag_data: [],
    job_posts_data: [],
    job_posts_header: [],
    loading: false,
    error: null,
    success: false,
    message: null,
}, action) {
    switch (action.type) {
        case FETCH_TAG_DATA:
            return { ...state, tag_data: action.payload };
        case ADD_TAG:
            return { state };
        case EDIT_TAG:
            return { state };
        case DELETE_TAG:
            return { state };
        case FETCH_JOB_POSTS:
            return { ...state, job_posts_data: action.payload.data, job_posts_header: action.payload.header };
        case ADD_JOB_POST:
            return { state };
        case EDIT_JOB_POST:
            return { state };
        case DELETE_JOB_POST:
            return { state };
        default:
            return state;
    }
}
// End: Reducer