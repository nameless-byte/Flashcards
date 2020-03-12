import { VISIBILITY_FILTERS } from "./constants";

export const getWordsState = store => store.words;

export const getWordList = store =>
  getWordsState(store) ? getWordsState(store).allIds : [];

export const getWordById = (store, id) =>
  getWordsState(store) ? { ...getWordsState(store).byIds[id], id } : {};

export const getWords = store =>
  getWordList(store).map(id => getWordById(store, id));

export const getWordsByVisibilityFilter = (store, visibilityFilter) => {
  const allWords = getWords(store);
  switch (visibilityFilter) {
    case VISIBILITY_FILTERS.DAY:
      return allWords.filter(word => Math.floor((new Date() - word.dateadded) / 8.64e+7) < 1);
    case VISIBILITY_FILTERS.WEEK:
      return allWords.filter(word => Math.floor((new Date() - word.dateadded) / 8.64e+7) < 7);
    case VISIBILITY_FILTERS.MONTH:
      return allWords.filter(word => Math.floor((new Date() - word.dateadded) / 8.64e+7) < 31);
    default:
      return allWords;
  }
};
