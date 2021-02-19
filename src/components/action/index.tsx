import React, { useRef, useState } from 'react'
import { Modalize } from 'react-native-modalize'
import { Text } from 'react-native'
import { Container, Content, List, ListItem, Left, Right } from 'native-base';
import { AntDesign } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/modules/combinedReducers';
import { REQUEST_TYPE_ACTION } from '../../utils/Constants';
import { clearAcceptedDetails } from '../../store/modules/dashboard/action';

interface ActionState {
    option1: String;
    option2: String;
    option3: String;
    modalizeRef: any;
    actionFuntion: Function;
    requestType: Number;
    requestList: Object;
    navigation: any;
    transmittal_key: any;
}

const ActionComponent = ({ route, navigation, requestList, option1, option2, option3, modalizeRef, actionFuntion, requestType, transmittal_key }: ActionState) => {
    const dispatch = useDispatch()
    const acceptance = useSelector((state: RootState) => state.acceptance)
    const [actionClicked, setActionClicked] = useState(true);

    const actionChangeStatusHandler = (requestType: Number, actionCode: Number, actionLabel: String, actionAPI: String) => {
        if (actionClicked) {
            modalizeRef.current?.close('alwaysOpen');
            setActionClicked(false)
            console.log(requestList)
            if (actionCode === 0) {
                dispatch(clearAcceptedDetails())
                navigation.push('AcceptedPage', {
                    requestListToChange: requestList,
                    actionLabel: actionLabel,
                    actionCode: actionCode,
                    actionAPI: actionAPI,
                    setActionClicked: setActionClicked,
                    transmittal_key: transmittal_key,
                })
            } else if (actionCode === 1) {
                navigation.push('NotAcceptedPage', {
                    requestListToChange: requestList,
                    actionLabel: actionLabel,
                    actionCode: actionCode,
                    actionAPI: actionAPI,
                    setActionClicked: setActionClicked,
                    transmittal_key: transmittal_key,
                })
            } else if (actionCode === 2) {
                navigation.push('CannotAccept', {
                    requestListToChange: requestList,
                    actionLabel: actionLabel,
                    actionCode: actionCode,
                    actionAPI: actionAPI,
                    setActionClicked: setActionClicked,
                    transmittal_key: transmittal_key,
                })
            }
        }
    }

    const actionButtonContent = () => (
        <Container style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', height: '20%', backgroundColor: '#00000000' }}>
            <Content padder>
                <List style={{ paddingLeft: 15, paddingRight: 15, backgroundColor: '#FFFFFF', borderRadius: 10 }}>
                    <ListItem style={{ marginLeft: 0, paddingLeft: 0, paddingRight: 0, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '500' }}>Change Status</Text>
                    </ListItem>
                    {REQUEST_TYPE_ACTION[requestType].actions.map((action, index) => (
                        <ListItem key={index} style={{ marginLeft: 0, paddingLeft: 0, paddingRight: 0 }} onPress={() => actionChangeStatusHandler(requestType, action.code, action.label, action.api)}>
                            <Left>
                                <Text style={{ fontSize: 18 }}>{action.label}</Text>
                            </Left>
                            <Right>
                                <AntDesign name='right' style={{ color: '#2F3542' }} size={16} />
                            </Right>
                        </ListItem>))}
                </List>
            </Content>
        </Container>
    )

    return (
        <Modalize ref={modalizeRef} adjustToContentHeight={true} withHandle={false} modalStyle={{ backgroundColor: '#00000000', elevation: 0, }}>
            {actionButtonContent()}
        </Modalize>
    )
}

ActionComponent.defaultProps = {
    option1: '',
    option2: '',
    option3: '',
    modalizeRef: '',
    actionFuntion: () => { },
    requestType: 0,
    requestList: {},
    navigation: '',
    transmittal_key: '',
}

export default ActionComponent
