import React, { useEffect, useState } from 'react'
import { StyleSheet, BackHandler, ToastAndroid } from 'react-native'
import { Container, Header, Left, Body, Right, Title, Button, Content, Card, CardItem, Text, Grid, Col, View } from 'native-base'
import { RootState } from '../store/modules/combinedReducers';
import { useSelector, useDispatch } from 'react-redux';
import { REQUEST_ITEM_TYPE } from '../utils/Constants';
import { AntDesign, Fontisto, EvilIcons, Ionicons } from '@expo/vector-icons'

import { userProfile, clearUserProfile, logoutUser, clearVerifyPassword, clearNewPassword } from '../store/modules/auth/action';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LoadingComponent from '../components/loading';
// import { useToast } from 'react-native-styled-toast'
import { clearListings, clearListingsAcceptance, clearListingsIntransit } from '../store/modules/dashboard/action';

const UserProfile = ({ route, navigation }) => {
    // const { toast } = useToast()
    const dispatch = useDispatch()
    const auth = useSelector((state: RootState) => state.auth)
    const acceptance = useSelector((state: RootState) => state.acceptance)
    const [refreshUserProfile, setRefreshUserProfile] = useState(true)
    const [notAllowedBtnBack, setNotAllowedBtnBack] = useState(false)
    const [historyBtnNotAllowed, setHistoryBtnNotAllowed] = useState(false)
    const [showToast, setShowToast] = useState(false)

    const checkHistory = () => {
        setHistoryBtnNotAllowed(true)
        navigation.push('History', {
            historyBtnNowAllowedHandler: historyBtnNowAllowedHandler,
            currentTab: 'history'
        })
    }

    const historyBtnNowAllowedHandler = (state: boolean) => {
        setHistoryBtnNotAllowed(state)
    }

    const logOut = () => {
        dispatch(clearListingsAcceptance())
        dispatch(clearListingsIntransit())
        dispatch(logoutUser())
    }

    const closeUserProfileHandler = () => {
        if (!notAllowedBtnBack) {
            setNotAllowedBtnBack(state => !state)
            navigation.goBack()
        }
    }

    const updatePasswordHandler = () => {
        dispatch(clearVerifyPassword())
        navigation.push('UpdatePassword')
    }

    const assignLocationHandler = () => {
        navigation.push('AssignedLocation', {
            assigned_location: auth.user.messenger.assigned_locations_labels
        })
    }

    useEffect(() => {
        function getUserProfile() {
            if (auth.connection.status) {
                dispatch(userProfile())
            }
            setRefreshUserProfile(false)
        }

        if (refreshUserProfile) getUserProfile()
    }, [refreshUserProfile])

    useEffect(() => {
        function passwordChanged() {
            // toast({ message: 'Password updated' })
            ToastAndroid.showWithGravity(
                'Password updated',
                ToastAndroid.SHORT,
                ToastAndroid.TOP
            );
            dispatch(clearNewPassword())
        }

        if (Object.keys(auth.newPasswordData).length > 0) passwordChanged()
    }, [auth.newPasswordData])

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
        <>
            <Container>
                <Header style={{ backgroundColor: '#FFFFFF', height: 80 }}>
                    <Left style={{ paddingLeft: 5 }}>
                        <Button transparent disabled={notAllowedBtnBack} onPress={() => closeUserProfileHandler()}>
                            <Ionicons name='md-arrow-back' size={24} />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ color: '#2F3542' }}>Profile</Title>
                    </Body>
                    <Right />
                </Header>
                {auth.isLoading || refreshUserProfile ? <View style={{ flex: 1, backgroundColor: '#F4F6F9', justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingComponent />
                </View> :

                    <Content style={{ backgroundColor: '#F4F6F9' }}>
                        {auth.connection.status ? acceptance.intransit.offMode.intransit.length > 0 ? <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                            <Text style={{ textAlign: 'center', fontSize: 12 }}>Syncing...</Text>
                        </View> : null : <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                                <Text style={{ textAlign: 'center', fontSize: 12 }}>You're offline</Text>
                            </View>}
                        <Card transparent>
                            <CardItem style={{ backgroundColor: '#00000000' }}>
                                <Body>
                                    <View style={{
                                        zIndex: 1,
                                        borderRadius: 50,
                                        alignSelf: 'center',
                                        height: 51,
                                        width: 51,
                                        backgroundColor: '#FFFFFF',
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 3,
                                        },
                                        shadowOpacity: 0.27,
                                        shadowRadius: 4.65,
                                        elevation: 6,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    >
                                        <AntDesign name='inbox' style={{ color: '#29B1C3' }} size={32} />
                                    </View>
                                    <View style={{ paddingTop: 33, paddingLeft: 20, paddingRight: 20, marginTop: -25, height: 135, width: '100%', backgroundColor: '#D1EEF2', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                                        <View style={{ height: 56, width: '100%', backgroundColor: '#B2E3E9', borderRadius: 2, justifyContent: 'center' }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>{!!auth.user.messenger ? !!auth.user.messenger.first_name ? auth.user.messenger.first_name : null : null} {!!auth.user.messenger ? !!auth.user.messenger.last_name ? auth.user.messenger.last_name : null : null}</Text>
                                        </View>
                                        <View style={{ width: '100%', height: '45%', justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => assignLocationHandler()}>
                                                <View style={{ flexDirection: 'row', backgroundColor: '#29B1C3', borderRadius: 10, paddingTop: 4, paddingBottom: 4, paddingLeft: 15, paddingRight: 15 }}>
                                                    <EvilIcons name='location' style={{ textAlignVertical: 'center', color: '#FFFFFF' }} size={24} /><Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'normal', textAlignVertical: 'center', textAlign: 'center' }}>{!!auth.user.messenger ? auth.user.messenger.assigned_locations_labels.length > 0 ? auth.user.messenger.assigned_locations_labels.length > 1 ? ` ${auth.user.messenger.assigned_locations_labels[0].city}, +${(auth.user.messenger.assigned_locations_labels.length - 1)} ${(auth.user.messenger.assigned_locations_labels.length - 1) > 1 ? 'Cities' : 'City'}` : auth.user.messenger.assigned_locations_labels[0].city : null : null}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ width: '100%', backgroundColor: '#29B1C3', height: 8 }} />
                                    {!auth.connection.status ? <View style={{ backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%' }}>
                                        <AntDesign name='warning' style={{ color: '#FA5656' }} size={12} />
                                        <Text style={{ textAlign: 'center', fontSize: 12, color: '#FA5656' }}>{' '}Values might be outdated while on offline mode.</Text>
                                    </View> : null}
                                    <View style={{ height: 212, width: '100%', backgroundColor: '#FFFFFF', paddingTop: 12, paddingBottom: 12, paddingLeft: 17, paddingRight: 17 }}>
                                        <Grid style={{ alignItems: 'center' }}>
                                            <Col>
                                                <Text style={{ fontSize: 32, textAlign: 'center', color: '#1DD28B' }}>{!!auth.user.requests_stats ? auth.user.requests_stats.deliver.delivered : 0}</Text>
                                            </Col>
                                            <Col>
                                                <Text style={{ fontSize: 32, textAlign: 'center', color: '#FA5656' }}>{!!auth.user.requests_stats ? auth.user.requests_stats.deliver.not_delivered : 0}</Text>
                                            </Col>
                                            <Col>
                                                <Text style={{ fontSize: 32, textAlign: 'center', color: '#F8B344' }}>{!!auth.user.requests_stats ? auth.user.requests_stats.deliver.delivery_in_transit : 0}</Text>
                                            </Col>
                                        </Grid>
                                        <Grid>
                                            <Col>
                                                <Text style={{ textAlign: 'center', fontSize: 12, textTransform: 'uppercase', fontWeight: '500' }}>Delivered</Text>
                                            </Col>
                                            <Col>
                                                <Text style={{ textAlign: 'center', fontSize: 12, textTransform: 'uppercase', fontWeight: '500' }}>Not Delivered</Text>
                                            </Col>
                                            <Col>
                                                <Text style={{ textAlign: 'center', fontSize: 12, textTransform: 'uppercase', fontWeight: '500' }}>Pending Deliver</Text>
                                            </Col>
                                        </Grid>
                                        <Grid style={{ alignItems: 'center' }}>
                                            <Col>
                                                <Text style={{ fontSize: 32, textAlign: 'center', color: '#1DD28B' }}>{!!auth.user.requests_stats ? auth.user.requests_stats.pickup.pickedup : 0}</Text>
                                            </Col>
                                            <Col>
                                                <Text style={{ fontSize: 32, textAlign: 'center', color: '#FA5656' }}>{!!auth.user.requests_stats ? auth.user.requests_stats.pickup.not_pickedup : 0}</Text>
                                            </Col>
                                            <Col>
                                                <Text style={{ fontSize: 32, textAlign: 'center', color: '#F8B344' }}>{!!auth.user.requests_stats ? auth.user.requests_stats.pickup.pickup_in_transit : 0}</Text>
                                            </Col>
                                        </Grid>
                                        <Grid>
                                            <Col>
                                                <Text style={{ textAlign: 'center', fontSize: 12, textTransform: 'uppercase', fontWeight: '500' }}>Picked Up</Text>
                                            </Col>
                                            <Col>
                                                <Text style={{ textAlign: 'center', fontSize: 12, textTransform: 'uppercase', fontWeight: '500' }}>Not Picked Up</Text>
                                            </Col>
                                            <Col>
                                                <Text style={{ textAlign: 'center', fontSize: 12, textTransform: 'uppercase', fontWeight: '500' }}>Pending PickUp</Text>
                                            </Col>
                                        </Grid>
                                    </View>
                                    <View style={styles.viewStyleForLine} />
                                    <View style={{ width: '100%' }}>
                                        <TouchableOpacity style={{ alignSelf: 'stretch' }} onPress={() => checkHistory()} disabled={historyBtnNotAllowed}>
                                            <View style={{
                                                height: 60,
                                                backgroundColor: '#FFFFFF',
                                                borderBottomLeftRadius: 10,
                                                borderBottomRightRadius: 10,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            >
                                                <View style={{
                                                    alignItems: 'center',
                                                    flexDirection: "row",
                                                    justifyContent: 'space-between',
                                                    width: 126
                                                }}>
                                                    <Fontisto name="clock" style={{ color: '#2F3542' }} size={18} />
                                                    <Text>Check History</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '100%', height: 65, alignItems: 'center', justifyContent: 'center' }}>
                                        <Button transparent onPress={() => updatePasswordHandler()}>
                                            <Text style={{ textTransform: 'capitalize', color: '#41B67F' }}>Update Password</Text>
                                        </Button>
                                    </View>
                                    <View style={{ width: '100%' }}>
                                        <Button style={{ backgroundColor: '#41B67F', height: 56, justifyContent: 'center' }} onPress={() => logOut()}>
                                            <Text>Log Out</Text>
                                        </Button>
                                    </View>
                                </Body>
                            </CardItem>
                        </Card>
                    </Content >
                }
            </Container >
        </>
    )
}

const styles = StyleSheet.create({
    viewStyleForLine: {
        borderBottomColor: "#E0E6ED",
        borderBottomWidth: 1,
        alignSelf: 'stretch',
        width: "100%"
    }
})

export default UserProfile
