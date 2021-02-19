import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, BackHandler } from 'react-native'
import { Container, Text, Grid, Col, View, List, ListItem } from 'native-base'
import { RootState } from '../store/modules/combinedReducers';
import { useSelector, useDispatch } from 'react-redux';
import { Badge } from 'react-native-elements'

import {
    getNotification,
    scrollNotification,
    clearNotification,
    markAsReadNotif,
    viewDetails,
    markAsReadSingleNotif,
    getNotifCount, setCurretTab
} from '../store/modules/dashboard/action';

import HeaderComponent from '../components/header';
import LoadingComponent from '../components/loading';
import moment from 'moment';

moment.locale("en");

function wait(timeout: number) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const Notification = ({ route, navigation }) => {
    const dispatch = useDispatch()
    const { setToggleNotification } = route.params;
    const auth = useSelector((state: RootState) => state.auth)
    const acceptance = useSelector((state: RootState) => state.acceptance)
    const [refreshing, setRefreshing] = useState(false);
    const [flatlistReady, setFlatlistReady] = useState(false);
    const [notAllowedBtnBack, setNotAllowedBtnBack] = useState(false)
    const [fetchList, setFetchList] = useState(true)
    const [triggerMarkRead, setTriggerMarkRead] = useState(true)

    let countUnRead: Number = acceptance.countUnreadNotif


    const headerBtnCloseFunction = () => {
        if (!notAllowedBtnBack) {
            setToggleNotification(true)
            setNotAllowedBtnBack(state => !state)
            dispatch(clearNotification())
            navigation.goBack()
        }
    }

    const scrolledFlatlist = () => {
        if (acceptance.notification.loading) setFlatlistReady(false)
        setFlatlistReady(true);
    }

    const onRefresh = React.useCallback(() => {
        setFlatlistReady(false);
        if (auth.connection.status) {
            dispatch(clearNotification())
            dispatch(getNotification())
            dispatch(getNotifCount())
        }
        wait(3000).then(() => setRefreshing(false))
    }, [refreshing]);

    const endReachedHandler = (distanceFromEnd: any) => {
        if (!flatlistReady) return null
        if (acceptance.notification.pagination.hasNext) {
            setTriggerMarkRead(true)
            setFlatlistReady(false);
            console.log('End ', distanceFromEnd)
            // Load more
            console.log('Load more notification')
            dispatch(scrollNotification())
        }
    }

    const viewDetailsHandler = (transmittal_no: any, id: any, currentTab: any, notificationID: String, is_read: any, transmittal_key: any) => {
        if (!is_read) dispatch(markAsReadSingleNotif(notificationID))
        dispatch(viewDetails(id, false, true))
        dispatch(getNotifCount())
        navigation.push('RequestDetails', {
            transmittalNo: transmittal_no,
            currentTab: currentTab,
            btnFooter: false,
            transmittal_key: transmittal_key
        })
    }

    const backToIntransitListing = (refference_id: any, id: any, is_read: any) => {
        // console.log('Not a transmittal request', refference_id, id, is_read)
        if (!is_read) dispatch(markAsReadSingleNotif(id))
        dispatch(setCurretTab('intransit'))
        headerBtnCloseFunction()
    }

    const Body = ({ id, transmittal_no, activity_type, activity_at, refference_id, refference_title, refference_body, is_read }: any) => {
        return (
            <List>
                <ListItem
                    noIndent
                    style={styles.cardUncheckedStyle}
                    onPress={() => !!transmittal_no ?
                        viewDetailsHandler(transmittal_no, refference_id, 'history', id, is_read, '')
                        :
                        backToIntransitListing(refference_id, id, is_read)}
                >
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Text style={{ fontSize: 14, fontWeight: '300' }}>{activity_at} </Text>
                            {!is_read ? <Badge status="error" containerStyle={{ alignSelf: 'center' }} /> : null}
                        </View>
                        <Text style={{ fontSize: 16, fontWeight: is_read ? '500' : 'bold' }}>{refference_title}</Text>
                        <Text style={{ fontSize: 14, fontWeight: 'normal', color: '#2F3542' }}>{refference_body}</Text>
                        {/* <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: 14, fontWeight: 'normal', color: '#2F3542' }}>{refference_body}</Text> */}
                    </View>
                </ListItem>
            </List>
        );
    }

    useEffect(() => {

        function markAsRead() {
            setTriggerMarkRead(false)
            let notifDataList: any = []
            acceptance.notification.list.map((data) => {
                if (!data.is_read) {
                    notifDataList = [...notifDataList, data.id];
                }
            })
            // console.log('List of ID:', notifDataList)
            if (notifDataList.length > 0) {
                dispatch(markAsReadNotif(notifDataList))
            }
        }
        if (!fetchList && triggerMarkRead) markAsRead()
    }, [fetchList, triggerMarkRead])

    useEffect(() => {
        if (fetchList) {
            setFetchList(false)
            if (auth.connection.status) dispatch(getNotification())
        }
    }, [])

    useEffect(() => {
        const backAction = () => {
            headerBtnCloseFunction()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    // useEffect(() => {
    //     setFetchList(true)
    // }, [acceptance.notification.list])

    return (
        <Container style={{ backgroundColor: '#F4F6F9' }}>
            <HeaderComponent
                currentPage='normalheader'
                headerBtnCloseFunction={headerBtnCloseFunction}
                headerTitle='Notifications'
                headerSubTitle={`${auth.connection.status ? countUnRead : 0} Unread`}
                notAllowedBtnBack={notAllowedBtnBack}
            />
            {auth.connection.status ? acceptance.intransit.offMode.intransit.length > 0 ? <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                <Text style={{ textAlign: 'center', fontSize: 12 }}>Syncing...</Text>
            </View> : null : <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                    <Text style={{ textAlign: 'center', fontSize: 12 }}>You're offline</Text>
                </View>}
            {auth.connection.status ? fetchList || (acceptance.notification.loading && acceptance.notification.list.length === 0) ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <LoadingComponent />
            </View> :
                acceptance.notification.list.length > 0 ?
                    (<FlatList
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        onScroll={scrolledFlatlist}
                        style={{ paddingLeft: 10, paddingTop: 10, paddingRight: 10, backgroundColor: '#F4F6F9' }}
                        data={acceptance.notification.list}
                        renderItem={({ item }) => <Body
                            id={item.id}
                            transmittal_no={item.transmittal_no}
                            activity_type={item.activity_type}
                            activity_at={item.activity_at}
                            refference_id={item.refference_id}
                            refference_title={item.refference_title}
                            refference_body={item.refference_body}
                            is_read={item.is_read}
                        />
                        }
                        keyExtractor={item => item.id}
                        ListFooterComponent={acceptance.notification.loading ? <LoadingComponent /> : <View style={{ height: 80 }}></View>}
                        onEndReached={({ distanceFromEnd }) => endReachedHandler(distanceFromEnd)}
                        onEndReachedThreshold={0.4}
                    />) :
                    (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>
                            No notification to show
                        </Text>
                    </View>) : acceptance.notification.list.length > 0 ?
                    (<FlatList
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        onScroll={scrolledFlatlist}
                        style={{ paddingLeft: 10, paddingTop: 10, paddingRight: 10, backgroundColor: '#F4F6F9' }}
                        data={acceptance.notification.list}
                        renderItem={({ item }) => <Body id={item.id} transmittal_no={item.transmittal_no} activity_type={item.activity_type} activity_at={item.activity_at} refference_id={item.refference_id} refference_title={item.refference_title} refference_body={item.refference_body} is_read={item.is_read} />}
                        keyExtractor={item => item.id}
                        ListFooterComponent={acceptance.notification.loading ? <LoadingComponent /> : <View style={{ height: 80 }}></View>}
                        onEndReached={({ distanceFromEnd }) => endReachedHandler(distanceFromEnd)}
                        onEndReachedThreshold={0.4}
                    />) :
                    (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>
                            The page is not available
                        </Text>
                    </View>)}
        </Container >
    )
}

const styles = StyleSheet.create({
    cardUncheckedStyle: {
        backgroundColor: '#FFFFFF',
        paddingLeft: 20,
        paddingRight: 20,
    },
    viewStyleForLine: {
        borderBottomColor: "#E0E6ED",
        borderBottomWidth: 1
    }
})

export default Notification
