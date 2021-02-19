import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, FlatList, BackHandler } from 'react-native'
import { Container, Header, ActionSheet, Left, Body, Right, Title, Subtitle, Button, Content, Card, CardItem, Text, Grid, Col, View, Footer, FooterTab, Badge, Spinner, Toast, CheckBox, List, ListItem } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { RootState } from '../store/modules/combinedReducers';
import { useSelector, useDispatch } from 'react-redux';
import { AntDesign } from '@expo/vector-icons'
import { Modalize } from 'react-native-modalize';

import { clearBundledDetails } from '../store/modules/dashboard/action';
import * as ACCEPTANCE from '../store/modules/dashboard/action'
import * as TABSCOUNT from '../store/modules/tabscount/action'
import FooterComponent from '../components/footer';
import HeaderComponent from '../components/header';
import ActionComponent from '../components/action';
import LoadingComponent from '../components/loading';
import { any } from 'prop-types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { REQUEST_TYPE_TEXT } from '../utils/Constants';

const BundledDetails = ({ route, navigation }) => {
    const modalizeRef = useRef<Modalize>(null);
    const dispatch = useDispatch()
    const { company, transmital_count, currentTab, transmittal_key, bundledType, contactPerson } = route.params;
    const [requestList, setRequestList] = useState({
        requestor_name: company,
        requests: []
    })
    const auth = useSelector((state: RootState) => state.auth)
    const acceptance = useSelector((state: RootState) => state.acceptance)
    const [allowedBtnChangeStatus, setAllowedBtnChangeStatus] = useState(true)
    const [disabledBtnAccept, setDisabledBtnAccept] = useState(false)
    const [notAllowedBtnBack, setNotAllowedBtnBack] = useState(false)
    const [btnTrigger, setBtnTrigger] = useState(false)
    const [refreshtabs, setRefreshtabs] = useState(false)
    const [refreshBundledList, setRefreshBundledList] = useState(true)
    const [delayToShowList, setDelayToShowList] = useState(true)

    const closeRequestDetailsHandler = () => {
        if (!notAllowedBtnBack) {
            setNotAllowedBtnBack(state => !state)
            dispatch(clearBundledDetails())
            navigation.goBack()
        }
    }

    const selectChangeHandler = (requestName: any, checked: boolean) => {
        dispatch(ACCEPTANCE.clearResponse())
        console.log(requestName, checked)
        if (acceptance.bundledDetails.request.length > 0) {
            let prevRequestList = acceptance.bundledDetails
            if (checked) { checked = false } else { checked = true; }

            let { request, allChecked } = prevRequestList;
            if (requestName === "checkAll") {
                allChecked = checked;
                request = request.map(request => ({ ...request, isChecked: checked }));
            } else {
                request = request.map(request =>
                    request.id === requestName ? { ...request, isChecked: checked } : request
                );

                allChecked = request.every(request => request.isChecked);
            }

            dispatch(ACCEPTANCE.selectBundledDetailsTrigger({ request, allChecked }));
        }
    }

    const changeStatusButtonSelectedHandler = () => {
        // dispatch(ACCEPTANCE.clearListingsIntransit())
        let request_id = []
        acceptance.bundledDetails.request.map(request => {
            if (request.isChecked) {
                request_id = [...request_id, request.id]
            }
        }
        );
        setRequestList({
            ...requestList,
            requests: request_id,
        })

        setDisabledBtnAccept(true)

        // Change Status
        // dispatch(ACCEPTANCE.acceptRequest(request_selected))
    }

    const showToastHandler = (text: any) => {
        console.log(text)
        setRefreshtabs(state => !state)
        dispatch(ACCEPTANCE.clearMessage())
        Toast.show({
            text: text,
            buttonText: "Okay",
            duration: 3000
        })
    }

    const viewDetailsHandler = (transmittal_no: any, id: any, currentTab: any, transmittal_key: any) => {
        dispatch(ACCEPTANCE.clearResponse())
        dispatch(ACCEPTANCE.viewDetails(id, true, false))
        navigation.push('RequestDetails', {
            transmittalNo: transmittal_no,
            currentTab: currentTab,
            btnFooter: true,
            transmittal_key: transmittal_key
        })
    }

    const EmptyComponent = () => {
        return (
            <Text>No results found</Text>
        )
    }

    const actionChangeStateHandler = () => {
        modalizeRef.current?.close('default');
        console.log('Action Closed')
    }

    const delayToShowListHandler = () => {
        setTimeout(() => { setDelayToShowList(state => !state) }, 1000)
    }

    const viewActionComponent = () => {
        setDisabledBtnAccept(false)
        console.log('Action Open')
        modalizeRef.current?.open();
    }

    const BodyBundled = ({ intransit, transmittal_key }: any) => {
        return (
            <List style={styles.cardStyle}>
                <ListItem noIndent onPress={() => viewDetailsHandler(intransit.transmittal_no, intransit.id, currentTab, transmittal_key)} noBorder style={intransit.isChecked ? styles.cardCheckedStyle : styles.cardUncheckedStyle}>
                    {/* <TouchableOpacity style={{ width: '100%' }}> */}
                    {!!intransit.action_change ? <>{intransit ? intransit.is_urgent ?
                        <View style={{ position: 'absolute', top: 0, left: 0, height: 20, backgroundColor: '#FA5656', borderTopLeftRadius: 10, borderBottomRightRadius: 10, width: 62, alignItems: 'center' }}>
                            <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Urgent</Text>
                        </View> : null : null}
                        <View style={{ position: 'absolute', top: 2, right: 10, height: 20, alignItems: 'center', flexDirection: 'row' }}>
                            <AntDesign name='warning' style={{ color: '#FA5656' }} size={12} /><Text style={{ color: '#FA5656', fontSize: 10 }}>{' '}Queued for syncing</Text>
                        </View>
                        <Left style={{ flex: 0.5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '100%', justifyContent: 'center' }}>
                                    {/* <TouchableOpacity onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab)}> */}
                                    <Text style={{ fontSize: 12 }}>{intransit.assigned_at}</Text>
                                    <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: 16, fontWeight: '500' }}>{intransit.company}</Text>
                                    {/* </TouchableOpacity> */}
                                </View>
                            </View>
                        </Left>
                        <Right style={{ flex: 0.5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ justifyContent: 'center', width: '80%' }}>
                                    {/* <TouchableOpacity onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab)}> */}
                                    <Text style={{ fontSize: 12, textAlign: 'right' }}>Transmittal No.</Text>
                                    <Text style={{ fontSize: 16, textAlign: 'right', fontWeight: "normal" }}>{intransit.transmittal_no}</Text>
                                    {/* </TouchableOpacity> */}
                                </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center', width: '20%' }}>
                                    {/* <Button transparent onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab)}> */}
                                    <AntDesign name='right' style={{ color: '#2F3542' }} size={20} />
                                    {/* </Button> */}
                                </View>
                            </View>
                        </Right></> : <>{intransit.is_urgent ?
                            <View style={{ position: 'absolute', height: 20, top: 0, left: 0, backgroundColor: '#FA5656', borderTopLeftRadius: 10, borderBottomRightRadius: 10, width: 62, alignItems: 'center' }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Urgent</Text>
                            </View> : null}
                            <Left style={{ flex: 0.5 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '25%', justifyContent: 'center' }}>
                                        <CheckBox color={intransit.isChecked ? "#41B67F" : "#2F3542"} onPress={event => selectChangeHandler(intransit.id, intransit.isChecked)} checked={intransit.isChecked} />
                                    </View>
                                    <View style={{ width: '75%', justifyContent: 'center' }}>
                                        {/* <TouchableOpacity onPress={() => viewDetailsHandler(intransit.transmittal_no, intransit.id, currentTab)}> */}
                                        <Text style={{ fontSize: 12 }}>{intransit.assigned_at}</Text>
                                        <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: 16, fontWeight: '500' }}>{intransit.company}</Text>
                                        {/* </TouchableOpacity> */}
                                    </View>
                                </View>
                            </Left>
                            <Right style={{ flex: 0.5 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ justifyContent: 'center', width: '80%' }}>
                                        {/* <TouchableOpacity onPress={() => viewDetailsHandler(intransit.transmittal_no, intransit.id, currentTab)}> */}
                                        <Text style={{ fontSize: 12, textAlign: 'right' }}>Transmittal No.</Text>
                                        <Text style={{ fontSize: 16, textAlign: 'right', fontWeight: "normal" }}>{intransit.transmittal_no}</Text>
                                        {/* </TouchableOpacity> */}
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '20%' }}>
                                        {/* <Button transparent onPress={() => viewDetailsHandler(intransit.transmittal_no, intransit.id, currentTab)}> */}
                                        <AntDesign name='right' style={{ color: '#2F3542' }} size={20} />
                                        {/* </Button> */}
                                    </View>
                                </View>
                            </Right></>}
                    {/* </TouchableOpacity> */}
                </ListItem>
            </List>
        )
    }

    useEffect(() => {
        function selectHandler() {
            if (acceptance.bundledDetails.request.length > 0) {
                const haveChecked = acceptance.bundledDetails.request.some(requestChecked => requestChecked.isChecked === true)
                setAllowedBtnChangeStatus(!haveChecked)
                // console.log('Request List', requestList)
            }
        }

        function tabsCountRefresh() {
            setRefreshtabs(state => !state)
            if (auth.connection.status) dispatch(TABSCOUNT.getTabCount())
        }

        function viewBundledDetials(transmittal_key: any) {
            setRefreshBundledList(false)
            dispatch(ACCEPTANCE.bundledDetails(transmittal_key))
            delayToShowListHandler()
        }

        selectHandler()
        if (refreshtabs) tabsCountRefresh()
        if (disabledBtnAccept) viewActionComponent()
        if (acceptance.bundledDetails.response.status.length > 0) actionChangeStateHandler()
        if (refreshBundledList) viewBundledDetials(transmittal_key)
    }, [acceptance.bundledDetails, disabledBtnAccept, refreshtabs, refreshBundledList])

    useEffect(() => {
        const backAction = () => {
            closeRequestDetailsHandler()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    return (
        <>
            <Container style={{ backgroundColor: '#F4F6F9' }}>
                <HeaderComponent 
                    headerSubTitle={`${acceptance.bundledDetails.request.length} Transmittal`} 
                    headerTitle={company}
                    notAllowedBtnBack={notAllowedBtnBack} 
                    currentPage='bundleddetails' 
                    headerBtnCloseFunction={closeRequestDetailsHandler} 
                />
                {auth.connection.status ? acceptance.intransit.offMode.intransit.length > 0 ? <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                    <Text style={{ textAlign: 'center', fontSize: 12 }}>Syncing...</Text>
                </View> : null : <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                        <Text style={{ textAlign: 'center', fontSize: 12 }}>You're offline</Text>
                    </View>}
                {delayToShowList || acceptance.isLoading ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <View style={{ marginTop: '50%' }}> */}
                        <LoadingComponent />
                        {/* </View> */}
                    </View> : !!acceptance.bundledDetails.request && (acceptance.bundledDetails.request.length > 0) ?
                        <Content padder>
                            <Grid style={styles.topContainer}>
                                <Col style={{ width: '50%' }}>
                                    <View style={styles.selectAll}>
                                        <View>
                                            <CheckBox color={acceptance.bundledDetails.allChecked ? "#41B67F" : "#2F3542"} checked={acceptance.bundledDetails.allChecked} onPress={event => selectChangeHandler("checkAll", acceptance.bundledDetails.allChecked)} />
                                        </View>
                                        <View>
                                            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Select All</Text>
                                        </View>
                                    </View>
                                </Col>
                                <Col style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <View>
                                        <Badge style={{ backgroundColor: '#F8B344', height: 30, justifyContent: 'center', borderRadius: 4 }}>
                                            <Text>For {REQUEST_TYPE_TEXT[bundledType].text}</Text>
                                        </Badge>
                                    </View>
                                </Col>
                            </Grid>
                            <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 5, }}>
                                <Text style={{ fontSize: 12, fontWeight: 'normal' }}>Contact Person:{' '}</Text>
                                <Text style={{ fontSize: 12, fontWeight: 'normal', textTransform: 'capitalize' }}>{contactPerson}</Text>
                            </View>
                            {/* {acceptance.bundledDetails.request.map((request, index) => ( */}
                            {/* <Grid style={styles.cardStyle} key={index}>
                                 <Grid style={request.isChecked ? styles.cardCheckedStyle : styles.cardUncheckedStyle}>
                                     {request.is_urgent ?
                                         <View style={{ position: 'absolute', height: 20, backgroundColor: '#FA5656', borderTopLeftRadius: 10, borderBottomRightRadius: 10, width: 62, alignItems: 'center' }}>
                                             <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Urgent</Text>
                                         </View> : null}
                                     <Col style={{ width: '12%', justifyContent: 'center' }}>
                                         <CheckBox color={request.isChecked ? "#41B67F" : "#2F3542"} onPress={event => selectChangeHandler(request.id, request.isChecked)} checked={request.isChecked} />
                                     </Col>
                                     <Col style={{ width: '40%', justifyContent: 'center' }}>
                                         <TouchableOpacity onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab)}>
                                             <Text style={{ fontSize: 12 }}>{request.assigned_at}</Text>
                                             <Text ellipsizeMode='tail' numberOfLines={1} style={{ fontSize: 16, fontWeight: '500' }}>{request.company}</Text>
                                         </TouchableOpacity>
                                     </Col>
                                     <Col style={{ width: '40%', justifyContent: 'center' }}>
                                         <TouchableOpacity onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab)}>
                                             <Text style={{ fontSize: 12, textAlign: 'right' }}>Transmittal No.</Text>
                                             <Text style={{ fontSize: 16, textAlign: 'right', fontWeight: 'normal' }}>{request.transmittal_no}</Text>
                                         </TouchableOpacity>
                                     </Col>
                                     <Col style={{ justifyContent: 'center', paddingLeft: 5 }}>
                                         <Button transparent onPress={() => viewDetailsHandler(request.transmittal_no, request.id, currentTab)}>
                                             <AntDesign name='right' style={{ color: '#2F3542' }} size={20} />
                                         </Button>
                                     </Col>
                                 </Grid>
                             </Grid> */}
                            {/* ))} */}
                            <FlatList
                                // ListHeaderComponent={<HeaderIntransit />}
                                refreshing={acceptance.bundledDetails.request.length === 0 && acceptance.isLoading ? true : false}
                                style={{ backgroundColor: '#F4F6F9' }}
                                data={acceptance.bundledDetails.request}
                                contentContainerStyle={acceptance.bundledDetails.request.length === 0 ? styles.emptyComponent : null}
                                ListEmptyComponent={<EmptyComponent />}
                                renderItem={({ item }) => <BodyBundled intransit={item} transmittal_key={transmittal_key} />}
                                keyExtractor={intransit => intransit.key}
                            // ListFooterComponent={acceptance.isLoading && acceptance.bundledDetails.request.length > 0 ? <LoadingComponent /> : <View style={{ height: 80 }}></View>}
                            // onEndReached={({ distanceFromEnd }) => endReachedIntransitHandler(distanceFromEnd)}
                            // onEndReachedThreshold={0.5}
                            />
                        </Content > :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>
                                No results found
                        </Text>
                        </View>
                }
                {acceptance.bundledDetails.request.length === 0 ? null : <FooterComponent notAllowedBtn={allowedBtnChangeStatus} buttonTitle='Change Status' btnFunction={changeStatusButtonSelectedHandler} />}
            </Container >
            <ActionComponent navigation={navigation} requestList={requestList} transmittal_key={transmittal_key} requestType={bundledType} modalizeRef={modalizeRef} />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navigationBorder: {
        backgroundColor: '#F4F6F9',
    },
    navigationButton: {
        height: 50,
        borderWidth: 2,
        borderRadius: 10,
        borderStyle: 'solid',
        borderColor: '#E0E6ED',
    },
    buttonAccept: {
        backgroundColor: '#41B67F'
    },
    disabledButtonAccept: {
        backgroundColor: '#9dd6bd'
    },
    topContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    selectAll: {
        height: 36,
        width: 117,
        borderRadius: 10,
        paddingTop: 9,
        paddingRight: 10,
        paddingBottom: 9,
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        elevation: 1,
        marginBottom: 8,
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
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
    emptyComponent: {
        flexGrow: 1, justifyContent: 'center', alignItems: 'center'
    },
});

export default BundledDetails
