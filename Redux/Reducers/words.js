import { ADD_WORD, REFRESH_STATE, DELETE_WORD } from "../actionTypes";

const initialState = {
    allIds: [],
    byIds: {}
};

export default function(state = initialState, action) {
    switch(action.type) {
        case ADD_WORD: {
            const {id, content} = action.payload;
            return Object.assign({}, state, {
                allIds: [...state.allIds, id],
                byIds: {
                    ...state.byIds,
                    [id]: content
                }    
            });
        }
        case REFRESH_STATE: {
            const {content} = action.payload;
            return Object.assign({}, state, {
                allIds: content.allIds,
                byIds: content.byIds,  
            });
        }
        case DELETE_WORD: {
            const {id} = action.payload;
            const { [id]: value, ...remainingState } = state.byIds;
            return Object.assign({}, {
                allIds: state.allIds.filter((itemid) => itemid !== id),
                byIds: remainingState,
            });
        }
        default:
            return state;
    }
}

