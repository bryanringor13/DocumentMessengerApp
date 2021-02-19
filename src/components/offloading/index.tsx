import React, { useRef, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import Constants from 'expo-constants';
import { RootState } from '../../store/modules/combinedReducers';
import { useSelector, useDispatch } from 'react-redux';
import { saveChangesMade, syncDoneChange } from '../../store/modules/dashboard/action';

function useInterval(callback: any, delay: any) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

function wait(timeout: number) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const OffloadingComponent = () => {
    const auth = useSelector((state: RootState) => state.auth)
    const dashboard = useSelector((state: RootState) => state.acceptance)
    const dispatch = useDispatch();
    let animation = useRef(new Animated.Value(0));
    const [progress, setProgress] = useState(0);
    const [saved, setSaved] = useState(true)

    // useEffect(() => {
    //     if (auth.connection.status && dashboard.acceptance.offMode.accepted.length > 0) {
    //         setSaved(false)
    //         dispatch(saveChangesMade())
    //     }
    // }, [auth.connection.status])

    // const triggerLoading = () => {
    useInterval(() => {
        if (!saved) {
            //     if (dashboard.syncDone) {
            let convertTo100 = (100 / dashboard.acceptance.offMode.accepted.length);
            if (progress < 100) {
                setProgress(progress + convertTo100);
            } else {
                wait(1000).then(() => {
                    setSaved(true)
                })
            }
            //     }
        }
    }, 1000);
    // }

    // useEffect(() => {
    //     if (!saved) {
    //         if (dashboard.syncDone) {
    //             dispatch(syncDoneChange(false))
    //             triggerLoading()
    //         }
    //     }
    // }, [dashboard.syncDone])

    useEffect(() => {
        Animated.timing(animation.current, {
            toValue: progress,
            duration: 100
        }).start();
    }, [progress])

    const width = animation.current.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
        extrapolate: "clamp"
    })
    return (
        <>
            {dashboard.acceptance.offMode.accepted.length > 0 ? saved ? null : <View style={styles.container}>
                {/* <Text>
                Syncing...
            </Text> */}
                {progress > 99 ? <Text style={{ fontSize: 12 }}>
                    {`Saved`}
                </Text> :
                    <View style={styles.progressBar}>
                        <Animated.View style={[StyleSheet.absoluteFill], { backgroundColor: "rgb(67, 200, 111)", width }} />
                    </View>}
                {/* <Text>
                {`${progress}%`}
            </Text> */}

            </View> : null}
        </>
    );
}

export default OffloadingComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingTop: Constants.statusBarHeight,
        // paddingTop: 15,
        backgroundColor: '#E0E6ED',
        padding: 8,
    },
    progressBar: {
        flexDirection: 'row',
        height: 10,
        width: '100%',
        backgroundColor: 'white',
        borderColor: '#E0E6ED',
        borderWidth: 2,
        borderRadius: 5
    }
});


{/* <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                    <Text style={{ textAlign: 'center', fontSize: 12 }}>You're offline</Text>
                </View>} */}