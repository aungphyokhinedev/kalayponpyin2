import Store from '../store/test';

export const initialState = Store;

export default function pushMessageReducer(state = initialState, action) {
  switch (action.type) {
    case 'SAVE_PUSH_MESSAGE_TOKEN': {
      return {
        ...state,
        token: action.data,
      };
    }
    case 'SET_NOTIFICATION': {
      return {
        ...state,
        notification: action.data,
      };
    }
    default:
      return state;
  }
}
