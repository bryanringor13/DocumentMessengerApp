import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from "react-native";
import moment from "moment";
import CalendarPicker from 'react-native-calendar-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/modules/combinedReducers';
import { clearHistoryKeyword } from '../../store/modules/dashboard/action';

moment.locale("en");

interface DateRangePickerScreenState {
    closedCalendar: Function;
    setDateRangeHandler: Function;
    cancelCalendar: Function;
    clearCalendar: Function;
    setDateFrom: Function;
    setDateTo: Function;
    getdateTo: String;
    getdateFrom: String;
}

const DateRangePickerScreen = ({ closedCalendar, getdateTo, getdateFrom, setDateRangeHandler, setDateFrom, setDateTo, cancelCalendar, clearCalendar }: DateRangePickerScreenState) => {
    const minDate = new Date();
    const dispatch = useDispatch()
    const acceptance = useSelector((state: RootState) => state.acceptance)
    const [dates, setDates] = useState({
        startDate: null,
        endDate: null,
        displayedDate: moment()
    })

    const [dateRange, setDateRange] = useState({
        dateFrom: '',
        dateTo: ''
    })

    const setDateHandler = (dates: any) => {
        // setDates({
        //     ...dates
        // })
        if ((getdateFrom && getdateFrom.length > 0) && (getdateTo && getdateTo.length > 0)) {
            // dispatch(clearHistoryKeyword())
            console.log('from and To have dates already', dates);
            if (dates) {
                console.log('Date From: ', dates)
                setDateFrom(dates.toString())
            } else {
                console.log('Date To: ', 'null')
                setDateTo('')
            }
            // if (getdateFrom.length > 0) {
            //     console.log('Date To: ', dates)
            //     setDateTo(dates.toString())
            // } else {
            //     console.log('Date From: ', dates)
            //     setDateFrom(dates.toString())
            // }
        } else {
            if (!dates) return null
            if (getdateFrom.length === 0) {
                // setDateRange({
                //     ...dateRange,
                //     dateFrom: dates
                // })
                console.log('Date From: ', dates)
                setDateFrom(dates.toString())
            } else {
                // setDateRangeHandler({
                //     dateFrom: dateRange.dateFrom,
                //     dateTo: dates
                // })
                console.log('Date To: ', dates)
                setDateTo(dates.toString())
                // setDateRange({
                //     ...dateRange,
                // })
            }
        }
        // setDateRangeHandler()
    }

    // useEffect(() => {
    //     if (dateRange.dateFrom.length > 0 && dateRange.dateTo.length > 0) {
    //         console.log(dateRange)
    //     }
    // }, [dateRange])

    return (
        <View style={styles.overlay}>
            <View style={{ padding: 10 }}>
                <View style={{ backgroundColor: '#FFFFFF', borderRadius: 4, paddingTop: 20 }}>
                    <CalendarPicker
                        startFromMonday={true}
                        allowRangeSelection={true}
                        todayBackgroundColor="#f2e6ff"
                        todayTextStyle={{color: '#FFFFFF'}}
                        selectedDayColor="#BBE5D1"
                        selectedRangeStartStyle={styles.selectedStartRange}
                        selectedRangeEndStyle={styles.selectedEndRange}
                        selectedDayTextColor="#2B2D33"
                        onDateChange={setDateHandler}
                        width={320}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 25, paddingLeft: 25, marginBottom: 15, marginTop: 20 }}>
                        <View>
                            <TouchableOpacity onPress={() => clearCalendar()}><Text style={{ color: '#41B67F', fontSize: 14, fontWeight: '500' }}>Clear</Text></TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => cancelCalendar()}><Text style={{ color: '#41B67F', fontSize: 14, fontWeight: '500' }}>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => closedCalendar()}><Text style={{ color: '#41B67F', fontWeight: 'bold', fontSize: 16, marginLeft: 20 }}>OK</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
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
    selectedStartRange: {
        backgroundColor: '#41B67F', 
        borderTopLeftRadius: 0, 
        borderBottomLeftRadius: 0
    },
    selectedEndRange: {
        backgroundColor: '#41B67F', 
        borderTopRightRadius: 0, 
        borderBottomRightRadius: 0
    }
});

DateRangePickerScreen.defaultProps = {
    closedCalendar: () => { },
    setDateRangeHandler: () => { },
    cancelCalendar: () => { },
    clearCalendar: () => { },
    setDateFrom: () => { },
    setDateTo: () => { },
    getdateTo: '',
    getdateFrom: '',
}

export default DateRangePickerScreen
