
const base_api_url = 'https://backend-brixc.koyeb.app/';
const analyze_api_url = 'http://localhost:8281/';

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
export const SCHEDULE_INTERVIEW = 'SCHEDULE_INTERVIEW';
export const EDIT_CANDIDATES = 'EDIT_CANDIDATES';
export const DELETE_CANDIDATES = 'DELETE_CANDIDATES';
export const SUBMIT_JOB = 'SUBMIT_JOB';
export const FETCH_PENDING_JOBS = 'FETCH_PENDING_JOBS';
export const FETCH_JOB_RESULT = 'FETCH_JOB_RESULT';

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

export function scheduleInterview(item) {
    return async (dispatch) => {

        try {
            let job_data = {};

            const response2 = await fetch(`${base_api_url}managemeetings/createnewmeeting`, {
                method: "POST",
                body: JSON.stringify(job_data), // Convert to JSON
                headers: {
                    'Content-Type': 'application/json', // Set the content type
                },
            });

            const data2 = await response2.json();
            let update = { "meeting_id": data2.data.meeting_id, "join_url": data2.data.join_url, "candidate_id": item._id, "option": "update_meeting" };

            const response3 = await fetch(`${base_api_url}managecandidates/managecandidates`, {
                method: "POST",
                body: JSON.stringify(update), // Convert to JSON
                headers: {
                    'Content-Type': 'application/json', // Set the content type
                },
            });

            fetch(`${base_api_url}managecandidates/getcandidates/0`)
                .then((response) => response.json())
                .then((data) => dispatch({ type: SCHEDULE_INTERVIEW, payload: data }));
        } catch (error) {
            dispatch({ type: SCHEDULE_INTERVIEW, payload: error.message });
        }
    };
}

export function submitVideoAudioJobs(job, selectcandidate) {
    return async (dispatch) => {
        const sendOptions = { method: "POST", body: job };

        try {
            const response1 = await fetch(`${analyze_api_url}analyzevideo`, sendOptions);
            const data1 = await response1.json();
            let job_data = { ...data1 };
            job_data["candidate_id"] = selectcandidate;
            job_data["task_status"] = 10;
            job_data["option"] = "insert";


            const response2 = await fetch(`${base_api_url}analyzecandidates/analyzevideoandaudio`, {
                method: "POST",
                body: JSON.stringify(job_data), // Convert to JSON
                headers: {
                    'Content-Type': 'application/json', // Set the content type
                },
            });
            const data2 = await response2.json();

            dispatch({ type: SUBMIT_JOB, payload: job_data });
        } catch (error) {
            dispatch({ type: SUBMIT_JOB, payload: error.message });
        }
    };
}

export function fetchPendingJobs() {
    return (dispatch) => {
        fetch(`${base_api_url}analyzecandidates/getpendinganalyzejobs/0`)
            .then((response) => response.json())
            .then((data) => {
                dispatch({ type: FETCH_PENDING_JOBS, payload: data })
            });
    };
}

export function fetchJobResult(task_id) {
    return (dispatch) => {
        fetch(`${analyze_api_url}getresult/${task_id}`)
            .then((response) => response.json())
            .then((data) => {
                dispatch({ type: FETCH_JOB_RESULT, payload: data })
            });
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
    job_subission_output: [],
    outstanding_jobs: [],
    outstanding_jobs_header: [],
    average_job_result: [],
    job_result: [],
    traits: [],
    dominant_trait: [],
    meeting_scheduled_details: [],
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
        case SCHEDULE_INTERVIEW:
            return { ...state, candidates_data: action.payload.data, candidates_header: action.payload.header };
        case ADD_CANDIDATES:
            return { state };
        case EDIT_CANDIDATES:
            return { state };
        case DELETE_CANDIDATES:
            return { state };
        case SUBMIT_JOB:
            return { ...state, job_subission_output: action.payload.data };
        case FETCH_PENDING_JOBS:
            return { ...state, outstanding_jobs: action.payload.data, outstanding_jobs_header: action.payload.header };
        case FETCH_JOB_RESULT:
            return { ...state, average_job_result: action.payload.average_emotions, job_result: action.payload.emotions, traits: action.payload.traits, dominant_trait: action.payload.dominant_trait };
        default:
            return state;
    }
}
// End: Reducer