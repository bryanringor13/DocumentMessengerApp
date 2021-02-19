import React, { useState, SetStateAction, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Root, Toast } from 'native-base';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons';
import { Provider, useDispatch, useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'
// import { ToastProvider } from 'react-native-styled-toast'
import * as ACTION from './src/store/modules/auth/action'
import { NavigationContainer } from '@react-navigation/native';
import theme from './theme'
import { createStackNavigator } from '@react-navigation/stack';
import store from './src/store/'
import { RootState } from './src/store/modules/combinedReducers';
import io from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo'

import LoginScreen from './src/screens/LoginScreen';
import Dashboard from './src/page/Dashboard';
import RequestDetails from './src/page/RequestDetails';
import BundledDetails from './src/page/BundledDetails';
import UserProfile from './src/page/UserProfile';
import History from './src/page/History';
import AcceptedPage from './src/page/status/AcceptedPage';
import SignScreen from './src/screens/signature';
import CameraCapture from './src/screens/camera';
import NotAcceptedPage from './src/page/status/NotAcceptedPage';
import CannotAccept from './src/page/status/CannotAccept';
import UpdatePassword from './src/page/UpdatePassword';
import NewPassword from './src/page/NewPassword';
import AssignedLocation from './src/page/AssignedLocation';
import DateRangePickerScreen from './src/screens/daterangepicker';
import ForgotPassword from './src/page/ForgotPassword';
import Notification from './src/page/Notification';
import { notifStatus, newListWithoutLoad, saveChangesMade, syncOngoing } from './src/store/modules/dashboard/action';
import { API_URL, SOCKET_URL } from './src/utils/Constants';
import { setInterval } from 'timers';
import { getTabCount } from './src/store/modules/tabscount/action';

function HomeScreen({ navigation }) {

  const auth = useSelector((state: RootState) => state.auth)
  const [passwordUpdated, setPasswordUpdated] = useState(true)

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = () => {
      if (Object.keys(auth.user).length > 0) {
        // dispatch(ACTION.restoreToken());
        // if (Object.keys(auth.user.messenger).length > 0 && false) {
        if (Object.keys(auth.user.messenger).length > 0 && auth.user.messenger.password_temp) {
          setPasswordUpdated(false)
          navigation.navigate('NewPassword', { currentPassword: auth.currentPassword, setProceedNext: () => { }, directTo: 'Dashboard', noBackArrow: true })
        } else {
          setPasswordUpdated(false)
          navigation.navigate('Dashboard')
        }
      } else {
        console.log('Error Login: Empty Auth User')
        setPasswordUpdated(false)
      }
    };

    if (passwordUpdated) bootstrapAsync();
  }, [auth.user]);

  return null;
}

function cacheImages(images: any[]) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

const navOptionHandler = () => ({
  headerShown: false
})

const StackHome = createStackNavigator();

const HomeStack = ({ navigation }: any) => {
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)
  const acceptance = useSelector((state: RootState) => state.acceptance)
  const [allowConnect, setAllowConnect] = useState(true)
  const [connectionMode, setConnectionMode] = useState(false)
  const [socket, setSocket] = useState(null)
  // console.log('Token: ', auth.token, )

  useEffect(() => {
    console.log('Token Hash: ', auth.token)
    console.log('User ID Hash: ', auth.userId)
    if (auth.userId.length > 0 && !socket) {
      setSocket(io(SOCKET_URL, {
        query: {
          Authorization: auth.userId,
          detect: 'mobile',
          type: 'messenger',
        },
      }))
    }
  }, [auth.userId])

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      // let connStatus = false;
      let connStatus = state.isConnected;
      // dispatch(ACTION.connectionStatus('wifi', connStatus))
      // console.log('State: ', auth.connection.status, '| New Status: ', state.isConnected)

      // if (auth.connection.status != connStatus) connectionModeHandler(connStatus);
      dispatch(ACTION.connectionStatus(state.type, connStatus))
    });

    // console.log('Connection: ', unsubscribe);
  }, [])

  useEffect(() => {
    if (auth.connection.haveChanged) {
      dispatch(ACTION.connectionChanged(false))
      if (!auth.connection.status) {
        Toast.show({
          text: 'You are offline.\nAll changes made will be saved once you get online.',
          position: 'top',
          duration: 3000,
          textStyle: styles.toastTextStyle,
          style: styles.toastStyle
        })
      } else {
        Toast.show({
          text: 'You are online.\nAll changes made during offline are now saved.',
          position: 'top',
          duration: 3000,
          textStyle: styles.toastTextStyle,
          style: styles.toastStyle
        })
      }
    }
  }, [auth.connection])

  useEffect(() => {
    console.log('Current Tab: ', acceptance.currentTab)
  }, [acceptance.currentTab])

  // useEffect(() => {
  //   console.log('Offline Mode:', acceptance.acceptance.)
  // }, [acceptance.acceptance.offMode])

  useEffect(() => {
    if (!!socket) {
      if (allowConnect) {
        setAllowConnect(false);
        socket.connect();
      }

      socket.on('connect', () => {
        console.log('connected to socket server');
      });

      socket.on('disconnect', () => {
        console.log('Socket Disconnected');
      });

      socket.on('notif', (data: any) => {
        // console.log('New Notif: ', data)
        if (data.data.has_new_notif && !acceptance.notification.newUpdate) {
          console.log('Current Tab: ', acceptance.currentTab)
          dispatch(notifStatus(data.data.has_new_notif))
          dispatch(getTabCount())
          // if (acceptance.currentTab === 'acceptance') {
          dispatch(newListWithoutLoad())
          // }
        }
      })
    }
  }, [socket])


  // useEffect(() => {
  //   console.log('Offline Mode For Acceptance: ', acceptance.acceptance)
  // }, [acceptance.acceptance])

  // useEffect(() => {
  //   console.log('Offline Mode In Transit: ', acceptance.intransit)
  // }, [acceptance.intransit])

  useEffect(() => {
    if (auth.connection.status && acceptance.syncOngoing && acceptance.intransit.offMode.intransit.length == 0) {
      dispatch(syncOngoing(false))
      dispatch(newListWithoutLoad())
    }
  }, [acceptance.syncOngoing, acceptance.intransit.offMode.intransit])

  useEffect(() => {
    if (auth.connection.status && acceptance.intransit.offMode.intransit.length > 0) {
      console.log('Syncing changes is now execute....', acceptance.intransit.offMode.intransit)
      dispatch(syncOngoing(true))
      dispatch(saveChangesMade())
    }
  }, [auth.connection.status, acceptance.intransit.offMode.intransit])

  return (
    <StackHome.Navigator initialRouteName="Login">
      {!!auth.token ?
        <>
          <StackHome.Screen name="HomeScreen" component={HomeScreen} options={navOptionHandler} />
          <StackHome.Screen name="Dashboard" component={Dashboard} options={navOptionHandler} />
          <StackHome.Screen name="BundledDetails" component={BundledDetails} options={navOptionHandler} />
          <StackHome.Screen name="RequestDetails" component={RequestDetails} options={navOptionHandler} />
          <StackHome.Screen name="UserProfile" component={UserProfile} options={navOptionHandler} />
          <StackHome.Screen name="AcceptedPage" component={AcceptedPage} options={navOptionHandler} />
          <StackHome.Screen name="NotAcceptedPage" component={NotAcceptedPage} options={navOptionHandler} />
          <StackHome.Screen name="CannotAccept" component={CannotAccept} options={navOptionHandler} />
          <StackHome.Screen name="History" component={History} options={navOptionHandler} />
          <StackHome.Screen name="SignatureScreen" component={SignScreen} options={navOptionHandler} />
          <StackHome.Screen name="CameraScreen" component={CameraCapture} options={navOptionHandler} />
          <StackHome.Screen name="UpdatePassword" component={UpdatePassword} options={navOptionHandler} />
          <StackHome.Screen name="NewPassword" component={NewPassword} options={navOptionHandler} />
          <StackHome.Screen name="AssignedLocation" component={AssignedLocation} options={navOptionHandler} />
          <StackHome.Screen name="Notification" component={Notification} options={navOptionHandler} />
          <StackHome.Screen name="DateRangePickerScreen" component={DateRangePickerScreen} options={navOptionHandler} />
        </> :
        <>
          <StackHome.Screen name="Login" component={LoginScreen} options={navOptionHandler} />
          <StackHome.Screen name="ForgotPassword" component={ForgotPassword} options={navOptionHandler} />
        </>}
    </StackHome.Navigator>
  )
}

const App = () => {

  const [isReady, setIsReady] = useState(false)

  const _loadAssetsAsync = async () => {
    const imageAssets = cacheImages([require('./assets/images/bg.png')]);
    const fontAssets = Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    })
    await Promise.all([...imageAssets, fontAssets]);
  }

  const isReadyHandler = (toggle: SetStateAction<boolean>) => {
    setIsReady(toggle)
  }

  return (
    <Provider store={store}>
      {!isReady ? (
        <AppLoading
          startAsync={_loadAssetsAsync}
          onFinish={() => isReadyHandler(true)}
          onError={console.warn}
        />
      ) : (
          <Root>
            <ThemeProvider theme={theme}>
              {/* <ToastProvider> */}
              <NavigationContainer>
                <HomeStack />
              </NavigationContainer>
              {/* </ToastProvider> */}
            </ThemeProvider>
          </Root>
        )}
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastTextStyle: {
    fontSize: 13.3,
    textAlign: 'center'
  },
  toastStyle: {
    width: 340,
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(109, 109, 109, 0.9)'
  }
});

export default App
