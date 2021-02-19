import React from 'react'
import { Text } from 'react-native'
import { View, Spinner } from 'native-base'

const LoadingComponent = () => {
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <Spinner color='#29B1C3' /><Text style={{ marginLeft: 15, color: '#A5B0BE', fontWeight: '500', fontSize: 16 }}>{' '}Loading...</Text>
        </View>
    )
}

export default LoadingComponent
