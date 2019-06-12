import React from "react";
import {
  Animated,
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions
} from "react-native";

import {
  ParallaxSwiper,
  ParallaxSwiperPage
} from "react-native-parallax-swiper";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRecipes, setError } from '../../actions/recipes';
import { registerPushNotifications } from '../../actions/PushMessage';

const { width, height } = Dimensions.get("window");

class StoryPages extends React.Component {
  myCustomAnimatedValue = new Animated.Value(0);

  getPageTransformStyle = index => ({
    transform: [
      {
        scale: this.myCustomAnimatedValue.interpolate({
          inputRange: [
            (index - 1) * (width + 8), // Add 8 for dividerWidth
            index * (width + 8),
            (index + 1) * (width + 8)
          ],
          outputRange: [0, 1, 0],
          extrapolate: "clamp"
        })
      },
      {
        rotate: this.myCustomAnimatedValue.interpolate({
          inputRange: [
            (index - 1) * (width + 8),
            index * (width + 8),
            (index + 1) * (width + 8)
          ],
          outputRange: ["180deg", "0deg", "-180deg"],
          extrapolate: "clamp"
        })
      }
    ]
  });

  static propTypes = {
    recipes: PropTypes.shape({
      loading: PropTypes.bool,
      error: PropTypes.string,
      recipes: PropTypes.arrayOf(PropTypes.shape()),
    }).isRequired,
    fetchRecipes: PropTypes.func.isRequired,
  }

  fetchRecipes = () => {
    const { fetchRecipes, showError } = this.props;
    return fetchRecipes()
      .then(console.log('fetched'))
      .catch((err) => {
        console.log(`Error: ${err}`);
        return showError(err);
      });
  }

  componentDidMount = () => this.fetchRecipes();
  render() {
    const {  recipes } = this.props;
    return (
      <ParallaxSwiper
      displayName={''}
        speed={0.5}
        vertical={true}
        animatedValue={this.myCustomAnimatedValue}
        dividerWidth={8}
        dividerColor="black"
        backgroundColor="black"
        onMomentumScrollEnd={activePageIndex => console.log(activePageIndex)}
        showProgressBar={true}
        progressBarBackgroundColor="rgba(0,0,0,0.25)"
        progressBarValueBackgroundColor="white"
      >
      {
          recipes.recipes.map((item) => (
            <ParallaxSwiperPage
            key={item.id}
            BackgroundComponent={
                <Image
                style={styles.backgroundImage}
                source={{ uri: item.image }}
                />
            }
            ForegroundComponent={
                <View style={styles.foregroundTextContainer}>
                <Animated.Text
                    style={[styles.foregroundText, this.getPageTransformStyle(0)]}
                >
                    {item.title}
                </Animated.Text>
                </View>
            }
            />
          ))
      }
        
        <ParallaxSwiperPage
          BackgroundComponent={
            <Image
              style={styles.backgroundImage}
              source={{ uri: "https://goo.gl/gt4rWa" }}
            />
          }
          ForegroundComponent={
            <View style={styles.foregroundTextContainer}>
              <Animated.Text
                style={[styles.foregroundText, this.getPageTransformStyle(1)]}
              >
                Page 2
              </Animated.Text>
            </View>
          }
        />
        <ParallaxSwiperPage
          BackgroundComponent={
            <Image
              style={styles.backgroundImage}
              source={{ uri: "https://goo.gl/KAaVXt" }}
            />
          }
          ForegroundComponent={
            <View style={styles.foregroundTextContainer}>
              <Animated.Text
                style={[styles.foregroundText, this.getPageTransformStyle(2)]}
              >
                Page 3
              </Animated.Text>
            </View>
          }
        />
      </ParallaxSwiper>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    width,
    height
  },
  foregroundTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  foregroundText: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 0.41,
    color: "white"
  }
});

const mapStateToProps = state => {
    return {
        recipes: state.recipes || {},
    }
  }


const mapDispatchToProps = {
  fetchRecipes: getRecipes,

};

export default connect(mapStateToProps, mapDispatchToProps)(StoryPages);