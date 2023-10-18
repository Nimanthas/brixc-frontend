export const SearchData = (data) => {
    return (dispatch) => {
        dispatch({
            type: 'SEARCH_DETAILS',
            payload: data
        });
    }
}

export const UpdateFilters = (data) => {
    return (dispatch) => {
        dispatch({
            type: 'UPDATE_FILTER_DETAILS',
        });
    }
}