import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, RefreshControl, FlatList } from 'react-native'
import { Content, Grid, Col, Button, CheckBox, View, Spinner, Text, ListItem, Left, Right, Icon, List } from 'native-base'
import PropTypes from 'prop-types'
import { AntDesign } from '@expo/vector-icons'
import { RootState } from '../../store/modules/combinedReducers'
import { useSelector, useDispatch } from 'react-redux'
import LoadingComponent from '../loading'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { listAcceptance, loadingAcceptance, setCurretTab, listIntransit, clearListingsAcceptance, clearListingsIntransit, scrollDownAcceptance, scrollDownIntransit, saveChangesMade, syncDoneChange } from '../../store/modules/dashboard/action'
import { getTabCount } from '../../store/modules/tabscount/action'
import OffloadingComponent from '../offloading'

interface BodyState {
    tabsCount: Object;
    acceptance: Object;
    currentTab: String;
    setTabHandler: Function;
    selectChangeHandler: Function;
    viewDetailsHandler: Function;
    viewBundledHandler: Function;
    setRefreshtabs: Function;
    setRefreshList: Function;
}

function wait(timeout: number) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const BodyComponent = ({
    currentTab,
    setTabHandler,
    selectChangeHandler,
    viewDetailsHandler,
    viewBundledHandler,
    setRefreshtabs,
    setRefreshList,
}: BodyState) => {
    const dispatch = useDispatch()
    const auth = useSelector((state: RootState) => state.auth)
    const acceptance = useSelector((state: RootState) => state.acceptance)
    const tabsCount = useSelector((state: RootState) => state.tabsCount)
    const [refreshing, setRefreshing] = useState(false);
    const [flatlistReady, setFlatlistReady] = useState(false);
    const [triggerLoading, setTriggerLoading] = useState(true)
    // const [savedChanges, setSavedChanges] = useState(false)

    const onRefreshAcceptance = React.useCallback(() => {
        // setFlatlistReady(false);
        // setRefreshtabs((state: boolean) => !state)
        // setRefreshList((state: boolean) => !state)
        if (auth.connection.status) {
            dispatch(getTabCount())
            dispatch(clearListingsAcceptance())
            console.log('Current Tab: ', acceptance.currentTab)
            dispatch(listAcceptance())
        }
        // setRefreshing((state: boolean) => !state)

        // wait(1000).then(() => setRefreshing(false))
    }, [acceptance.isLoading]);

    const onRefreshTransit = React.useCallback(() => {
        // setFlatlistReady(false);
        // setRefreshtabs((state: boolean) => !state)
        // setRefreshList((state: boolean) => !state)
        if (auth.connection.status) {
            dispatch(getTabCount())
            console.log('Current Tab: ', acceptance.currentTab)
            if (acceptance.intransit.offMode.intransit.length == 0) {
                dispatch(clearListingsIntransit())
                dispatch(listIntransit())
            }
        }
        // setRefreshing((state: boolean) => !state)

        // wait(1000).then(() => setRefreshing(false))
    }, [acceptance.isLoading]);

    const HeaderForAcceptance = () => {
        return (
            <Grid style={styles.selectAll}>
                <Col style={{ width: 40, justifyContent: 'center' }}>
                    <CheckBox color={acceptance.acceptance.allChecked ? "#41B67F" : "#2F3542"} checked={acceptance.acceptance.allChecked} onPress={event => selectChangeHandler("checkAll", acceptance.acceptance.allChecked)} />
                </Col>
                <Col style={{ justifyContent: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Select All</Text>
                </Col>
            </Grid>
        )
    }

    const HeaderIntransit = () => {
        return null
    }

    const BodyForAcceptance = ({ request }: any) => {
        return (
            <List style={styles.cardStyle}>
                <ListItem noIndent onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab, '')} noBorder style={request.isChecked ? styles.cardCheckedStyle : styles.cardUncheckedStyle}>
                    {/* <TouchableOpacity style={{ width: '100%' }}> */}
                    {request.is_urgent ?
                        <View style={{ position: 'absolute', height: 20, top: 0, left: 0, backgroundColor: '#FA5656', borderTopLeftRadius: 10, borderBottomRightRadius: 10, width: 62, alignItems: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Urgent</Text>
                        </View> : null}
                    <Left style={{ flex: 0.5 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '25%', justifyContent: 'center' }}>
                                <CheckBox color={request.isChecked ? "#41B67F" : "#2F3542"} onPress={event => selectChangeHandler(request.id, request.isChecked)} checked={request.isChecked} />
                            </View>
                            <View style={{ width: '75%', justifyContent: 'center' }}>
                                {/* <TouchableOpacity onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab)}> */}
                                <Text style={{ fontSize: 12 }}>{request.assigned_at}</Text>
                                <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: 16, fontWeight: '500' }}>{request.company}</Text>
                                {/* </TouchableOpacity> */}
                            </View>
                        </View>
                    </Left>
                    <Right style={{ flex: 0.5 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center', width: '80%' }}>
                                {/* <TouchableOpacity onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab)}> */}
                                <Text style={{ fontSize: 12, textAlign: 'right' }}>Transmittal No.</Text>
                                <Text style={{ fontSize: 16, textAlign: 'right', fontWeight: "normal" }}>{request.transmittal_no}</Text>
                                {/* </TouchableOpacity> */}
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '20%' }}>
                                {/* <Button transparent onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab)}> */}
                                <AntDesign name='right' style={{ color: '#2F3542' }} size={20} />
                                {/* </Button> */}
                            </View>
                        </View>
                    </Right>
                    {/* </TouchableOpacity> */}
                </ListItem>
            </List>
        )
    }

    const BodyIntransit = ({ intransit }: any) => {
        return (
            <List style={styles.cardStyle}>
                {intransit.transmital_type === 'SINGLE_ITEM' ?
                    <ListItem noIndent onPress={() => viewDetailsHandler(intransit.transmital_preview.transmittal_no, intransit.transmital_preview.id, currentTab, intransit.transmital_key)} noBorder style={styles.cardUncheckedStyle}>
                        {/* <TouchableOpacity style={{ width: '100%' }}> */}
                        {intransit.transmital_preview ? intransit.transmital_preview.is_urgent ?
                            <View style={{ position: 'absolute', top: 0, left: 0, height: 20, backgroundColor: '#FA5656', borderTopLeftRadius: 10, borderBottomRightRadius: 10, width: 62, alignItems: 'center' }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Urgent</Text>
                            </View> : null : null}
                        {!!intransit.transmital_preview.action_change ? <View style={{ position: 'absolute', top: 2, right: 10, height: 20, alignItems: 'center', flexDirection: 'row' }}>
                            <AntDesign name='warning' style={{ color: '#FA5656' }} size={12} /><Text style={{ color: '#FA5656', fontSize: 10 }}>{' '}Queued for syncing</Text>
                        </View> : null}
                        <Left style={{ flex: 0.5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '100%', justifyContent: 'center' }}>
                                    {/* <TouchableOpacity onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab)}> */}
                                    <Text style={{ fontSize: 12 }}>{intransit.transmital_preview.assigned_at}</Text>
                                    <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: 16, fontWeight: '500' }}>{intransit.transmital_preview.company}</Text>
                                    {/* </TouchableOpacity> */}
                                </View>
                            </View>
                        </Left>
                        <Right style={{ flex: 0.5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'center', width: '80%' }}>
                                    {/* <TouchableOpacity onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab)}> */}
                                    <Text style={{ fontSize: 12, textAlign: 'right' }}>Transmittal No.</Text>
                                    <Text style={{ fontSize: 16, textAlign: 'right', fontWeight: "normal" }}>{intransit.transmital_preview.transmittal_no}</Text>
                                    {/* </TouchableOpacity> */}
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: '20%' }}>
                                    {/* <Button transparent onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab)}> */}
                                    <AntDesign name='right' style={{ color: '#2F3542' }} size={20} />
                                    {/* </Button> */}
                                </View>
                            </View>
                        </Right>
                        {/* </TouchableOpacity> */}
                    </ListItem> :
                    <>
                        <View style={{ width: '100%', height: 10, position: "absolute", paddingLeft: 10, paddingRight: 10 }}>
                            <View style={{ backgroundColor: '#E0E6ED', width: '100%', height: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                                {/* Bundled Background Highlight */}
                            </View>
                        </View>
                        <ListItem noIndent onPress={() => viewBundledHandler(intransit.transmital_preview.company, intransit.transmital_count, currentTab, intransit.transmital_key, intransit.transmital_preview.request_type, intransit.transmital_preview.contact_person)} noBorder style={styles.cardBundledStyle}>
                            {/* <TouchableOpacity style={{ width: '100%' }}> */}
                            {intransit.transmital_preview ? intransit.transmital_preview.is_urgent ?
                                <View style={{ position: 'absolute', top: 0, left: 0, height: 20, backgroundColor: '#FA5656', borderTopLeftRadius: 10, borderBottomRightRadius: 10, width: 62, alignItems: 'center' }}>
                                    <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Urgent</Text>
                                </View> : null : null}
                            {!!intransit.transmital_preview.action_change ? <View style={{ position: 'absolute', top: 2, right: 10, height: 20, alignItems: 'center', flexDirection: 'row' }}>
                                <AntDesign name='warning' style={{ color: '#FA5656' }} size={12} /><Text style={{ color: '#FA5656', fontSize: 10 }}>{' '}Queued for syncing</Text>
                            </View> : null}
                            <Left style={{ flex: 0.5 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '100%', justifyContent: 'center' }}>
                                        {/* <TouchableOpacity onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab)}> */}
                                        {/* <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: 16, fontWeight: '500' }}>{intransit.transmital_preview.company}</Text> */}
                                        <Text style={{ fontSize: 12 }}>{intransit.transmital_preview ? intransit.transmital_preview.assigned_at : null}</Text>
                                        <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: 16, fontWeight: '500' }}>{intransit.transmital_preview ? intransit.transmital_preview.company : null}</Text>
                                        {/* </TouchableOpacity> */}
                                    </View>
                                </View>
                            </Left>
                            <Right style={{ flex: 0.5 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ justifyContent: 'center', width: '80%' }}>
                                        {/* <TouchableOpacity onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab)}> */}
                                        <Text style={{ fontSize: 12, textAlign: 'right' }}>Requests</Text>
                                        <Text style={{ fontSize: 16, textAlign: 'right', fontWeight: '500' }}>{intransit.transmital_count ? intransit.transmital_count : null}</Text>
                                        {/* </TouchableOpacity> */}
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '20%' }}>
                                        {/* <Button transparent onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab)}> */}
                                        <AntDesign name='right' style={{ color: '#2F3542' }} size={20} />
                                        {/* </Button> */}
                                    </View>
                                </View>
                            </Right>
                            {/* </TouchableOpacity> */}
                        </ListItem>
                    </>}
            </List>
        )
    }

    const scrolledFlatlist = () => {
        if (acceptance.isLoading) return null
        setFlatlistReady(true);
    }

    const endReachedHandler = (distanceFromEnd: any) => {
        if (!flatlistReady) return null
        if (acceptance.acceptance.pagination.hasNext && !acceptance.isLoading && auth.connection.status) {
            setFlatlistReady(false);
            console.log('End ', distanceFromEnd)
            // Load more
            console.log('Load more')
            dispatch(scrollDownAcceptance())
            // setRefreshHistory(true)
            // console.log('Flatlist - False')
        }
    }

    const endReachedIntransitHandler = (distanceFromEnd: any) => {
        if (!flatlistReady) return null
        if (acceptance.intransit.pagination.hasNext && !acceptance.isLoading && auth.connection.status) {
            setFlatlistReady(false);
            console.log('End ', distanceFromEnd)
            // Load more
            console.log('Load more')
            dispatch(scrollDownIntransit())
            // setRefreshHistory(true)
            // console.log('Flatlist - False')
        }
    }

    const selectTabHandlerAcceptance = (tab: any) => {
        // setRefreshing(true)
        // setRefreshList(true)
        console.log(tab)
        // setTabHandler(tab)
        dispatch(setCurretTab(tab))
        if (auth.connection.status) {
            dispatch(clearListingsAcceptance())
            // dispatch(loadingAcceptance())
            dispatch(getTabCount())
            dispatch(listAcceptance())
        }
    }

    const selectTabHandlerIntransit = (tab: any) => {
        // setRefreshing(true)
        // setRefreshList(true)
        console.log(tab)
        // setTabHandler(tab)
        dispatch(setCurretTab(tab))
        if (auth.connection.status) {
            dispatch(getTabCount())
            if (acceptance.intransit.offMode.intransit.length == 0) {
                dispatch(clearListingsIntransit())
                dispatch(listIntransit())
            }
        }
    }

    const EmptyComponent = () => {
        return (
            <Text>{auth.connection.status ? 'No results found' : 'The page is not available'}</Text>
        )
    }

    const NotAvailableComponent = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                <Text>{'The page is not available'}</Text>
            </View>
        )
    }

    return (
        <>
            <View>
                {auth.connection.status ? acceptance.syncDone ? <OffloadingComponent /> : acceptance.intransit.offMode.intransit.length > 0 ? <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                    <Text style={{ textAlign: 'center', fontSize: 12 }}>Syncing...</Text>
                </View> : null : <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                        <Text style={{ textAlign: 'center', fontSize: 12 }}>You're offline</Text>
                    </View>}
                {/* {auth.connection.status ? null : } */}
                <View style={{ marginTop: 15, height: 50, backgroundColor: '#F4F6F9', paddingLeft: 10, paddingRight: 10 }}>
                    <Grid style={styles.navigationButton}>
                        <Col style={{ backgroundColor: acceptance.currentTab === 'acceptance' ? '#E0E6ED' : '#FFFFFF', borderTopLeftRadius: acceptance.currentTab === 'acceptance' ? 5 : 10, borderBottomLeftRadius: acceptance.currentTab === 'acceptance' ? 5 : 10 }}>
                            <Button full transparent disabled={acceptance.currentTab === 'acceptance' ? true : false} onPress={() => selectTabHandlerAcceptance('acceptance')}>
                                <Text style={{ color: acceptance.currentTab === 'acceptance' ? '#1F236F' : '#2F3542', fontWeight: 'bold', textTransform: "capitalize" }}>For Acceptance ({tabsCount.for_acceptance})</Text>
                            </Button>
                        </Col>
                        <Col style={{ backgroundColor: acceptance.currentTab === 'intransit' ? '#E0E6ED' : '#FFFFFF', borderTopRightRadius: acceptance.currentTab === 'intransit' ? 5 : 10, borderBottomRightRadius: acceptance.currentTab === 'intransit' ? 5 : 10 }}>
                            <Button full transparent disabled={acceptance.currentTab === 'intransit' ? true : false} onPress={() => selectTabHandlerIntransit('intransit')}>
                                <Text style={{ color: acceptance.currentTab === 'intransit' ? '#1F236F' : '#2F3542', fontWeight: 'bold', textTransform: "capitalize" }}>In Transit ({tabsCount.in_transit})</Text>
                            </Button>
                        </Col>
                    </Grid>
                </View>
            </View>
            {acceptance.search.keyword.length > 0 && !auth.connection.status ? <NotAvailableComponent /> : (
                acceptance.currentTab === 'acceptance' ?
                    (acceptance.isLoading) && acceptance.acceptance.request.length === 0 ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LoadingComponent />
                        </View> :
                        // acceptance.acceptance.request.length > 0 ?
                        <>
                            <FlatList
                                ListHeaderComponent={acceptance.acceptance.request.length > 0 ? <HeaderForAcceptance /> : null}
                                refreshing={acceptance.acceptance.request.length === 0 && acceptance.isLoading ? true : false}
                                onRefresh={onRefreshAcceptance}
                                contentContainerStyle={acceptance.acceptance.request.length === 0 ? styles.emptyComponent : null}
                                onScroll={scrolledFlatlist}
                                style={{ paddingLeft: 10, paddingRight: 10, backgroundColor: '#F4F6F9' }}
                                data={acceptance.acceptance.request}
                                ListEmptyComponent={<EmptyComponent />}
                                renderItem={({ item }) => <BodyForAcceptance request={item} />}
                                keyExtractor={item => item.id}
                                ListFooterComponent={acceptance.isLoading && acceptance.acceptance.request.length > 0 ? <LoadingComponent /> : <View style={{ height: 80 }}></View>}
                                onEndReached={({ distanceFromEnd }) => endReachedHandler(distanceFromEnd)}
                                onEndReachedThreshold={0.5}
                            />
                        </> :
                    (acceptance.isLoading) && acceptance.intransit.request.length === 0 ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <LoadingComponent />
                        </View> :
                        // acceptance.acceptance.request.length > 0 ?
                        <FlatList
                            // ListHeaderComponent={<HeaderIntransit />}
                            refreshing={acceptance.intransit.request.length === 0 && acceptance.isLoading ? true : false}
                            onRefresh={onRefreshTransit}
                            onScroll={scrolledFlatlist}
                            style={{ paddingLeft: 10, paddingRight: 10, backgroundColor: '#F4F6F9' }}
                            data={acceptance.intransit.request}
                            contentContainerStyle={acceptance.intransit.request.length === 0 ? styles.emptyComponent : null}
                            ListEmptyComponent={<EmptyComponent />}
                            renderItem={({ item }) => <BodyIntransit intransit={item} />}
                            keyExtractor={intransit => intransit.transmital_key}
                            ListFooterComponent={acceptance.isLoading && acceptance.intransit.request.length > 0 ? <LoadingComponent /> : <View style={{ height: 80 }}></View>}
                            onEndReached={({ distanceFromEnd }) => endReachedIntransitHandler(distanceFromEnd)}
                            onEndReachedThreshold={0.5}
                        />
            )}
        </>
    )
}

const styles = StyleSheet.create({
    navigationBorder: {
        backgroundColor: '#F4F6F9',
        flex: 1,
    },
    navigationButton: {
        borderWidth: 2,
        borderRadius: 10,
        borderStyle: 'solid',
        borderColor: '#E0E6ED',
    },
    emptyComponent: {
        flexGrow: 1, justifyContent: 'center', alignItems: 'center'
    },
    buttonAccept: {
        backgroundColor: '#41B67F'
    },
    disabledButtonAccept: {
        backgroundColor: '#9dd6bd'
    },
    selectAll: {
        height: 36,
        width: 125,
        borderRadius: 10,
        paddingTop: 9,
        paddingRight: 10,
        paddingBottom: 9,
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        elevation: 1,
        marginBottom: 8,
        paddingLeft: 10
    },
    cardStyle: {
        marginTop: 8
    },
    cardBundledStyle: {
        backgroundColor: '#FFFFFF',
        paddingLeft: 10,
        marginTop: 5,
        borderRadius: 10,
        height: 82,
        paddingRight: 10,
        paddingTop: 16,
        paddingBottom: 16,
        elevation: 1
    },
    cardUncheckedStyle: {
        backgroundColor: '#FFFFFF',
        paddingLeft: 10,
        borderRadius: 10,
        height: 82,
        paddingRight: 10,
        paddingTop: 16,
        paddingBottom: 16,
        elevation: 1
    },
    cardCheckedStyle: {
        backgroundColor: '#D6EFE3',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#41B67F',
        paddingLeft: 10,
        borderRadius: 10,
        height: 82,
        paddingRight: 10,
        paddingTop: 16,
        paddingBottom: 16,
        elevation: 1
    },
    cardBox: {
        borderRadius: 10,
    },
    overlay: {
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
        position: "absolute",
        zIndex: 1,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
        opacity: 0.9,
    },
});

BodyComponent.defaultProps = {
    tabsCount: {},
    acceptance: {},
    currentTab: '',
    setTabHandler: () => { },
    selectChangeHandler: () => { },
    viewDetailsHandler: () => { },
    viewBundledHandler: () => { },
    setRefreshtabs: () => { },
    setRefreshList: () => { },
}

export default BodyComponent
