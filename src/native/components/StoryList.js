import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Actions } from 'react-native-router-flux'; 
import { connect } from 'react-redux';
import { Appbar, Searchbar } from 'react-native-paper';
import PropTypes from 'prop-types';
import { getStories } from '../../actions/Story';
import CustomText from './CustomText'
import SearchBar from 'react-native-searchbar';

import {MaterialIcons,MaterialCommunityIcons} from '@expo/vector-icons';

class StoryList extends Component {
    state = {
        isSearching: false,
        query: null,
        isFavouriteOnly: false,
        tracks: null
    }
    static propTypes = {
        stories: PropTypes.shape({
            loading: PropTypes.bool,
            error: PropTypes.string,
            stories: PropTypes.arrayOf(PropTypes.shape()),
        }).isRequired,
        fetchStories: PropTypes.func.isRequired,
    }
    componentDidMount = () => {
        console.log(this.props.stories)
        this.props.fetchStories().then(()=>{
            this.setState({tracks:this.props.stories.stories});
        })
        
        
    }

    setFavouriteOnly = (status) => {
        console.log(status)
        this.setState({isFavouriteOnly:!status});

    }
    renderSubHeader = () => {
        const { isSearching, query,isFavouriteOnly,tracks } = this.state;
     
        return (
            <View style={styles.subheader}>
            <SearchBar
                    ref={(ref) => this.searchBar = ref}
                    data={tracks}
                   // handleResults={this._handleResults}
                    showOnLoad={false}
                    handleChangeText={query => { this.setState({ query }); }}
                    />
                <CustomText style={styles.headersubtitle}>{isFavouriteOnly?'Favourites':'All Stories'}</CustomText>
                <View style={styles.headerbackicon}>
                    <TouchableOpacity onPress={()=>this.setFavouriteOnly(isFavouriteOnly)}>
                        <MaterialCommunityIcons style={{opacity:isFavouriteOnly?1:.5}}
                            name="bookmark-plus-outline"
                            size={25}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    onSearchPress = () => {
        const { isSearching } = this.state;
        this.setState({ isSearching: !isSearching })
        if(!isSearching){
            this.searchBar.show()
        }
       else{
        this.searchBar.hide()
       }
       
    }

    renderHeader = () => {

        return (
            <View style={styles.headeritem}>
                <View style={styles.itemhead}>
                    <View style={styles.headerfronticon}>
                        <MaterialIcons
                            name="queue-music"
                            size={25}
                            color="#fff"
                        />
                    </View>

                    <CustomText style={styles.headertitle}>Khalay Ponpyin</CustomText>


                </View>
                <View style={styles.headeritemtail}>
                    <View style={styles.headerbackicon}>
                        <TouchableOpacity onPress={() => { this.onSearchPress() }}>
                            <MaterialIcons
                                name="search"
                                size={25}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    </View>

                </View>


            </View>
        )
    }
    onItemPress = (item) => {
        Actions.home({trackId:item})
    }
    renderRow({ item }) {

        return (
            <View style={styles.item}>

                <TouchableOpacity onPress={() => this.onItemPress(item.id)} style={styles.itemhead}>
                    <View style={styles.fronticon}>
                        <MaterialIcons
                            name="music-note"
                            size={35}
                            color="#555"
                        />
                    </View>
                    <View style={styles.info} >
                        <CustomText style={styles.title}>{item.title}</CustomText>
                        <CustomText style={styles.subtitle}>{item.author}</CustomText>
                    </View>
                </TouchableOpacity>


            </View>
        )
    }

    getTracks = () => {
        const { tracks,isFavouriteOnly,query,isSearching } = this.state;
        const { favourites } = this.props;
        let chooseTracks = tracks;
        if(isFavouriteOnly) {
            chooseTracks = chooseTracks.filter(track=>{
                return favourites.indexOf(track.id) >= 0
            })
        }
        if(isSearching) {     
                chooseTracks = chooseTracks.filter(track=>{
                    return track.title.indexOf(query) >= 0
                })      
        }

        return chooseTracks
    }

    render() {
        const  tracks  = this.getTracks();
      
        return (
            <View style={styles.container}>
             {this.renderSubHeader()}
                {this.renderHeader()}
               
                <View style={{ flex: 1 }}>
                {tracks ? 
                    <FlatList
                        style={{ backgroundColor: '#151515' }}
                        data={tracks}
                        renderItem={this.renderRow.bind(this)}
                        keyExtractor={item => item.id.toString()}
                    /> :
                    <ActivityIndicator size="small" color="#ffffff33" />
                }
                </View>

            </View>
        )
    }


};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#151515',
        paddingTop:10
    },
    headeritem: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#191919',
        height: 70,

    },
    headerfronticon: {
        width: 72,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    headerbackicon: {
        width: 50,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    headertitle: {
        flex: 1,
        color: '#fff7',
        fontFamily: 'unicode',
        fontSize: 16,
        marginHorizontal: 10,
        textAlign: 'left',
    },
    headeritemtail: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    subheader: {
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#151515'
    },
    headersubtitle: {
        margin: 23,
        color: '#fff7',
        fontFamily: 'unicode',
        fontSize: 15,
    },
    item: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    itemhead: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    itemtail: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    fronticon: {
        width: 72,
        height: 72,
        backgroundColor: '#191919',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    info: {
        marginVertical: 15,
        marginHorizontal: 10,
        flex: 1,
        alignItems: 'stretch',
        flexDirection: 'column',
        justifyContent: 'space-between',

    },
    backicon: {
        width: 72,
        height: 72,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    title: {
        flex: 1,
        color: '#fff',
        fontFamily: 'unicode',
        fontSize: 15,
        textAlign: 'left',
    },
    subtitle: {
        flex: 1,
        color: '#777',
        fontFamily: 'unicode',
        fontSize: 11,
        textAlign: 'left',
    },
});

const mapStateToProps = state => {
    return {
        stories: state.story || {},
        favourites: state.story.favourites || []
    }
}


const mapDispatchToProps = {
    fetchStories: getStories,

};

export default connect(mapStateToProps, mapDispatchToProps)(StoryList);
