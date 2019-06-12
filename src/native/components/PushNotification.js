import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Banner } from 'react-native-paper';
import { Notifications } from 'expo';
import { setNotifications, registerPushNotifications } from '../../actions/PushMessage';

class PushNotification extends React.Component {
  state = {
    visible: false,
  };

  static propTypes = {
    setNotifications: PropTypes.func.isRequired,
    registerPushMessage: PropTypes.func.isRequired,
  }

  async componentDidMount() {
    const { registerPushMessage } = this.props;
    registerPushMessage();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = (newnotification) => {
    const { setNotifications } = this.props;
    setNotifications(newnotification);
    // this.setState({notification: newnotification});
  };
  
  
    render() {
    const { token, notification } = this.props;
    console.log('notification ' + JSON.stringify(notification));
    console.log('expotoken ' + token);
      return (
        <Banner
        visible={this.state.visible}
        actions={[
          {
            label: 'Fix it',
            onPress: () => this.setState({ visible: false }),
          },
          {
            label: 'Learn more',
            onPress: () => this.setState({ visible: false }),
          },
        ]}
        image={({ size }) =>
          <Image
            source={{ uri: 'https://avatars3.githubusercontent.com/u/17571969?s=400&v=4' }}
            style={{
              width: size,
              height: size,
            }}
          />
        }
      >
      {JSON.stringify(notification)}
        There was a problem processing a transaction on your credit card.
      </Banner>
      );
    }
  }
  const mapStateToProps = state => {
    return {
        token: state.PushMessage.token,
        notification: state.PushMessage.notification,
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

const mapDispatchToProps = {
  setNotifications: setNotifications,
  registerPushMessage: registerPushNotifications
};

export default connect( mapStateToProps, mapDispatchToProps)(PushNotification);
