import React, { useState, useEffect } from 'react'
import { View, TextInput, BackHandler, Text, StyleSheet, Picker } from 'react-native'
import { Container, Content, Card, CardItem, Grid, Col, Body } from 'native-base'
import HeaderComponent from '../../components/header'
import FooterComponent from '../../components/footer'
import ModalComponent from '../../components/modal'
import { useDispatch, useSelector } from 'react-redux'
import { removeRequestInBundled, clearResponse, changeStatus, listIntransit, clearListingsIntransit } from '../../store/modules/dashboard/action'
import { getTabCount } from '../../store/modules/tabscount/action'
import { RootState } from '../../store/modules/combinedReducers'
import { CHANGE_STATUS_CANNOT_ACCEPT } from '../../utils/Constants'

const CannotAccept = ({ route, navigation }) => {
    const { requestListToChange, actionLabel, actionCode, actionAPI, setActionClicked, transmittal_key } = route.params;
    const dispatch = useDispatch()
    const auth = useSelector((state: RootState) => state.auth)
    const acceptance = useSelector((state: RootState) => state.acceptance)
    const [notAllowedBtnBack, setNotAllowedBtnBack] = useState(false)
    const [proceedNotValidation, setProceedNotValidation] = useState(true)
    const [requestDone, setRequestDone] = useState(0)
    const [modalDone, setModalDone] = useState(false)
    const [selectedValue, setSelectedValue] = useState('select');
    const [showReasonForCannotAccept, setShowReasonForCannotAccept] = useState(false)
    const [reasonForCannotAccept, setReasonForCannotAccept] = useState('')
    const [stateYourReason, setStateYourReason] = useState('')

    const closeUserProfileHandler = () => {
        if (!notAllowedBtnBack) {
            setActionClicked(true)
            setNotAllowedBtnBack(state => !state)
            navigation.goBack()
        }
    }

    const submitAcceptedHandler = () => {
        setProceedNotValidation(true)
        setModalDone(state => !state)

        dispatch(changeStatus('', requestListToChange, actionLabel, selectedValue, stateYourReason, actionCode, actionAPI, transmittal_key))
        if (auth.connection.status) dispatch(removeRequestInBundled(requestListToChange.requests))
        console.log('submitAcceptedHandler', requestListToChange.requests)
    }

    const closeModalHandler = (state: boolean) => {

        if (auth.connection.status) {
            setRequestDone(requestListToChange.requests.length)
            dispatch(removeRequestInBundled(requestListToChange.requests))
            dispatch(getTabCount())
            if (acceptance.intransit.offMode.intransit.length == 0) {
                dispatch(clearListingsIntransit())
                dispatch(listIntransit());
            }
        } else {
            // offline mode
        }
        setModalDone(state)
        navigation.goBack()
    }

    const selectedValueHandler = (value: any) => {
        if (value === 'others') { setShowReasonForCannotAccept(true) } else {
            setShowReasonForCannotAccept(false)
        }

        setSelectedValue(value)
    }

    const reasonCannotDeliverHandler = (value: any) => {
        setStateYourReason(value)
    }


    useEffect(() => {
        if (selectedValue === 'others') {
            if (!!stateYourReason) setProceedNotValidation(false); else setProceedNotValidation(true)
        } else { if (selectedValue === 'select') setProceedNotValidation(true); else setProceedNotValidation(false); }
    }, [selectedValue, stateYourReason])


    useEffect(() => {
        const backAction = () => {
            closeUserProfileHandler()
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);
    return (
        <Container>
            {modalDone ?
                <ModalComponent closedModal={closeModalHandler} status={acceptance.bundledDetails.response.status} actionCode={actionCode} /> : null}
            <HeaderComponent currentPage='normalheader' headerBtnCloseFunction={closeUserProfileHandler} headerTitle='Update Status' headerSubTitle={(requestListToChange.requests.length - requestDone) > 1 ? `${(requestListToChange.requests.length - requestDone)} Requests` : `${(requestListToChange.requests.length - requestDone)} Request`} />
            <Content>
                {auth.connection.status ? acceptance.intransit.offMode.intransit.length > 0 ? <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                    <Text style={{ textAlign: 'center', fontSize: 12 }}>Syncing...</Text>
                </View> : null : <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                        <Text style={{ textAlign: 'center', fontSize: 12 }}>You're offline</Text>
                    </View>}
                <Card style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }}>
                    <CardItem header bordered>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: '#2F3542' }}>{actionLabel}</Text>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Grid>
                                <Col>
                                    <View>
                                        <Text style={[styles.inputTitle, styles.inputTitleBottomMargin]}>Reason</Text>
                                        <View style={{ borderStyle: 'solid', borderWidth: 1, borderColor: '#A5B0BE', borderRadius: 4 }}>
                                            <Picker
                                                selectedValue={selectedValue}
                                                style={{ height: 40, width: '100%' }}
                                                onValueChange={(itemValue, itemIndex) => selectedValueHandler(itemValue)}
                                            >
                                                {CHANGE_STATUS_CANNOT_ACCEPT.map((reason: any, index: any) => (
                                                    <Picker.Item key={index} label={reason.label} value={reason.value} />))}
                                            </Picker>
                                        </View>
                                    </View>
                                </Col>
                            </Grid>
                            {showReasonForCannotAccept ?
                                <Grid style={{ marginTop: 14 }}>
                                    <Col>
                                        <View>
                                            <Text style={[styles.inputTitle, styles.inputTitleBottomMargin]}>State your Reason</Text>
                                            <TextInput
                                                style={styles.input}
                                                underlineColorAndroid="transparent"
                                                placeholder="Reason Here..."
                                                placeholderTextColor="grey"
                                                numberOfLines={8}
                                                multiline={true}
                                                onChangeText={(value: any) => reasonCannotDeliverHandler(value)}
                                            />
                                        </View>
                                    </Col>
                                </Grid> : null}
                        </Body>
                    </CardItem>
                </Card>
            </Content>
            <FooterComponent btnFunction={submitAcceptedHandler} buttonTitle='Proceed' notAllowedBtn={proceedNotValidation} />
        </Container>
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
    inputTitle: {
        color: 'rgba(43, 45, 51, 0.8)',
        fontSize: 14,
    },
    inputTitleBottomMargin: {
        marginBottom: 2,
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        fontSize: 15,
        color: "#161F3D",
        borderWidth: 1,
        borderColor: '#A5B0BE',
        borderStyle: 'solid',
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 10,
        paddingRight: 10,
        textAlignVertical: 'top',
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
})

export default CannotAccept
