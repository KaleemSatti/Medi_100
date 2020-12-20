import React,{useState,useEffect} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import CommonStyles from '../../CommonStyles';
import theme from '../../themes';
import MonthSelectorCalendar from 'react-native-month-selector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import * as firebase from 'firebase';
const BeDonor = (props) => {
    const [name,setName] = useState("");
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [phone,setPhone] = useState();
    const [bloodGroup,setBloodGroup] = useState();
    const [age, setAge] = useState();
    const [activity,showActivity] = useState(false);
    const [showModal,setShowModal] = useState(false);
    const [donationMonth,setDonationMonth] = useState(new moment());
    const [monthSelected,setMonthSelected] = useState(false);
    const [userKey,setUserKey] = useState("");
    let okArray = [false,false,false,false,false];

    useEffect(()=>{
        const {displayName,email,photoURL,uid} = firebase.auth().currentUser;
        async function setUserInformation(){
            const value = await AsyncStorage.getItem('@UserKey');
            if(value!==null){
                const rootRef = firebase.database().ref('users/'+value);
                rootRef.once('value').then((snapshot)=>{
                    const user = snapshot.val();
                    setName((user.FirstName+" "+user.LastName).trim());
                    setEmail(user.Email);
                    setPhone(user.Phone);
                    setBloodGroup(user.BloodGroup);
                    const birthDate = new Date(user.DateOfBirth);
                    setAge(global.calculateAge(birthDate)+"");
                    setUserKey(value);
                });
            }
        }
        setUserInformation();
    },[]);

    async function saveDonorInformation(){
        showActivity(true);
        let hasError = false;
        for(var ok of okArray){
            if(ok==false){
                hasError=true;
                break;
            }
        }
        if(hasError){
            Alert.alert("Invalid or Incomplete Information","Please Complete the Fields according to the rules mentioned below!");    
            showActivity(false);
        }
        else{
            const rootRef = firebase.database().ref().child('donors');
            await rootRef.push({
                Email:email,
                UserKey:userKey,
                LastDonated:donationMonth.format('MMM YYYY'),
                BloodGroup:bloodGroup,
                Age:age,
                Name:name,
                Status:'Pending'
            }).then(async res=>{
                await AsyncStorage.setItem('@DonorKey',res.key,err=>{
                    console.log(err);
                });
                firebase.database().ref('users').child(userKey).update({
                    DonorKey:res.key
                });
                showActivity(false);
                props.route.params.setStateDonor("Donor Application Pending|Please wait till we approve your application");
                props.navigation.goBack();
            }).catch(err=>{
                Alert.alert('Server Error',err.message?err.message:'Cannot Connect to Server at the moment!');
                showActivity(false);
            });
        }
    }

    function executeRule(ruleType,value){
        let length = value.length;
        if(length==0){
            return <View></View>
        }
        else{
            switch(ruleType){
                case "Name":
                    if(length>=3){
                        okArray[0] = true;
                        return <MaterialIcons name="done-all" size={50} color={theme.success} style={CommonStyles.IconStyles}/>
                    }
                    else{
                        okArray[0] = false;
                        return <MaterialIcons name="error" size={40} color={theme.error} style={CommonStyles.IconStyles}/>
                    }
                case "Email":
                    if(value.includes("@")&&value.includes(".com")){
                        okArray[1] = true;
                        return <MaterialIcons name="done-all" size={40} color={theme.success} style={CommonStyles.IconStyles}/>
                    }
                    else{
                        okArray[1] = false;
                        return <MaterialIcons name="error" size={40} color={theme.error} style={CommonStyles.IconStyles}/>
                    }
                case "Phone":
                    if(length==11&&value.match(/^[0-9]+$/)!=null){
                        okArray[2] = true;
                        return <MaterialIcons name="done-all" size={40} color={theme.success} style={CommonStyles.IconStyles}/>
                    }
                    else{
                        okArray[2] = false;
                        return <MaterialIcons name="error" size={40} color={theme.error} style={CommonStyles.IconStyles}/>
                    }
                case "Age":
                    if(value.match(/^[0-9]+$/)!=null&&value>=18&&value<=45){
                        okArray[3] = true;
                        return <MaterialIcons name="done-all" size={40} color={theme.success} style={CommonStyles.IconStyles}/>
                    }
                    else{
                        okArray[3] = false;
                        return <MaterialIcons name="error" size={40} color={theme.error} style={CommonStyles.IconStyles}/>
                    }
                case "BloodGroup":
                    if(["A+","A-","B+","B-","O+","O-","AB+","AB-"].includes(value)){
                        okArray[4] = true;
                        return <MaterialIcons name="done-all" size={40} color={theme.success} style={CommonStyles.IconStyles}/>
                    }
                    else{
                        okArray[4] = false;
                        return <MaterialIcons name="error" size={40} color={theme.error} style={CommonStyles.IconStyles}/>
                    }
                case "Month":
                    if(value[0]){
                        return <MaterialIcons name="done-all" size={40} color={theme.success} style={CommonStyles.IconStyles}/>
                    }
            }
        }
    }
    return(
        <View>
            <View style={{marginTop:70}}>

            </View>
            <Modal
                visible={showModal}
                onRequestClose={()=>setShowModal(false)}
                onDismiss={()=>setShowModal(false)}
                transparent
            >
                <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.3)'}}>
                    <View style={{backgroundColor:'white',marginTop:'20%'}}>
                        <MonthSelectorCalendar 
                            onMonthTapped={(month)=>{
                                setDonationMonth(month);
                            }}
                            selectedDate={donationMonth}
                            currentDate={new moment()}
                            currentMonthTextStyle={{
                                color:theme.secondary,
                                fontSize:17,
                                fontWeight:'bold'
                            }}
                            selectedBackgroundColor={theme.secondary}
                            yearTextStyle={{
                                fontSize:18,
                                fontWeight:'bold'
                            }}
                            nextText=">>>"
                            prevText="<<<"
                        />
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style={[CommonStyles.SaveButtonSmall,{flex:0.5}]} onPress={()=>{
                                setMonthSelected(true);
                                setShowModal(false);
                            }}>
                                <Text style={CommonStyles.SaveTextSmall}>Select Month</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[CommonStyles.SaveButtonSmall,{flex:0.5,backgroundColor:theme.tabBar}]} onPress={()=>{
                                setMonthSelected(false);
                                setShowModal(false);
                            }}>
                                <Text style={CommonStyles.SaveTextSmall}>Cancel Selection</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <ScrollView>
                <Text style={CommonStyles.MainHeading}>You're Someone's 
                    <Text style={[CommonStyles.MainHeading,{color:theme.secondary}]}> Type</Text>
                    <MaterialCommunityIcons name="cards-heart" color={theme.secondary} size={20}/>
                </Text>
                <View style={CommonStyles.OtherView}>
                    <TextInput 
                        value={name}
                        placeholder="Enter Your Name"
                        placeholderTextColor={theme.white}
                        onChangeText={(text)=>setName(text)}
                        style={CommonStyles.TextStyles}
                        editable={false}
                    />
                    {name?executeRule("Name",name):null}
                </View>
                <Text style={CommonStyles.RestrictionText}>Name must be 3 characters or more</Text>

                <View style={CommonStyles.OtherView}>
                    <TextInput 
                        value={email}
                        placeholder="Enter Your Email Address"
                        placeholderTextColor={theme.white}
                        onChangeText={(text)=>setEmail(text)}
                        style={CommonStyles.TextStyles}
                        editable={false}
                    />
                    {email?executeRule("Email",email):null}
                </View>
                <Text style={CommonStyles.RestrictionText}>Format: example123@service.com</Text>

                <View style={CommonStyles.OtherView}>
                    <TextInput 
                        value={phone}
                        placeholder="Enter Your Phone Number"
                        placeholderTextColor={theme.white}
                        onChangeText={(text)=>setPhone(text)}
                        style={CommonStyles.TextStyles}
                        keyboardType="number-pad"
                        editable={false}
                    />
                    {phone?executeRule("Phone",phone):null}
                </View>
                <Text style={CommonStyles.RestrictionText}>Format: 11 Digits Only, No Alphabets</Text>

                <View style={CommonStyles.OtherView}>
                    <TextInput 
                        value={age}
                        placeholder="Enter Your Age"
                        placeholderTextColor={theme.white}
                        onChangeText={(text)=>setAge(text)}
                        style={CommonStyles.TextStyles}
                        keyboardType="number-pad"
                        editable={false}
                    />
                    {age?executeRule("Age",age):null}
                </View>
                <Text style={CommonStyles.RestrictionText}>Age Limit 18-45</Text>

                <View style={CommonStyles.OtherView}>
                    <TextInput 
                        value={bloodGroup}
                        placeholder="Enter Your BloodGroup"
                        placeholderTextColor={theme.white}
                        onChangeText={(text)=>setBloodGroup(text)}
                        style={CommonStyles.TextStyles}
                        editable={false}
                    />
                    {bloodGroup?executeRule("BloodGroup",bloodGroup):null}
                </View>
                <Text style={CommonStyles.RestrictionText}>Valid Items: A+, A-, B+, B-, O+, O-, AB+, AB-</Text>

                <View style={CommonStyles.OtherView}>
                    <TouchableOpacity style={CommonStyles.TextStyles}onPress={()=>{
                        setShowModal(showModal?false:true);         
                    }}>
                        <Text style={{color:'white',fontSize:16}}>{monthSelected?donationMonth.format('MMM YYYY'):'Not Selected'}</Text>
                    </TouchableOpacity>
                    {monthSelected?executeRule("Month",[monthSelected,donationMonth,showModal]):null}
                </View>
                <Text style={CommonStyles.RestrictionText}>Select Last Donation Month</Text>
                
                <TouchableOpacity style={CommonStyles.SaveButton} onPress={async()=>{
                    await saveDonorInformation();
                }}>
                    {activity==false?(
                        <Text style={CommonStyles.SaveText}>Save Information</Text>
                    ):(
                        <ActivityIndicator size={60} color={theme.white} style={CommonStyles.SaveText}/>
                    )}
                </TouchableOpacity>

                <View style={{marginTop:100}}>

                </View>

            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    
});
export default BeDonor;