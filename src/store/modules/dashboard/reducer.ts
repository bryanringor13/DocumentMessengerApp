import {
    LIST_ACCEPTANCE,
    LOADING_ACCEPTANCE,
    SELECT_REQUEST,
    VIEW_DETAILS,
    SET_KEYWORD,
    CLEAR_DETAILS,
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
    PROCESS_DONE,
    SCROLL_DOWN,
    SET_TAB,
    GET_NOTIFICATION,
    CLEAR_NOTIFICATION,
    LOADING_NOTIFICATION,
    SCROLL_NOTIFICATION,
    HAS_UPDATE,
    MARK_AS_READ_BULK,
    MARK_AS_SINGLE_READ,
    COUNT_UNREAD,
    SAVE_OFFLINE_ACCEPTED,
    SAVE_OFFLINE_INTRANSIT,
    CANCEL_LOADING,
    LIST_INTRANSIT,
    CLEAR_LISTINGS_ACCEPTANCE,
    CLEAR_LISTINGS_INTRANSIT,
    SCROLL_DOWN_INTRANSIT,
    SCROLL_DOWN_ACCEPTANCE,
    CLEAR_OFFMODE_ACCEPTANCE,
    VIEW_DETAILS_ACCEPTANCE,
    VIEW_DETAILS_INTRANSIT,
    VIEW_DETAILS_BUNDLED, SAVE_OFFLINE_BUNDLED, REMOVE_ITEM_LIST_IN_OFFMODE, SYNC_ONGOING
} from './types';
import { AsyncStorage } from 'react-native';

interface DashboardState {
    acceptance: {
        requestType: String,
        allChecked: boolean,
        request: [],
        data: [],
        pagination: {
            hasNext: boolean,
            itemLimit: Number,
            skipItem: Number,
        },
        offMode: {
            accepted: [],
            api: String,
        }
    },
    intransit: {
        requestType: String,
        allChecked: boolean,
        request: [],
        data: [],
        pagination: {
            hasNext: boolean,
            itemLimit: Number,
            skipItem: Number,
        },
        offMode: {
            intransit: [],
            label: String,
        }
    },
    history: {
        request: [],
        pagination: {
            itemLimit: Number,
            skipItem: Number,
            hasNext: boolean
        },
        search: {
            keyword: String,
            dateFrom: String,
            dateTo: String,
        }
    },
    notification: {
        list: [],
        loading: boolean,
        pagination: {
            hasNext: boolean,
            itemLimit: Number,
            skipItem: Number,
        },
        newUpdate: boolean
    },
    search: {
        keyword: String,
    },
    bundledDetails: {
        allChecked: boolean,
        request: [],
        signature: any,
        documents: any,
        response: {
            data: [],
            status: String,
            label: String,
        }
    },
    details: Object,
    message: String,
    currentTab: String,
    processDone: boolean,
    isLoading: boolean,
    countUnreadNotif: Number,
    syncOngoing: boolean,
}

const initialState: DashboardState = {
    acceptance: {
        requestType: '',
        allChecked: false,
        request: [],
        data: [],
        pagination: {
            hasNext: false,
            itemLimit: 10,
            skipItem: 0,
        },
        offMode: {
            accepted: [],
            api: '',
        }
    },
    intransit: {
        requestType: '',
        request: [],
        data: [],
        allChecked: false,
        pagination: {
            hasNext: false,
            itemLimit: 10,
            skipItem: 0,
        },
        offMode: {
            intransit: [],
            label: '',
        }
    },
    history: {
        request: [],
        pagination: {
            itemLimit: 10,
            skipItem: 0,
            hasNext: false
        },
        search: {
            keyword: '',
            dateFrom: '',
            dateTo: '',
        }
    },
    notification: {
        list: [],
        loading: false,
        pagination: {
            hasNext: false,
            itemLimit: 10,
            skipItem: 0,
        },
        newUpdate: false
    },
    search: {
        keyword: '',
    },
    bundledDetails: {
        allChecked: false,
        request: [],
        signature: null,
        documents: null,
        response: {
            data: [],
            status: '',
            label: '',
        }
    },
    details: {},
    message: '',
    currentTab: 'acceptance',
    processDone: false,
    isLoading: false,
    countUnreadNotif: 0,
    syncOngoing: false,
};

export default function dashboardReducer(state = initialState, action: any): DashboardState {
    switch (action.type) {
        case SAVE_OFFLINE_ACCEPTED:
            console.log(action.payload)
            const modAcceptList = state.acceptance.request.filter(function (request) {
                return !action.payload.requests.includes(request.id);
            });

            return {
                ...state,
                acceptance: {
                    ...state.acceptance,
                    request: modAcceptList,
                    data: modAcceptList,
                    offMode: {
                        accepted: [...state.acceptance.offMode.accepted, ...action.payload.data.body],
                        api: action.payload.data.api
                    }
                },
                isLoading: false,
            }
        case SAVE_OFFLINE_INTRANSIT:
            console.log('SAVE_OFFLINE_INTRANSIT: ', action.payload)
            action.payload.trans_list
            // state.intransit.request.filter(function (request){
            //     return action.payload.trans_list.includes(request.transmital_preview.id);
            // }).map((intrans_request, index) => {
            // let modiList = [], reqObject = {};
            const modiList = state.intransit.request.map((intrans_request: any) => (action.payload.trans_list.includes(intrans_request.transmital_preview.id) ?
                {
                    ...intrans_request,
                    transmital_preview: {
                        ...intrans_request.transmital_preview,
                        action_change: {
                            ...action.payload.action,
                            action_code: action.payload.action_code,
                            action_label: action.payload.label,
                            action_date: action.payload.data.action_date
                        }
                    },
                    transmital_requests: intrans_request.transmital_requests.map((trans_req: any) => (action.payload.trans_list.includes(trans_req.id) ? {
                        ...trans_req,
                        view_data: {
                            ...trans_req.view_data,
                            action_change: {
                                ...action.payload.action,
                                action_code: action.payload.action_code,
                                action_label: action.payload.label,
                                action_date: action.payload.data.action_date
                            }
                        }
                    } : trans_req))
                } : intrans_request))
            // })
            console.log('Modify List: ', modiList)
            return {
                ...state,
                intransit: {
                    ...state.intransit,
                    offMode: {
                        intransit: [...state.intransit.offMode.intransit, action.payload.data],
                        label: action.payload.label
                    },
                    request: modiList,
                    data: modiList,
                },
                details: {
                    ...state.details,
                    action_change: {
                        ...action.payload.action,
                        action_code: action.payload.action_code,
                        action_label: action.payload.label,
                        action_date: action.payload.data.action_date
                    }
                },
                isLoading: false,
            }
        case SAVE_OFFLINE_BUNDLED:
            const modiListBundled = state.intransit.request.map((intrans_request: any) => action.payload.transmittal_key === intrans_request.transmital_key ?
                {
                    ...intrans_request,
                    transmital_preview: {
                        ...intrans_request.transmital_preview,
                        action_change: {
                            ...action.payload.action,
                            action_code: action.payload.action_code,
                            action_label: action.payload.label,
                            action_date: action.payload.data.action_date
                        }
                    },
                    transmital_requests: intrans_request.transmital_requests.map((trans_req: any) => (action.payload.trans_list.includes(trans_req.id) ? {
                        ...trans_req,
                        action_change: {
                            ...action.payload.action,
                            action_code: action.payload.action_code,
                            action_label: action.payload.label,
                            action_date: action.payload.data.action_date
                        },
                        view_data: {
                            ...trans_req.view_data,
                            action_change: {
                                ...action.payload.action,
                                action_code: action.payload.action_code,
                                action_label: action.payload.label,
                                action_date: action.payload.data.action_date
                            }
                        }
                    } : trans_req))
                } : intrans_request)
            // })

            const modifyBundled = state.bundledDetails.request.map((intrans_bundled: any) => (action.payload.trans_list.includes(intrans_bundled.id) ?
                {
                    ...intrans_bundled,
                    action_change: {
                        ...action.payload.action,
                        action_code: action.payload.action_code,
                        action_label: action.payload.label,
                        action_date: action.payload.data.action_date
                    },
                    isChecked: false,
                    view_data: {
                        ...intrans_bundled.view_data,
                        action_change: {
                            ...action.payload.action,
                            action_code: action.payload.action_code,
                            action_label: action.payload.label,
                            action_date: action.payload.data.action_date
                        }
                    }
                } : { ...intrans_bundled }))
            console.log('SAVE_OFFLINE_BUNDLED', action.payload)
            console.log('Modify Bundled', modifyBundled)
            console.log('Modify List in Bundled: ', modiListBundled)
            return {
                ...state,
                bundledDetails: {
                    ...state.bundledDetails,
                    request: modifyBundled
                },
                intransit: {
                    ...state.intransit,
                    offMode: {
                        intransit: [...state.intransit.offMode.intransit, action.payload.data],
                        label: action.payload.label
                    },
                    request: modiListBundled,
                    data: modiListBundled
                },
                details: {
                    ...state.details,
                    action_change: {
                        ...action.payload.action,
                        action_code: action.payload.action_code,
                        action_label: action.payload.label,
                        action_date: action.payload.data.action_date
                    }
                },
                isLoading: false,
            }
        case LIST_ACCEPTANCE:
            // console.log('LIST_ACCEPTANCE', action.payload.request)
            return {
                ...state,
                acceptance: {
                    ...state.acceptance,
                    allChecked: false,
                    requestType: action.payload.requestType,
                    request: action.payload.request,
                    data: action.payload.request,
                    pagination: {
                        hasNext: action.payload.pagination.hasNext,
                        itemLimit: action.payload.pagination.itemLimit,
                        skipItem: action.payload.pagination.skipItem,
                    }
                },
                isLoading: false,
            }
        case LIST_INTRANSIT:
            console.log('LIST_INTRANSIT')
            return {
                ...state,
                intransit: {
                    ...state.intransit,
                    requestType: action.payload.requestType,
                    request: action.payload.request,
                    data: action.payload.request,
                    pagination: {
                        hasNext: action.payload.pagination.hasNext,
                        itemLimit: action.payload.pagination.itemLimit,
                        skipItem: action.payload.pagination.skipItem,
                    }
                },
                isLoading: false,
            }
        case SCROLL_DOWN_ACCEPTANCE:
            console.log('SCROLL_DOWN', action.payload.request)
            return {
                ...state,
                acceptance: {
                    allChecked: action.payload.allChecked,
                    requestType: action.payload.requestType,
                    request: [...state.acceptance.request, ...action.payload.request],
                    data: [...state.acceptance.request, ...action.payload.request],
                    pagination: {
                        hasNext: action.payload.pagination.hasNext,
                        itemLimit: action.payload.pagination.itemLimit,
                        skipItem: action.payload.pagination.skipItem,
                    }
                },
                isLoading: false,
            }
        case SCROLL_DOWN_INTRANSIT:
            console.log('SCROLL_DOWN_INTRANSIT', action.payload.request)
            return {
                ...state,
                intransit: {
                    ...state.intransit,
                    requestType: action.payload.requestType,
                    request: [...state.intransit.request, ...action.payload.request],
                    data: [...state.intransit.request, ...action.payload.request],
                    pagination: {
                        hasNext: action.payload.pagination.hasNext,
                        itemLimit: action.payload.pagination.itemLimit,
                        skipItem: action.payload.pagination.skipItem,
                    }
                },
                isLoading: false,
            }
        case SET_TAB:
            console.log('SET_TAB', action.payload)
            return {
                ...state,
                currentTab: action.payload
            }
        case GET_NOTIFICATION:
            console.log('GET_NOTIFICATIONS', action.payload)
            return {
                ...state,
                notification: {
                    list: action.payload.list,
                    loading: false,
                    pagination: action.payload.pagination
                }
            }
        case MARK_AS_SINGLE_READ:
            console.log('MARK_AS_SINGLE_READ', action.payload)
            return {
                ...state,
                notification: {
                    ...state.notification,
                    list: action.payload
                }
            }
        case MARK_AS_READ_BULK:
            console.log('MARK_AS_READ_BULK', action.payload)
            return {
                ...state,
                notification: {
                    ...state.notification,
                    list: action.payload
                }
            }
        case SCROLL_NOTIFICATION:
            console.log('SCROLL_NOTIFICATION', action.payload)
            return {
                ...state,
                notification: {
                    list: [...state.notification.list, ...action.payload.list],
                    loading: false,
                    pagination: action.payload.pagination
                }
            }
        case HAS_UPDATE:
            console.log('HAS_UPDATE', action.payload)
            return {
                ...state,
                notification: {
                    ...state.notification,
                    newUpdate: action.payload
                }
            }
        case COUNT_UNREAD:
            console.log('COUNT_UNREAD', action.payload)
            return {
                ...state,
                countUnreadNotif: action.payload
            }
        case CLEAR_NOTIFICATION:
            console.log('CLEAR_NOTIFICATION')
            return {
                ...state,
                notification: {
                    ...state.notification,
                    list: [],
                    loading: false,
                    pagination: {
                        hasNext: false,
                        itemLimit: 10,
                        skipItem: 0
                    }
                }
            }
        case CLEAR_LISTINGS_ACCEPTANCE:
            console.log('CLEAR_LISTINGS_ACCEPTANCE')
            return {
                ...state,
                acceptance: {
                    ...state.acceptance,
                    allChecked: false,
                    requestType: '',
                    request: [],
                    data: [],
                    pagination: {
                        hasNext: false,
                        itemLimit: 10,
                        skipItem: 0,
                    }
                },
                isLoading: false,
            }
        case CLEAR_LISTINGS_INTRANSIT:
            console.log('CLEAR_LISTINGS_INTRANSIT')
            return {
                ...state,
                intransit: {
                    ...state.intransit,
                    allChecked: false,
                    requestType: '',
                    request: [],
                    data: [],
                    pagination: {
                        hasNext: false,
                        itemLimit: 10,
                        skipItem: 0,
                    }
                },
                isLoading: false,
            }
        case CLEAR_LISTINGS:
            console.log('CLEAR_LISTINGS')
            return {
                ...state,
                acceptance: {
                    allChecked: false,
                    requestType: '',
                    request: [],
                    data: [],
                    pagination: {
                        hasNext: false,
                        itemLimit: 10,
                        skipItem: 0,
                    }
                },
                isLoading: false,
            }
        case SELECT_REQUEST:
            console.log('SELECT_REQUEST')
            return {
                ...state,
                acceptance: {
                    ...state.acceptance,
                    ...action.payload,
                },
                isLoading: false,
            }
        case SET_KEYWORD:
            console.log('SET_KEYWORD', action.payload)
            return {
                ...state,
                search: {
                    keyword: action.payload
                },
                isLoading: false,
            }
        case VIEW_DETAILS:
            console.log('VIEW_DETAILS', action.payload)
            return {
                ...state,
                details: action.payload,
                isLoading: false,
            }
        case VIEW_DETAILS_ACCEPTANCE:
            console.log('VIEW_DETAILS_ACCEPTANCE', action.payload)
            let data_acceptance = state.acceptance.request.filter(function (list) {
                return list.id == action.payload;
            }).map((request, index) => {
                return request.view_data
            })
            // console.log('Data View Details', data[0])
            return {
                ...state,
                details: data_acceptance[0],
                isLoading: false,
            }
        case VIEW_DETAILS_INTRANSIT:
            console.log('VIEW_DETAILS_INTRANSIT', action.payload)
            let data_intransit = state.intransit.request.filter(function (list) {
                return list.transmital_preview.id == action.payload;
            }).map((request, index) => {
                return request.transmital_requests.filter(function (requests) {
                    return requests.id == action.payload;
                }).map((details, index) => {
                    return details.view_data;
                })
            })
            console.log('Data Intransit View Details', data_intransit[0][0])
            return {
                ...state,
                details: data_intransit[0][0],
                isLoading: false,
            }
        case VIEW_DETAILS_BUNDLED:
            console.log('VIEW_DETAILS_BUNDLED', action.payload)
            let data_bundled = state.bundledDetails.request.filter(function (list) {
                return list.id == action.payload;
            }).map((request, index) => {
                return request.view_data
            })
            console.log('Data View Details', data_bundled[0])
            return {
                ...state,
                details: data_bundled[0],
                isLoading: false,
            }
        case CLEAR_ACCEPTED_DETAILS:
            return {
                ...state,
                bundledDetails: {
                    ...state.bundledDetails,
                    signature: null,
                    documents: null,
                    response: {
                        data: [],
                        status: '',
                        label: '',
                    }
                },
                isLoading: false,
            }
        case ACCEPTED_REQUEST:
            console.log('ACCEPTED_REQUEST')
            return {
                ...state,
                message: action.payload,
                isLoading: false,
                processDone: true,
            }
        case PROCESS_DONE:
            console.log('PROCESS_DONE')
            return {
                ...state,
                processDone: false,
            }
        case GET_BUNDLED_DETAILS:
            console.log('GET_BUNDLED_DETAILS', action.payload.request)
            return {
                ...state,
                bundledDetails: {
                    ...state.bundledDetails,
                    allChecked: false,
                    request: action.payload.request,
                },
                isLoading: false,
            }
        case STATUS_ACCEPTED:
            console.log('STATUS_ACCEPTED')
            return {
                ...state,
                bundledDetails: {
                    ...state.bundledDetails,
                    response: action.payload
                },
                isLoading: false,
            }
        case CLEAR_RESPONSE:
            console.log('CLEAR_RESPONSE')
            return {
                ...state,
                bundledDetails: {
                    ...state.bundledDetails,
                    response: {
                        data: [],
                        status: '',
                        label: '',
                    }
                },
                isLoading: false,
            }
        case SELECT_BUNDLED_REQUEST:
            console.log('SELECT_BUNDLED_REQUEST')
            return {
                ...state,
                bundledDetails: {
                    ...state.bundledDetails,
                    ...action.payload,
                },
                isLoading: false,
            }
        case CLEAR_BUNDLED_DETAILS:
            console.log('CLEAR_BUNDLED_DETAILS')
            return {
                ...state,
                bundledDetails: {
                    ...state.bundledDetails,
                    allChecked: false,
                    signature: null,
                    documents: null,
                    request: [],
                    response: {
                        data: [],
                        status: '',
                        label: '',
                    }
                },
            }
        case SET_SIGNATURE:
            console.log('SET_SIGNATURE', 'Base64: DONE')
            return {
                ...state,
                bundledDetails: {
                    ...state.bundledDetails,
                    signature: action.payload,
                },
            }
        case CLEAR_SIGNATURE:
            console.log('CLEAR_SIGNATURE', 'DONE')
            return {
                ...state,
                bundledDetails: {
                    ...state.bundledDetails,
                    signature: null,
                },
            }
        case SET_DOCUMENTS:
            console.log('SET_DOCUMENTS', 'DONE')
            return {
                ...state,
                bundledDetails: {
                    ...state.bundledDetails,
                    documents: action.payload,
                },
            }
        case CLEAR_MESSAGE:
            console.log('CLEAR_MESSAGE')
            return {
                ...state,
                message: '',
            }
        case CLEAR_DETAILS:
            console.log('CLEAR_DETAILS')
            return {
                ...state,
                details: {},
                isLoading: false,
            }
        case REMOVE_REQUEST:
            return {
                ...state,
                bundledDetails: {
                    ...state.bundledDetails,
                    request: state.bundledDetails.request.filter(function (item) {
                        return !action.payload.includes(item.id);
                    }),
                }
            }
        case GET_HISTORY:
            console.log('GET_HISTORY', action.payload.pagination)
            return {
                ...state,
                history: {
                    ...state.history,
                    request: [...state.history.request, ...action.payload.request],
                    pagination: action.payload.pagination,
                },
                isLoading: false,
            }
        case CLEAR_HISTORY:
            console.log('CLEAR_HISTORY')
            return {
                ...state,
                history: {
                    ...state.history,
                    request: [],
                    pagination: {
                        itemLimit: 10,
                        skipItem: 0,
                        hasNext: false
                    }
                },
                isLoading: false,
            }
        case SET_HISTORY_KEYWORD:
            console.log('SET_HISTORY_KEYWORD', action.payload)
            return {
                ...state,
                history: {
                    ...state.history,
                    search: {
                        ...state.history.search,
                        keyword: action.payload
                    }
                }
            }
        case SET_HISTORY_DATE_RANGE:
            return {
                ...state,
                history: {
                    ...state.history,
                    search: {
                        ...state.history.search,
                        dateFrom: action.payload.dateFrom,
                        dateTo: action.payload.dateTo
                    }
                }
            }
        case CLEAR_HISTORY_KEYWORD:
            console.log('CLEAR_HISTORY_KEYWORD')
            return {
                ...state,
                history: {
                    ...state.history,
                    search: {
                        ...state.history.search,
                        keyword: ''
                    }
                },
                isLoading: false,
            }
        case CLEAR_HISTORY_DATERANGE:
            console.log('CLEAR_HISTORY_DATERANGE')
            return {
                ...state,
                history: {
                    ...state.history,
                    search: {
                        ...state.history.search,
                        dateFrom: '',
                        dateTo: ''
                    }
                },
                isLoading: false,
            }
        case CLEAR_SEARCH:
            console.log('CLEAR_SEARCH')
            return {
                ...state,
                search: {
                    keyword: '',
                },
                isLoading: false,
            }
        case LOADING_NOTIFICATION:
            console.log('LOADING_NOTIFICATION')
            return {
                ...state,
                notification: {
                    ...state.notification,
                    loading: true
                }
            }
        case LOADING_ACCEPTANCE:
            console.log('LOADING_ACCEPTANCE')
            return {
                ...state,
                isLoading: true,
            }
        case CANCEL_LOADING:
            console.log('CANCEL_LOADING')
            return {
                ...state,
                isLoading: false,
                notification: {
                    ...state.notification,
                    loading: false
                }
            }
        case CLEAR_OFFMODE_ACCEPTANCE:
            console.log('CLEAR_OFFMODE')
            return {
                ...state,
                acceptance: {
                    ...state.acceptance,
                    offMode: {
                        accepted: [],
                        api: '',
                    }
                }
            }
        case SYNC_ONGOING:
            return {
                ...state,
                syncOngoing: action.payload,
            }
        case REMOVE_ITEM_LIST_IN_OFFMODE:
            const new_request = state.intransit.request.filter((intrans_request) => {
                return (intrans_request.transmital_key != action.payload.transmittal_key);
            })

            // const new_request_bundled = new_request.map((intrans_req_bandled: any) => (intrans_req_bandled.transmital_key == action.payload.transmittal_key ? {
            //     ...intrans_req_bandled,
            //     transmital_requests: intrans_req_bandled.transmital_requests.filter((filter_req: any) => {
            //         return !action.payload.request.includes(filter_req.id);
            //     })
            // } : intrans_req_bandled))

            // const clearing_empty_bundled = new_request_bundled.filter((intrans_request_clearing: any) => {
            //     return (intrans_request_clearing.transmital_requests.length > 0);
            // })

            const offModeFilter = state.intransit.offMode.intransit.filter((request) => {
                return (action.payload.transmittal_key != request.transmittal_key);
            })

            // console.log('Cleared Empty Bundled: ', clearing_empty_bundled);
            // console.log('Offline Mode Fiter: ', offModeFilter)
            return {
                ...state,
                intransit: {
                    ...state.intransit,
                    request: new_request,
                    data: new_request,
                    offMode: {
                        ...state.intransit.offMode,
                        intransit: offModeFilter
                    }
                }
            }
        default:
            return state;
    }
}