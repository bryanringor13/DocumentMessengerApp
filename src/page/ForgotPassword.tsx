import React, { useState, useEffect } from 'react'
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Picker } from 'react-native'
import { Container, Content, Card, CardItem, Grid, Col, Body, Button, List, ListItem, Left, Right } from 'native-base'
import HeaderComponent from '../components/header'
import { Feather, AntDesign, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/modules/combinedReducers';
import { verifyPassword } from '../store/modules/auth/action';


const ForgotPassword = ({ route, navigation }) => {
    const auth = useSelector((state: RootState) => state.auth)
    const acceptance = useSelector((state: RootState) => state.acceptance)
    const [notAllowedBtnBack, setNotAllowedBtnBack] = useState(false)

    const closeUserProfileHandler = () => {
        if (!notAllowedBtnBack) {

            setNotAllowedBtnBack(state => !state)
            navigation.goBack()
        }
    }

    return (
        <Container style={{ backgroundColor: '#F4F6F9' }}>
            <HeaderComponent currentPage='normalheader' headerBtnCloseFunction={closeUserProfileHandler} headerTitle='Forgot Password' />
            <Content>
                {auth.connection.status ? acceptance.intransit.offMode.intransit.length > 0 ? <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                    <Text style={{ textAlign: 'center', fontSize: 12 }}>Syncing...</Text>
                </View> : null : <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                        <Text style={{ textAlign: 'center', fontSize: 12 }}>You're offline</Text>
                    </View>}
                <Card style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }}>
                    <CardItem bordered>
                        <Body>
                            <Grid>
                                <Col>
                                    <View>
                                        <Text style={{ fontWeight: '600', fontSize: 16 }}>How To Reset your Password</Text>
                                    </View>
                                    <View style={{ marginTop: 16 }}>
                                        <View style={styles.listItemRow} noBorder>
                                            <View style={{ width: 30 }}>
                                                <Text style={{ lineHeight: 24, fontSize: 12, fontWeight: '600' }}>1.</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ lineHeight: 24, fontSize: 12 }}>Please call Intellicare FPAD at +5242011 loc 123 or at +639171234567.</Text>
                                            </View>
                                        </View>
                                        <View style={styles.listItemRow} noBorder>
                                            <View style={{ width: 30 }}>
                                                <Text style={{ lineHeight: 24, fontSize: 12, fontWeight: '600' }}>2.</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ lineHeight: 24, fontSize: 12 }}>Your default password will be given to you by your Admin Assistant, use your default password to login to your account.</Text>
                                            </View>
                                        </View>
                                        <View style={styles.listItemRow} noBorder>
                                            <View style={{ width: 30 }}>
                                                <Text style={{ lineHeight: 24, fontSize: 12, fontWeight: '600' }}>3.</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ lineHeight: 24, fontSize: 12 }}>Upon successful login, you will be required to nominate a new password.</Text>
                                            </View>
                                        </View>
                                        <View style={styles.listItemRow} noBorder>
                                            <View style={{ width: 30 }}>
                                                <Text style={{ lineHeight: 24, fontSize: 12, fontWeight: '600' }}>4.</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ lineHeight: 24, fontSize: 12 }}>Please nominate a strong password for a more secure account.</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 25, borderWidth: 1, borderStyle: 'solid', borderColor: '#E0E6ED', borderRadius: 10, paddingLeft: 17, paddingTop: 20, paddingRight: 17, paddingBottom: 20 }}>
                                        <View>
                                            <Text style={{ fontWeight: 'bold' }}>Intellicare FPAD</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <FontAwesome name="phone" size={24} /><Text style={{ marginLeft: 2, fontSize: 12 }}> +5242011 loc 123</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <MaterialCommunityIcons name='cellphone' size={24} /><Text style={{ marginLeft: 2, fontSize: 12 }}>+639171234567</Text>
                                            </View>
                                        </View>
                                    </View>
                                </Col>
                            </Grid>
                        </Body>
                    </CardItem>
                </Card>
            </Content>
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
    listItemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        flex: 1,
        marginVertical: 4
    }
})

export default ForgotPassword
