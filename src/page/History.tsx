import React, { useEffect, useState } from 'react'
import { StyleSheet, BackHandler, FlatList, Dimensions } from 'react-native'
import { Container, Left, Right, Text, View, ListItem, List } from 'native-base'
import { useFocusEffect } from '@react-navigation/native';
import { RootState } from '../store/modules/combinedReducers';
import { useSelector, useDispatch } from 'react-redux';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import Constants from 'expo-constants';

import {
    viewDetails,
    getHistoryList,
    setHistoryDateRange,
    setHistoryKeyword,
    clearHistoryKeyword,
    clearHistoryDateRange,
    clearHistoryList
} from '../store/modules/dashboard/action';

import HeaderComponent from '../components/header';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LoadingComponent from '../components/loading';
import DateRangePickerScreen from '../screens/daterangepicker';
import moment from 'moment';

moment.locale("en");

function wait(timeout: number) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const History = ({ route, navigation }) => {
    const dispatch = useDispatch()
    const auth = useSelector((state: RootState) => state.auth)
    const { historyBtnNowAllowedHandler, currentTab } = route.params;
    const acceptance = useSelector((state: RootState) => state.acceptance)
    const [searchBar, setSearchBar] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [fetchHistory, setFetchHistory] = useState(true)
    const [notAllowedBtnBack, setNotAllowedBtnBack] = useState(false)
    const [showDateRangePicker, setShowDateRangePicker] = useState(false)
    const [showDateRange, setShowDateRange] = useState('')
    const { height } = Dimensions.get('window');
    const [flatlistReady, setFlatlistReady] = useState(false);
    const [getdateFrom, setDateFrom] = useState('');
    const [getdateTo, setDateTo] = useState('');

    const setDateRangeHandler = ({ dateFrom, dateTo }: any) => {
        setDateFrom(dateFrom)
        setDateTo(dateTo)
    }

    const closeHistoryHandler = () => {
            dispatch(clearHistoryKeyword())
            dispatch(clearHistoryDateRange())
            dispatch(clearHistoryList())
            historyBtnNowAllowedHandler(false)
            navigation.goBack()
    }

    const searchCLoseHandler = () => {
        setSearchBar(false)
        // if (searchText.length > 0) {
        setFlatlistReady(false)
        if (auth.connection.status) {
            dispatch(clearHistoryList())
            dispatch(getHistoryList())
        } else {
            dispatch(clearHistoryList())
        }
    }

    const closeSearchHandler = () => {
        setSearchText('')
        setFlatlistReady(false);
        dispatch(clearHistoryKeyword())
        if (auth.connection.status) {
            dispatch(clearHistoryList())
            dispatch(getHistoryList())
        }
    }

    const searchHistoryHandler = (state: boolean) => {
        setSearchBar(state)
        console.log('Search History')
    }

    const searchTextHandler = (event: String) => {
        setSearchText(event)
        if (event.length > 0) {
            dispatch(setHistoryKeyword(event))
        } else {
            if (acceptance.history.search.keyword.length > 0) dispatch(clearHistoryKeyword())
        }
    }

    const datePickerHandler = () => {
        setDateFrom('');
        setDateTo('');
        setShowDateRangePicker(state => !state)
        if (auth.connection.status) dispatch(getHistoryList())
    }

    const closeDatePickerHandler = () => {
        setShowDateRangePicker(false)

        if (getdateFrom.toString().length > 0 && getdateTo.toString().length > 0) {
            if (auth.connection.status) dispatch(clearHistoryList())

            setShowDateRange(`${moment(getdateFrom).format('MMM D, YYYY').toString()} - ${moment(getdateTo).format('MMM D, YYYY').toString()}`)
            dispatch(setHistoryDateRange(moment(getdateFrom).format('YYYY-MM-DD'), moment(getdateTo).format('YYYY-MM-DD')))
            dispatch(getHistoryList())
        }
    }

    const viewDetailsHandler = (transmittal_no: any, id: any, currentTab: any, transmittal_key: any) => {
        // console.log('History: viewDetailsHandler ', transmittal_no, id, currentTab, transmittal_key);
        dispatch(viewDetails(id, false, true))
        navigation.push('RequestDetails', {
            transmittalNo: transmittal_no,
            currentTab: currentTab,
            btnFooter: false,
            transmittal_key: transmittal_key
        })
    }

    const cancelCalendar = () => {
        setShowDateRangePicker(state => !state)
        // dispatch(clearHistoryDateRange())
        // 
        if (auth.connection.status) dispatch(getHistoryList())
    }

    const clearCalendar = () => {
        if (auth.connection.status) dispatch(clearHistoryList())
        setShowDateRangePicker(false)
        setShowDateRange('')
        dispatch(clearHistoryDateRange())

        if (auth.connection.status) dispatch(getHistoryList())
    }

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = React.useCallback(() => {
        setFlatlistReady(false);
        if (auth.connection.status) {
            dispatch(clearHistoryList())
            dispatch(getHistoryList())
        }
    }, [refreshing]);

    const scrolledFlatlist = () => {
        // console.log('Scrolling...')
        // console.log('Flatlist - True')
        if (acceptance.isLoading) return null
        setFlatlistReady(true);
    }

    const endReachedHandler = (distanceFromEnd: any) => {
        if (!flatlistReady) return null
        if (acceptance.history.pagination.hasNext) {
            setFlatlistReady(false);
            console.log('End ', distanceFromEnd)
            // Load more
            console.log('Load more')
            if (auth.connection.status) dispatch(getHistoryList())
            // setRefreshHistory(true)
            // console.log('Flatlist - False')
        }
    }

    const Header = () => {
        return (
            <View style={{ justifyContent: 'center', paddingRight: 10, alignItems: 'flex-end', backgroundColor: '#F4F6F9' }}>
                <View style={styles.filterDate}>
                    <MaterialCommunityIcons name='calendar-blank-outline' size={24} />
                    <TouchableOpacity onPress={() => datePickerHandler()}>
                        <Text style={{ fontSize: 12, marginRight: 5, fontWeight: 'bold' }}>{' '}{showDateRange.length > 0 ? showDateRange : 'Filter Date'}</Text>
                    </TouchableOpacity>
                    {showDateRange.length > 0 ? <>
                        <TouchableOpacity onPress={() => clearCalendar()}>
                            <AntDesign name='close' size={16} />
                        </TouchableOpacity>
                    </> : null}
                </View>
            </View>
        )
    }

    const Body = ({ id, assigned_at, company, transmittal_no }: any) => {
        return (
            <List style={styles.cardStyle}>
                <ListItem
                    noIndent
                    onPress={() => viewDetailsHandler(transmittal_no, id, currentTab, '')}
                    noBorder style={styles.cardUncheckedStyle}
                >
                    <Left style={{ flex: 0.5 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '100%', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 12 }}>{assigned_at}</Text>
                                <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: 16, fontWeight: '500' }}>{company}</Text>
                            </View>
                        </View>
                    </Left>
                    <Right style={{ flex: 0.5 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center', width: '80%' }}>
                                <Text style={{ fontSize: 12, textAlign: 'right' }}>Transmittal No.</Text>
                                <Text style={{ fontSize: 16, textAlign: 'right', fontWeight: "normal" }}>{transmittal_no}</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '20%' }}>
                                <AntDesign name='right' style={{ color: '#2F3542' }} size={20} />
                            </View>
                        </View>
                    </Right>
                </ListItem>
            </List>
        );
    }

    useEffect(() => {
        function getHistory() {
            // Dispatch History
            setFetchHistory(false)
            if (auth.connection.status) dispatch(getHistoryList())
        }

        if (fetchHistory) getHistory()
    }, [])

    useFocusEffect(() => {
        const backAction = () => {
            closeHistoryHandler()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    return (
        <Container style={{ backgroundColor: '#F4F6F9' }}>
            <HeaderComponent
                currentPage='history'
                searchText={searchText}
                searchCLoseHandler={searchCLoseHandler}
                searchTextHandler={searchTextHandler}
                setSearchBar={setSearchBar}
                searchBar={searchBar}
                setSearchText={setSearchText}
                notAllowedBtnBack={notAllowedBtnBack}
                closeUserProfileHandler={closeHistoryHandler}
                searchHistoryHandler={searchHistoryHandler}
                closeSearchHandler={closeSearchHandler}
            />
            {auth.connection.status ? acceptance.intransit.offMode.intransit.length > 0 ? <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                <Text style={{ textAlign: 'center', fontSize: 12 }}>Syncing...</Text>
            </View> : null : <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                    <Text style={{ textAlign: 'center', fontSize: 12 }}>You're offline</Text>
                </View>}
            {
                showDateRangePicker ? <DateRangePickerScreen
                    getdateFrom={getdateFrom}
                    getdateTo={getdateTo}
                    closedCalendar={closeDatePickerHandler}
                    setDateFrom={setDateFrom}
                    setDateTo={setDateTo}
                    cancelCalendar={cancelCalendar}
                    clearCalendar={clearCalendar}
                />
                    : null}
            {
                auth.connection.status ?
                    (<><Header />
                        {auth.connection.status ? fetchHistory || (acceptance.isLoading && acceptance.history.request.length === 0) ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <LoadingComponent />
                            </View>
                            :
                            acceptance.history.request.length > 0 ?
                                <FlatList
                                    refreshing={acceptance.history.request.length === 0 && acceptance.isLoading ? true : false}
                                    onRefresh={onRefresh}
                                    onScroll={scrolledFlatlist}
                                    style={{ paddingLeft: 10, paddingRight: 10, backgroundColor: '#F4F6F9' }}
                                    data={acceptance.history.request}
                                    renderItem={({ item }) => (
                                        <Body
                                            id={item.id}
                                            assigned_at={item.assigned_at}
                                            company={item.company}
                                            transmittal_no={item.transmittal_no}
                                        />
                                    )
                                    }
                                    keyExtractor={item => item.id}
                                    ListFooterComponent={acceptance.isLoading ?
                                        <LoadingComponent />
                                        :
                                        <View style={{ height: 80 }}></View>
                                    }
                                    onEndReached={({ distanceFromEnd }) => endReachedHandler(distanceFromEnd)}
                                    onEndReachedThreshold={0.4}
                                />
                                :
                                (
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text>
                                            No results found
                            </Text>
                                    </View>)
                            :
                            acceptance.history.request.length > 0 ?
                                <FlatList
                                    refreshing={acceptance.history.request.length === 0 && acceptance.isLoading ? true : false}
                                    onRefresh={onRefresh}
                                    onScroll={scrolledFlatlist}
                                    style={{ paddingLeft: 10, paddingRight: 10, backgroundColor: '#F4F6F9' }}
                                    data={acceptance.history.request}
                                    renderItem={({ item }) => <Body id={item.id} assigned_at={item.assigned_at} company={item.company} transmittal_no={item.transmittal_no} />}
                                    keyExtractor={item => item.id}
                                    ListFooterComponent={acceptance.isLoading ? <LoadingComponent /> : <View style={{ height: 80 }}></View>}
                                    onEndReached={({ distanceFromEnd }) => endReachedHandler(distanceFromEnd)}
                                    onEndReachedThreshold={0.4}
                                />
                                :
                                (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>
                                        The page is not available
                            </Text>
                                </View>)}</>) : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>
                            The page is not available
                    </Text>
                    </View>
            }
            {/* <Content style={{ backgroundColor: '#E5E5E5' }} padder refreshControl={
                <RefreshControl  />
            }> */}
            {}
            {/* </Content > */}
        </Container >
    )
}

const styles = StyleSheet.create({
    viewStyleForLine: {
        borderBottomColor: "#E0E6ED",
        borderBottomWidth: 1,
        alignSelf: 'stretch',
        width: "100%"
    },
    cardStyle: {
        marginTop: 8
    },
    cardUncheckedStyle: {
        backgroundColor: '#FFFFFF',
        paddingLeft: 20,
        borderRadius: 10,
        height: 82,
        paddingRight: 10,
        paddingTop: 16,
        paddingBottom: 16,
        elevation: 1
    },
    topContainer: {
        width: '100%',
    },
    filterDate: {
        height: 36,
        borderRadius: 10,
        paddingRight: 10,
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        elevation: 1,
        marginBottom: 8,
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default History
