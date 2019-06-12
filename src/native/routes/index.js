import React , { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Router, Scene } from 'react-native-router-flux';
import {setFont} from '../../actions/Story';
import { Font } from 'expo';
import Loading from '../components/Loading';
import Home from '../components/Home';
import MyStoryList from '../components/StoryList';
class Index extends Component {
  static propTypes = {
    setLoadFont: PropTypes.func.isRequired,
}
  componentDidMount = () => {

    (async () => {
        await Font.loadAsync({
            unicode: require('../../assets/fonts/Tharlon-Regular.ttf'),
        });
        this.props.setLoadFont(true)
    })();
}
render = () =>{
  return (
    <Router>
      <Scene  hideNavBar key="root">
        <Scene   key="home"
          component={Home}
          title="Home"
          
        />
        <Scene
        type="reset"
          key="cards"
          initial
          component={MyStoryList}
          title="Stories"
         
        />
     
      </Scene>
    </Router>
  );
}
  
}

const mapStateToProps = state => {
  return {
    fontLoaded: state.story.fontLoaded || {},
  }
}


const mapDispatchToProps = {
  setLoadFont: setFont,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);