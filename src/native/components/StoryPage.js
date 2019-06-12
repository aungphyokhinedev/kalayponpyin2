import * as React from 'react';
import { StyleSheet,View,Text,TouchableHighlight,ScrollView } from 'react-native';
import AudioPlayer from './AudioPlayer';
import {Font } from 'expo';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { getRecipes, setError } from '../../actions/recipes';

class StoryPage extends React.Component {
    state = {
        currentstory: null,
        fontLoaded: false,
        index: 0,
    }
    static propTypes = {
        stories: PropTypes.shape({
          loading: PropTypes.bool,
          error: PropTypes.string,
          recipes: PropTypes.arrayOf(PropTypes.shape()),
        }).isRequired,
        fetchStories: PropTypes.func.isRequired,
      }
    
      fetchStories = () => {
        const { fetchStories, showError } = this.props;
        return fetchStories()
          .then(console.log('fetched'))
          .catch((err) => {
            console.log(`Error: ${err}`);
            return showError(err);
          });
      }
    
    _getStory = (index) => {
        const {  stories } = this.props;
        if(stories && stories.recipes){
            let story = stories.recipes[index];
            if(story){
                let song = {
                    name: story.title,
                    uri: story.sound ,
                    image: story.image
                };
                return { song: song,story:  story}
            }
        }
    }
     
    componentDidMount = () => {
        const { index } = this.state;

        (async () => {
            await Font.loadAsync({
                unicode: require('../../assets/fonts/Tharlon-Regular.ttf'),
            });
            this.setState({ fontLoaded: true });
        })();

       var story = this._getStory(index)
       this.setState({currentstory:story})
       // this.player._startNewPlaybackInstance(true,story.song )
       
    }
    _onNext = () => {
        const { index,song } = this.state;
        const {  stories } = this.props;
        let next = index + 1;
        next = next < stories.recipes.length?next: stories.recipes.length
        var story = this._getStory(next);
        this.setState({currentstory:story, index: next})
        this.player._startNewPlaybackInstance(true,story.song )
    }
    _onPlay = () => {
        console.log('press a')
        this.player._onPlayPausePressed()
    }
    render = () => {
        const { currentstory,fontLoaded,story } = this.state;
        if(!fontLoaded)
        {
            return (<View/>)
        }
      
      return (
       <View style={styles.container}>
           <ScrollView style={styles.textcontainer}>
        <Text style={styles.text}>
       {currentstory.story.body}
        </Text>
       
       </ScrollView>
        <AudioPlayer  ref={player => {this.player = player}} {...this.props}  styles={styles.player}/>
        <View style={styles.iconsbox}>
        <TouchableHighlight
                                underlayColor={'#000a'}
                                onPress={()=>this._onPlay()}
                              //  style={styles.wrapper}
                              //  disabled={this.state.isLoading}
                            >
                            <View>
                            <AntDesign
                                name="left"
                                size={24}
                                color="#fffa"
                            />
                            </View>
                            </TouchableHighlight>
                            <Feather
                                name="bookmark"
                                size={24}
                                color="#fffa"
                            />
                            <AntDesign
                                name="like2"
                                size={24}
                                color="#fffa"
                            />
                            <TouchableHighlight
                                underlayColor={'#000a'}
                                onPress={()=>this._onNext()}
                              //  style={styles.wrapper}
                              //  disabled={this.state.isLoading}
                            >
                            <View>
                            <AntDesign
                                name="right"
                                size={24}
                                color="#fffa"
                            />
                            </View>
                            </TouchableHighlight>
                           
                        </View>
           
       </View>
      );
    }
  }

const styles = StyleSheet.create({
    textcontainer: {
        flex:1,
        padding:10,
        marginBottom:10,
    },
    iconsbox: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 20,
    },
    text: {
        color:'#fffd',
        fontFamily:'unicode',
        marginBottom:20
    },
    player: {
        height:300,
        width:'100%',
        flex:1,
    },
    container: {
        flex: 1,
        backgroundColor:'#212121',
        width:'100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch',
  },
});

const mapStateToProps = state => {
    return {
        stories: state.recipes || {},
    }
  }


const mapDispatchToProps = {
    fetchStories: getRecipes,

};

export default connect(mapStateToProps, mapDispatchToProps)(StoryPage);