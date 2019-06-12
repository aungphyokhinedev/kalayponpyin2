import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Animated,
} from 'react-native';

export default class Card extends React.Component{
    constructor(props) {
        super(props);
        const { height, width, top, marginLeft } = this.props;
        this.state = {
            _height: new Animated.Value(height),
            _width: new Animated.Value(width),
            _top: new Animated.Value(top),
            _marginLeft: new Animated.Value(marginLeft),
        };
    }
  
    componentWillReceiveProps (nextProps) {
        const { _width, _height, _top, _marginLeft } = this.state;
        _width.setValue(nextProps.width);
        _height.setValue(nextProps.height);
        _top.setValue(nextProps.top);
        _marginLeft.setValue(nextProps.marginLeft);
    }
    render () {
        const { mounted, renderRow } = this.props;
        const { _width: width, _height: height, _top: top, _marginLeft: marginLeft } = this.state;
        return (
            mounted ?
                <Animated.View style={[styles.card, { height, width, top, marginLeft }]}>
                    {renderRow(this.props.width, this.props.height)}
                </Animated.View>
            : null
        );
    }
};

const styles = StyleSheet.create({
    cardContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        overflow: 'hidden',
    },
    card: {
        position: 'absolute',
    },
});
