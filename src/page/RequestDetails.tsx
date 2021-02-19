import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Image, BackHandler, ToastAndroid } from 'react-native'
import { Container, Body, Content, Card, CardItem, Text, Grid, Col, View, Badge } from 'native-base'
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'
import { RootState } from '../store/modules/combinedReducers';
import { useSelector, useDispatch } from 'react-redux';
import { REQUEST_ITEM_TYPE, TRACKING_STATUS } from '../utils/Constants';
import { uriImage } from '../utils/config';
import { Modalize } from 'react-native-modalize';
import { AntDesign } from '@expo/vector-icons'
import moment from "moment";
moment.locale("en");

import * as ACCEPTANCE from '../store/modules/dashboard/action'
import HeaderComponent from '../components/header';
import ActionComponent from '../components/action';
import FooterComponent from '../components/footer';
import { bool } from 'prop-types';
import LoadingComponent from '../components/loading';

// import { useToast } from 'react-native-styled-toast'
import { default as NumberFormat } from 'react-number-format';

const RequestDetails = ({ route, navigation }) => {
    // const { toast } = useToast()
    const modalizeRef = useRef<Modalize>(null);
    const dispatch = useDispatch()
    const auth = useSelector((state: RootState) => state.auth)
    const { transmittalNo, currentTab, btnFooter, setRefreshtabs, transmittal_key } = route.params;
    const acceptance = useSelector((state: RootState) => state.acceptance)
    const [allowedBtnAccept, setAllowedBtnAccept] = useState(true)
    const [disabledBtnAccept, setDisabledBtnAccept] = useState(false)
    const [notAllowedBtnBack, setNotAllowedBtnBack] = useState(false)
    const [requestType, setRequestType] = useState(0)
    const [requestList, setRequestList] = useState({})
    const [toastProceed, setToastProceed] = useState(true)

    const [buttonAction, setButtonAction] = useState({})
    const buttonActionHandler = (buttonIndex: any) => {
        setButtonAction({ clicked: actionSheetButton[buttonIndex] });
    }
    const actionSheetButton = [
        { text: "Delivered", icon: "arrow-right" },
        { text: "Not Delivered", icon: "arrow-right" },
        { text: "Cannot Deliver", icon: "arrow-right" }
    ];
    const DESTRUCTIVE_INDEX = 3;
    const CANCEL_INDEX = 4;

    // console.log('Request Details: ', acceptance.details)
    const closeRequestDetailsHandler = () => {
            dispatch(ACCEPTANCE.clearDetails())
            if (auth.connection.status) {
                dispatch(ACCEPTANCE.getNotifCount())
            }
            navigation.goBack()
    }

    const buttonFunction = (id: any) => {
        setDisabledBtnAccept(state => !state)
        let request_selected = {
            requestor_name: acceptance.details.requestor_name,
            requests: [id],
        }

        if (currentTab === 'intransit') {
            setRequestList(request_selected)
            modalizeRef.current?.open();
        } else {
            dispatch(ACCEPTANCE.clearListings())
            dispatch(ACCEPTANCE.acceptRequest(request_selected))
            setRefreshtabs(true)
        }
    }

    const showToastHandler = (text: any) => {
        setToastProceed(false)
        console.log(text)
        dispatch(ACCEPTANCE.clearMessage())
        // toast({ message: text })
        ToastAndroid.showWithGravity(
            text,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
        setAllowedBtnAccept(state => !state)
    }

    const setActionBtnHandler = () => {
        setRequestType(acceptance.details.request_type)
    }

    const requestStringHandler = (requestDepartment) => {
        let request_dept = requestDepartment.split(' ')
        let first_space = request_dept.slice(0, 2).join(' ')
        let second_space = request_dept.slice(2).join(' ')

        return first_space + '\n' + second_space
    }

    const capitalizeReason = (reason) => {
        return reason.charAt(0).toUpperCase() + reason.slice(1);
    }

    useEffect(() => {
        if (Object.keys(acceptance.details).length > 0) setActionBtnHandler()
        if (acceptance.bundledDetails.response.status.length > 0) modalizeRef.current?.close();
    }, [acceptance.details, acceptance.bundledDetails.response])

    useEffect(() => {
        if (acceptance.message.length > 0 && toastProceed) showToastHandler(acceptance.message)
    }, [acceptance.message])

    useEffect(() => {
        if (!auth.connection.status) setDisabledBtnAccept(true);
        else setDisabledBtnAccept(false)
    }, [auth.connection.status])

    useFocusEffect(() => {
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
            <HeaderComponent
                currentPage='requestdetails'
                notAllowedBtnBack={notAllowedBtnBack}
                headerBtnCloseFunction={closeRequestDetailsHandler}
                headerTitle='Transmittal No.'
                headerSubTitle={transmittalNo}
            />
            <Container style={{ backgroundColor: '#F4F6F9' }}>
                {/* <Content padder> */}
                {auth.connection.status ? acceptance.intransit.offMode.intransit.length > 0 ? <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                    <Text style={{ textAlign: 'center', fontSize: 12 }}>Syncing...</Text>
                </View> : null : <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                        <Text style={{ textAlign: 'center', fontSize: 12 }}>You're offline</Text>
                    </View>}
                {!!acceptance.details ? <>{acceptance.isLoading && (Object.keys(acceptance.details).length === 0) ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {/* <View style={{ backgroundColor: '#000000' }}> */}
                    <LoadingComponent />
                    {/* </View> */}
                </View> : acceptance.details ? <Content padder>
                    {currentTab === 'history' ?
                        <Grid>
                            <Col>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Badge style={{ backgroundColor: acceptance.details.tracking_status === 6 || acceptance.details.tracking_status === 7 ? '#1DD28B' : '#FA5656', height: 30, justifyContent: 'center', borderRadius: 4 }}>
                                        <Text>{acceptance.details.tracking_status_label}</Text>
                                    </Badge>
                                    <Text>
                                        {!!acceptance.details && !!acceptance.details.tracking_status && Object.keys(acceptance.details.tracking_status_details).length > 0 ? !!acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status] ? `${moment(acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status].date).format('MMMM DD, YYYY')} at ${moment(acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status].date).format('hh:mm A')}` : !!acceptance.details.tracking_status_details.date ? `${moment(acceptance.details.tracking_status_details.date).format('MMMM DD, YYYY')}  at ${moment(acceptance.details.tracking_status_details.date).format('hh:mm A')}` : null : null}
                                    </Text>
                                </View>
                            </Col>
                        </Grid> : !!acceptance.details.action_change ?
                            <Grid>
                                <Col>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Badge style={{ backgroundColor: acceptance.details.action_change.action_code > 0 ? '#FA5656' : '#1DD28B', height: 30, justifyContent: 'center', borderRadius: 4 }}>
                                            <Text>{acceptance.details.action_change.action_label}</Text>
                                        </Badge>
                                        <View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                <AntDesign name='warning' style={{ color: '#FA5656' }} size={12} />
                                                <Text style={{ fontSize: 14, textAlign: 'right', color: '#FA5656' }}>
                                                    {' '}Queued for syncing
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 14, textAlign: 'right' }}>
                                                {!!acceptance.details && !!acceptance.details.action_change && !!acceptance.details.action_change.action_date ? `${moment(acceptance.details.action_change.action_date).format('MMMM DD, YYYY')} at ${moment(acceptance.details.action_change.action_date).format('hh:mm A')}` : null}
                                            </Text>
                                        </View>
                                    </View>
                                </Col>
                            </Grid>
                            : acceptance.details.is_urgent ? acceptance.details.is_urgent === 1 ? <Badge style={{ width: 81, backgroundColor: '#FA5656', height: 30, justifyContent: 'center', borderRadius: 4 }}>
                                <Text>Urgent</Text>
                            </Badge> : null : null}
                    {currentTab === 'history' ? acceptance.details.tracking_status > 7 ? <Card style={{ marginTop: 10 }}>
                        <CardItem header bordered>
                            <Text style={{ color: '#2F3542', fontWeight: 'bold' }}>Reason</Text>
                        </CardItem>
                        <CardItem bordered>
                            <Body>
                                {/* <Grid>
                                    <Col> */}
                                <Text>
                                    {!!acceptance.details.tracking_status ? !!acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status] ?
                                        <>{!!acceptance.details.tracking_status ?
                                            !!acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status] ?
                                                acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status].reason.length > 0 ?
                                                    <Text>{capitalizeReason(acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status].reason)}</Text> : <Text>{'N/A'}</Text> : null : null}
                                            {!!acceptance.details.tracking_status ? !!acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status] ? !!acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status].others ? acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status].others.length > 0 ? <Text>{' - '}{acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status].others}</Text> : <Text>{' - N/A'}</Text> : null : null : null}
                                        </> : <Text>
                                            {!!acceptance.details.tracking_status_details.reason ? capitalizeReason(acceptance.details.tracking_status_details.reason) : 'N/A'}
                                        </Text> : null}
                                </Text>
                                {/* </Col>
                                </Grid> */}
                            </Body>
                        </CardItem>
                    </Card> : acceptance.details.tracking_status === 7 || acceptance.details.tracking_status === 6 ? <Card style={{ marginTop: 10 }}>
                        <CardItem header bordered>
                            <Text style={{ color: '#2F3542', fontWeight: 'bold' }}>Attachments</Text>
                        </CardItem>
                        <CardItem bordered>
                            <Body>
                                <Grid>
                                    <Col>
                                        <Text style={{ color: '#A5B0BE' }}>
                                            Name
                                        </Text>
                                    </Col>
                                    <Col>
                                        <Text style={{ textAlign: 'right' }}>
                                            {acceptance.details.tracking_status_details ? !!acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status] ? !!acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status].name ? acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status].name : null : null : null}
                                        </Text>
                                    </Col>
                                </Grid>
                                <Grid style={{ marginTop: 10 }}>
                                    <Col>
                                        <Text style={{ color: '#A5B0BE', marginBottom: 10 }}>
                                            E-Signature
                                            </Text>
                                        <View style={{ height: 100 }}>
                                            {acceptance.details.tracking_status_details ? <Image source={{ uri: `${uriImage}/${acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status].files.signature}` }} style={{ height: '100%' }} /> : null}
                                        </View>
                                    </Col>
                                </Grid>
                                <Grid style={{ marginTop: 10 }}>
                                    <Col>
                                        <Text style={{ color: '#A5B0BE', marginBottom: 10 }}>
                                            Proof of Delivery
                                            </Text>
                                        <View>
                                            {acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status].files.photo ? <Image source={{ uri: `${uriImage}/${acceptance.details.tracking_status_details[TRACKING_STATUS[acceptance.details.tracking_status].status].files.photo}` }} style={{ width: '100%', aspectRatio: 1, height: undefined }} /> : <Text style={{ textAlign: 'center', marginTop: 20, marginBottom: 20 }}>No Image Available</Text>}
                                        </View>
                                    </Col>
                                </Grid>
                            </Body>
                        </CardItem>
                    </Card> : null : null}
                    {!!acceptance.details.action_change ?
                        acceptance.details.action_change.action_code > 0 ?
                            <Card style={{ marginTop: 10 }}>
                                <CardItem header bordered>
                                    <Text style={{ color: '#2F3542', fontWeight: 'bold' }}>Reason</Text>
                                </CardItem>
                                <CardItem bordered>
                                    <Body>
                                        {/* <Grid>
                                    <Col> */}
                                        <Text>
                                            {!!acceptance.details.action_change.details ?
                                                acceptance.details.action_change.details.reason.length > 0 ? <>
                                                    <Text style={{ textTransform: 'capitalize' }}>{acceptance.details.action_change.details.reason.replace(/_/g, ' ')}</Text>{!!acceptance.details.action_change.details.others ? acceptance.details.action_change.details.others.length > 0 ? <Text>{' - '}{acceptance.details.action_change.details.others}</Text> : 'N/A' : ''}
                                                </> : 'N/A'
                                                : null}
                                        </Text>
                                        {/* </Col>
                                </Grid> */}
                                    </Body>
                                </CardItem>
                            </Card> : <Card style={{ marginTop: 10 }}>
                                <CardItem header bordered>
                                    <Text style={{ color: '#2F3542', fontWeight: 'bold' }}>Attachments</Text>
                                </CardItem>
                                <CardItem bordered>
                                    <Body>
                                        <Grid>
                                            <Col>
                                                <Text style={{ color: '#A5B0BE' }}>
                                                    Name
                                        </Text>
                                            </Col>
                                            <Col>
                                                <Text style={{ textAlign: 'right' }}>
                                                    {!!acceptance.details.action_change ? !!acceptance.details.action_change.details ? !!acceptance.details.action_change.details.name ? acceptance.details.action_change.details.name : null : null : null}
                                                </Text>
                                            </Col>
                                        </Grid>
                                        <Grid style={{ marginTop: 10 }}>
                                            <Col>
                                                <Text style={{ color: '#A5B0BE', marginBottom: 10 }}>
                                                    E-Signature
                                            </Text>
                                                <View style={{ height: 100 }}>
                                                    {!!acceptance.details.action_change ? <Image source={{ uri: `${acceptance.details.action_change.details.signature}` }} style={{ height: '100%' }} /> : null}
                                                </View>
                                            </Col>
                                        </Grid>
                                        <Grid style={{ marginTop: 10 }}>
                                            <Col>
                                                <Text style={{ color: '#A5B0BE', marginBottom: 10 }}>
                                                    Proof of Delivery
                                            </Text>
                                                <View>
                                                    {!!acceptance.details.action_change ? !!acceptance.details.action_change.details.photo ? <Image source={{ uri: `${acceptance.details.action_change.details.photo}` }} style={{ width: '100%', aspectRatio: 1, height: undefined }} /> : <Text style={{ textAlign: 'center', marginTop: 20, marginBottom: 20 }}>No Image Available</Text> : <Text style={{ textAlign: 'center', marginTop: 20, marginBottom: 20 }}>No Image Available</Text>}
                                                </View>
                                            </Col>
                                        </Grid>
                                    </Body>
                                </CardItem>
                            </Card>
                        : null}
                    <Card style={{ marginTop: 10 }}>
                        <CardItem header bordered>
                            <Text style={{ color: '#2F3542', fontWeight: 'bold' }}>Company Details</Text>
                        </CardItem>
                        <CardItem bordered>
                            <Body>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    {/* <Col> */}
                                    <Text style={{ color: '#A5B0BE' }}>
                                        Name
                                        </Text>
                                    {/* </Col> */}
                                    {/* <Col> */}
                                    <Text style={{ textAlign: 'right' }}>
                                        {acceptance.details.requestor_name ? acceptance.details.company.name : null}
                                    </Text>
                                    {/* </Col> */}
                                </View>
                                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    {/* <Col> */}
                                    <Text style={{ color: '#A5B0BE' }}>
                                        Contact Person
                                        </Text>
                                    {/* </Col> */}
                                    {/* <Col> */}
                                    <Text style={{ textAlign: 'right' }}>
                                        {acceptance.details.company ? acceptance.details.company.contact_person ? acceptance.details.company.contact_person : null : null}
                                    </Text>
                                    {/* </Col> */}
                                </View>
                                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    {/* <Col> */}
                                    <Text style={{ color: '#A5B0BE' }}>
                                        Contact Number
                                        </Text>
                                    {/* </Col> */}
                                    {/* <Col> */}
                                    <Text style={{ textAlign: 'right' }}>
                                        {acceptance.details.company ? acceptance.details.company.contact_number ? acceptance.details.company.contact_number : null : null}
                                    </Text>
                                    {/* </Col> */}
                                </View>
                                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    {/* <Col> */}
                                    <Text style={{ color: '#A5B0BE' }}>
                                        Department
                                        </Text>
                                    {/* </Col> */}
                                    {/* <Col> */}
                                    <Text style={{ textAlign: 'right' }}>
                                        {acceptance.details.company ? acceptance.details.company.department ? acceptance.details.company.department : 'N/A' : 'N/A'}
                                    </Text>
                                    {/* </Col> */}
                                </View>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card style={{ marginTop: 20 }}>
                        <CardItem header bordered>
                            <Text style={{ fontWeight: 'bold', color: '#2F3542' }}>Address</Text>
                        </CardItem>
                        <CardItem bordered>
                            <Body>
                                {/* <Grid>
                                    <Col> */}
                                <Text>
                                    {acceptance.details.address ? acceptance.details.address.unit ? `${acceptance.details.address.unit} ` : null : null}
                                    {acceptance.details.address ? acceptance.details.address.floor_no ? `${acceptance.details.address.floor_no}/F ` : null : null}
                                    {acceptance.details.address ? acceptance.details.address.building_name ? `${acceptance.details.address.building_name}, ` : null : null}
                                    {acceptance.details.address ? acceptance.details.address.street ? `${acceptance.details.address.street}, ` : null : null}
                                    {acceptance.details.address ? acceptance.details.address.barangay ? `${acceptance.details.address.barangay}, ` : null : null}
                                    {acceptance.details.address ? acceptance.details.address.city ? `${acceptance.details.address.city}, ` : null : null}
                                    {acceptance.details.address ? acceptance.details.address.province ? `${acceptance.details.address.province} ` : null : null}
                                    {acceptance.details.address ? acceptance.details.address.country ? `${acceptance.details.address.country}` : null : null}
                                    {acceptance.details.address ? acceptance.details.address.zip_code && (acceptance.details.address.zip_code > 0) ? `, ${acceptance.details.address.zip_code}` : null : null}
                                </Text>
                                {/* </Col> */}
                                {/* </Grid> */}
                            </Body>
                        </CardItem>
                    </Card>
                    <Card style={{ marginTop: 20 }}>
                        <CardItem header bordered>
                            <Text style={{ fontWeight: 'bold', color: '#2F3542' }}>Item Details</Text>
                        </CardItem>
                        <CardItem bordered>
                            <View style={{ width: '100%' }}>
                                {acceptance.details.item ? acceptance.details.item.items.length > 0 ? acceptance.details.item.items.map((request, index) => (
                                    <View key={index} style={{ width: '100%' }}>
                                        {index > 0 ? <View style={styles.viewStyleForLine}></View> : null}
                                        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                            {/* <Col> */}
                                            <Text style={{ color: '#A5B0BE' }}>
                                                Item for {acceptance.details.request_type_label}
                                            </Text>
                                            {/* </Col>
                                            <Col> */}
                                            <Text style={{ textAlign: 'right', width: '50%' }}>
                                                {request.type === 0 ? `Others - ${request.other}` : REQUEST_ITEM_TYPE[request.type].text}
                                            </Text>
                                            {/* </Col> */}
                                        </View>
                                        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                            {/* <Col> */}
                                            <Text style={{ color: '#A5B0BE' }}>
                                                No. of Item/s
                                                </Text>
                                            {/* </Col>
                                            <Col> */}
                                            <NumberFormat value={request.count} displayType={'text'} thousandSeparator={true} renderText={value => <Text style={{ textAlign: 'right' }}>{value}</Text>} />
                                            {/* </Col> */}
                                        </View>
                                    </View>
                                )) : null : null}
                                <View style={styles.viewStyleForLine}></View>
                                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    {/* <Col> */}
                                    <Text style={{ color: '#A5B0BE' }}>
                                        Expected {acceptance.details.request_type_label}
                                    </Text>
                                    {/* </Col>
                                    <Col> */}
                                    <Text style={{ textAlign: 'right' }}>
                                        {acceptance.details.item ? acceptance.details.item.expected_date : null}
                                    </Text>
                                    {/* </Col> */}
                                </View>
                                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    {/* <Col> */}
                                    <Text style={{ color: '#A5B0BE' }}>
                                        Urgent Request
                                        </Text>
                                    {/* </Col>
                                    <Col> */}
                                    <Text style={{ textAlign: 'right' }}>
                                        {acceptance.details.is_urgent_label}
                                    </Text>
                                    {/* </Col> */}
                                </View>
                            </View>
                        </CardItem>
                        {acceptance.details.is_urgent ? acceptance.details.is_urgent === 1 ?
                            <CardItem footer bordered>
                                <View>
                                    <Text style={{ color: '#A5B0BE' }}>Reason for Urgency</Text>
                                    <Text style={{ marginTop: 5 }}>{acceptance.details.reason_urgency}</Text>
                                </View>
                            </CardItem> : null
                            : null}
                    </Card>
                    <Card style={{ marginTop: 20 }}>
                        <CardItem header bordered>
                            <Text style={{ fontWeight: 'bold', color: '#2F3542' }}>Remarks</Text>
                        </CardItem>
                        <CardItem bordered>
                            <Body>
                                {/* <Grid>
                                    <Col> */}
                                <Text>
                                    {!!acceptance.details && !!acceptance.details.remarks ? acceptance.details.remarks.length > 0 ? acceptance.details.remarks : 'N/A' : 'N/A'}
                                </Text>
                                {/* </Col>
                                </Grid> */}
                            </Body>
                        </CardItem>
                    </Card>
                    <Card style={{ marginTop: 20 }}>
                        <CardItem header bordered>
                            <Text style={{ fontWeight: 'bold', color: '#2F3542' }}>Request Details</Text>
                        </CardItem>
                        <CardItem bordered>
                            <Body>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    {/* <Col> */}
                                    <Text style={{ color: '#A5B0BE' }}>
                                        Requestor
                                        </Text>
                                    {/* </Col>
                                    <Col> */}
                                    <Text style={{ textAlign: 'right' }}>
                                        {!!acceptance.details.requestor_name ? acceptance.details.requestor_name : null}
                                    </Text>
                                    {/* </Col> */}
                                </View>
                                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: acceptance.details.requestor_department_name ? (acceptance.details.requestor_department_name).length > 20 ? 43 : 20 : 20 }}>
                                    {/* <Col> */}
                                    <Text style={{ color: '#A5B0BE' }}>
                                        Requestor Dept.
                                        </Text>
                                    {/* </Col>
                                    <Col> */}
                                    <Text style={{ textAlign: 'right' }}>
                                        {!!acceptance.details.requestor_department_name ? requestStringHandler(acceptance.details.requestor_department_name) : null}
                                    </Text>
                                    {/* </Col> */}
                                </View>
                                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    {/* <Col> */}
                                    <Text style={{ color: '#A5B0BE' }}>
                                        HMO Partner
                                        </Text>
                                    {/* </Col>
                                    <Col> */}
                                    <Text style={{ textAlign: 'right' }}>
                                        {!!acceptance.details.requestor_hmo_partner_label ? acceptance.details.requestor_hmo_partner_label : null}
                                    </Text>
                                    {/* </Col> */}
                                </View>
                                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    {/* <Col> */}
                                    <Text style={{ color: '#A5B0BE' }}>
                                        Requested On
                                    </Text>
                                    {/* </Col> */}
                                    {/* <Col> */}
                                    <Text style={{ textAlign: 'right' }}>
                                        {moment(acceptance.details.created_at).format('MMMM DD, YYYY')} {'\n'}
                                        {moment(acceptance.details.created_at).format('h:mm:ss A')}
                                    </Text>
                                    {/* </Col> */}
                                </View>
                            </Body>
                        </CardItem>
                    </Card>
                </Content> : null}</> : <LoadingComponent />}
            </Container>
            {/* {auth.connection.status ?  */}
            {btnFooter ?
                currentTab === 'acceptance' ?
                    allowedBtnAccept ?
                        <FooterComponent notAllowedBtn={disabledBtnAccept} buttonTitle={currentTab === 'acceptance' ? 'Accept' : 'Change Status'} btnFunction={() => buttonFunction(acceptance.details._id)} />
                        : null
                    : acceptance.bundledDetails.response.status.length > 0 ?
                        null
                        : !!acceptance.details.action_change ? null : <FooterComponent notAllowedBtn={false} buttonTitle={currentTab === 'acceptance' ? 'Accept' : 'Change Status'} btnFunction={() => buttonFunction(acceptance.details._id)} />
                : null}
            {/* : null} */}
            <ActionComponent navigation={navigation} requestList={requestList} transmittal_key={transmittal_key} requestType={requestType} modalizeRef={modalizeRef} />
        </>
    )
}

const styles = StyleSheet.create({
    viewStyleForLine: {
        marginTop: 10,
        borderBottomColor: "#E0E6ED",
        borderBottomWidth: 1,
        alignSelf: 'stretch',
        width: "100%"
    }
})

export default RequestDetails
