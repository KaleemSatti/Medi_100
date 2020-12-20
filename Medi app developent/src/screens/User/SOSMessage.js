import React,{useState, useRef, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import theme from '../../themes';
import FirebaseFunctions from '../../FirebaseFunctions';
import CommonStyles from '../../CommonStyles';

const SOSMessage = (props) => {
    return(
        <View style={{flex:1}}>
            <Text style={[CommonStyles.MainHeading,{paddingTop:50}]}>SOS Message</Text>
        </View>
    );
}
const styles = StyleSheet.create({

});
export default SOSMessage;