// Start: Actions
// Start: Master 
// Start: Manage Tags
export const FETCH_TAG_DATA = 'FETCH_TAG_DATA';
export const ADD_TAG = 'ADD_TAG';
export const EDIT_TAG = 'EDIT_TAG';
export const DELETE_TAG = 'DELETE_TAG';

export function fetchTagData() {
    return (dispatch) => {
        fetch('/api/data')
            .then((response) => response.json())
            .then((data) => dispatch({ type: FETCH_TAG_DATA, payload: data }));
    };
}

export function addTag(item) {
    return { type: ADD_TAG, payload: item };
}

export function editTag(item) {
    return { type: EDIT_TAG, payload: item };
}

export function deleteTag(id) {
    return { type: DELETE_TAG, payload: id };
}
// End: Manage Tags
// End: Master
// End: Actions


//Start: Reducer
export default function reducer(state = {
    tag_data: [],
    loading: false,
    error: null,
    success: false,
    message: null,
}, action) {
    switch (action.type) {
        case FETCH_TAG_DATA:
            return { ...state, data: action.payload };
        case ADD_TAG:
            return { ...state, data: [...state.data, action.payload] };
        case EDIT_TAG:
            return {
                ...state,
                data: state.data.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                ),
            };
        case DELETE_TAG:
            return {
                ...state,
                data: state.data.filter((item) => item.id !== action.payload),
            };
        default:
            return state;
    }
}
// End: Reducer