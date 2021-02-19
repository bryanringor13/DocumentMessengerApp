import React, { useState, useEffect } from 'react'
import { View, TextInput, ToastAndroid, Text, StyleSheet, Picker } from 'react-native'
import { Container, Content, Card, CardItem, Grid, Col, Body, Button, Toast } from 'native-base'
import HeaderComponent from '../components/header'
import { Feather, AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { clearVerifyPassword, updatePassword } from '../store/modules/auth/action';
import { clearErrors } from '../store/modules/error/action';
// import { useToast } from 'react-native-styled-toast'
// import Toast from '@rimiti/react-native-toastify';
import { RootState } from '../store/modules/combinedReducers';

const NewPassword = ({ route, navigation }) => {
    const dispatch = useDispatch()
    // const { toast } = useToast()
    const error = useSelector((state: RootState) => state.error)
    const auth = useSelector((state: RootState) => state.auth)
    const acceptance = useSelector((state: RootState) => state.acceptance)
    const { currentPassword, setProceedNext, directTo, noBackArrow } = route.params;
    const [notAllowedBtnBack, setNotAllowedBtnBack] = useState(false)
    const [hidePassword, setHidePassword] = useState(true)
    const [hidePasswordRe, setHidePasswordRe] = useState(true)
    const [newPassword, setNewPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [toastify, setToastify] = useState('')

    const [atleastOneUpperCase, setAtleastOneUpperCase] = useState(false)
    const [atleastOneNumber, setAtleastOneNumber] = useState(false)
    const [atleastEightChar, setAtleastEightChar] = useState(false)
    const [showNewPassToast, setShowNewPassToast] = useState(false)
    const [allowedSubmit, setAllowedSubmit] = useState(true)
    const [passMatched, setPassMatched] = useState(true)

    const closeUserProfileHandler = () => {
        if (!notAllowedBtnBack) {
            dispatch(clearVerifyPassword())
            setProceedNext(true)
            setNotAllowedBtnBack(state => !state)
            navigation.goBack()
        }
    }

    const newPasswordHandler = (value: any) => {
        setNewPassword(value)
    }

    const rePasswordHandler = (value: any) => {
        setRePassword(value)
    }

    const submitNewPasswordHandler = () => {
        if (!allowedSubmit) {
            fetchErrorHandler('Please wait..')
            dispatch(clearErrors())
            setAllowedSubmit(true)
            setShowNewPassToast(true)
            if (newPassword.length === 0) {
                setAllowedSubmit(false)
                return fetchErrorHandler('New Password is not allowed to be empty')
            }
            if (rePassword.length === 0) {
                setAllowedSubmit(false)
                return fetchErrorHandler('Re-enter Password is not allowed to be empty')
            }
            if (!newPassword.match(/[A-Z]/)) {
                setAllowedSubmit(false)
                return fetchErrorHandler('Password should contain at least 1 upper-cased letter')
            }
            if (!newPassword.match(/\d/)) {
                setAllowedSubmit(false)
                return fetchErrorHandler('Password should contain at least 1 number')
            }
            if (newPassword.length < 8) {
                setAllowedSubmit(false)
                return fetchErrorHandler('Password should be atleast 8 characters long')
            }
            if (newPassword !== rePassword) {
                setAllowedSubmit(false)
                return fetchErrorHandler('Password not matched')
            }

            const body = {
                new_password: newPassword,
                re_password: rePassword,
                current_password: currentPassword
            }

            dispatch(updatePassword(body))
        }
    }

    const fetchErrorHandler = (errorMess: any) => {
        // toast({ message: errorMess, intent: 'ERROR' })
        // toastify.show('Sample', 100)
        ToastAndroid.showWithGravity(
            errorMess,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
        // Toast.show({
        //     text: "Wrong password!",
        //     buttonText: "Okay",
        //     position: "top"
        // })
        // setAllowedSubmit(false)
    }

    useEffect(() => {
        if (newPassword.length > 0) {
            if (newPassword.match(/[A-Z]/)) setAtleastOneUpperCase(true); else setAtleastOneUpperCase(false)
            if (newPassword.match(/\d/)) setAtleastOneNumber(true); else setAtleastOneNumber(false)
            if (newPassword.length > 7) setAtleastEightChar(true); else setAtleastEightChar(false)
            if (rePassword.length > 0) {
                if (newPassword === rePassword) setPassMatched(true); else setPassMatched(false)
            }
        } else {
            setAtleastOneUpperCase(false)
            setAtleastOneNumber(false)
            setAtleastEightChar(false)
            // setPassMatched(false)
        }
    }, [newPassword])

    useEffect(() => {
        if (rePassword.length > 0) {
            // setPassMatched(true)
            if (newPassword === rePassword) setPassMatched(true); else setPassMatched(false)
        } else {
            setPassMatched(true)
        }
    }, [rePassword])

    useEffect(() => {
        if (atleastOneUpperCase && atleastOneNumber && atleastEightChar && newPassword.length > 0 && rePassword.length > 0 && passMatched) setAllowedSubmit(false); else setAllowedSubmit(true)
    }, [atleastOneUpperCase, atleastOneNumber, atleastEightChar, newPassword, rePassword, passMatched])

    useEffect(() => {
        function fetchError() {
            setShowNewPassToast(false)
            error.msg.map((error, index) => {
                fetchErrorHandler(error.errMessage)
            })
        }

        if (error.msg.length > 0 && showNewPassToast) fetchError()
    }, [error.msg])

    useEffect(() => {
        function successChangePassword() {
            navigation.push(directTo)
        }

        if (Object.keys(auth.newPasswordData).length > 0) successChangePassword()
    }, [auth.newPasswordData])

    return (
        <Container style={{ backgroundColor: '#F4F6F9' }}>
            <HeaderComponent currentPage='normalheader' noBackArrow={noBackArrow} headerBtnCloseFunction={closeUserProfileHandler} headerTitle='New Password' />
            {auth.connection.status ?
                <Content>
                    <Card style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }}>
                        <CardItem bordered>
                            <Body>
                                <Grid>
                                    <Col>
                                        <View>
                                            <Text style={{ fontWeight: '500', fontSize: 16 }}>Nominate New Password</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.inputTitle, styles.inputTitleBottomMargin]}>New Password</Text>
                                            <View style={[styles.passwordInputText, styles.input]}>
                                                <TextInput
                                                    style={{ width: '90%' }}
                                                    placeholder="Enter New Password"
                                                    placeholderTextColor="grey"
                                                    defaultValue={newPassword}
                                                    onFocus={(value: any) => newPasswordHandler(newPassword)}
                                                    onChangeText={(value: any) => newPasswordHandler(value)}
                                                    secureTextEntry={hidePassword}
                                                />{hidePassword ? <AntDesign name="eyeo" size={24} color="#2F3542" onPress={event => setHidePassword(false)} /> :
                                                    <Feather name="eye-off" size={24} color="#2F3542" onPress={event => setHidePassword(true)} />}
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={[styles.inputTitle, styles.inputTitleBottomMargin]}>Re-enter New Password</Text>
                                            <View style={[styles.passwordInputText, styles.input, { borderColor: passMatched ? '#A5B0BE' : 'red' }]}>
                                                <TextInput
                                                    style={{ width: '90%' }}
                                                    placeholder="Must match the new Password"
                                                    placeholderTextColor="grey"
                                                    defaultValue={rePassword}
                                                    onFocus={(value: any) => rePasswordHandler(rePassword)}
                                                    onChangeText={(value: any) => rePasswordHandler(value)}
                                                    secureTextEntry={hidePasswordRe}
                                                />{hidePasswordRe ? <AntDesign name="eyeo" size={24} color="#2F3542" onPress={event => setHidePasswordRe(false)} /> :
                                                    <Feather name="eye-off" size={24} color="#2F3542" onPress={event => setHidePasswordRe(true)} />}
                                            </View>{passMatched ? null : <Text style={{ marginLeft: 5, marginTop: 5, color: 'red', fontSize: 12 }}>New and re-entered password does not match</Text>}
                                        </View>
                                        <View style={{ marginTop: 10 }}>
                                            <Button disabled={allowedSubmit} style={{ backgroundColor: allowedSubmit ? '#9dd6bd' : '#41B67F', justifyContent: 'center', height: 56 }} onPress={() => submitNewPasswordHandler()}>
                                                <Text style={{ color: '#FFFFFF' }}>Save</Text>
                                            </Button>
                                        </View>
                                        <View style={{ marginTop: 16 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Password must contain:</Text>
                                            <Text style={{ color: atleastOneUpperCase ? '#41B67F' : '#FA5656', fontWeight: 'normal', fontSize: 12, marginTop: 8 }}>At least 1 upper case letter (A-Z)</Text>
                                            <Text style={{ color: atleastOneNumber ? '#41B67F' : '#FA5656', fontWeight: 'normal', fontSize: 12, marginTop: 8 }}>At least 1 number (0-9)</Text>
                                            <Text style={{ color: atleastEightChar ? '#41B67F' : '#FA5656', fontWeight: 'normal', fontSize: 12, marginTop: 8 }}>At least 8 characters</Text>
                                        </View>
                                    </Col>
                                </Grid>
                            </Body>
                        </CardItem>
                    </Card>
                </Content> : <>{auth.connection.status ? acceptance.intransit.offMode.intransit.length > 0 ? <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
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
        borderBottomWidth: StyleSheet.hairlineWidth,
        fontSize: 15,
        color: "#161F3D",
        borderWidth: 1,
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

export default NewPassword
