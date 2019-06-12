//https://github.com/GetStream/react-native-audio-player/blob/master/App.js
import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    ScrollView
} from 'react-native';
import Slider from 'react-native-slider';
import { Asset, Audio, Font } from 'expo';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';



class PlaylistItem {
    constructor(name, uri, image) {
        this.name = name;
        this.uri = uri;
        this.image = image;
    }
}

const PLAYLIST = [
    new PlaylistItem(
        'Comfort Fit - “Sorry”',
        'https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3',
        'https://facebook.github.io/react/img/logo_og.png'
    ),
    new PlaylistItem(
        'Mildred Bailey – “All Of Me”',
        'https://ia300304.us.archive.org/34/items/PaulWhitemanwithMildredBailey/PaulWhitemanwithMildredBailey-AllofMe.mp3',
        'https://facebook.github.io/react/img/logo_og.png'
    ),
    new PlaylistItem(
        'Podington Bear - “Rubber Robot”',
        'https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Podington_Bear_-_Rubber_Robot.mp3',
        'https://facebook.github.io/react/img/logo_og.png'
    ),
];

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#212121';
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = 'Loading...';
const BUFFERING_STRING = 'Buffering...';
const RATE_SCALE = 3.0;

export default class AudioPlayer extends Component {
    static playbackInstance = null;
    constructor(props) {
        super(props);
        this.index = 0;
        this.isSeeking = false;
        this.shouldPlayAtEndOfSeek = false;

        this.state = {
            playbackInstanceName: LOADING_STRING,
            playbackInstancePosition: null,
            playbackInstanceDuration: null,
            shouldPlay: false,
            isPlaying: false,
            isBuffering: false,
            isLoading: true,
            fontLoaded: false,
            volume: 1.0,
            rate: 1.0,
            portrait: null,
            song: null
        };
    }

    componentDidMount() {
        (async () => {
        this._clearPlayback()
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playThroughEarpieceAndroid:false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        });
       // this._loadNewPlaybackInstance(false);
            await Font.loadAsync({
                unicode: require('../../assets/fonts/Tharlon-Regular.ttf'),
            });
            this.setState({ fontLoaded: true });
        })();

       
    }

    componentWillUnmount = async () => {
        this._clearPlayback()
      }

      _stopPlayback = async () => {
        if (AudioPlayer.playbackInstance != null) {
            await AudioPlayer.playbackInstance.stopAsync();
        }
      }

     _clearPlayback = async () => {
        if (AudioPlayer.playbackInstance) {
            await AudioPlayer.playbackInstance.stopAsync()
            AudioPlayer.playbackInstance.setOnPlaybackStatusUpdate(null);
            await AudioPlayer.playbackInstance.unloadAsync();
            AudioPlayer.playbackInstance = null;
            
        }
    }

    
    async _startNewPlaybackInstance(playing,song) {
        try{
        this.setState({song})
        await this._clearPlayback()
            if(song) {
                const source = { uri: song.uri };
                const initialStatus = {
                    shouldPlay: false,
                    rate: this.state.rate,
                    volume: this.state.volume,
                };
          
                const { sound, status } = await Audio.Sound.createAsync(
                    source,
                    initialStatus,
                    this._onPlaybackStatusUpdate
                );
                AudioPlayer.playbackInstance = sound;
                this._updateScreenForLoading(false);
                if(playing) {
                    this._onPlayPausePressed()
                }
            }     
        
       
       
        }
        catch(e){
            this._clearPlayback()
        }
    }


    async _loadNewPlaybackInstance(playing) {
        try{
        this._clearPlayback()
        const { song } = this.state;  
        if(song) {
            const source = { uri: song.uri };
            const initialStatus = {
                shouldPlay: playing,
                rate: this.state.rate,
                volume: this.state.volume,
            };
    
            const { sound, status } = await Audio.Sound.createAsync(
                source,
                initialStatus,
                this._onPlaybackStatusUpdate
            );
            AudioPlayer.playbackInstance = sound;
            this._updateScreenForLoading(false);
        }     
       
        }
        catch(e){
            this._clearPlayback()
        }
    }

    _updateScreenForLoading(isLoading) {
        const { song } = this.state;  
        if (isLoading) {
            this.setState({
                isPlaying: false,
                playbackInstanceName: LOADING_STRING,
                playbackInstanceDuration: null,
                playbackInstancePosition: null,
                isLoading: true,
            });
        } else {
            this.setState({
                
                playbackInstanceName: song.name,
                portrait: song.image,
                isLoading: false,
            });
        }
    }

    _onPlaybackStatusUpdate = status => {
        if (status.isLoaded) {
            this.setState({
                playbackInstancePosition: status.positionMillis,
                playbackInstanceDuration: status.durationMillis,
                shouldPlay: status.shouldPlay,
                isPlaying: status.isPlaying,
                isBuffering: status.isBuffering,
                rate: status.rate,
                volume: status.volume,
            });
            if (status.didJustFinish) {
                // this._advanceIndex(true);
                this._updatePlaybackInstanceForIndex(true);
            }
        } else {
            if (status.error) {
                console.log(`FATAL PLAYER ERROR: ${status.error}`);
            }
        }
    };

    _advanceIndex(forward) {
        this.index =
            (this.index + (forward ? 1 : PLAYLIST.length - 1)) %
            PLAYLIST.length;
    }

    async _updatePlaybackInstanceForIndex(playing) {
        this._updateScreenForLoading(true);

        this._loadNewPlaybackInstance(playing);
    }

    _onPlayPausePressed = () => {
        console.log('playpause')
        if (AudioPlayer.playbackInstance != null) {
            if (this.state.isPlaying) {
                AudioPlayer.playbackInstance.pauseAsync();
            } else {
                AudioPlayer.playbackInstance.playAsync();
            }
        }
    };

    _onStopPressed = () => {
        if (AudioPlayer.playbackInstance != null) {
            AudioPlayer.playbackInstance.stopAsync();
        }
    };

    _onForwardPressed = () => {
        if (AudioPlayer.playbackInstance != null) {
            this._advanceIndex(true);
            this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
        }
    };

    _onBackPressed = () => {
        if (AudioPlayer.playbackInstance != null) {
            this._advanceIndex(false);
            this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
        }
    };

    _onVolumeSliderValueChange = value => {
        if (AudioPlayer.playbackInstance != null) {
            AudioPlayer.playbackInstance.setVolumeAsync(value);
        }
    };

    _trySetRate = async rate => {
        if (AudioPlayer.playbackInstance != null) {
            try {
                await AudioPlayer.playbackInstance.setRateAsync(rate);
            } catch (error) {
                // Rate changing could not be performed, possibly because the client's Android API is too old.
            }
        }
    };

    _onRateSliderSlidingComplete = async value => {
        this._trySetRate(value * RATE_SCALE);
    };

    _onSeekSliderValueChange = value => {
        if (AudioPlayer.playbackInstance != null && !this.isSeeking) {
            this.isSeeking = true;
            this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
            AudioPlayer.playbackInstance.pauseAsync();
        }
    };

    _onSeekSliderSlidingComplete = async value => {
        if (AudioPlayer.playbackInstance != null) {
            this.isSeeking = false;
            const seekPosition = value * this.state.playbackInstanceDuration;
            if (this.shouldPlayAtEndOfSeek) {
                AudioPlayer.playbackInstance.playFromPositionAsync(seekPosition);
            } else {
                AudioPlayer.playbackInstance.setPositionAsync(seekPosition);
            }
        }
    };

    _getSeekSliderPosition() {
        if (
            AudioPlayer.playbackInstance != null &&
            this.state.playbackInstancePosition != null &&
            this.state.playbackInstanceDuration != null
        ) {
            return (
                this.state.playbackInstancePosition /
                this.state.playbackInstanceDuration
            );
        }
        return 0;
    }

    _getMMSSFromMillis(millis) {
        const totalSeconds = millis / 1000;
        const seconds = Math.floor(totalSeconds % 60);
        const minutes = Math.floor(totalSeconds / 60);

        const padWithZero = number => {
            const string = number.toString();
            if (number < 10) {
                return '0' + string;
            }
            return string;
        };
        return padWithZero(minutes) + ':' + padWithZero(seconds);
    }

    _getTimestamp() {
        if (
            AudioPlayer.playbackInstance != null &&
            this.state.playbackInstancePosition != null &&
            this.state.playbackInstanceDuration != null
        ) {
            return `${this._getMMSSFromMillis(
                this.state.playbackInstancePosition
            )}` + '/' + `${this._getMMSSFromMillis(
                this.state.playbackInstanceDuration
            )}`;
        }
        return '';
    }


    render() {
        const { song } = this.state; 
        if(!song){
            return <View />
        }
        return !this.state.fontLoaded ? (
            <View />
        ) : (
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                 
                        <Text style={styles.secondText}>
                            {song.name}
                </Text>
                        <View style={styles.timeinfo}>
                            <Text style={styles.playBackText}>{this._getTimestamp()}</Text>
                       
                        </View>
                        <View
                            style={[
                                styles.playbackContainer,
                                {
                                    opacity: this.state.isLoading
                                        ? DISABLED_OPACITY
                                        : 1.0,
                                },
                            ]}
                        >
                            <Slider
                                style={styles.playbackSlider}
                                value={this._getSeekSliderPosition()}
                                onValueChange={this._onSeekSliderValueChange}
                                onSlidingComplete={this._onSeekSliderSlidingComplete}
                                thumbTintColor="#f7b928"
                                minimumTrackTintColor="#f7b928"
                                disabled={this.state.isLoading}
                                trackStyle={styles.track}
                            />

                        </View>
                        <View style={styles.playerbox}>
                            <TouchableHighlight
                                underlayColor={BACKGROUND_COLOR}
                                style={styles.wrapper}
                                onPress={this._onPlayPausePressed}
                                disabled={this.state.isLoading}
                            >
                                <View>
                                    {this.state.isPlaying ? (
                                        <MaterialIcons
                                            name="pause-circle-outline"
                                            size={55}
                                            color="#f7b928"
                                        />
                                    ) : (
                                            <MaterialIcons
                                                name="play-circle-outline"
                                                size={55}
                                                color="#f7b928"
                                            />
                                        )}
                                </View>
                            </TouchableHighlight>
                        </View>
                      
                    </View>

                </View>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        width:'100%'
    },
    titleContainer: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    firstBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        marginTop: 16,
        paddingHorizontal: 10
    },
    firstBoxText: {
        opacity: .7,
        color: '#fff',
        fontFamily: 'unicode'
    },
    secondText: {
        color: '#fff',
        fontSize: 20,
        marginTop: 7,
        opacity: .9,
        textAlign: 'center',
        fontFamily: 'unicode'
    },
    thirdText: {
        color: '#fff',
        fontSize: 20,
        marginTop: 14,
        textAlign: 'center',
        opacity: .7,
        fontFamily: 'unicode',
        fontWeight: '100'
    },
    playerbox: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    playbackContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch',
        paddingHorizontal: 20
    },
    timeinfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconsbox: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 40,
        marginBottom: 29,
    },
    portraitContainer: {
        flex: 1,
    },
    portrait: {
        flex: 1,
        width: DEVICE_WIDTH,
    },
    storytextbox: {
        flex: 1,
        width: DEVICE_WIDTH,
        padding: 15,
        backgroundColor: '#212121'
    },
    storytext: {
        color: '#fffa',
        textAlign: 'justify',
        fontFamily: 'unicode',
    },
    detailssub: {
        color: '#fffa',
        fontFamily: 'unicode',
    },

    playbackSlider: {
        alignSelf: 'stretch',
    },
    text: {
        fontSize: FONT_SIZE,
        minHeight: FONT_SIZE,
    },
    buttonsContainerBase: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20
    },
    buttonsContainerTopRow: {
        minWidth: DEVICE_WIDTH / 2.0,
        width: DEVICE_WIDTH - 30,
    },
    timelineinfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        maxWidth: DEVICE_WIDTH - 30,
        minWidth: DEVICE_WIDTH - 30,
    },
    playBackText: {
        color: '#fffa',
        fontFamily: 'unicode',
        height:20
    },
    track: {
        height: 2,
        backgroundColor: '#fff5',
    }
});