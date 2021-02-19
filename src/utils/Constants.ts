/* eslint-disable no-undef */
import { apiBaseURL, socketIOVNI } from './config'

// For URL API
// const API_URL = "http://localhost:5000";
export const API_URL = apiBaseURL
export const SOCKET_URL = socketIOVNI
// console.log(API_URL)

export const REQUEST_TYPE_DELIVERY = 1
export const REQUEST_TYPE_PICKUP = 2
export const REQUEST_TYPE_TEXT = [
    { code: 0, text: 'Filter Type' },
    { code: 1, text: 'Delivery' },
    { code: 2, text: 'Pickup' },
]

export const REQUEST_TYPE_ACTION = [
    { actions: [] },
    {
        actions: [
            { code: 0, label: 'Delivered', api: `${API_URL}/messenger/requests/in-transit/delivered` },
            { code: 1, label: 'Not Delivered', api: `${API_URL}/messenger/requests/in-transit/not-delivered` },
            { code: 2, label: 'Cannot Deliver', api: `${API_URL}/messenger/requests/in-transit/cannot-deliver` }
        ]
    },
    {
        actions: [
            { code: 0, label: 'Picked Up', api: `${API_URL}/messenger/requests/in-transit/picked-up` },
            { code: 1, label: 'Not Picked Up', api: `${API_URL}/messenger/requests/in-transit/not-picked-up` },
            { code: 2, label: 'Cannot Pickup', api: `${API_URL}/messenger/requests/in-transit/cannot-pick-up` }
        ]
    }
]

export const IS_URGENT_YES = 1
export const IS_URGENT_NO = 2
export const IS_URGENT = [
    { code: 0, text: 'None' },
    { code: 1, text: 'Yes' },
    { code: 2, text: 'No' },
]

export const TRACKING_STATUS_PREVIEW = 0
export const TRACKING_STATUS_REQUEST_SENT = 1
export const TRACKING_STATUS_FOR_DELIVERY = 2
export const TRACKING_STATUS_FOR_PICKUP = 3
export const TRACKING_STATUS_DELIVERY_IN_TRANSIT = 4
export const TRACKING_STATUS_PICKUP_IN_TRANSIT = 5
export const TRACKING_STATUS_DELIVERED = 6
export const TRACKING_STATUS_PICKEDUP = 7
export const TRACKING_STATUS_CANNOT_PICKUP = 8
export const TRACKING_STATUS_NOT_PICKEDUP = 9
export const TRACKING_STATUS_NON_DELIVERABLE = 10
export const TRACKING_STATUS_NOT_DELIVERED = 11
export const TRACKING_STATUS_CANCELLED = 12
export const TRACKING_STATUS_CANCELLED_REQUESTOR = 13
export const TRACKING_STATUS = [
    { code: 0, status: 'filter_status', text: 'Filter Status' },
    { code: 1, status: 'request_sent', text: 'Request Sent' },
    { code: 2, status: 'for_delivery', text: 'For Delivery' },
    { code: 3, status: 'for_pickup', text: 'For Pick Up' },
    { code: 4, status: 'delivery_in_transit', text: 'Delivery in Transit' },
    { code: 5, status: 'pickup_in_transit', text: 'Pick Up in Transit' },
    { code: 6, status: 'delivered', text: 'Delivered' },
    { code: 7, status: 'picked_up', text: 'Picked Up' },
    { code: 8, status: 'cannot_pickup', text: 'Cannot Pick Up' },
    { code: 9, status: 'not_picked_up', text: 'Not Picked Up' },
    { code: 10, status: 'cannot_deliver', text: 'Non Deliverable' },
    { code: 11, status: 'not_delivered', text: 'Not Delivered' },
    { code: 12, status: 'cancelled', text: 'Cancelled' },
    { code: 13, status: 'cancelled_requestor', text: 'Cancelled Requestor' },
]
export const ACTIVE_STATUS = [
    { code: 1, text: 'Active' },
    { code: 2, text: 'Inactive' },
]

export const PARTNER_AVIDA = 1
export const PARTNER_INTELLICARE = 2
export const PARTNER = [
    { code: 0, text: 'None' },
    { code: 1, text: 'Avega' },
    { code: 2, text: 'Intellicare' },
]

export const REQUEST_STATUS_PENDING = 0
export const REQUEST_STATUS_UNASSIGNED = 1
export const REQUEST_STATUS_ASSIGNED = 2
export const REQUEST_STATUS_PENDING_ACCEPTANCE = 3
export const REQUEST_STATUS_ACCEPTED_BY_MESSAGNER = 4

export const REQUEST_ITEM_TYPE_OTHER = 0
export const REQUEST_ITEM_TYPE_CHECK = 1
export const REQUEST_ITEM_TYPE_SOA = 2
export const REQUEST_ITEM_TYPE_CONTRACT_CARDS = 3
// export const  = 4;
export const REQUEST_ITEM_TYPE = [
    { code: 0, text: 'Other' },
    { code: 1, text: 'Check' },
    { code: 2, text: 'SOA' },
    { code: 3, text: 'ID Cards' },
    // { code: 4, text: "Other" },
]

export const HIMS_DEPARTMENT_NODEPT = 1
export const HIMS_DEPARTMENT_CASHIERING = 2
export const HIMS_DEPARTMENT = [
    { code: 0, text: 'None' },
    { code: 1, text: 'No Department Yet' },
    { code: 2, text: 'Cashiering' },
]

// export const LOGIN_USER = API_URL + '/api-login'
// export const LOGIN_USER = himsServerIp + '/api/messenger/login'
export const LOGIN_USER = API_URL + '/messenger/login'
export const LOGOUT_USER = API_URL + '/messenger/logout'
export const USER_PROFILE = API_URL + '/messenger/profile'
export const FOR_ACCEPTANCE = API_URL + '/messenger/requests/for-acceptance'
export const IN_TRANSIT = API_URL + '/messenger/requests/in-transit'
export const CURRENT_TABS = {
    acceptance: API_URL + '/messenger/requests/for-acceptance',
    intransit: API_URL + '/messenger/requests/in-transit'
}
export const VIEW_DETAILS = API_URL + '/messenger/requests'
export const GET_TAB_COUNT = API_URL + '/messenger/requests/tabs-stats'
export const ACCEPT_REQUEST = API_URL + '/messenger/requests/for-acceptance/accept'
export const GET_USER = API_URL + '/users/'
export const STATUS_ACCEPTED = API_URL + '/messenger/requests/in-transit/delivered'
export const CHANGE_STATUS = API_URL + '/messenger/requests/in-transit/delivered'
export const GET_HISTORY = API_URL + '/messenger/requests/history'
export const VERIFY_PASSWORD = API_URL + '/messenger/password/verify'
export const UPDATE_PASSWORD = API_URL + '/messenger/password/new'
export const GET_NOTIFICATION = API_URL + '/notifications'
export const GET_NOTIF_COUNT = API_URL + '/notifications/unread/count'
export const MARK_AS_READ_BULK = API_URL + '/notifications/mark-as-read'

// Reason for Cannot Accept
export const CHANGE_STATUS_CANNOT_ACCEPT = [
    { code: 0, label: 'Select...', value: 'select' },
    { code: 1, label: 'Recipient is not Present', value: 'recipient_is_not_present' },
    { code: 2, label: 'Outdated Address', value: 'outdated_address' },
    { code: 3, label: 'Closed Office', value: 'closed_office' },
    { code: 4, label: 'Wrong Addressee', value: 'wrong_addressee' },
    { code: 5, label: 'Wrong Contact Number', value: 'wrong_contact_number' },
    { code: 6, label: 'Wrong Address', value: 'wrong_address' },
    { code: 7, label: 'Receiver Refused to Accept', value: 'receiver_refused_to_accept' },
    { code: 8, label: 'Item Lost in Transit', value: 'item_lost_in_transit' },
    { code: 9, label: 'Others', value: 'others' },
]