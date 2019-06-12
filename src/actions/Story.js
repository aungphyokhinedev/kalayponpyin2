import { Firebase, FirebaseRef } from '../lib/firebase';

export function setFont() {
  return dispatch => new Promise(resolve => resolve(dispatch({
      type: 'FONT_LOADED',
      data: true,
    })));
  }

  export function setPlayStatus(data) {
    return dispatch => new Promise(resolve => resolve(dispatch({
        type: 'SET_PLAY_STATUS',
        data: data,
      })));
    }
    

export function setFavourite(data) {
return dispatch => new Promise(resolve => resolve(dispatch({
    type: 'ADD_FAVOURITE',
    data: data,
  })));
}

  export function getStories() {
    if (Firebase === null) return () => new Promise(resolve => resolve());
  
    return dispatch => new Promise(resolve => FirebaseRef.child('recipes')
      .on('value', (snapshot) => {
        const stories = snapshot.val() || [];
        return resolve(dispatch({
          type: 'STORIES_REPLACE',
          data: stories,
        }));
      })).catch(e => console.log(e));
  }
  