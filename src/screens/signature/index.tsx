import React, { useState, useEffect } from 'react'
import { StyleSheet, BackHandler, ToastAndroid, Dimensions } from 'react-native'
import SignatureScreen from 'react-native-signature-canvas';
import { useDispatch } from 'react-redux';
import { setSignature, clearSignature } from '../../store/modules/dashboard/action';
import { Header, Left, Button, Body, Title, Right } from 'native-base';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons'
import signatureStyles from './signature-style';
// import { useToast } from 'react-native-styled-toast'

interface SignatureState {
    text: String,
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const SignScreen = ({ route, navigation, text }: SignatureState) => {
    // const { toast } = useToast()
    const dispatch = useDispatch()
    const [signatureRef, setSignatureRef] = useState()
    const [btnAllowed, setBtnAllowed] = useState(true)
    const [notAllowedBtnBack, setNotAllowedBtnBack] = useState(false)

    async function changeScreenOrientationLandscape() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    }

    async function changeScreenOrientationPortrait() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }

    const closeHandler = () => {
        if (!notAllowedBtnBack) {
            changeScreenOrientationPortrait()
            setNotAllowedBtnBack(state => !state)
            navigation.goBack()
        }
    }

    const showToastHandler = (text: any) => {
        // toast({ message: text })
        ToastAndroid.showWithGravity(
            text,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const handleSignatureSave = (signature: any) => {
        if (btnAllowed) {
            setBtnAllowed(false)
            showToastHandler('Saving...')
            dispatch(setSignature(signature))
            changeScreenOrientationPortrait()
            navigation.goBack()
        }
    }

    const handleEmpty = () => {
        showToastHandler('Saving...')
        if (btnAllowed) {

            changeScreenOrientationPortrait()
            dispatch(clearSignature())
            setBtnAllowed(false)
            navigation.goBack()
        }
    }

    const handleClear = () => {
        console.log('clear success!');
    }

    const signatureRefHandler = (ref: any) => {
        console.log(ref)
        // handleSignatureSave(ref)
    }

    const HeaderSignature = ({ headerTitle }: any) => {
        return (
          <Header style={{ backgroundColor: "#FFFFFF", height: 60 }}>
            <Left style={{ paddingLeft: 5 }}>
              <Button
                transparent
                disabled={notAllowedBtnBack}
                onPress={() => closeHandler()}
              >
                <Ionicons name="md-arrow-back" size={24} />
              </Button>
            </Left>
            <Body>
              <Title style={{ color: "#2F3542", width: 400 }}>
                {headerTitle}
              </Title>
            </Body>
            <Right />
          </Header>
        );
    }

    useEffect(() => {
        changeScreenOrientationLandscape()
    }, [])

    useEffect(() => {
        const backAction = () => {
            closeHandler()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [])

    useEffect(() => {
        console.log('Height: ', DEVICE_HEIGHT, ' Width: ', DEVICE_WIDTH)
    }, [])

    return (

        <>
            <HeaderSignature headerTitle='Add Signature' />
            <SignatureScreen
                ref={(ref: any) => signatureRefHandler(ref)}
                onOK={(event: any) => handleSignatureSave(event)}
                onEmpty={() => handleEmpty()}
                onClear={() => handleClear()}
                autoClear={false}
                descriptionText=''
                confirmText="Submit Signature"
                webStyle={signatureStyles}
            />
        </>
    );
}

const styles = StyleSheet.create({
    viewStyleForLine: {
        position: 'absolute',
        textAlign: 'center',
        bottom: 115,
        borderBottomColor: "#2F3542",
        borderBottomWidth: 1,
        alignSelf: 'center',
        width: "40%"
    }
})

SignScreen.defaultProps = {
    text: '',
}

export default SignScreen
