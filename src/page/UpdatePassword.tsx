import React, { useState, useEffect } from 'react'
import { View, TextInput, ToastAndroid, Text, StyleSheet, BackHandler } from 'react-native'
import { Container, Content, Card, CardItem, Grid, Col, Body, Button, Toast } from 'native-base'
import HeaderComponent from '../components/header'
import { Feather, AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/modules/combinedReducers';
import { verifyPassword } from '../store/modules/auth/action';
// import { useToast } from 'react-native-styled-toast'
import { clearErrors } from '../store/modules/error/action';
import Constants from "expo-s";

const UpdatePassword = ({ route, navigation }) => {
    // const { toast } = useToast()
    const dispatch = useDispatch()
    const auth = useSelector((state: RootState) => state.auth)
    const error = useSelector((state: RootState) => state.error)
    const acceptance = useSelector((state: RootState) => state.acceptance)
    const [notAllowedBtnBack, setNotAllowedBtnBack] = useState(false)
    const [hidePassword, setHidePassword] = useState(true)
    const [btnAllowed, setBtnAllowed] = useState(true)
    const [currentPassword, setCurrentPassword] = useState('')
    const [proceedNext, setProceedNext] = useState(true)
    const [showErrorToast, setShowErrorToast] = useState(false)

    const closeUserProfileHandler = () => {
        if (!notAllowedBtnBack) {

            setNotAllowedBtnBack(state => !state)
            navigation.goBack()
        }
    }

    const nextProcess = () => {
        navigation.push('NewPassword', {
            currentPassword,
            setProceedNext,
            directTo: 'UserProfile',
            noBackArrow: false
        })
    }

    const setCurrentPasswordHandler = (value: any) => {
        setCurrentPassword(value)
    }

    const verifyCurrentPasswordHandler = () => {
        dispatch(clearErrors())
        setShowErrorToast(true)
        dispatch(verifyPassword(currentPassword))
    }

    const btnAllowedHandler = (toggle: boolean) => {
        setBtnAllowed(toggle)
    }

    useEffect(() => {
        if (currentPassword.length > 0) {
            btnAllowedHandler(false)
        } else {
            btnAllowedHandler(true)
        }
    }, [currentPassword])

    useEffect(() => {
        if (proceedNext && Object.keys(auth.verifyPassData).length > 0) {
            setProceedNext(false)
            nextProcess()
        }
    }, [auth.verifyPassData])

    useEffect(() => {
        function fetchError() {
            setShowErrorToast(false)
            // toast({ message: error.msg[0].errMessage, intent: 'ERROR' })
            ToastAndroid.showWithGravity(
                error.msg[0].errMessage,
                ToastAndroid.SHORT,
                ToastAndroid.TOP
            );
            // Toast.show({
            //     text: "Wrong password!",
            //     buttonText: "Okay",
            //     buttonTextStyle: { color: "#008000" },
            //     buttonStyle: { backgroundColor: "#5cb85c" }
            // })
        }

        if (error.msg.length > 0 && showErrorToast) fetchError()
    }, [error.msg])

    useEffect(() => {
        const backAction = () => {
            closeUserProfileHandler()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [])

    return (
        <Container style={{ backgroundColor: '#F4F6F9' }}>
            <HeaderComponent currentPage='normalheader' headerBtnCloseFunction={closeUserProfileHandler} headerTitle='Update Password' />
            {auth.connection.status ?
                <Content>
                    <Card style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }}>
                        <CardItem bordered>
                            <Body>
                                <Grid>
                                    <Col>
                                        <View>
                                            <Text style={{ fontWeight: '500', fontSize: 16 }}>Verify Your Account to Proceed</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.inputTitle, styles.inputTitleBottomMargin]}>Current Password</Text>
                                            <View style={[styles.passwordInputText, styles.input]}>
                                                <TextInput
                                                    style={{ width: '90%' }}
                                                    placeholder="Enter Current Password"
                                                    placeholderTextColor="grey"
                                                    onChangeText={(value: any) => setCurrentPasswordHandler(value)}
                                                    secureTextEntry={hidePassword}
                                                />{hidePassword ? <AntDesign name="eyeo" size={24} color="#2F3542" onPress={event => setHidePassword(false)} /> :
                                                    <Feather name="eye-off" size={24} color="#2F3542" onPress={event => setHidePassword(true)} />}

                                            </View>
                                        </View>
                                        <View style={{ marginTop: 24 }}>
                                            <Button style={{ backgroundColor: btnAllowed ? '#9dd6bd' : '#41B67F', justifyContent: 'center', height: 56 }} disabled={btnAllowed} onPress={() => verifyCurrentPasswordHandler()}>
                                                <Text style={{ color: '#FFFFFF' }}>Next</Text>
                                            </Button>
                                        </View>
                                    </Col>
                                </Grid>
                            </Body>
                        </CardItem>
                    </Card>
                </Content> : <>
                    {auth.connection.status ? acceptance.intransit.offMode.intransit.length > 0 ? <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                        <Text style={{ textAlign: 'center', fontSize: 12 }}>Syncing...</Text>
                    </View> : null : <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                            <Text style={{ textAlign: 'center', fontSize: 12 }}>You're offline</Text>
                        </View>}
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>
                            The page is not available
                        </Text>
                    </View>
                </>}
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
        marginTop: 16,
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
    },
    passwordInputText: {
        marginTop: 2,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
})

export default UpdatePassword
