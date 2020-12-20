import React,{useState, useRef, useEffect} from 'react';
import { View, Text, StyleSheet, Linking, Alert,ActivityIndicator } from 'react-native';
import theme from '../../themes';
import FirebaseFunctions from '../../FirebaseFunctions';
import RequestStyles from '../Home/Requests/RequestStyles';
import CommonStyles from '../../CommonStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Keyboard from '../../components/Keyboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationService from '../../components/Services/Location';

const Services = (props) => {
    const modalizeRef = useRef(null);
    const [viewNow,setViewNow] = useState("");
    const [contactName,setContactName] = useState("");
    const [contactNumber,setContactNumber] = useState("");
    const [saving,setSaving] = useState(false);
    const [emergencyText, SetEmergencyText] = useState("");
    const [fireServices,setFireService] = useState(false);
    const [coords,setCoords] = useState({});

    useEffect(()=>{
        async function getEmergencyMessage(){
            const message = await AsyncStorage.getItem('@EmergencyText');
            if(message) SetEmergencyText(message);

            const fire = await AsyncStorage.getItem('@fireNotifications');
            if(fire) setFireService(fire==="true"?true:false);
        }
        navigator.geolocation.getCurrentPosition(({coords})=>{
            console.log(coords);
            setCoords(coords);
        });
        getEmergencyMessage();
    },[])
    return(
        <View style={{flex:1}}>
            <Modalize
                handlePosition='outside'
                ref={modalizeRef}
                onOverlayPress={() => {
                    
                }}
                adjustToContentHeight
                useNativeDriver
                withHandle
                withOverlay
                modalTopOffset={10}
            >
                <View style={{backgroundColor:theme.tabBar,zIndex:9998}}>
                    <View>
                        {viewNow==="MainSOS"&&(
                            <View>
                                <Text style={RequestStyles.Modalize_Heading}>
                                    SOS MESSAGE SERVICE
                                </Text>
                                <TouchableOpacity onPress={()=>setViewNow("AddTrusted")}>
                                    <Text style={RequestStyles.ModalizeButton}>Add Trusted Contacts</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>setViewNow("SetEmergencyText")}>
                                    <Text style={RequestStyles.ModalizeButton}>Set Emergency Text</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={async ()=>{
                                    const user = await AsyncStorage.getItem('@UserKey');
                                    if(user){
                                        const contacts = await FirebaseFunctions.getTrustedContact(user);
                                        let phones = "";
                                        for(let c of contacts){
                                            phones = phones + c.Phone + ","
                                        }
                                        const Location = `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`
                                        var url = `sms:${phones}${Platform.OS === "ios" ? "&" : "?"}body=${Location + "\n\n\n" + emergencyText}`
                                        Linking.openURL(url);
                                    }
                                }}>
                                    <Text style={RequestStyles.ModalizeButton}>Send Emergency Message NOW!</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {viewNow==="AddTrusted"&&(
                            <View>
                                <Text style={RequestStyles.Modalize_Heading}>
                                    Add Contact Details
                                </Text>
                                <Text style={RequestStyles.ModalizeButton}>{contactName===""?"Add Contact Name":contactName}</Text>
                                <Keyboard
                                    textInput={contactName}
                                    onInput={setContactName}
                                    inputType="textPassword"
                                />
                                <TouchableOpacity onPress={()=>setViewNow("AddPhone")}>
                                    <Text style={RequestStyles.ModalizeButton}>Next</Text>
                                </TouchableOpacity>   
                            </View>           
                        )}
                        {viewNow==="AddPhone"&&(
                            <View>
                                <Text style={RequestStyles.Modalize_Heading}>
                                    Add Phone Number
                                </Text>
                                <Text style={RequestStyles.ModalizeButton}>{contactNumber===""?"Add Phone Number":contactNumber}</Text>
                                <Keyboard
                                    textInput={contactNumber}
                                    onInput={setContactNumber}
                                    inputType="textPassword"
                                />
                                <TouchableOpacity onPress={async ()=>{
                                    setSaving(true);
                                    const userKey = await AsyncStorage.getItem('@UserKey');
                                    if(userKey){
                                        const TrustedContact = {
                                            Name:contactName,
                                            Phone:contactNumber
                                        }
                                        await FirebaseFunctions.saveTrustedContact(userKey,TrustedContact);
                                        setContactName("");
                                        setContactNumber("");
                                        modalizeRef.current.close();
                                        Alert.alert('Saved New Trusted Contact','This Contact will be used to send SOS Message');
                                        setSaving(false);
                                    }
                                }}>
                                    {saving?(
                                        <ActivityIndicator size={60} color="white" style={{alignSelf:'center',margin:10}}/>
                                    ):(
                                        <Text style={RequestStyles.ModalizeButton}>Save Trusted Contact</Text>
                                    )}
                                </TouchableOpacity>   
                            </View>                              
                        )}
                        {viewNow==="SetEmergencyText"&&(
                        <View>
                            <Text style={RequestStyles.Modalize_Heading}>
                                Set Emergency Text
                            </Text>
                            <Text style={RequestStyles.ModalizeButton}>{emergencyText===""?"Add Emergency Message":emergencyText}</Text>
                            <Keyboard
                                textInput={emergencyText}
                                onInput={SetEmergencyText}
                                inputType="textPassword"
                            />
                            <TouchableOpacity onPress={async ()=>{
                                await AsyncStorage.setItem('@EmergencyText',emergencyText);
                                modalizeRef.current.close();
                                Alert.alert('Emergency Text Set','Your Trusted Contacts will receive this message upon SOS Message Sending');
                            }}>
                                <Text style={RequestStyles.ModalizeButton}>Save Emergency Text</Text>
                            </TouchableOpacity>   
                        </View>                             
                        )}
                        {viewNow==="FireService"&&(
                        <View>
                            <Text style={RequestStyles.Modalize_Heading}>
                                Fire Services Are {fireServices?"On":"Off"}
                            </Text>
                            <TouchableOpacity onPress={async ()=>{
                                if(fireServices){
                                    await AsyncStorage.setItem('@fireNotifications','false');
                                    setFireService(false);
                                }
                                else{
                                    await AsyncStorage.setItem('@fireNotifications','true');
                                    setFireService(true);                                
                                }
                            }}>
                                <Text style={RequestStyles.ModalizeButton}>Turn Fire Services {fireServices?"Off":"On"}</Text>
                            </TouchableOpacity>   
                        </View>                                   
                        )}
                    </View>
                    <View style={{marginTop:15}}>

                    </View>
                </View>
            </Modalize>
            <View style={{flex:1}}>
                <Text style={[CommonStyles.MainHeading,{marginTop:60}]}>Medi Services</Text>

                <TouchableOpacity onPress={()=>{
                    setViewNow("MainSOS")
                    modalizeRef.current.open();
                }}>
                    <View style={styles.Container}>
                        <View style={{flex:0.3}}>
                            <MaterialCommunityIcons name="cellphone-message" size={60} style={styles.Image} color={theme.secondary}/>
                        </View>
                        <View style={{flex:0.7}}>
                            <Text style={styles.Text}>SOS Message Service</Text>
                            <Text style={{letterSpacing:1, textAlign:'justify', padding:3}}>Send Messages to Trusted Contacts in case of an emergency</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                    // setViewNow("FireService")
                    // modalizeRef.current.open();
                    props.navigation.navigate('Camera')
                }}>
                    <View style={styles.Container}>
                        <View style={{flex:0.3}}>
                            <MaterialCommunityIcons name="fire" size={60} style={styles.Image} color={theme.secondary}/>
                        </View>
                        <View style={{flex:0.7}}>
                            <Text style={[styles.Text]}>Fire Detection</Text>
                            <Text style={{letterSpacing:1, textAlign:'justify', padding:3}}>Add CCTV Cameras and Use our fire detection algorithm to detect emergency fire situations</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    Image:{
        width:100, height:100,textAlign:'center',textAlignVertical:'center' 
    },  
    Container:{
        flexDirection:'row',margin:5,marginBottom:0,backgroundColor:'white',shadowColor:'black',shadowOpacity:1,elevation:5,borderRadius:10
    },
    Text:{
        flex:0.8,fontSize:21,fontWeight:'bold',textAlignVertical:'center',color:theme.tabBar
    }    
})
export default Services;