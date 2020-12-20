import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Image, ScrollView, Alert } from 'react-native';
import theme from '../../themes';
import { CommonActions } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FirebaseFunctions from '../../FirebaseFunctions';

const LogIn = (props) => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [activity,showActivity] = useState(false);
    let okArray = [false,false];
    useEffect(()=>{
        async function getAll(){
            const keys = await AsyncStorage.getAllKeys();
            console.log(keys);  
        }
        getAll();
    },[])
    async function logIn(){
        for(var x of okArray){
            if(!x){
                Alert.alert("Invalid or Incomplete Information","Please Complete the Fields according to the rules mentioned below!")
                return null;
            }
        }
        showActivity(true);
        const promise = firebase.auth().signInWithEmailAndPassword(email.toLowerCase(),password);
        let MainUser = null;
        promise.then(async({user})=>{
            MainUser = user.providerData[0];

            await FirebaseFunctions.setKeys(MainUser.email);
            await AsyncStorage.setItem('@UserDisplayName',MainUser.displayName);
            await AsyncStorage.setItem('@UserPhotoUrl',MainUser.photoURL);
            await AsyncStorage.setItem('@UserEmail',MainUser.email); 
            await AsyncStorage.setItem('@UserUID',user.uid);
 
            showActivity(false);              
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                    { name: 'HOME' },
                    ],
                })
            );
        }).catch(err=>{
            console.log(err);
            Alert.alert('Error While Logging In',err.message);
            showActivity(false);
        });
    }
    function executeRule(ruleType,value){
        let length = value.length;
        if(length==0){
            return <View></View>
        }
        else{
            switch(ruleType){
                case "Password":
                    let regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
                    if(value.search(regularExpression)>=0){
                        okArray[0] = true;
                        return <MaterialIcons name="done-all" size={40} color={theme.success} style={styles.IconStyles}/>
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
            }
        }
    }

    return(
        <View>
            <Image source={require('../../../assets/icon-removebg-preview.png')} style={{width:'60%', height:'40%',alignSelf:'center'}} resizeMode='contain'/>
            <Text style={styles.MainHeading}>Log In To Medi</Text>            
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
                
                <TouchableOpacity style={styles.SaveButton} onPress={async()=>await logIn()}>
                {activity==false?(
                    <Text style={styles.SaveText}>Log In</Text>
                ):(
                    <ActivityIndicator size={60} color={theme.white} style={styles.SaveText}/>
                )}
                </TouchableOpacity>

                <TouchableOpacity style={[styles.SaveButton,{marginTop:'5%'}]} onPress={()=>{
                    props.navigation.navigate('SignUp')
                }}>
                {activity==false?(
                    <Text style={styles.SaveText}>Create Account</Text>
                ):(
                    <View></View>
                )}
                </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    MainHeading: {
      fontSize: 28,
      fontWeight: "bold",
      padding: 30,
      color: theme.tabBar,
      paddingTop:0
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

export default LogIn;