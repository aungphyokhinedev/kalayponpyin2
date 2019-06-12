import member from './member';
import locale from './locale';
import story from './story';
import PushMessage from './PushMessage';

const rehydrated = (state = false, action) => {
    switch (action.type) {
      case 'persist/REHYDRATE':
        return true;
      default:
        return state;
    }
  };
  

export default {
  rehydrated,
  story,
  member,
  locale,
  PushMessage
};
