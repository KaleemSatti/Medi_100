import React,{useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Image, Alert, LogBox } from 'react-native';
import theme from '../../themes';
import { MaterialIcons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const SignUp = (props) => {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone,setPhone] = useState("");
    const [password,setPassword] = useState("");
    const [bloodGroup,setBloodGroup] = useState("");
    const [image,setImage] = useState([]);
    const [dateOfBirth,setDateBirth] = useState(null);
    const [showPicker,setShowPicker] = useState(false);
    const [activity,showActivity] = useState(false);
    const [gender, setGender] = useState("");
    let okArray = [false,false,false,false,false,false,false,false];

    useEffect(()=>{
        LogBox.ignoreAllLogs(); 
    },[])
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowPicker(false);
        setDateBirth(currentDate);
    };
    function getImagesSeleceted(Images){
        if(Images){
            setImage(Images);
        }
    }

    async function uploadImage(){
        const folderName = "DriverLicence/"+phone+"/";
        
        const metadata = {
            "content-type":'image/jpeg'
        }

        const frontPictureRef = firebase.storage().ref().child(folderName+image[0].name);
        
        const urlFront = await frontPictureRef.put(image[0],metadata);
        
        const urls = Promise.all([urlFront.ref.getDownloadURL()]);
        return urls;
    }

    async function saveUser(){
        showActivity(true);
        for(var x of okArray){
            if(!x){
                Alert.alert("Invalid or Incomplete Information","Please Complete the Fields according to the rules mentioned below!")
                return null;
            }
        }
        firebase.auth().createUserWithEmailAndPassword(email,password).then(async function(){
            await uploadImage().then(url=>{
                const {currentUser} = firebase.auth();
                currentUser.updateProfile({
                    photoURL:url[0],
                    displayName:name,
                }).then(async function(){
                    const rootRef = firebase.database().ref().child('users');
                    let firstName = name.split(" ")[0];
                    let lastName = name.split(" ")[1];
                    if(!lastName){
                        lastName = "";
                    }
                    const userKey = rootRef.push({
                        FirstName:firstName,
                        LastName:lastName,  
                        Email:email.toLowerCase(),
                        Password:password,
                        Phone:phone,
                        BloodGroup:bloodGroup,
                        Photo:url[0],
                        DateOfBirth:dateOfBirth.toDateString(),
                        Gender:gender
                    }).key;
                    await AsyncStorage.setItem('@UserKey',userKey);
                    Alert.alert('User Created','Welcome to MEDI-Emergency Help Service');
                    showActivity(false);
                    props.navigation.goBack();
                });
            })
        }).catch(error=>{
            Alert.alert('Error Occured While Creating User',error.message);
        })
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
                        return <MaterialIcons name="done-all" size={50} color={theme.success} style={styles.IconStyles}/>
                    }
                    else{
                        okArray[0] = false;
                        return <MaterialIcons name="error" size={40} color={theme.error} style={styles.IconStyles}/>
                    }
                case "Email":
                    if(value.includes("@")&&value.includes(".com")){
                        okArray[1] = true;
                        return <MaterialIcons name="done-all" size={40} color={theme.success} style={styles.IconStyles}/>
                    }
                    else{
                        okArray[1] = false;
                        return <MaterialIcons name="error" size={40} color={theme.error} style={styles.IconStyles}/>
                    }
                case "Password":
                    let regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
                    if(value.search(regularExpression)>=0){
                        okArray[2] = true;
                        return <MaterialIcons name="done-all" size={40} color={theme.success} style={styles.IconStyles}/>
                    }
                    else{
                        okArray[2] = false;
                        return <MaterialIcons name="error" size={40} color={theme.error} style={styles.IconStyles}/>
                    }
                case "Phone":
                    if(length==11&&value.match(/^[0-9]+$/)!=null){
                        okArray[3] = true;
                        return <MaterialIcons name="done-all" size={40} color={theme.success} style={styles.IconStyles}/>
                    }
                    else{
                        okArray[3] = false;
                        return <MaterialIcons name="error" size={40} color={theme.error} style={styles.IconStyles}/>
                    }
                case "BloodGroup":
                    if(["A+","A-","B+","B-","O+","O-","AB+","AB-"].includes(value)){
                        okArray[4] = true;
                        return <MaterialIcons name="done-all" size={40} color={theme.success} style={styles.IconStyles}/>
                    }
                    else{
                        okArray[4] = false;
                        return <MaterialIcons name="error" size={40} color={theme.error} style={styles.IconStyles}/>
                    }
                case "Images":
                    if(value.length==1){
                        okArray[5] = true;
                        return <MaterialIcons name="done-all" size={40} color={theme.success} style={styles.IconStyles}/>
                    }
                    else{
                        okArray[5] = false;
                        return <MaterialIcons name="error" size={40} color={theme.error} style={styles.IconStyles}/>
                    }                    
                case "DateBirth":
                    const age = global.calculateAge(value);
                    if(age>=18 && age<=45){
                        okArray[6] = true;
                        return <MaterialIcons name="done-all" size={40} color={theme.success} style={styles.IconStyles}/>
                    }
                    else{
                        okArray[6] = false;
                        return <MaterialIcons name="error" size={40} color={theme.error} style={styles.IconStyles}/>
                    }
                case "Gender":
                    if(value.toLowerCase()==="Male".toLowerCase() || value.toLowerCase()==="Female".toLowerCase() || value.toLowerCase()==="Others".toLowerCase()){
                        okArray[7] = true;
                        return <MaterialIcons name="done-all" size={40} color={theme.success} style={styles.IconStyles}/>
                    }
                    else{
                        okArray[7] = false;
                        return <MaterialIcons name="error" size={40} color={theme.error} style={styles.IconStyles}/>
                    }
                }
                    
        }
    }


    return(
        <View>
            {showPicker && (
            <DateTimePicker
                testID="dateTimePicker"
                value={dateOfBirth || new Date()}
                mode="date"
                is24Hour={false}
                display="calendar"
                onChange={onChange}
            />
            )}
            <Image source={require('../../../assets/icon-removebg-preview.png')} style={{width:'30%', height:'10%', alignSelf:'center'}} resizeMode='contain'/>
            <Text style={styles.MainHeading}>Create New Account</Text>
            <ScrollView>

                <View style={styles.OtherView}>
                    <TextInput 
                        value={name}
                        placeholder="Enter Your Name"
                        placeholderTextColor={theme.white}
                        onChangeText={(text)=>setName(text)}
                        style={styles.TextStyles}
                    />
                    {name?executeRule("Name",name):null}
                </View>
                <Text style={styles.RestrictionText}>Name must be 3 characters or more</Text>

                <View style={styles.OtherView}>
                    <TextInput 
                        value={email}
                        placeholder="Enter Your Email Address"
                        placeholderTextColor={theme.white}
                        onChangeText={(text)=>setEmail(text)}
                        style={styles.TextStyles}
                    />
                    {email?executeRule("Email",email):null}
                </View>
                <Text style={styles.RestrictionText}>Format: example123@service.com</Text>

                <View style={styles.OtherView}>
                    <TextInput 
                        value={password}
                        placeholder="Enter Your Password"
                        placeholderTextColor={theme.white}
                        onChangeText={(text)=>setPassword(text)}
                        style={styles.TextStyles}
                    />
                    {password?executeRule("Password",password):null}
                </View>
                <Text style={styles.RestrictionText}>Password must contain Special Characters {"[!,?,@,#,$,%,^,&]"}</Text>

                <View style={styles.OtherView}>
                    <TextInput 
                        value={phone}
                        placeholder="Enter Your Phone Number"
                        placeholderTextColor={theme.white}
                        onChangeText={(text)=>setPhone(text)}
                        style={styles.TextStyles}
                        keyboardType="number-pad"
                    />
                    {phone?executeRule("Phone",phone):null}
                </View>
                <Text style={styles.RestrictionText}>Format: 11 Digits Only, No Alphabets</Text>

                <TouchableOpacity style={styles.OtherView} onPress={()=>setShowPicker(true)}>
                    <Text style={styles.TextStyles}>{dateOfBirth?dateOfBirth.toDateString():'Select Your Date of Birth'}</Text>
                    {dateOfBirth?executeRule("DateBirth",dateOfBirth):null}
                </TouchableOpacity>
                <Text style={styles.RestrictionText}>Age Limit 18-45</Text>

                <View style={styles.OtherView}>
                <TextInput 
                    value={bloodGroup}
                    placeholder="Enter Your BloodGroup"
                    placeholderTextColor={theme.white}
                    onChangeText={(text)=>setBloodGroup(text)}
                    style={styles.TextStyles}
                />
                {bloodGroup?executeRule("BloodGroup",bloodGroup):null}
            </View>
            <Text style={styles.RestrictionText}>Valid Items: A+, A-, B+, B-, O+, O-, AB+, AB-</Text>

            <View style={styles.OtherView}>
                <TextInput 
                    value={gender}
                    placeholder="Enter Your Gender"
                    placeholderTextColor={theme.white}
                    onChangeText={(text)=>setGender(text)}
                    style={styles.TextStyles}
                />
                {gender?executeRule("Gender",gender):null}
            </View>
            <Text style={styles.RestrictionText}>Valid Items: Male, Female, Others</Text>

            <View style={styles.OtherView}>
                <TouchableOpacity style={styles.TextStyles}onPress={()=>{
                    props.navigation.navigate('SelectImages',{
                        setImages:getImagesSeleceted
                    });
                }}>
                    <Text style={{color:'white',fontSize:16}}>{image.length>0?image.length+" Image Selected":"Choose Profile Image"}</Text>
                </TouchableOpacity>
                {image?executeRule("Images",image):null}
            </View>
            <Text style={styles.RestrictionText}>Take Or Choose Your Picture</Text>

            <TouchableOpacity style={styles.SaveButton} onPress={async()=>await saveUser()}>
                {activity==false?(
                    <Text style={styles.SaveText}>Save Information</Text>
                ):(
                    <ActivityIndicator size={60} color={theme.white} style={styles.SaveText}/>
                )}
            </TouchableOpacity>

            <View style={{marginTop:200}}></View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    MainHeading: {
      fontSize: 28,
      fontWeight: "bold",
      padding: 30,
      color: theme.tabBar,
      paddingTop:0,
      alignSelf:'center'
    },
    OtherView: {
      flexDirection: "row",
      backgroundColor: theme.tabBar,
      width: "90%",
      alignSelf: "center",
      borderRadius: 10,
    },
    TextStyles: {
      padding: 15,
      alignSelf: "center",
      color: theme.white,
      flex: 0.9,
      fontSize:16
    },
    IconStyles: {
      justifyContent: "center",
      alignItems: "center",
      textAlignVertical: "center",
    },
    RestrictionText: {
      padding: 22,
      color: theme.tabBar,
      paddingTop: 0,
    },
    SaveButton:{
      backgroundColor: theme.secondary,
      width: "50%",
      alignSelf: "flex-start",
      borderRadius: 20,
      marginLeft:20
    },
    SaveText: {
      padding: 15,
      color: theme.white,
      fontSize:22,
      fontWeight:'bold',
      textAlign:'center',
    },
  });

export default SignUp;