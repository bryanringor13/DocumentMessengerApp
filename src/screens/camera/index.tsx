import React, { useState, useEffect } from 'react';
import { Text, View, BackHandler, ToastAndroid } from 'react-native';
import { Camera } from 'expo-camera';
import { Container, Toast } from 'native-base';
import HeaderComponent from '../../components/header';
import FooterComponent from '../../components/footer';
import { useDispatch } from 'react-redux';
import { setDocument } from '../../store/modules/dashboard/action';
import { any } from 'prop-types';
import * as ImageManipulator from 'expo-image-manipulator';
// import { useToast } from 'react-native-styled-toast'

export default function CameraCapture({ route, navigation }) {
    // const { toast } = useToast()
    const dispatch = useDispatch()
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [notAllowedBtnBack, setNotAllowedBtnBack] = useState(false)
    const [cameraRef, setCameraRef] = useState()
    const [btnCaptureAllowed, setBtnCaptureAllowed] = useState(false)
    const [btnAllowed, setBtnAllowed] = useState(true)

    const closeHandler = () => {
        if (!notAllowedBtnBack) {
            setNotAllowedBtnBack(state => !state)
            navigation.goBack()
        }
    }

    const captureImageHandler = () => {
        setBtnCaptureAllowed(true)
        // showToastHandler('Please Wait!')
        // toast({ message: 'Capturing...' })
        if (cameraRef) {
            cameraRef.takePictureAsync({ onPictureSaved: onPictureSaved, quality: 0, exif: true, skipProcessing: true });
        }
    }

    const onPictureSaved = async (photo: any) => {
        // toast({ message: 'Saving...' })

        ToastAndroid.showWithGravity(
            'Saving...',
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
        if (btnAllowed) {
            setBtnAllowed(false)
            const manipResult = await ImageManipulator.manipulateAsync(photo.uri, [{ resize: { width: 480, height: 640 } }],
                { compress: 0, format: ImageManipulator.SaveFormat.PNG, base64: true });
            dispatch(setDocument(manipResult))
            setBtnCaptureAllowed(false)
            navigation.goBack()
        }
    }

    const showToastHandler = (text: any) => {
        Toast.show({
            text: text,
            duration: 3000,
            position: 'top'
        })
    }

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
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (

        <Container>
            <HeaderComponent currentPage='camerascreen' headerTitle='Take a Photo' headerBtnCloseFunction={closeHandler} />
            <View style={{ flex: 1 }}>
                <Camera style={{ flex: 1, alignItems: 'center' }} type={type} ref={(ref: any) => setCameraRef(ref)}>
                    <View
                        style={{
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            justifyContent: 'space-around'
                        }}>
                    </View>
                </Camera>
            </View>
            <FooterComponent cameraBtn={true} buttonTitle='' notAllowedBtn={btnCaptureAllowed} btnFunction={captureImageHandler} />
        </Container>
    );
}