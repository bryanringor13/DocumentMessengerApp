import axios from 'axios'
import {
    LIST_ACCEPTANCE,
    LOADING_ACCEPTANCE,
    SELECT_REQUEST,
    VIEW_DETAILS,
    CLEAR_DETAILS,
    SET_KEYWORD,
    CLEAR_SEARCH,
    ACCEPTED_REQUEST,
    CLEAR_MESSAGE,
    GET_BUNDLED_DETAILS,
    CLEAR_BUNDLED_DETAILS,
    SELECT_BUNDLED_REQUEST,
    SET_SIGNATURE,
    SET_DOCUMENTS,
    CLEAR_ACCEPTED_DETAILS,
    CLEAR_SIGNATURE,
    STATUS_ACCEPTED,
    REMOVE_REQUEST,
    CLEAR_RESPONSE,
    GET_HISTORY,
    SET_HISTORY_KEYWORD,
    SET_HISTORY_DATE_RANGE,
    CLEAR_HISTORY_KEYWORD,
    CLEAR_HISTORY_DATERANGE,
    CLEAR_HISTORY,
    CLEAR_LISTINGS,
    SCROLL_DOWN,
    SET_TAB,
    LOADING_NOTIFICATION,
    GET_NOTIFICATION,
    CLEAR_NOTIFICATION,
    HAS_UPDATE,
    MARK_AS_READ_BULK,
    COUNT_UNREAD,
    MARK_AS_SINGLE_READ,
    SCROLL_NOTIFICATION,
    SAVE_OFFLINE_INTRANSIT,
    SAVE_OFFLINE_ACCEPTED,
    CLEAR_LISTINGS_ACCEPTANCE,
    CLEAR_LISTINGS_INTRANSIT,
    LIST_INTRANSIT,
    SCROLL_DOWN_INTRANSIT,
    SCROLL_DOWN_ACCEPTANCE,
    CLEAR_OFFMODE_ACCEPTANCE,
    VIEW_DETAILS_ACCEPTANCE,
    VIEW_DETAILS_INTRANSIT,
    VIEW_DETAILS_BUNDLED,
    SAVE_OFFLINE_BUNDLED,
    REMOVE_ITEM_LIST_IN_OFFMODE,
    SYNC_ONGOING

} from './types';
import { returnErrors } from '../error/action'
import * as API from '../../../utils/Constants'
import { invalidUser } from '../auth/action';
import moment from 'moment';
import { getTabCount } from '../tabscount/action';
moment.locale("en");

export const listAcceptance = () => (dispatch, getState) => {
    dispatch({ type: LOADING_ACCEPTANCE })

    const content = 'acceptance'
    const search = getState().acceptance.search
    const pagination = getState().acceptance.acceptance.pagination
    let paramsQuery = "", paginationQuery = ""

    const paginationAcceptance = JSON.parse(JSON.stringify(pagination))
    delete paginationAcceptance.hasNext
    paginationQuery = `${new URLSearchParams(paginationAcceptance).toString()}`

    if (search.keyword.length > 0) {
        const searchAcceptance = JSON.parse(JSON.stringify(search))
        paramsQuery = `&${new URLSearchParams(searchAcceptance).toString()}`
    }

    // Headers
    const config = tokenConfig(getState)

    console.log('Link Requesting: ', config, API.CURRENT_TABS[content], paramsQuery, paginationQuery)

    axios
        .get(`${API.CURRENT_TABS[content]}?showAll=true${paramsQuery}`, config)
        .then((res) => {
            let data = {}, request: any[] = [], pagination = {
                hasNext: res.data.pagination.hasNext,
                itemLimit: res.data.pagination.itemLimit,
                skipItem: res.data.pagination.skipItem
            }

            // console.log(res.data.data)

            // if (content === 'acceptance') {
            res.data.data.map((acceptance, index) => {
                request = [...request, {
                    key: index,
                    isChecked: false,
                    id: acceptance.id,
                    expected_date: acceptance.expected_date,
                    assigned_at: acceptance.assigned_at,
                    company: acceptance.company,
                    transmittal_no: acceptance.transmittal_no,
                    is_urgent: acceptance.is_urgent,
                    view_data: acceptance.view_data
                }]
            })
            // } else {
            //     res.data.data.map((intransit, index) => {
            //         request = [...request, {
            //             key: index,
            //             transmital_key: intransit.transmital_key,
            //             transmital_type: intransit.transmital_type,
            //             transmital_count: intransit.transmital_count,
            //             transmital_preview: intransit.transmital_preview,
            //             transmital_requests: intransit.transmital_requests
            //         }]
            //     })
            // }

            data = {
                requestType: content,
                request,
                pagination,
            }
            dispatch({
                type: LIST_ACCEPTANCE,
                payload: data,
            })
        })
        .catch((err) => {
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    errors = [{
                        "errMessage": err.response.data.message,
                        "path": "invalid",
                    }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )

                if (err.response.status === 401) dispatch(invalidUser())
            }
            console.log('Handle: ', err)
        })
}

export const listIntransit = () => (dispatch, getState) => {
    dispatch({ type: LOADING_ACCEPTANCE })
    // const currentTab = getState().acceptance.currentTab

    const search = getState().acceptance.search
    const content = 'intransit'
    const pagination = getState().acceptance.intransit.pagination
    let paramsQuery = "", paginationQuery = ""

    const paginationAcceptance = JSON.parse(JSON.stringify(pagination))
    delete paginationAcceptance.hasNext
    paginationQuery = `${new URLSearchParams(paginationAcceptance).toString()}`

    if (search.keyword.length > 0) {
        const searchAcceptance = JSON.parse(JSON.stringify(search))
        paramsQuery = `&${new URLSearchParams(searchAcceptance).toString()}`
    }

    // Headers
    const config = tokenConfig(getState)

    console.log('Link Requesting: ', config, `${API.CURRENT_TABS[content]}?showAll=true`)

    axios
        .get(`${API.CURRENT_TABS[content]}?showAll=true${paramsQuery}`, config)
        .then((res) => {
            let data = {}, request: any[] = [], pagination = {
                hasNext: res.data.pagination.hasNext,
                itemLimit: res.data.pagination.itemLimit,
                skipItem: res.data.pagination.skipItem
            }

            // console.log(res.data.data)

            // if (content === 'acceptance') {
            //     res.data.data.map((acceptance, index) => {
            //         request = [...request, {
            //             key: index,
            //             isChecked: false,
            //             id: acceptance.id,
            //             expected_date: acceptance.expected_date,
            //             assigned_at: acceptance.assigned_at,
            //             company: acceptance.company,
            //             transmittal_no: acceptance.transmittal_no,
            //             is_urgent: acceptance.is_urgent
            //         }]
            //     })
            // } else {
            res.data.data.map((intransit, index) => {
                request = [...request, {
                    key: index,
                    transmital_key: intransit.transmital_key,
                    transmital_type: intransit.transmital_type,
                    transmital_count: intransit.transmital_count,
                    transmital_preview: intransit.transmital_preview,
                    transmital_requests: intransit.transmital_requests
                }]
            })
            // }

            data = {
                requestType: content,
                request,
                pagination,
            }
            dispatch({
                type: LIST_INTRANSIT,
                payload: data,
            })
        })
        .catch((err) => {
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    errors = [{
                        "errMessage": err.response.data.message,
                        "path": "invalid",
                    }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )

                if (err.response.status === 401) dispatch(invalidUser())
            }
            console.log('Handle: ', err)
        })
}

export const newListWithoutLoad = () => (dispatch, getState) => {

    const currentTab = getState().acceptance.currentTab
    // const pagination = getState().acceptance.acceptance.pagination
    // let paramsQuery = "", paginationQuery = ""

    // const paginationAcceptance = JSON.parse(JSON.stringify(pagination))
    // delete paginationAcceptance.hasNext
    // paginationQuery = `?${new URLSearchParams(paginationAcceptance).toString()}`

    // if (search.keyword.length > 0) {
    //     const searchAcceptance = JSON.parse(JSON.stringify(search))
    //     paramsQuery = `&${new URLSearchParams(searchAcceptance).toString()}`
    // }

    // Headers
    const config = tokenConfig(getState)

    console.log('Link Requesting: ', config, API.CURRENT_TABS[currentTab])

    axios
        .get(`${API.CURRENT_TABS[currentTab]}?showAll=true`, config)
        .then((res) => {
            let data = {}, request: any[] = [], pagination = {
                hasNext: res.data.pagination.hasNext,
                itemLimit: res.data.pagination.itemLimit,
                skipItem: res.data.pagination.skipItem
            }

            if (currentTab === 'acceptance') {
                res.data.data.map((acceptance, index) => {
                    request = [...request, {
                        key: index,
                        isChecked: false,
                        id: acceptance.id,
                        expected_date: acceptance.expected_date,
                        assigned_at: acceptance.assigned_at,
                        company: acceptance.company,
                        transmittal_no: acceptance.transmittal_no,
                        is_urgent: acceptance.is_urgent,
                        view_data: acceptance.view_data
                    }]
                })


                data = {
                    requestType: currentTab,
                    request,
                    pagination,
                }
                dispatch({
                    type: LIST_ACCEPTANCE,
                    payload: data,
                })
            } else {
                res.data.data.map((intransit, index) => {
                    request = [...request, {
                        key: index,
                        transmital_key: intransit.transmital_key,
                        transmital_type: intransit.transmital_type,
                        transmital_count: intransit.transmital_count,
                        transmital_preview: intransit.transmital_preview,
                        transmital_requests: intransit.transmital_requests
                    }]
                })

                data = {
                    requestType: currentTab,
                    request,
                    pagination,
                }
                dispatch({
                    type: LIST_INTRANSIT,
                    payload: data,
                })
            }
        })
        .catch((err) => {
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    errors = [{
                        "errMessage": err.response.data.message,
                        "path": "invalid",
                    }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )

                if (err.response.status === 401) dispatch(invalidUser())
            }
            console.log('Handle: ', err)
        })
}

export const scrollDownAcceptance = () => (dispatch, getState) => {
    dispatch({ type: LOADING_ACCEPTANCE })

    const content = 'acceptance'
    const search = getState().acceptance.search
    const pagination = getState().acceptance.acceptance.pagination
    let paramsQuery = "", paginationQuery = ""

    const paginationAcceptance = JSON.parse(JSON.stringify(pagination))
    delete paginationAcceptance.hasNext
    paginationQuery = `?${new URLSearchParams(paginationAcceptance).toString()}`

    if (search.keyword.length > 0) {
        const searchAcceptance = JSON.parse(JSON.stringify(search))
        paramsQuery = `?${new URLSearchParams(searchAcceptance).toString()}`
        paginationQuery = `&${new URLSearchParams(paginationAcceptance).toString()}`
    }

    // Headers
    const config = tokenConfig(getState)

    console.log('Link Requesting: ', config, API.CURRENT_TABS[content] + paramsQuery + paginationQuery)

    axios
        .get(API.CURRENT_TABS[content] + paramsQuery + paginationQuery, config)
        .then((res) => {
            let data = {}, request: any[] = [], pagination = {
                hasNext: res.data.pagination.hasNext,
                itemLimit: res.data.pagination.itemLimit,
                skipItem: res.data.pagination.skipItem
            }

            const allChecked = getState().acceptance.acceptance.allChecked

            // if (content === 'acceptance') {
            res.data.data.map((acceptance, index) => {
                request = [...request, {
                    key: index,
                    isChecked: allChecked,
                    id: acceptance.id,
                    expected_date: acceptance.expected_date,
                    assigned_at: acceptance.assigned_at,
                    company: acceptance.company,
                    transmittal_no: acceptance.transmittal_no,
                    is_urgent: acceptance.is_urgent
                }]
            })
            // } else {
            //     res.data.data.map((intransit, index) => {
            //         request = [...request, {
            //             key: index,
            //             transmital_key: intransit.transmital_key,
            //             transmital_type: intransit.transmital_type,
            //             transmital_count: intransit.transmital_count,
            //             transmital_preview: intransit.transmital_preview,
            //             transmital_requests: intransit.transmital_requests
            //         }]
            //     })
            // }

            data = {
                requestType: content,
                request,
                pagination,
                allChecked,
            }
            dispatch({
                type: SCROLL_DOWN_ACCEPTANCE,
                payload: data,
            })
        })
        .catch((err) => {
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    errors = [{
                        "errMessage": err.response.data.message,
                        "path": "invalid",
                    }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )

                if (err.response.status === 401) dispatch(invalidUser())
            }
            console.log(err)
        })
}

export const scrollDownIntransit = () => (dispatch, getState) => {
    dispatch({ type: LOADING_ACCEPTANCE })

    const content = 'intransit'
    const search = getState().acceptance.search
    const pagination = getState().acceptance.intransit.pagination
    let paramsQuery = "", paginationQuery = ""

    const paginationAcceptance = JSON.parse(JSON.stringify(pagination))
    delete paginationAcceptance.hasNext
    paginationQuery = `?${new URLSearchParams(paginationAcceptance).toString()}`

    if (search.keyword.length > 0) {
        const searchAcceptance = JSON.parse(JSON.stringify(search))
        paramsQuery = `?${new URLSearchParams(searchAcceptance).toString()}`
        paginationQuery = `&${new URLSearchParams(paginationAcceptance).toString()}`
    }

    // Headers
    const config = tokenConfig(getState)

    console.log('Link Requesting: ', config, API.CURRENT_TABS[content] + paramsQuery + paginationQuery)

    axios
        .get(API.CURRENT_TABS[content] + paramsQuery + paginationQuery, config)
        .then((res) => {
            let data = {}, request: any[] = [], pagination = {
                hasNext: res.data.pagination.hasNext,
                itemLimit: res.data.pagination.itemLimit,
                skipItem: res.data.pagination.skipItem
            }

            // const allChecked = getState().acceptance.acceptance.allChecked

            // if (content === 'acceptance') {
            //     res.data.data.map((acceptance, index) => {
            //         request = [...request, {
            //             key: index,
            //             isChecked: allChecked,
            //             id: acceptance.id,
            //             expected_date: acceptance.expected_date,
            //             assigned_at: acceptance.assigned_at,
            //             company: acceptance.company,
            //             transmittal_no: acceptance.transmittal_no,
            //             is_urgent: acceptance.is_urgent
            //         }]
            //     })
            // } else {
            res.data.data.map((intransit, index) => {
                request = [...request, {
                    key: index,
                    transmital_key: intransit.transmital_key,
                    transmital_type: intransit.transmital_type,
                    transmital_count: intransit.transmital_count,
                    transmital_preview: intransit.transmital_preview,
                    transmital_requests: intransit.transmital_requests
                }]
            })
            // }

            data = {
                requestType: content,
                request,
                pagination,
            }
            dispatch({
                type: SCROLL_DOWN_INTRANSIT,
                payload: data,
            })
        })
        .catch((err) => {
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    errors = [{
                        "errMessage": err.response.data.message,
                        "path": "invalid",
                    }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )

                if (err.response.status === 401) dispatch(invalidUser())
            }
            console.log(err)
        })
}

export const getNotification = () => (dispatch, getState) => {
    dispatch({ type: LOADING_NOTIFICATION })

    // const search = getState().acceptance.search
    const pagination = getState().acceptance.notification.pagination
    let paginationQuery = ""

    const paginationNotification = JSON.parse(JSON.stringify(pagination))
    delete paginationNotification.hasNext
    paginationQuery = `?${new URLSearchParams(paginationNotification).toString()}`

    // if (search.keyword.length > 0) {
    //     const searchAcceptance = JSON.parse(JSON.stringify(search))
    //     paramsQuery = `?${new URLSearchParams(searchAcceptance).toString()}`
    //     paginationQuery = `&${new URLSearchParams(paginationAcceptance).toString()}`
    // }

    // Headers
    const config = tokenConfig(getState)

    // console.log('Notification: ', config, API.GET_NOTIFICATION)

    axios
        .get(API.GET_NOTIFICATION + paginationQuery, config)
        .then((res) => {
            console.log(res.data)
            let data = {}, list: any[] = res.data.data, pagination = {
                hasNext: res.data.pagination.has_next,
                itemLimit: res.data.pagination.item_limit,
                skipItem: res.data.pagination.skip_item
            }

            data = {
                list,
                pagination,
            }
            dispatch({
                type: GET_NOTIFICATION,
                payload: data,
            })
        })
        .catch((err) => {
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    errors = [{
                        "errMessage": err.response.data.message,
                        "path": "invalid",
                    }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )

                if (err.response.status === 401) dispatch(invalidUser())
            }
            console.log('Handle: ', err)
        })
}

export const getNotifCount = () => (dispatch, getState) => {

    const config = tokenConfig(getState)

    axios
        .get(API.GET_NOTIF_COUNT, config)
        .then((res) => {
            // console.log('GET NOTIF COUNT: ', res.data)
            let has_update: boolean = false;
            if (res.data.data > 0) has_update = true;

            dispatch({
                type: HAS_UPDATE,
                payload: has_update,
            })

            dispatch({
                type: COUNT_UNREAD,
                payload: res.data.data
            })
        })
        .catch((err) => {
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    errors = [{
                        "errMessage": err.response.data.message,
                        "path": "invalid",
                    }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )

                if (err.response.status === 401) dispatch(invalidUser())
            }
            console.log('Handle: ', err)
        })
}

export const markAsReadSingleNotif = (notificationID: any) => (dispatch, getState) => {

    // Headers
    const config = tokenConfig(getState)
    const currentNotificationList = getState().acceptance.notification.list
    let request: any[] = []

    axios
        .put(`${API.GET_NOTIFICATION}/${notificationID}/mark-as-read`, {}, config)
        .then((res) => {
            const currentListings = getState().acceptance.currentTab
            request = currentNotificationList.map(request =>
                request.id === res.data.data ? { ...request, is_read: true } : request
            )
            console.log('Response Mark as Read: ', res.data.data, request)
            dispatch({
                type: MARK_AS_SINGLE_READ,
                payload: request,
            })
            if (currentListings === 'acceptance') dispatch(listAcceptance())
            else {
                if (getState().acceptance.intransit.offMode.intransit.length == 0) dispatch(listIntransit())
            }
        })
        .catch((err) => {
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    errors = [{
                        "errMessage": err.response.data.message,
                        "path": "invalid",
                    }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )

                if (err.response.status === 401) dispatch(invalidUser())
            }
            console.log(err)
        })
}

export const markAsReadNotif = (notification: any) => (dispatch, getState) => {

    // Headers
    const config = tokenConfig(getState)
    const currentNotificationList = getState().acceptance.notification.list
    let request: any[] = [], request_remove: any[] = []

    const notifData = {
        notifications: notification
    }

    const body = JSON.stringify(notifData)
    // console.log('Marking as Read: ', body)
    axios
        .put(API.MARK_AS_READ_BULK, body, config)
        .then((res) => {
            const currentListings = getState().acceptance.currentTab
            // res.data.data.filter((notif: any) => currentNotificationList.includes(notif.id))
            res.data.data.map((resNotif) => {
                request_remove = [...request_remove, resNotif]
                request = currentNotificationList.map(request =>
                    request.id === resNotif ? { ...request, is_read: true } : request
                )
            })

            console.log('Response Mark as Read: ', res.data.data, request)
            dispatch({
                type: MARK_AS_READ_BULK,
                payload: request,
            })
            // if (currentListings === 'acceptance') dispatch(listAcceptance())
            // else dispatch(listIntransit())
        })
        .catch((err) => {
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    errors = [{
                        "errMessage": err.response.data.message,
                        "path": "invalid",
                    }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )

                if (err.response.status === 401) dispatch(invalidUser())
            }
            console.log(err)
        })
}

export const scrollNotification = () => (dispatch, getState) => {
    dispatch({ type: LOADING_NOTIFICATION })

    // const search = getState().acceptance.search
    const pagination = getState().acceptance.notification.pagination

    const paginationNotification = JSON.parse(JSON.stringify(pagination))
    delete paginationNotification.hasNext
    const paginationQuery = `?${new URLSearchParams(paginationNotification).toString()}`

    // Headers
    const config = tokenConfig(getState)

    console.log('Scroll Notification: ', config, API.GET_NOTIFICATION)

    axios
        .get(API.GET_NOTIFICATION + paginationQuery, config)
        .then((res) => {
            let data = {}, list: any[] = res.data.data, pagination = {
                hasNext: res.data.pagination.has_next,
                itemLimit: res.data.pagination.item_limit,
                skipItem: res.data.pagination.skip_item
            }

            data = {
                list,
                pagination,
            }
            dispatch({
                type: SCROLL_NOTIFICATION,
                payload: data,
            })
        })
        .catch((err) => {
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    errors = [{
                        "errMessage": err.response.data.message,
                        "path": "invalid",
                    }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )

                if (err.response.status === 401) dispatch(invalidUser())
            }
            console.log('Handle: ', err)
        })
}

export const clearNotification = () => {
    return {
        type: CLEAR_NOTIFICATION
    }
}

export const notifStatus = (status: boolean) => {
    return {
        type: HAS_UPDATE,
        payload: status
    }
}

export const setCurretTab = (tab: any) => (dispatch) => {
    dispatch({
        type: SET_TAB,
        payload: tab
    })
}

export const clearListings = () => {
    return {
        type: CLEAR_LISTINGS
    }
}

export const clearListingsAcceptance = () => {
    return {
        type: CLEAR_LISTINGS_ACCEPTANCE
    }
}

export const clearListingsIntransit = () => {
    return {
        type: CLEAR_LISTINGS_INTRANSIT
    }
}

export const changeStatus = (name, requestlist, actionLabel, reason, otherReason, actionCode, actionApi, transmittal_key) => (dispatch, getState) => {
    dispatch({ type: LOADING_ACCEPTANCE })
    let request = {}
    if (actionCode === 0) {
        const signature = getState().acceptance.bundledDetails.signature
        let documents = ''
        if (!!getState().acceptance.bundledDetails.documents) documents = getState().acceptance.bundledDetails.documents;

        request = {
            details: {
                name: name,
                signature: signature,
                photo: documents
            },
            requests: requestlist.requests,
        }
    } else if (actionCode === 1) {
        request = {
            details: {
                reason: reason
            },
            requests: requestlist.requests,
        }
    } else if (actionCode === 2) {
        request = {
            details: {
                reason: reason,
                others: otherReason
            },
            requests: requestlist.requests,
        }
    }

    const body = JSON.stringify(request)

    // console.log(body)
    // Headers
    const config = tokenConfig(getState)

    const connectionStatus = getState().auth.connection.status

    if (connectionStatus) {
        axios
            .put(actionApi, body, config)
            .then((res) => {
                let response = {
                    data: res.data.data,
                    status: actionLabel,
                }
                console.log('Change Status Response: ', response)
                dispatch({
                    type: STATUS_ACCEPTED,
                    payload: response,
                })
            })
            .catch((err) => {
                console.log('Error In Changing the status: ', err)
                if (!!err.response) {
                    let errors = []
                    let errMessage = "Cannot connect to server. Please contact administrator.", path = "connection"
                    if (!!err.response.data.errors) {
                        errors = err.response.data.errors
                    } else {
                        if (!!err.response.data) {
                            if (!!err.response.data.message) {
                                errMessage = err.response.data.message
                                path = "invalid"
                            }
                        } else if (!!err.response.message) {
                            errMessage = err.response.data.message
                            path = "invalid"
                        } else if (!!err.message) {
                            errMessage = err.message
                            path = "invalid"
                        }

                        errors = [{ "errMessage": errMessage, "path": path, }]
                    }
                    dispatch(
                        returnErrors(errors, err.response.status, err.response.data.message)
                    )
                    dispatch({
                        type: STATUS_ACCEPTED,
                        payload: {
                            data: [],
                            status: errMessage
                        }
                    })
                }
            })
    } else {
        if (getState().acceptance.bundledDetails.request.length > 0) {
            dispatch({
                type: SAVE_OFFLINE_BUNDLED,
                payload: {
                    data: {
                        api: actionApi,
                        body: request,
                        action_date: moment().format(),
                        transmittal_key: transmittal_key,
                    },
                    label: actionLabel,
                    trans_list: requestlist.requests,
                    action: request,
                    action_code: actionCode,
                    transmittal_key: transmittal_key
                }
            })
        } else {
            dispatch({
                type: SAVE_OFFLINE_INTRANSIT,
                payload: {
                    data: {
                        api: actionApi,
                        body: request,
                        action_date: moment().format(),
                        transmittal_key: transmittal_key
                    },
                    label: actionLabel,
                    trans_list: requestlist.requests,
                    action: request,
                    action_code: actionCode,
                    transmittal_key: transmittal_key
                }
            })
        }
    }
}

export const bundledDetails = (transmital_key: any) => (dispatch, getState) => {
    dispatch({ type: LOADING_ACCEPTANCE })

    let data = {}, transmittalRequest: any[] = []
    const requestDetails = getState().acceptance.intransit.request.filter((request: any) => request.transmital_key === transmital_key)
    // console.log(requestDetails[0])
    requestDetails[0].transmital_requests.map((request, index) => {
        transmittalRequest = [...transmittalRequest, {
            ...request,
            key: index,
            isChecked: false,
            id: request.id,
            expected_date: request.expected_date,
            assigned_at: request.assigned_at,
            company: request.company_name,
            transmittal_no: request.transmittal_no,
            is_urgent: request.is_urgent,
            view_data: request.view_data
        }]
    })
    data = {
        request: transmittalRequest
    }
    dispatch({
        type: GET_BUNDLED_DETAILS,
        payload: data
    })
}

export const clearAcceptedDetails = () => {
    return {
        type: CLEAR_ACCEPTED_DETAILS
    }
}

export const getHistoryList = () => (dispatch, getState) => {
    dispatch({ type: LOADING_ACCEPTANCE })

    const search = getState().acceptance.history.search
    const pagination = getState().acceptance.history.pagination

    let paramsQuery = ""
    let paginationQuery = ""
    const searchAcceptance = JSON.parse(JSON.stringify(search))
    const paginationHistory = JSON.parse(JSON.stringify(pagination))
    delete paginationHistory.hasNext

    paginationQuery = new URLSearchParams(paginationHistory).toString()

    if (search.keyword.length === 0) {
        delete searchAcceptance.keyword
    }

    if (search.dateFrom.length === 0 || search.dateTo.length === 0) {
        delete searchAcceptance.dateFrom
        delete searchAcceptance.dateTo
    }

    paramsQuery = `?${paginationQuery}&${new URLSearchParams(searchAcceptance).toString()}`

    console.log('Search Parameters: ', paramsQuery)

    // Headers
    const config = tokenConfig(getState)

    axios
        .get(API.GET_HISTORY + paramsQuery, config)
        .then((res) => {
            let data = {
                request: res.data.data,
                pagination: {
                    itemLimit: res.data.pagination.itemLimit,
                    skipItem: res.data.pagination.skipItem,
                    hasNext: res.data.pagination.hasNext
                }
            }

            dispatch({
                type: GET_HISTORY,
                payload: data,
            })
        })
        .catch((err) => {
            if (!!err.response) {
                let errors = []
                if (!!err.response.data.errors) {
                    errors = err.response.data.errors
                } else {
                    errors = [{
                        "errMessage": err.response.data.message,
                        "path": "invalid",
                    }]
                }
                dispatch(
                    returnErrors(errors, err.response.status, err.response.data.message)
                )

                if (err.response.status === 401) dispatch(invalidUser())
            }
            console.log(err)
        })
}

export const clearHistoryList = () => {
    return {
        type: CLEAR_HISTORY,
    }
}

export const setHistoryKeyword = (keyword: any) => {
    return {
        type: SET_HISTORY_KEYWORD,
        payload: keyword,
    }
}

export const clearHistoryKeyword = () => {
    return {
        type: CLEAR_HISTORY_KEYWORD,
    }
}

export const setHistoryDateRange = (dateFrom: any, dateTo: any) => {
    let data = {
        dateFrom: dateFrom,
        dateTo: dateTo
    }
    return {
        type: SET_HISTORY_DATE_RANGE,
        payload: data,
    }
}

export const clearHistoryDateRange = () => {
    return {
        type: CLEAR_HISTORY_DATERANGE
    }
}

export const setSignature = (signature: any) => (dispatch) => {
    dispatch({
        type: SET_SIGNATURE,
        payload: signature,
    })
}

export const clearSignature = () => {
    return {
        type: CLEAR_SIGNATURE,
    }
}

export const setDocument = (document: any) => async (dispatch) => {
    dispatch({
        type: SET_DOCUMENTS,
        payload: `data:image/png;base64,${document.base64}`,
    })
}

export const viewDetails = (id: any, bundled: boolean, onlineModeOnly: boolean) => (dispatch, getState) => {
    dispatch({ type: LOADING_ACCEPTANCE })
    const currentTab = getState().acceptance.currentTab

    // console.log(API.VIEW_DETAILS + "/" + id + "/view", config)
    if (onlineModeOnly) {
        if (getState().auth.connection.status) {
            // Headers
            const config = tokenConfig(getState)

            axios
                .get(API.VIEW_DETAILS + "/" + id + "/view", config)
                .then((res) => {
                    dispatch({
                        type: VIEW_DETAILS,
                        payload: res.data.data,
                    })
                })
                .catch((err) => {
                    if (!!err.response) {
                        let errors = []
                        if (!!err.response.data.errors) {
                            errors = err.response.data.errors
                        } else {
                            errors = [{
                                "errMessage": err.response.data.message,
                                "path": "invalid",
                            }]
                        }
                        dispatch(
                            returnErrors(errors, err.response.status, err.response.data.message)
                        )
                    }
                    console.log(err)
                })
        }
    } else {
        if (bundled) {
            dispatch({
                type: VIEW_DETAILS_BUNDLED,
                payload: id
            })
        } else {
            if (currentTab === 'acceptance') {
                dispatch({
                    type: VIEW_DETAILS_ACCEPTANCE,
                    payload: id
                })
            } else {
                dispatch({
                    type: VIEW_DETAILS_INTRANSIT,
                    payload: id
                })
            }
        }
    }
    // axios
    //     .get(API.VIEW_DETAILS + "/" + id + "/view", config)
    //     .then((res) => {
    //         dispatch({
    //             type: VIEW_DETAILS,
    //             payload: res.data.data,
    //         })
    //     })
    //     .catch((err) => {
    //         if (!!err.response) {
    //             let errors = []
    //             if (!!err.response.data.errors) {
    //                 errors = err.response.data.errors
    //             } else {
    //                 errors = [{
    //                     "errMessage": err.response.data.message,
    //                     "path": "invalid",
    //                 }]
    //             }
    //             dispatch(
    //                 returnErrors(errors, err.response.status, err.response.data.message)
    //             )
    //         }
    //         console.log(err)
    //     })
}

export const searchKeyword = (keyword: any) => {
    return {
        type: SET_KEYWORD,
        payload: keyword
    }
}

export const acceptRequest = (requests: any) => (dispatch, getState) => {
    // Headers
    // dispatch({ type: LOADING_ACCEPTANCE })
    const config = tokenConfig(getState)
    const body = JSON.stringify(requests)

    const connectionStatus = getState().auth.connection.status

    if (connectionStatus) {
        axios
            .put(API.ACCEPT_REQUEST, body, config)
            .then((res) => {
                console.log('ACCEPTED', res.data)
                dispatch(clearListingsAcceptance())
                dispatch({
                    type: ACCEPTED_REQUEST,
                    payload: 'Request Accepted'
                })
                dispatch(listAcceptance())
            })
            .catch((err) => {
                if (!!err.response) {
                    let errors = []
                    if (!!err.response.data.errors) {
                        errors = err.response.data.errors
                    } else {
                        errors = [{
                            "errMessage": err.response.data.message,
                            "path": "invalid",
                        }]
                    }
                    dispatch(
                        returnErrors(errors, err.response.status, err.response.data.message)
                    )
                }
                console.log(err)
            })
    } else {
        dispatch({
            type: SAVE_OFFLINE_ACCEPTED,
            payload: {
                data: {
                    api: API.ACCEPT_REQUEST,
                    body: requests.requests,
                },
                requests: requests.requests
            }
        })

        dispatch({
            type: ACCEPTED_REQUEST,
            payload: 'Request Accepted'
        })
    }
}

export const saveChangesMade = () => (dispatch, getState) => {

    if (getState().acceptance.intransit.offMode.intransit.length > 0 && getState().auth.connection.status) {
        const requestItem = getState().acceptance.intransit.offMode.intransit[0]
        const config = tokenConfig(getState)
        const body = JSON.stringify(requestItem.body)
        console.log('On Process')
        axios
            .put(requestItem.api, body, config)
            .then((res) => {
                console.log('SUCCESS SAVED ONLINE', res.data)
                // dispatch(clearListingsAcceptance())
                dispatch(getTabCount())
                dispatch({
                    type: REMOVE_ITEM_LIST_IN_OFFMODE,
                    payload: {
                        request: requestItem.body.requests,
                        transmittal_key: requestItem.transmittal_key
                    }
                })
            })
            .catch((err) => {
                if (!!err.response) {
                    let errors = []
                    if (!!err.response.data.errors) {
                        errors = err.response.data.errors
                    } else {
                        errors = [{
                            "errMessage": err.response.data.message,
                            "path": "invalid",
                        }]
                    }
                    dispatch(
                        returnErrors(errors, err.response.status, err.response.data.message)
                    )
                }
                console.log(err)
            })

    }
}

export const syncOngoing = (action: any) => {
    return {
        type: SYNC_ONGOING,
        payload: action,
    }
}

export const clearSearch = () => {
    return {
        type: CLEAR_SEARCH,
    }
}

export const clearBundledDetails = () => {
    return {
        type: CLEAR_BUNDLED_DETAILS,
    }
}

export const clearMessage = () => {
    return {
        type: CLEAR_MESSAGE,
    }
}

export const clearDetails = () => {
    return {
        type: CLEAR_DETAILS
    }
}
export const clearResponse = () => {
    return {
        type: CLEAR_RESPONSE,
    }
}

export const selectTrigger = (select: { requestType, request, allChecked, pagination }) => (dispatch) => {
    dispatch({
        type: SELECT_REQUEST,
        payload: select,
    })
}

export const selectBundledDetailsTrigger = (select: { request, allChecked }) => (dispatch) => {
    dispatch({
        type: SELECT_BUNDLED_REQUEST,
        payload: select,
    })
}

export const removeRequestInBundled = (requestList: any) => {
    return {
        type: REMOVE_REQUEST,
        payload: requestList,
    }
}

export const loadingAcceptance = () => {
    return {
        type: LOADING_ACCEPTANCE
    }
}

// Setup config/Headers and token
export const tokenConfig = (getState: any) => {
    // Get token from local storage
    const token = getState().auth.token;
    // console.log('Token Config', token)

    // Headers
    let config = {
        headers: {
            'Content-type': 'application/json',
        },
    }

    // If token, add to headers
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token
    }

    // console.log('Config', config)
    return config
}