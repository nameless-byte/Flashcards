import { ADD_WORD, SET_FILTER, REFRESH_STATE, DELETE_WORD } from "./actionTypes";

export const addWord = (content, id) => ({
    type: ADD_WORD,
    payload: {
      id: id,
      content
    }
});

export const refreshState = (content) => ({
  type: REFRESH_STATE,
  payload: {content},
});

export const deleteWord = (id) => ({
  type: DELETE_WORD,
  payload: {id}
});

export const setFilter = filter => ({ type: SET_FILTER, payload: { filter } });