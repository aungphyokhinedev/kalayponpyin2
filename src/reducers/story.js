import Store from '../store/test';

export const initialState = Store;

export default function storyReducer(state = initialState, action) {
    console.log(action.type)
  switch (action.type) {
   
      case 'FONT_LOADED': {
      return {
        ...state,
        fontLoaded: action.data || false,
      };
    }
    case 'SET_PLAY_STATUS': {
        return {
          ...state,
          playstatus: action.data || {},
        };
      }
    case 'ADD_FAVOURITE': {
        return {
          ...state,
          favourites: action.data || [],
        };
      }
    case 'STORIES_REPLACE': {
      let stories = [];

      // Pick out the props I need
      if (action.data && typeof action.data === 'object') {
        stories = action.data.map(item => ({
          id: item.id,
          title: item.title,
          body: item.body,
          category: item.category,
          image: item.image,
          author: item.author,
          sound: item.sound,
        }));
      }
      return {
        ...state,
        error: null,
        loading: false,
        stories,
      };
    }
    default:
      return state;
  }
}
