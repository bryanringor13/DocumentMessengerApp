import React, { useState, useEffect } from 'react'
import { Text, StyleSheet, View, BackHandler } from 'react-native'
import { Container, Content, Card, CardItem, Grid, Col, Body } from 'native-base'
import HeaderComponent from '../components/header'
import { RootState } from '../store/modules/combinedReducers'
import { useSelector } from 'react-redux'

const AssignedLocation = ({ route, navigation }) => {
    const { assigned_location } = route.params;
    const [notAllowedBtnBack, setNotAllowedBtnBack] = useState(false)
    const auth = useSelector((state: RootState) => state.auth)
    const acceptance = useSelector((state: RootState) => state.acceptance)

    const closeUserProfileHandler = () => {
        if (!notAllowedBtnBack) {

            setNotAllowedBtnBack(state => !state)
            navigation.goBack()
        }
    }

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
            <HeaderComponent currentPage='normalheader' headerBtnCloseFunction={closeUserProfileHandler} headerTitle='Assigned Locations' />
            {auth.connection.status ? acceptance.intransit.offMode.intransit.length > 0 ? <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                <Text style={{ textAlign: 'center', fontSize: 12 }}>Syncing...</Text>
            </View> : null : <View style={{ backgroundColor: '#E0E6ED', height: 25, justifyContent: 'center', width: '100%' }}>
                    <Text style={{ textAlign: 'center', fontSize: 12 }}>You're offline</Text>
                </View>}
            <Content padder>
                {assigned_location.length > 0 ? assigned_location.map((locations, index) => (
                    <Card key={index} style={{ marginTop: 20 }}>
                        <CardItem header bordered>
                            <Text style={{ fontWeight: '500', color: '#2F3542' }}>Assigned Location {index + 1}</Text>
                        </CardItem>
                        <CardItem bordered>
                            <Body>
                                <Grid>
                                    <Col>
                                        <Text style={{ color: '#A5B0BE' }}>
                                            City
                                        </Text>
                                    </Col>
                                    <Col>
                                        <Text style={{ textAlign: 'left' }}>
                                            {locations.city}
                                        </Text>
                                    </Col>
                                </Grid>
                                <Grid style={{ marginTop: 10 }}>
                                    <Col>
                                        <Text style={{ color: '#A5B0BE' }}>
                                            Assigned{'\n'}Barangay(s)
                            </Text>
                                    </Col>
                                    <Col>
                                        <Text style={{ textAlign: 'left' }}>
                                            {locations.barangays.length > 0 ? locations.barangays.map((barangays, index) => (
                                                <Text key={index}>{barangays}{'\n'}</Text>
                                            )) : null}
                                        </Text>
                                    </Col>
                                </Grid>
                            </Body>
                        </CardItem>
                    </Card>)) : null}
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({

})

export default AssignedLocation
