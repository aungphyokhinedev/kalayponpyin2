import React, { Component } from 'react';
import {MaterialIcons,MaterialCommunityIcons} from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

const Header = ({
  message,
  onDownPress,
  onQueuePress,
  onMessagePress,
}) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onDownPress}>
    <MaterialIcons
                                            name="queue-music"
                                            size={24}
                                            color="#fff7"
                                        />
    </TouchableOpacity>
    <Text onPress={onMessagePress}
      style={styles.message}>{message.toUpperCase()}</Text>
    <TouchableOpacity onPress={onQueuePress}>
    <MaterialIcons
                                            name="share"
                                            size={24}
                                            color="#fff7"
                                        />
    </TouchableOpacity>
  </View>
);

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 72,
    paddingTop: 20,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'row',
  },
  message: {
    flex: 1,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.72)',
    fontWeight: 'bold',
    fontSize: 10,
  },
  button: {
    opacity: 0.72
  }
});
