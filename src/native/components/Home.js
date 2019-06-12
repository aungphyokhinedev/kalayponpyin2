import React, { Component } from 'react';
import Player from './MyAudioPlayer/Index';
import { Font } from 'expo';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getStories,setFavourite } from '../../actions/Story';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import CustomText from './CustomText';
import { Actions } from 'react-native-router-flux'; 
  import {
    Animated,
    Text,
    View,
    Image,
    StyleSheet,
    Dimensions,
    ScrollView
  } from "react-native";
import Loading from './Loading';
const { width, height } = Dimensions.get("window");
export const TRACKS = [];
class Home extends Component {
    static propTypes = {
        favourites: PropTypes.arrayOf(PropTypes.number),
        stories: PropTypes.shape({
            loading: PropTypes.bool,
            error: PropTypes.string,
            stories: PropTypes.arrayOf(PropTypes.shape()),
        }).isRequired,
        fetchStories: PropTypes.func.isRequired,
    }
    state = {
        newstories: null,
        storyIndex: 0,
        storyText: '',
        index: 0,
        routes: [
        { key: 'first', title: 'Audio' },
        { key: 'second', title: 'Story' },
        ],
    }
    myCustomAnimatedValue = new Animated.Value(0);

    getPageTransformStyle = index => ({
      transform: [
        {
          scale: this.myCustomAnimatedValue.interpolate({
            inputRange: [
              (index - 1) * (width + 8), // Add 8 for dividerWidth
              index * (width + 8),
              (index + 1) * (width + 8)
            ],
            outputRange: [0, 1, 0],
            extrapolate: "clamp"
          })
        },
        {
          rotate: this.myCustomAnimatedValue.interpolate({
            inputRange: [
              (index - 1) * (width + 8),
              index * (width + 8),
              (index + 1) * (width + 8)
            ],
            outputRange: ["180deg", "0deg", "-180deg"],
            extrapolate: "clamp"
          })
        }
      ]
    });
  

    

    componentDidMount = () => {
        console.log(this.props.trackId)
      //  this.fetchStories();
    }


    changeIndex = (text) => {this.setState({storyText:text})}
    render() {
       

    renderScene = ({ route }) => {
        switch (route.key) {
          case 'first':
            return (
                <View style={styles.container}>
                <Player trackId={this.props.trackId}  changeIndex={this.changeIndex}  />
                </View>
            );
            case 'second': return (<ScrollView style={styles.scroll}>
                <View style={styles.textContainer}>
                 <CustomText style={styles.storyText}>
                     {this.state.storyText}
                 </CustomText>
                 </View>
                </ScrollView>)
          default:
            return null;
        }
      };
     
      return (
        <TabView
        style={styles.tabbar}
          navigationState={this.state}
          renderScene={renderScene}
          onIndexChange={index => this.setState({ index })}
          renderTabBar={(props) =>
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: 'white'}}
              style={{backgroundColor: "black", height:0 }}
              renderIcon={this.renderIcon}
              indicatorStyle={{backgroundColor: "#555555"}}
            />
          }
        />
      );

    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      flexDirection: 'column',
      justifyContent: "center",
      backgroundColor: '#151515',
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: 'column',
        justifyContent: "center",
      },
    scroll: {
        flex:1,
        backgroundColor: '#151515',
        padding:20
    },
    backgroundImage: {
      width,
      height,
    },
    foregroundTextContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent"
    },
    storyText: {
      color: "white",
      fontFamily:'unicode',
      marginBottom: 50
    }
  });

const mapStateToProps = state => {
    return {
        stories: state.story || {},
        favourites : state.story.favourites || []
    }
}


const mapDispatchToProps = {
    fetchStories: getStories,
    setFavourite : setFavourite

};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

