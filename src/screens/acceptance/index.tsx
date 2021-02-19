import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/modules/combinedReducers'
import { useFocusEffect } from '@react-navigation/native';

import * as AUTH from '../../store/modules/auth/action'
import * as ACCEPTANCE from '../../store/modules/dashboard/action'
import * as TABSCOUNT from '../../store/modules/tabscount/action'

import BodyComponent from '../../components/body'
import FooterComponent from '../../components/footer'
import HeaderComponent from '../../components/header'
import { ToastAndroid, Alert, BackHandler, Text } from 'react-native'
import { View } from 'react-native'

// import { useToast } from 'react-native-styled-toast'

function wait(timeout: number) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const AcceptanceScreen = ({ route, navigation, setTabHandler, currentTab, setRefreshList, refreshList }) => {
    // const { toast } = useToast()
    let checkedCount = 0
    const dispatch = useDispatch()
    const acceptance = useSelector((state: RootState) => state.acceptance)
    const auth = useSelector((state: RootState) => state.auth)
    const [searchBar, setSearchBar] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [notAllowAccept, setNotAllowAccept] = useState(false)
    const [refreshtabs, setRefreshtabs] = useState(true)
    const [acceptShowToast, setAcceptShowToast] = useState(false)
    const [toggleNotification, setToggleNotification] = useState(true)
    const [countRequestToDeduct, setCountRequestToDeduct] = useState(0)

    const searchTextHandler = (value: any) => {
        setSearchText(value)
        dispatch(ACCEPTANCE.searchKeyword(value))
    }

    const searchCLoseHandler = () => {
        console.log(searchText)
        // dispatch(ACCEPTANCE.clearListingsAcceptance())
        if (auth.connection.status) {
            if (acceptance.currentTab === 'acceptance') {
                dispatch(ACCEPTANCE.clearListingsAcceptance())
                dispatch(ACCEPTANCE.listAcceptance())
            } else {
                if (acceptance.intransit.offMode.intransit.length == 0) {
                    dispatch(ACCEPTANCE.clearListingsIntransit())
                    dispatch(ACCEPTANCE.listIntransit())
                }
            }
        }
        // else {
        // dispatch(ACCEPTANCE.clearListingsAcceptance())
        // dispatch(ACCEPTANCE.clearListingsIntransit())
        // }

        setSearchBar(false)
    }

    const selectChangeHandler = (requestName: any, checked: boolean) => {
        console.log(requestName, checked)
        let prevRequestList = acceptance.acceptance
        if (checked) { checked = false } else { checked = true; }

        let { requestType, request, allChecked, pagination } = prevRequestList;
        if (requestName === "checkAll") {
            allChecked = checked;
            request = request.map(request => ({ ...request, isChecked: checked }));
        } else {
            request = request.map(request =>
                request.id === requestName ? { ...request, isChecked: checked } : request
            );

            allChecked = request.every(request => request.isChecked);
        }

        dispatch(ACCEPTANCE.selectTrigger({ requestType, request, allChecked, pagination }));
    }

    const viewDetailsHandler = (transmittal_no: any, id: any, currentTab: any, transmittal_key: any) => {
        dispatch(ACCEPTANCE.clearResponse())
        dispatch(ACCEPTANCE.clearAcceptedDetails())
        dispatch(ACCEPTANCE.viewDetails(id, false, false))
        // console.log('View Details: ', id)
        navigation.push('RequestDetails', {
            transmittalNo: transmittal_no,
            currentTab: currentTab,
            btnFooter: true,
            setRefreshtabs: setRefreshtabs,
            transmittal_key: transmittal_key
        })
    }

    const viewBundledHandler = (company: any, transmital_count: any, currentTab: any, transmittal_key: any, bundledType: any, contactPerson: any) => {
        console.log(company, transmital_count, currentTab, transmittal_key, bundledType, contactPerson)
        navigation.push('BundledDetails', {
            company: company,
            transmital_count: transmital_count,
            currentTab: currentTab,
            transmittal_key: transmittal_key,
            bundledType: bundledType,
            contactPerson: contactPerson,
        })
    }

    const showToastHandler = (text: any) => {
        dispatch(ACCEPTANCE.clearMessage())
        // toast({ message: text })
        ToastAndroid.showWithGravity(
            text,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );

        if (auth.connection.status) {
            dispatch(TABSCOUNT.getTabCount())
            dispatch(ACCEPTANCE.clearListingsAcceptance())
            dispatch(ACCEPTANCE.listAcceptance())
        } else {
            dispatch(TABSCOUNT.deductTabCount(countRequestToDeduct))
        }
    }

    const acceptButtonSelectedHandler = () => {
        setNotAllowAccept(true)
        setAcceptShowToast(true)
        let request_id = []
        let request_selected = {
            requests: []
        }
        acceptance.acceptance.request.map(request => {
            if (request.isChecked) {
                request_id = [...request_id, request.id]
            }
        }
        );
        request_selected = { requests: request_id }

        setCountRequestToDeduct(request_id.length)
        dispatch(ACCEPTANCE.acceptRequest(request_selected))
    }

    const closeSearchHandler = () => {
        setAcceptShowToast(false)
        setSearchText('')
        dispatch(ACCEPTANCE.clearSearch())
        if (auth.connection.status) {
            if (acceptance.currentTab === 'acceptance') {
                dispatch(ACCEPTANCE.clearListingsAcceptance())
                dispatch(ACCEPTANCE.listAcceptance())
            } else {
                if (acceptance.intransit.offMode.intransit.length == 0) {
                    dispatch(ACCEPTANCE.clearListingsIntransit())
                    dispatch(ACCEPTANCE.listIntransit())
                }
            }
        }
    }

    const userProfile = () => {
        // dispatch(AUTH.logoutUser())
        navigation.push('UserProfile')
    }

    useEffect(() => {
        function selectHandler() {
            if (acceptance.acceptance.request.length > 0) {
                const haveChecked = acceptance.acceptance.request.some(requestChecked => requestChecked.isChecked === true)
                if (auth.connection.status) setNotAllowAccept(!haveChecked);
                else setNotAllowAccept(true)
                // console.log('Request List', requestList)
            } else {
                setNotAllowAccept(true)
            }
        }

        selectHandler()
    }, [acceptance.acceptance])

    useEffect(() => {
        function tabsCountRefresh() {
            setRefreshtabs(state => !state)
            if (auth.connection.status) dispatch(TABSCOUNT.getTabCount())
        }

        if (refreshtabs) tabsCountRefresh()
    }, [refreshtabs])

    useEffect(() => {
        // function getAcceptance() {
        if (auth.connection.status) {
            // if (acceptance.currentTab === 'acceptance') {
            // dispatch(ACCEPTANCE.clearListingsAcceptance())
            dispatch(AUTH.userProfile())
            dispatch(ACCEPTANCE.listAcceptance())
            // } else {
            // dispatch(ACCEPTANCE.clearListingsIntransit())
            if (acceptance.intransit.offMode.intransit.length == 0) dispatch(ACCEPTANCE.listIntransit())
            // }
        }
        // }
        // getAcceptance()
    }, [])

    useEffect(() => {
        if (acceptance.message.length > 0 && acceptShowToast) showToastHandler(acceptance.message)
    }, [acceptance.message])

    const notificationHandler = () => {
        if (toggleNotification) {
            setToggleNotification(false)
            if (auth.connection.status) {
                dispatch(ACCEPTANCE.notifStatus(false))
                dispatch(ACCEPTANCE.getNotifCount())
            }
            navigation.push('Notification', {
                setToggleNotification: setToggleNotification
            })
        }
    }

    useFocusEffect(() => {
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want to exit?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: "YES", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    return (
        <>
            <HeaderComponent
                searchBar={searchBar}
                searchText={searchText}
                setSearchBar={setSearchBar}
                setSearchText={setSearchText}
                searchTextHandler={searchTextHandler}
                searchCLoseHandler={searchCLoseHandler}
                closeSearchHandler={closeSearchHandler}
                userProfile={userProfile}
                notificationHandler={notificationHandler}
            />
            <BodyComponent
                setRefreshList={setRefreshList}
                setRefreshtabs={setRefreshtabs}
                currentTab={acceptance.currentTab}
                setTabHandler={setTabHandler}
                selectChangeHandler={selectChangeHandler}
                viewDetailsHandler={viewDetailsHandler}
                viewBundledHandler={viewBundledHandler}
            />
            {acceptance.currentTab === 'acceptance' ?
                <FooterComponent
                    notAllowedBtn={notAllowAccept}
                    buttonTitle={acceptance.currentTab === 'acceptance' ? 'Accept' : 'Change Status'}
                    btnFunction={acceptButtonSelectedHandler}
                /> : null
            }
        </>
    )
}

export default AcceptanceScreen