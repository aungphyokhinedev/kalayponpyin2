import React, { Component } from 'react';
import {MaterialIcons,MaterialCommunityIcons} from '@expo/vector-icons';
import CustomText from '../CustomText';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const TrackDetails = ({
  title,
  artist,
  onAddPress,
  onMorePress,
  onTitlePress,
  onArtistPress,
  isFavourite,
  isLiked,
}) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onAddPress}>
    <MaterialCommunityIcons style={{opacity:isFavourite?1:.5}}
                                            name="bookmark-plus-outline"
                                            size={24}
                                            color="#fff"
                                        />
    </TouchableOpacity>
    <View style={styles.detailsWrapper}>
      <CustomText style={styles.title} onPress={onTitlePress}>{title} {isFavourite}</CustomText>
      <CustomText style={styles.artist} onPress={onArtistPress}>{artist}</CustomText>
    </View>
    <TouchableOpacity onPress={onMorePress}>
      <MaterialCommunityIcons style={{opacity:isLiked?1:.5}}
                                            name="heart-circle-outline"
                                            size={24}
                                            color="#fff"
                                        />

    </TouchableOpacity>
  </View>
);

export default TrackDetails;

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    flexDirection: 'row',
    paddingLeft: 20,
    alignItems: 'center',
    paddingRight: 20,
  },
  detailsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
   // fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'unicode'
  },
  artist: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'unicode'
  },
  button: {
    opacity: 0.72,
  },
  moreButton: {
    borderColor: 'rgb(255, 255, 255)',
    borderWidth: 2,
    opacity: 0.72,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonIcon: {
    height: 17,
    width: 17,
  }
});
