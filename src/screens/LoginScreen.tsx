import React, { useState, SetStateAction, ChangeEvent, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, Image } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import * as ERROR from '../store/modules/error/action'
import * as AUTH from '../store/modules/auth/action'
import { Feather } from '@expo/vector-icons';
import { RootState } from '../store/modules/combinedReducers'
import { Spinner } from 'native-base'
import LoadingComponent from '../components/loading'
import Constants from 'expo-constants';
import { version } from '../utils/config'

const loginBackground = require("../../assets/images/bg.png")
const logoImage = require("../../assets/images/logo.png")
const veridataLogo = require("../../assets/images/veridata.png")

const LoginScreen = ({ route, navigation }) => {
    const dispatch = useDispatch()
    const error = useSelector((state: RootState) => state.error)
    const auth = useSelector((state: RootState) => state.auth)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [notAllowedLogin, setNotAlowedLogin] = useState(true)
    const [hidePassword, setHidePassword] = useState(true)
    const [errorMessage, setErrorMessage] = useState({
        status: null,
        message: null,
    })

    const usernameHandler = (value: any) => {
        setUsername(value)
    }

    const passwordHandler = (value: any) => {
        setPassword(value)
    }

    const forgotPasswordHandler = () => {
        navigation.push('ForgotPassword')
    }

    const handleLogin = () => {
        const requestLoginBody = {
            username: username,
            password: password,
        }

        let errors;

        if(auth.connection.status){
            dispatch(ERROR.clearErrors())
            dispatch(AUTH.loginUser(requestLoginBody))
        } else {
            errors = [{ "errMessage": `You're offline!` }]
            dispatch(ERROR.returnErrors(errors, 500))
        }
        // console.log(requestLoginBody)
    }

    useEffect(() => {

        function allowedButtonLogin() {
            if ((username.length > 0) && (password.length > 0)) setNotAlowedLogin(false)
            else setNotAlowedLogin(true)
        }

        allowedButtonLogin()
    }, [username, password])

    // useEffect(() => {
    //     function checkUserPassword() {
    //         if (auth.user.messenger.password_temp) {
    //             navigation.navigate('NewPassword', { currentPassword: auth.currentPassword, setProceedNext: () => { }, directTo: 'Dashboard', noBackArrow: true })
    //         } else {
    //             navigation.navigate('Dashboard')
    //         }
    //     }
    //     if (auth.token.length > 0) checkUserPassword()
    // }, [auth.token])

    return (
        <View style={styles.container}>
            {auth.isLoading ? <View style={styles.overlay}>
                <LoadingComponent />
            </View> : null}
            <ImageBackground
                style={[styles.background]}
                source={loginBackground}
            >
                <View style={styles.content}>
                    <Image
                        source={logoImage}
                        style={{ alignSelf: "center", marginTop: 150 }}
                    />
                    <View style={{ marginTop: 24, marginBottom: 40 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#2F3542', textAlign: 'center' }}>Document Distribution System</Text>
                    </View>
                    {auth.isLoading ? null : error.status > 0 ?
                        error.msg.length > 0 ? 
                        error.msg.map((msg: any, index: any) => (
                            <View key={index} style={[styles.errorMessage, styles.alertMessage]}>
                                <Text style={styles.alertText}>{msg.errMessage}</Text>
                            </View>
                        )) 
                        : null 
                        : null
                    }
                    <View>
                        <Text style={[styles.inputTitle, styles.inputTitleBottomMargin]}>Username</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={(event) => usernameHandler(event)}
                            value={username}
                        ></TextInput>
                    </View>
                    <View>
                        <View style={[styles.passwordText, styles.inputTitleBottomMargin]}>
                            <View>
                                <Text style={styles.inputTitle}>Password</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => forgotPasswordHandler()}>
                                    <Text style={styles.forgotText}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.passwordInputText, styles.input]}>
                            <TextInput
                                autoCapitalize="none"
                                style={styles.passwordField}
                                onChangeText={(event) => passwordHandler(event)}
                                value={password}
                                secureTextEntry={hidePassword}
                            ></TextInput>
                            {hidePassword ? <AntDesign name="eyeo" size={24} color="#2F3542" onPress={event => setHidePassword(false)} /> :
                                <Feather name="eye-off" size={24} color="#2F3542" onPress={event => setHidePassword(true)} />}
                        </View>
                    </View>
                    <TouchableOpacity style={notAllowedLogin || auth.isLoading ? styles.disabledButton : styles.button} disabled={notAllowedLogin} onPress={event => handleLogin()}>
                        <Text style={{ color: "#FFF", fontWeight: "500" }}>Log in</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', marginTop: 150, alignSelf: 'center' }}>
                        <Text>Powered By</Text>
                        <Image
                            source={veridataLogo}
                            style={{ marginLeft: 5 }}
                        />
                    </View>
                    <View style={{ justifyContent: 'center', marginTop: 5 }}>
                        <Text style={{ textAlign: 'center' }}>v{version}</Text>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    content: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10
    },
    passwordText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        fontSize: 14,
        marginTop: 19,
    },
    inputTitle: {
        color: '#8A8F9E',
    },
    inputTitleBottomMargin: {
        marginBottom: 2,
    },
    forgotText: {
        color: '#41B67F',
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
    passwordInputText: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    passwordField: {
        flex: 1,
    },
    button: {
        backgroundColor: "#41B67F",
        borderRadius: 4,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 32
    },
    disabledButton: {
        backgroundColor: '#9dd6bd',
        borderRadius: 4,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 32
    },
    alertMessage: {
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 16,
        paddingRight: 16,
        justifyContent: 'center',
        height: 40,
    },
    errorMessage: {
        borderLeftColor: '#FA5656',
        borderLeftWidth: 4,
        borderStyle: 'solid',
        backgroundColor: 'rgba(250, 86, 86, 0.25)',
        marginBottom: 10
    },
    infoMessage: {
        borderLeftColor: '#2196f3',
        borderLeftWidth: 4,
        borderStyle: 'solid',
        backgroundColor: '#afdbff',
        marginBottom: 10
    },
    alertText: {
        color: "#2F3542",
        fontSize: 14,
        textAlign: "center"
    },
    overlay: {
        paddingTop: 10,
        position: "absolute",
        zIndex: 1,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        opacity: 0.8,
    },
});

export default LoginScreen
