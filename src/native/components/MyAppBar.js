import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default class MyAppbar extends React.Component {
    _goBack = () => console.log('Went back');
  
    _onSearch = () => console.log('Searching');
  
    _onMore = () => console.log('Shown more');
  
    render() {
      return (
        <Appbar>
  
          <Appbar.Content
            title="Title"
            subtitle="Subtitle"
          />
          <Appbar.Action icon="search" onPress={this._onSearch} />
          <Appbar.Action icon="more-vert" onPress={this._onMore} />
        </Appbar>
      );
    }
  }

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
