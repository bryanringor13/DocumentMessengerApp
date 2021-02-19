import React, { useEffect, useState } from 'react'
import { StyleSheet, TextInput, Image, BackHandler } from 'react-native'
import { Container, Body, Content, Card, CardItem, Text, Grid, Col, View } from 'native-base'
import { RootState } from '../../store/modules/combinedReducers';
import { useSelector, useDispatch } from 'react-redux';

import HeaderComponent from '../../components/header';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FooterComponent from '../../components/footer';
import ModalComponent from '../../components/modal';
import { removeRequestInBundled, changeStatus, clearListingsIntransit, listIntransit } from '../../store/modules/dashboard/action';
import { getTabCount } from '../../store/modules/tabscount/action';

const signIcon = require('../../images/signature.png');

const AcceptedPage = ({ route, navigation }) => {
    const { requestListToChange, actionLabel, actionCode, actionAPI, setActionClicked, transmittal_key } = route.params;
    const dispatch = useDispatch()
    const auth = useSelector((state: RootState) => state.auth)
    const acceptance = useSelector((state: RootState) => state.acceptance)
    const [requestDone, setRequestDone] = useState(0)
    const [notAllowedBtnBack, setNotAllowedBtnBack] = useState(false)
    const [requestName, setRequestName] = useState('')
    const [receivedValidation, setReceivedValidation] = useState(true)
    const [modalDone, setModalDone] = useState(false)
    const [btnSubmitTrigger, setBtnSubmitTrigger] = useState(false)

    const closeUserProfileHandler = () => {
        if (!notAllowedBtnBack) {
            setActionClicked(true)
            setNotAllowedBtnBack(state => !state)
            navigation.goBack()
        }
    }

    const setRequestNameHandler = (value: any) => {
        if (value.length === 0) console.log('empty')
        setRequestName(value)
    }

    const signatureScreenHandler = () => {
        // navigation.push('SignatureCanvas')
        navigation.push('SignatureScreen')
    }

    const cameraScreenHandler = () => {
        navigation.push('CameraScreen')
    }

    const submitAcceptedHandler = () => {
        setReceivedValidation(false)
        dispatch(changeStatus(requestName, requestListToChange, actionLabel, '', '', actionCode, actionAPI, transmittal_key))
        // setBtnSubmitTrigger(true)
        modalTrigger()
    }

    const modalTrigger = () => {
        setModalDone(true)
        // setBtnSubmitTrigger(false)
    }

    const closeModalHandler = () => {
        setActionClicked(true)
        if (auth.connection.status) {
            setRequestDone(requestListToChange.requests.length)
            dispatch(removeRequestInBundled(requestListToChange.requests))
            dispatch(getTabCount())
            if (acceptance.intransit.offMode.intransit.length == 0) {
                dispatch(clearListingsIntransit())
                dispatch(listIntransit())
            }
        } else {
            // offline mode
        }
        setModalDone(false)
        navigation.goBack()
    }

    useEffect(() => {
        if (requestName.length > 0 && acceptance.bundledDetails.signature) {
            setReceivedValidation(false)
        } else {
            setReceivedValidation(true)
        }
    }, [requestName, acceptance.bundledDetails.signature])


    useEffect(() => {
        const backAction = () => {
            closeUserProfileHandler();
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
            <HeaderComponent currentPage='acceptedpage' headerTitle='Update Status' headerSubTitle={(requestListToChange.requests.length - requestDone) > 1 ? `${(requestListToChange.requests.length - requestDone)} Requests` : `${(requestListToChange.requests.length - requestDone)} Request`} notAllowedBtnBack={notAllowedBtnBack} headerBtnCloseFunction={closeUserProfileHandler} />
            <Content style={{ backgroundColor: '#E5E5E5' }}>
                {auth.connection.status ? acceptance.intransit.offMode.intransit.length > 0 ? <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                    <Text style={{ textAlign: 'center', fontSize: 12 }}>Syncing...</Text>
                </View> : null : <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                        <Text style={{ textAlign: 'center', fontSize: 12 }}>You're offline</Text>
                    </View>}
                <Card style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }}>
                    <CardItem header bordered>
                        <Text style={{ fontWeight: '500', color: '#2F3542' }}>Delivery/Pickup Details</Text>
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Grid>
                                <Col>
                                    <View>
                                        <Text style={[styles.inputTitle, styles.inputTitleBottomMargin]}>Name</Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={(value) => setRequestNameHandler(value)}
                                        ></TextInput>
                                    </View>
                                </Col>
                            </Grid>
                            <Grid style={{ marginTop: 18 }}>
                                <Col>
                                    <TouchableOpacity onPress={() => signatureScreenHandler()}>

                                        {acceptance.bundledDetails.signature ? <View style={{ backgroundColor: '#F4F6F9', height: 90, alignItems: 'center' }}>
                                            <Text style={{ color: '#41B67F', fontSize: 16, fontWeight: '600', position: 'absolute', right: 10 }}><Image source={signIcon} style={{ width: 24, height: 24 }} />{' '}Edit</Text>
                                            <Image source={{ uri: acceptance.bundledDetails.signature }} resizeMode={"contain"} style={{ width: 200, top: -55, aspectRatio: 1, height: undefined }} />
                                        </View> :
                                            <View style={{ backgroundColor: '#F4F6F9', height: 90, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#41B67F', fontSize: 16, fontWeight: '600' }}><Image source={signIcon} style={{ width: 24, height: 24 }} />{' '}Click to sign</Text></View>}

                                    </TouchableOpacity>
                                </Col>
                            </Grid>
                        </Body>
                    </CardItem>
                </Card>
                <Card style={{ marginTop: 20 }}>
                    <CardItem header bordered>
                        <Text style={{ fontWeight: '500', color: '#2F3542' }}>Documents (Optional)</Text>
                    </CardItem>
                    <CardItem bordered style={{ paddingTop: 21, paddingBottom: 33, paddingLeft: 20, paddingRight: 20 }}>
                        <Body>
                            <Grid>
                                {!!acceptance.bundledDetails.documents ? <>
                                    <Col>
                                        <Image source={{ uri: acceptance.bundledDetails.documents }} style={{ width: '100%', aspectRatio: 1, height: undefined }} />
                                    </Col>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={() => cameraScreenHandler()}>
                                            <View style={{ alignItems: 'center' }}>
                                                <Text style={{ color: '#41B67F' }}>Replace Photo</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Col>
                                </> :
                                    <Col>
                                        <TouchableOpacity onPress={() => cameraScreenHandler()}>
                                            <View style={{ borderWidth: 1, borderStyle: 'solid', borderColor: '#41B67F', height: 50, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: '#41B67F' }}>Take a Photo</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Col>}
                            </Grid>
                        </Body>
                    </CardItem>
                </Card>
            </Content>
            <FooterComponent buttonTitle='Submit' notAllowedBtn={receivedValidation} btnFunction={submitAcceptedHandler} />
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
        height: 40,
        fontSize: 15,
        color: "#161F3D",
        borderWidth: 1,
        borderColor: '#A5B0BE',
        borderStyle: 'solid',
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
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

export default AcceptedPage
