import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'native-base'
import { RootState } from '../store/modules/combinedReducers'

import AcceptanceScreen from '../screens/acceptance'
// import { useToast } from 'react-native-styled-toast'
import { loadingAcceptance, notifStatus, getNotifCount } from '../store/modules/dashboard/action'
import { clearNewPassword } from '../store/modules/auth/action'
import { ToastAndroid } from 'react-native'

function wait(timeout: number) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const Dashboard = ({ route, navigation }) => {
  // const { toast } = useToast()
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)
  const [currentTab, setCurrentTab] = useState('acceptance')
  const [refreshList, setRefreshList] = useState(true)
  const [allowedCount, setAllowedCount] = useState(true)

  const setTabHandler = (tab: any) => {
    // setRefreshList(true)
    setCurrentTab(tab)
  }

  useEffect(() => {
    function passwordChanged() {
      // toast({ message: 'Password updated' })
      ToastAndroid.showWithGravity(
        'Password updated',
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      dispatch(clearNewPassword())
    }

    if (Object.keys(auth.newPasswordData).length > 0) passwordChanged()
  }, [auth.newPasswordData])

  useEffect(() => {
    if (allowedCount) {
      setAllowedCount(false)
      if (auth.connection.status) dispatch(getNotifCount());
    }
  }, [])

  return (
    <Container style={{ backgroundColor: '#F4F6F9' }}>
      <AcceptanceScreen route={route} navigation={navigation} setTabHandler={setTabHandler} currentTab={currentTab} setRefreshList={setRefreshList} refreshList={refreshList} />
    </Container>
  )
}

export default Dashboard