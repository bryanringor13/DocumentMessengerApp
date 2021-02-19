import React, { useState } from 'react'
import { Grid, Col, Item, Button, Input, Header, Title, Body, Right, Left, Thumbnail, Icon, Subtitle } from 'native-base'
import { TouchableHighlight, StyleSheet, Image, View, Text } from 'react-native'
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import * as ACCEPTANCE from '../../store/modules/dashboard/action';
import { RootState } from '../../store/modules/combinedReducers'
import { Badge } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'

const intellicareImg = require('../../images/intellicare.png');


interface HeaderState {
    searchBar: boolean;
    searchText: String;
    setSearchBar: Function;
    setSearchText: Function;
    searchTextHandler: Function;
    searchCLoseHandler: Function;
    closeSearchHandler: Function;
    userProfile: Function;
    currentPage: String;
    notAllowedBtnBack: boolean;
    closeUserProfileHandler: Function;
    searchHistoryHandler: Function;
    headerBtnCloseFunction: Function;
    headerTitle: String;
    headerSubTitle: String;
    notificationHandler: Function;
    noBackArrow: boolean;
}

const HeaderComponent = ({
    searchBar,
    searchText,
    setSearchBar,
    setSearchText,
    searchTextHandler,
    searchCLoseHandler,
    closeSearchHandler,
    userProfile,
    currentPage,
    notAllowedBtnBack,
    closeUserProfileHandler,
    searchHistoryHandler,
    headerBtnCloseFunction,
    headerTitle,
    headerSubTitle,
    notificationHandler,
    noBackArrow,
}: HeaderState) => {
    const dispatch = useDispatch()
    const auth = useSelector((state: RootState) => state.auth)
    const dashboard = useSelector((state: RootState) => state.acceptance)
    return (
        currentPage === 'history' ?
            <>
                {searchBar ? <TouchableHighlight style={styles.overlay} onPress={() => searchCLoseHandler()}>
                    <Grid>
                        <Col>
                            <Item style={{ backgroundColor: '#FFFFFF', paddingLeft: 15, paddingRight: 15, paddingTop: 2, paddingBottom: 2 }}>
                                <Button transparent onPress={() => searchCLoseHandler()}>
                                    <MaterialIcons name="arrow-back" size={24} color="black" />
                                </Button>
                                <Input
                                    placeholder="Search"
                                    value={searchText}
                                    onChangeText={(event) => searchTextHandler(event)}
                                    onSubmitEditing={() => {
                                        searchCLoseHandler() // called only when multiline is false
                                    }}
                                />
                                <Button transparent onPress={() => searchTextHandler('')}>
                                    <MaterialIcons color="black" size={24} name="clear" />
                                </Button>
                            </Item>
                        </Col>
                    </Grid>
                </TouchableHighlight> : null}
                {!!searchText ?
                    <Header style={{ backgroundColor: '#FFFFFF', height: 80 }}>
                        <Body style={{ paddingLeft: 15 }}>
                            <TouchableOpacity onPress={() => setSearchBar(true)}>
                                <Title style={{ color: '#2F3542', marginLeft: 5 }}>{searchText}</Title>
                            </TouchableOpacity>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => closeSearchHandler()}>
                                <MaterialIcons color="black" size={24} name="clear" />
                            </Button>
                        </Right>
                    </Header> : <Header style={{ backgroundColor: '#FFFFFF', height: 80 }}>
                        <Left style={{ paddingLeft: 5 }}>
                            <Button transparent disabled={notAllowedBtnBack} onPress={() => closeUserProfileHandler()}>
                                <Ionicons name='md-arrow-back' size={24} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ color: '#2F3542' }}>History</Title>
                        </Body>
                        <Right>
                            <Button transparent disabled={notAllowedBtnBack} onPress={() => searchHistoryHandler(true)}>
                                <AntDesign name='search1' size={24} />
                            </Button>
                        </Right>
                    </Header>}
            </> 
            : 
            currentPage === 'bundleddetails' || currentPage === 'acceptedpage' || currentPage === 'signaturescreen' || currentPage === 'camerascreen' || currentPage === 'normalheader' ?
                <Header style={{ backgroundColor: '#FFFFFF', height: 80 }}>
                    {noBackArrow ? null : <Left style={{ paddingLeft: 5 }}>
                        <Button transparent disabled={notAllowedBtnBack} onPress={() => headerBtnCloseFunction()}>
                            <Ionicons name='md-arrow-back' size={24} />
                        </Button>
                    </Left>}
                    {noBackArrow ? <><Left>
                        <Title style={{ color: '#2F3542', width: 400, marginLeft: 10 }}>{headerTitle}</Title>
                        {headerSubTitle.length > 0 ? <Subtitle style={{ color: '#A5B0BE' }}>{headerSubTitle}</Subtitle> : null}
                    </Left><Body /></> : <Body>
                            <Title style={{ color: '#2F3542', width: 400 }}>{headerTitle}</Title>
                            {headerSubTitle.length > 0 ? <Subtitle style={{ color: '#A5B0BE' }}>{headerSubTitle}</Subtitle> : null}
                        </Body>}

                    <Right />
                </Header> : currentPage === 'requestdetails' ?
                    <Header style={{ backgroundColor: '#FFFFFF', height: 80 }}>
                        <Left style={{ paddingLeft: 5 }}>
                            <Button transparent disabled={notAllowedBtnBack} onPress={() => headerBtnCloseFunction()}>
                                <Ionicons name='md-arrow-back' size={24} />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ color: '#2F3542' }}>{headerTitle}</Title>
                            <Subtitle style={{ color: '#A5B0BE' }}>{headerSubTitle}</Subtitle>
                        </Body>
                        <Right />
                    </Header> :
                    <>
                        {searchBar ? <TouchableHighlight style={styles.overlay} onPress={() => searchCLoseHandler()}>
                            <Grid>
                                <Col>
                                    <Item style={{ backgroundColor: '#FFFFFF', paddingLeft: 15, paddingRight: 15, paddingTop: 2, paddingBottom: 2 }}>
                                        <Button transparent onPress={() => searchCLoseHandler()}>
                                            <MaterialIcons name="arrow-back" size={24} color="black" />
                                        </Button>
                                        <Input
                                            placeholder="Search"
                                            value={searchText}
                                            onChangeText={(event) => searchTextHandler(event)}
                                            onSubmitEditing={() => {
                                                searchCLoseHandler() // called only when multiline is false
                                            }}
                                        />
                                        <Button 
                                            transparent 
                                            disabled={!searchText} 
                                            onPress={() => {
                                                setSearchText('')
                                                dispatch(ACCEPTANCE.clearSearch())
                                            }
                                        }>
                                            <MaterialIcons color="black" size={24} name="clear" />
                                        </Button>
                                    </Item>
                                </Col>
                            </Grid>
                        </TouchableHighlight> : null}
                        {!!searchText ?
                            <Header style={{ backgroundColor: '#FFFFFF', height: 80 }}>
                                <Body style={{ paddingLeft: 15 }}>
                                    <TouchableOpacity onPress={() => setSearchBar(true)}>
                                        <Title style={{ color: '#2F3542', marginLeft: 5 }}>{searchText}</Title>
                                    </TouchableOpacity>
                                </Body>
                                <Right>
                                    <Button transparent onPress={() => closeSearchHandler()}>
                                        <MaterialIcons color="black" size={24} name="clear" />
                                    </Button>
                                </Right>
                            </Header> :
                            <Header style={{ backgroundColor: '#FFFFFF', height: 80 }}>
                                <Left style={{ flex: 1 }}>
                                    <TouchableHighlight style={{ borderRadius: 50 }} onPress={() => userProfile()}>
                                        {/* <Thumbnail source={{ uri: 'Image URL' }} style={{ backgroundColor: '#000000', width: 40, height: 40 }} /> */}
                                        <View style={{ backgroundColor: '#1F236F', width: 40, height: 40, borderRadius: 50, justifyContent: 'center' }}>
                                            <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 14, fontWeight: '500' }}>
                                                {!!auth.user.messenger ? auth.user.messenger.first_name.charAt(0) : null}
                                            </Text>
                                        </View>
                                    </TouchableHighlight>
                                </Left>
                                <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={intellicareImg} style={{ height: 50, resizeMode: "contain" }} />
                                </Body>
                                <Right style={{ flex: 1 }}>
                                    <Button transparent onPress={() => setSearchBar(true)}>
                                        <Icon style={{ color: '#000000' }} name='search' />
                                    </Button>
                                    <Button transparent onPress={() => notificationHandler()}>
                                        <View>
                                            <MaterialIcons name="notifications-none" size={24} color="black" />
                                            {dashboard.notification.newUpdate ? <Badge
                                                status="error"
                                                containerStyle={{ position: 'absolute', top: -2, right: -2 }}
                                            /> : null}
                                        </View>
                                    </Button>
                                </Right>
                            </Header>
                        }
                    </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navigationBorder: {
        backgroundColor: '#F4F6F9',
    },
    navigationButton: {
        height: 50,
        borderWidth: 2,
        borderRadius: 10,
        borderStyle: 'solid',
        borderColor: '#E0E6ED',
    },
    buttonAccept: {
        backgroundColor: '#41B67F'
    },
    disabledButtonAccept: {
        backgroundColor: '#9dd6bd'
    },
    selectAll: {
        height: 36,
        width: 125,
        borderRadius: 10,
        paddingTop: 9,
        paddingRight: 10,
        paddingBottom: 9,
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        elevation: 1,
        marginBottom: 8,
        paddingLeft: 10
    },
    cardStyle: {
        marginTop: 8
    },
    cardUncheckedStyle: {
        backgroundColor: '#FFFFFF',
        paddingLeft: 10,
        borderRadius: 10,
        height: 82,
        paddingRight: 10,
        paddingTop: 16,
        paddingBottom: 16,
        elevation: 1
    },
    cardCheckedStyle: {
        backgroundColor: '#D6EFE3',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#41B67F',
        paddingLeft: 10,
        borderRadius: 10,
        height: 82,
        paddingRight: 10,
        paddingTop: 16,
        paddingBottom: 16,
        elevation: 1
    },
    cardBox: {
        borderRadius: 10,
    },
    overlay: {
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
        position: "absolute",
        zIndex: 999999,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000000",
        opacity: 0.9,
    },
});

HeaderComponent.defaultProps = {
    searchBar: false,
    searchText: '',
    setSearchBar: () => { },
    setSearchText: () => { },
    searchTextHandler: () => { },
    searchCLoseHandler: () => { },
    closeSearchHandler: () => { },
    userProfile: () => { },
    currentPage: '',
    notAllowedBtnBack: false,
    closeUserProfileHandler: () => { },
    searchHistoryHandler: () => { },
    headerBtnCloseFunction: () => { },
    headerTitle: '',
    headerSubTitle: '',
    notificationHandler: () => { },
    noBackArrow: false,
}

export default HeaderComponent
