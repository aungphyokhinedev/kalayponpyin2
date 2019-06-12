import { Text } from 'react-native' ;
import React, { Component } from 'react' ;
import { connect } from 'react-redux' ;
class CustomText extends Component {
Loadtext(){
    if(this.props.fontLoaded){
      return (<Text style={this.props.style}>{this.props.children}</Text>) ;
    }
    return <Text/>
  }
render(){
    return (
      this.Loadtext()
    );
  }
}
const mapStateToProps = (state) => {
    return {
        fontLoaded: state.story.fontLoaded || false,
    }
};
export default connect(mapStateToProps ,{})(CustomText) ;