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

export function deleteJobPost(job_id) {
    return { type: DELETE_JOB_POST, payload: job_id };
}
// End: Manage Jobs

// Start: Manage Candidates
export const FETCH_CANDIDATES = 'FETCH_CANDIDATES';
export const FETCH_CANDIDATES_NAMES = 'FETCH_CANDIDATES_NAMES';
export const ADD_CANDIDATES = 'ADD_CANDIDATES';
export const EDIT_CANDIDATES = 'EDIT_CANDIDATES';
export const DELETE_CANDIDATES = 'DELETE_CANDIDATES';
export const SUBMIT_JOB = 'SUBMIT_JOB';

export function fetchCandidates() {
    return (dispatch) => {
        fetch(`${base_api_url}managecandidates/getcandidates/0`)
            .then((response) => response.json())
            .then((data) => dispatch({ type: FETCH_CANDIDATES, payload: data }));
    };
}

export function fetchCandidatesNames() {
    return (dispatch) => {
        fetch(`${base_api_url}managecandidates/getcandidatesnames/0`)
            .then((response) => response.json())
            .then((data) => dispatch({ type: FETCH_CANDIDATES_NAMES, payload: data }));
    };
}

export function addCandidate(item) {
    return (dispatch) => {
        fetch(`${base_api_url}managecandidates/managecandidates`)
            .then((response) => response.json())
            .then(() => {
                fetch(`${base_api_url}managecandidates/getcandidates/0`)
                    .then((response) => response.json())
                    .then((data) => dispatch({ type: ADD_CANDIDATES, payload: data }));
            });
    };
}

export function editCandidate(item) {
    return { type: EDIT_CANDIDATES, payload: item };
}

export function deleteCandidate(job_id) {
    return { type: DELETE_CANDIDATES, payload: job_id };
}

export function submitVideoAudioJobs(job) {
    return (dispatch) => {
        fetch(`${base_api_url}analyzecandidates/analyzevideoandaudio`, {
            method: 'POST',
            body: job,
        })
            .then((response) => response.json())
            .then((data) => dispatch({ type: SUBMIT_JOB, payload: data }));
    };
}
// End: Manage Candidates
// End: Actions


//Start: Reducer
export default function reducer(state = {
    tag_data: [],
    job_posts_data: [],
    job_posts_header: [],
    candidates_data: [],
    candidates_names_data: [],
    candidates_header: [],
    outstanding_jobs: [],
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
        case FETCH_CANDIDATES:
            return { ...state, candidates_data: action.payload.data, candidates_header: action.payload.header };
        case FETCH_CANDIDATES_NAMES:
            return { ...state, candidates_names_data: action.payload.data };
        case ADD_CANDIDATES:
            return { state };
        case EDIT_CANDIDATES:
            return { state };
        case DELETE_CANDIDATES:
            return { state };
            case SUBMIT_JOB:
                return { ...state, outstanding_jobs: action.payload.data };
        default:
            return state;
    }
}
// End: Reducer