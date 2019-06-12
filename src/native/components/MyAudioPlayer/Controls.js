import React, { Component } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { setPlayStatus } from '../../../actions/Story';

const Controls = ({
  paused,
  shuffleOn,
  repeatOn,
  onPressPlay,
  onPressPause,
  onBack,
  onForward,
  onPressShuffle,
  onPressRepeat,
  setPlayStatus,
  forwardDisabled,
  playstatus,
}) => (
  <View style={styles.container}>
    <TouchableOpacity  activeOpacity={0.0} onPress={()=>{
        playstatus.isShuffle = !playstatus.isShuffle
        setPlayStatus(playstatus)
        onPressShuffle()
    }}>
    <Ionicons style={{opacity:playstatus.isShuffle?1:0.5}}
                                            name="ios-shuffle"
                                            size={24}
                                            color="#fff"
                                        />
    </TouchableOpacity>
    <View style={{width: 40}} />
    <TouchableOpacity onPress={onBack}>
    <Ionicons
                                            name="md-skip-backward"
                                            size={26}
                                            color="#fff"
                                        />
    </TouchableOpacity>
    <View style={{width: 20}} />
    {!paused ?
      <TouchableOpacity onPress={onPressPause}>
        <View style={styles.playButton}>
        <MaterialIcons
                                            name="pause"
                                            size={46}
                                            color="#fff"
                                        />
        </View>
      </TouchableOpacity> :
      <TouchableOpacity onPress={onPressPlay}>
        <View style={styles.playButton}>
        <MaterialIcons
                                            name="play-arrow"
                                            size={46}
                                            color="#fff"
                                        />
        </View>
      </TouchableOpacity>
    }
    <View style={{width: 20}} />
    <TouchableOpacity onPress={onForward}>
       <Ionicons
                                            name="md-skip-forward"
                                            size={26}
                                            color="#fff"
                                        />
    </TouchableOpacity>
    <View style={{width: 40}} />
    <TouchableOpacity  onPress={()=>{
      playstatus.isRepeat = !playstatus.isRepeat
      setPlayStatus(playstatus)
      
    }}>
    <Ionicons style={{opacity:playstatus.isRepeat?1:.5}}
                                            name="ios-repeat"
                                            size={24}
                                            color="#fff"
                                        />
    </TouchableOpacity>
  </View>
);

const mapStateToProps = state => {
  return {
    playstatus: state.story.playstatus || {}
  }
}


const mapDispatchToProps = {
  setPlayStatus: setPlayStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(Controls);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  playButton: {
    height: 72,
    width: 72,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 72 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryControl: {
    height: 18,
    width: 18,
  },
  off: {
    opacity: 0.30,
  }
})
