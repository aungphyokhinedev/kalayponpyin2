import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getStories } from '../../actions/Story';
import CustomText from './CustomText'
import CardList from './CardList/Index'
const {width, height} = Dimensions.get('window');

const LIST = [
    {color: 'red'},
    {color: 'blue'},
    {color: 'darkgray'},
    {color: 'pink'},
    {color: 'green'},
    {color: 'yellow'},
    {color: 'red'},
    {color: 'blue'},
    {color: 'darkgray'},
    {color: 'pink'},
    {color: 'green'},
    {color: 'yellow'},
    {color: 'red'},
    {color: 'blue'},
    {color: 'darkgray'},
    {color: 'pink'},
    {color: 'green'},
    {color: 'yellow'}
];


class StoryCards extends Component {

    static propTypes = {
        stories: PropTypes.shape({
            loading: PropTypes.bool,
            error: PropTypes.string,
            stories: PropTypes.arrayOf(PropTypes.shape()),
        }).isRequired,
        fetchStories: PropTypes.func.isRequired,
    }
    componentDidMount = () => {
        console.log('story card')
    }
    render() {
        const {stories} = this.props;
        onClickCard = (i) => {
          //  Toast(i+'');
        }
        renderRow = (data, i, width, height) => {
            return (
                <View style={{width, height,backgroundColor:'#fff', alignItems:'center'}}>
                    <CustomText style={{fontFamily:'unicode',margin:10, textAlign:'center'}}>{data.title}</CustomText>
                </View>
            )
        }
      
        return (
            <View style={styles.container}>
                <CardList
                    list={stories.stories}
                    renderRow={renderRow}
                    height={300}
                    scrollOffset={700}
                    panelHeight={height-100}
                    panelWidth={width-20}
                    offsetTop={100}
                    offsetLeft={10}
                    onClickCard={onClickCard}/>
            </View>
        );
    }
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor:'#000'
    },
});

const mapStateToProps = state => {
    return {
        stories: state.story || {},
    }
}


const mapDispatchToProps = {
    fetchStories: getStories,

};

export default connect(mapStateToProps, mapDispatchToProps)(StoryCards);
