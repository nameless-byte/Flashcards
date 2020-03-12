import { SET_FILTER } from "../actionTypes";
import { VISIBILITY_FILTERS } from "../constants"

export default function(state = VISIBILITY_FILTERS.ALL, action) {
    switch (action.type) {
      case SET_FILTER: {
        return action.payload.filter;
      }
      default: {
        return state;
      }
    }
};