import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';

import { getRecipes, setError } from '../../actions/recipes';
import { registerPushNotifications } from '../../actions/PushMessage';

class RecipeListing extends Component {
    state = {
        notification: {},
      }

  static propTypes = {
    recipes: PropTypes.shape({
      loading: PropTypes.bool,
      error: PropTypes.string,
      recipes: PropTypes.arrayOf(PropTypes.shape()),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
    fetchRecipes: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
    notification: PropTypes.string,
  }

  static defaultProps = {
    match: null,
    notification: null
  }

  componentDidMount = () => this.fetchRecipes();

  /**
    * Fetch Data from API, saving to Redux
    */
  fetchRecipes = () => {
    const { fetchRecipes, showError, registerPushMessage } = this.props;
    registerPushMessage();
    
    return fetchRecipes()
      .then(console.log('fetched'))
      .catch((err) => {
        console.log(`Error: ${err}`);
        return showError(err);
      });
  }


  render = () => {
    const { notification } = this.state;
    const { token, recipes, match } = this.props;
    const id = (match && match.params && match.params.id) ? match.params.id : null;
    const onPress = () => {
        console.log('on press');
          console.log(JSON.stringify(recipes));
      }
    return (
        <View   style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
         <TouchableOpacity onPress={() => onPress()} style={{ flex: 1 }}>
        <Text>{JSON.stringify(notification)}</Text>
        </TouchableOpacity>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const mapStateToProps = state => {
    return {
        recipes: state.recipes || {},
        token: state.PushMessage.token
    }
  }


const mapDispatchToProps = {
  fetchRecipes: getRecipes,
  showError: setError,
  registerPushMessage: registerPushNotifications
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeListing);
