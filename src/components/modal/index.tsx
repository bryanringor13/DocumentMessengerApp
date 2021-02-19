import React from 'react'
import { StyleSheet, Text, Modal } from 'react-native'
import { View, Grid, Col, Button, Spinner } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import { RootState } from '../../store/modules/combinedReducers'
import { useSelector } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface ModalState {
    closedModal: Function;
    status: String;
    actionCode: Number;
}

const ModalComponent = ({ closedModal, status, actionCode }: ModalState) => {
    const acceptance = useSelector((state: RootState) => state.acceptance)
    const auth = useSelector((state: RootState) => state.auth)
    return (
        <View style={styles.overlay}>
            <Grid>
                <Col style={{ justifyContent: 'center', padding: 15 }}>
                    <View style={{
                        zIndex: 1,
                        borderRadius: 50,
                        borderWidth: 5,
                        borderStyle: 'solid',
                        borderColor: '#FFFFFF',
                        alignSelf: 'center',
                        backgroundColor: '#FFFFFF',
                        height: 64,
                        width: 64,
                        top: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    >
                        <View style={{
                            borderRadius: 50,
                            height: 64,
                            width: 64,
                            backgroundColor: '#FFFFFF',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <View style={{
                                borderRadius: 50,
                                height: 50,
                                width: 50,
                                backgroundColor: '#41B67F',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                {auth.connection.status ? acceptance.bundledDetails.response.status.length > 0 ? <AntDesign name='check' style={{ color: '#FFFFFF' }} size={32} /> : <Spinner color='#FFFFFF' size={32} /> : acceptance.intransit.offMode.label.length > 0 ? <AntDesign name='check' style={{ color: '#FFFFFF' }} size={32} /> : <Spinner color='#FFFFFF' size={32} />}
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '100%', height: 250, backgroundColor: '#FFFFFF', borderRadius: 2 }}>
                        <View style={{ width: '100%', height: 250, backgroundColor: '#FFFFFF', borderRadius: 2 }}>
                            <Grid>
                                <Col>
                                    <View style={{ marginTop: 40, justifyContent: 'center', alignItems: 'center' }}>
                                        {auth.connection.status ? <Text style={{ color: '#2F3542', fontSize: 16, fontWeight: 'bold', lineHeight: 19 }}>{acceptance.bundledDetails.response.status.length > 0 ? 'Status Successfully Submitted' : 'On Progress'}</Text> : <Text style={{ color: '#2F3542', fontSize: 16, fontWeight: 'bold', lineHeight: 19 }}>{acceptance.intransit.offMode.label.length > 0 ? 'Status Successfully Saved' : 'On Progress'}</Text>}

                                        <View style={{ display: 'flex', marginTop: 10 }}>
                                            {auth.connection.status ?
                                                <Text style={{ color: '#2F3542', fontSize: 16, textAlign: 'center', fontWeight: 'normal', width: 300 }}>Status: {
                                                    acceptance.bundledDetails.response.status.length > 0 ? <Text style={{ color: actionCode === 0 ? '#41B67F' : '#FA5656', fontSize: 16, fontWeight: 'normal' }}>{acceptance.bundledDetails.response.status}</Text> : <Text style={{ color: '#29B1C3', fontSize: 16, fontWeight: 'normal' }}>Please wait</Text>
                                                }</Text> :
                                                <Text style={{ color: '#2F3542', fontSize: 16, textAlign: 'center', fontWeight: 'normal', width: 300 }}>Status: {
                                                    acceptance.intransit.offMode.label.length > 0 ? <Text style={{ color: actionCode === 0 ? '#41B67F' : '#FA5656', fontSize: 16, fontWeight: 'normal' }}>{acceptance.intransit.offMode.label}</Text> : <Text style={{ color: '#29B1C3', fontSize: 16, fontWeight: 'normal' }}>Please wait</Text>
                                                }</Text>}

                                        </View>
                                        <View style={{ marginTop: 20 }}>
                                            {auth.connection.status ? <TouchableOpacity disabled={acceptance.bundledDetails.response.status.length > 0 ? false : true} style={{ width: 300, height: 70, justifyContent: 'center', backgroundColor: acceptance.bundledDetails.response.status.length > 0 ? '#41B67F' : '#9dd6bd' }} onPress={() => closedModal()}>
                                                <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>{acceptance.bundledDetails.response.status.length > 0 ? 'Done' : 'Please Wait'}</Text>
                                            </TouchableOpacity> : <TouchableOpacity disabled={acceptance.intransit.offMode.label.length > 0 ? false : true} style={{ width: 300, height: 70, justifyContent: 'center', backgroundColor: acceptance.intransit.offMode.label.length > 0 ? '#41B67F' : '#9dd6bd' }} onPress={() => closedModal()}>
                                                    <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>{acceptance.intransit.offMode.label.length > 0 ? 'Done' : 'Please Wait'}</Text>
                                                </TouchableOpacity>}
                                        </View>
                                        {!auth.connection.status ?
                                            <View style={{ padding: 20 }}>
                                                <Text style={{ textAlign: 'center' }}>
                                                    Note: Changes are saved and will be submitted once back online.
                                            </Text>
                                            </View> : null}
                                    </View>
                                </Col>
                            </Grid>
                        </View>
                    </View>
                </Col>
            </Grid>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
        position: "absolute",
        zIndex: 1,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
        opacity: 0.9,
    },
})

ModalComponent.defaultProps = {
    closedModal: () => { },
    status: '',
    actionCode: 0,
}

export default ModalComponent
