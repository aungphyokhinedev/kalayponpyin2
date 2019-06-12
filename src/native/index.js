import React from 'react';
// https://callstack.github.io/react-native-paper/
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Font,PublisherBanner } from 'expo';
import { Provider, connect } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import PropTypes from 'prop-types';

import Loading from './components/Loading';
import Routes from './routes/index';

const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#151515',
      background: '#151515',
      accent: '#f7b928',
    },
  };

class Root extends React.Component {
  state = {
    fontLoaded: false,
  };

  static propTypes = {
    store: PropTypes.shape({}).isRequired,
    persistor: PropTypes.shape({}).isRequired,
  }

  async componentDidMount() {
    await Font.loadAsync({
      unicode: require('../assets/fonts/Tharlon-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
  }



  render() {
    const {
      store, persistor,
    } = this.props;
    const {
      fontLoaded,
    } = this.state;
    if (!fontLoaded) {
      return <Loading />;
    }
    return (
        <Provider store={store}>
          <PersistGate
            loading={<Loading />}
            persistor={persistor}
          >
<PublisherBanner
          bannerSize="fullBanner"
          adUnitID="ca-app-pub-2053424925474556/4122021146" // Test ID, Replace with your-admob-unit-id
          testDeviceID="EMULATOR"
          onDidFailToReceiveAdWithError={this.bannerError}
          onAdMobDispatchAppEvent={this.adMobEvent}
        />
            <Routes>
              </Routes>
          </PersistGate>
        </Provider>
    );
  }
}

  
export default Root;

