import React, { Component } from 'react';
import {
  View,
  Text,
  Share,
  Platform,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getStories, setFavourite } from '../../../actions/Story';
import Header from './Header';
import AlbumArt from './AlbumArt';
import TrackDetails from './TrackDetails';
import SeekBar from './SeekBar';
import Controls from './Controls';
import Loading from '../Loading';
import { Video, Font } from 'expo';
import { Actions } from 'react-native-router-flux';
//import Video from 'react-native-video';

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFavourite: false,
      selectedTrackIndex: 0,
      paused: false,
      totalLength: 1,
      currentPosition: 0,
      shouldPlay: true,
    };
  }

  static propTypes = {
    favourites: PropTypes.arrayOf(PropTypes.number),
    stories: PropTypes.shape({
      loading: PropTypes.bool,
      error: PropTypes.string,
      stories: PropTypes.arrayOf(PropTypes.shape()),
    }).isRequired,
    playstatus:PropTypes.shape(),
    fetchStories: PropTypes.func.isRequired,
  }

  componentDidMount = () => {
    this.fetchStories()
  }

  componentWillReceiveProps = () => {
    const { stories } = this.props;
    if (stories) {

      console.log('set tracks')
    }
  }

  fetchStories = () => {
    const { fetchStories, showError, trackId } = this.props;
    return fetchStories()
      .then(() => {
        console.log('fetch done')
        this.setState({ tracks: this.props.stories.stories,selectedTrackIndex: 0 })
        if(trackId) {
          let index = 0
          this.props.stories.stories.forEach(story=>{
            if(story.id == trackId){
              this.setState({selectedTrackIndex : index})
              this._onChangeIndex(index);
            }
            index++;
          })
          
        }
        else{
          this._onChangeIndex(0);
        }
        
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        return showError(err);
      });
  }


  _onChangeIndex = (index) => {
    const { changeIndex, favourites } = this.props;
    let isFavourite = favourites.indexOf(this.props.stories.stories[index].id) >= 0;
    this.setState({ isFavourite });
    return changeIndex(this.props.stories.stories[index].body);
  }

  setDuration(data) {
    // console.log(totalLength);
    this.setState({ totalLength: Math.floor(data.duration) });
  }

  setTime(data) {
    //console.log(data);
    this.setState({ currentPosition: Math.floor(data.currentTime) });
  }

  seek(value) {
    value = Math.round(value);
    ///this.refs.audioElement && this.refs.audioElement.seek(time);
    console.log('value ' + value)
    console.log(this.state.totalLength)
    console.log(value * this.state.totalLength)
    if (this._video != null) {
      const seekPosition = value;
      this._video.setPositionAsync(seekPosition, {
        toleranceMillisBefore: 0,
        toleranceMillisAfter: 0
      });

    }
    this.setState({
      currentPosition: value,
      paused: false,
    });
  }

  onBack = async () => {
    const { selectedTrackIndex, tracks } = this.state;
    let previousTrack = (selectedTrackIndex - 1) < 0 ? (tracks.length - 1) : selectedTrackIndex - 1;
    //this.refs.audioElement && this.refs.audioElement.seek(0);
    this.setState({ isChanging: true });
    await this._onClearPlayback();
    setTimeout(() => this.setState({
      currentPosition: 0,
      paused: false,
      totalLength: 1,
      isChanging: false,
      selectedTrackIndex: previousTrack,
    }), 0);
    this._onChangeIndex(previousTrack);
  }

  onForward = async () => {
    const { selectedTrackIndex, tracks } = this.state;
    let nextTrack = (selectedTrackIndex + 1) < tracks.length ? selectedTrackIndex + 1 : 0;

    this.setState({ isChanging: true });
    await this._onClearPlayback();
    setTimeout(() => this.setState({
      currentPosition: 0,
      paused: false,
      totalLength: 1,
      isChanging: false,
      selectedTrackIndex: nextTrack,
    }), 0);
    this._onChangeIndex(nextTrack);
  }
  _onPlaybackStatusUpdate = status => {
    if (status.isLoaded) {
      this.setState({
        totalLength: status.durationMillis,
        currentPosition: status.positionMillis,
      })
    }
    if (status.didJustFinish && !status.isLooping) {
      this.onForward()
    }
  }

  _onClearPlayback = async () => {
    const { tracks, selectedTrackIndex } = this.state;
    const { playstatus } = this.props;
    if (this._video != null) {
      await this._video.unloadAsync();
      //this._video.setOnPlaybackStatusUpdate(null);
      //this._video = null;
      const source = { uri: tracks[selectedTrackIndex].sound };
      const initialStatus = {
        shouldPlay: true,
        rate: 1.0,
        shouldCorrectPitch: true,
        volume: 1.0,
        isMuted: false,
        isLooping: playstatus.isRepeat,
        // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
        // androidImplementation: 'MediaPlayer',
      };

      //this._video.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate());
      await this._video.loadAsync(source, initialStatus);
      await this._video.getStatusAsync();
    }

  }
  _onShare = () => {
    Share.share({
      ...Platform.select({
        ios: {
          message: 'Have a look on : ',
          url: 'https://play.google.com/store/apps/details?id=com.cybernetics.khalayponpyin',
        },
        android: {
          message: 'Have a look on : \n' + 'https://play.google.com/store/apps/details?id=com.cybernetics.khalayponpyin'
        }
      }),
      title: 'Wow, did you see that?'
    }, {
        ...Platform.select({
          ios: {
            // iOS only:
            excludedActivityTypes: [
              'com.apple.UIKit.activity.PostToTwitter'
            ]
          },
          android: {
            // Android only:
            dialogTitle: 'Share : ' + this.props.title
          }
        })
      });
  }


  _onAddFavourite = (track) => {
    const { favourites, setFavourite } = this.props;
    let index = favourites.indexOf(track.id) 
    if (index < 0) {
      favourites.push(track.id)
      setFavourite(favourites)
    }
    else{
      favourites.splice(index, 1);
      console.log(favourites)
      setFavourite(favourites)
    }
    let isFavourite = favourites.indexOf(track.id) >= 0;
    this.setState({ isFavourite });
  }
  _onPlay = () => {
    console.log('play')
    if (this._video) {
      this._video.playAsync()
    }
  }
  _onPause = () => {
    if (this._video) {
      this._video.pauseAsync()
    }
  }
  _mountVideo = component => {
    this._video = component;
  };


  _onPressShuffle = (status) => {
    console.log('shuffle click')
    const {playstatus} = this.props;
    if(playstatus.isShuffle) {
      console.log('shuffle list')
      if (this._video) {
        this._video.stopAsync()
      }
      let shuffleList = this.shuffle(this.state.tracks)
      this.setState({ tracks: shuffleList })
      if (this._video) {
        this._video.playAsync()
      }
    }
    else{
      console.log('restore list')
      if (this._video) {
        this._video.stopAsync()
      }
      this.fetchStories()
      if (this._video) {
        this._video.playAsync()
      }
    }
  }

  shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  
  render() {

    const {  tracks, selectedTrackIndex } = this.state;
    const { playstatus } = this.props;
    // console.log('tracklength ' + tracks.length + '  ' + selectedTrackIndex)
    if (!tracks) {
      return (<Loading />)
    }

    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Header onDownPress={() => { Actions.cards({}) }} onQueuePress={() => { this._onShare() }} message="Playing From Charts" />
        <AlbumArt url={tracks[selectedTrackIndex].image} />
        <TrackDetails isFavourite={this.state.isFavourite} onAddPress={() => { this._onAddFavourite(tracks[selectedTrackIndex]) }} title={tracks[selectedTrackIndex].title} artist={tracks[selectedTrackIndex].author} />
        <SeekBar
          onSeek={this.seek.bind(this)}
          trackLength={this.state.totalLength}
          onSlidingStart={() => this.setState({ paused: true })}
          currentPosition={this.state.currentPosition} />
        <Controls
          forwardDisabled={this.state.selectedTrackIndex === tracks.length - 1}
          onPressShuffle={() => this._onPressShuffle()}
          //onPressPlay={() => this.setState({paused: false})}

          onPressPlay={() => { this._onPlay(); this.setState({ paused: false }); }}
          onPressPause={() => { this._onPause(); this.setState({ paused: true }); }}
          //onPressPause={() => this.setState({paused: true})}
          onBack={this.onBack.bind(this)}
          onForward={this.onForward.bind(this)}
          paused={this.state.paused} />
        <Video
          ref={this._mountVideo}
          source={{ uri: tracks[selectedTrackIndex].sound }}
          onPlaybackStatusUpdate={this._onPlaybackStatusUpdate}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay={true}
          isLooping={playstatus.isRepeat}
          style={styles.audioElement}
        />
      </View>
    );
  }
}

const styles = {
  container: {

  },
  audioElement: {
    height: 0,
    width: 0,
  }
};


const mapStateToProps = state => {
  return {
    stories: state.story || {},
    favourites: state.story.favourites || [],
    playstatus: state.story.playstatus || {}
  }
}


const mapDispatchToProps = {
  fetchStories: getStories,
  setFavourite: setFavourite

};

export default connect(mapStateToProps, mapDispatchToProps)(Index);