import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Share } from 'react-native';
import theme from '../../themes';
import CommonStyles from '../../CommonStyles';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
const UserProfile = (props) => {
    const [user,setUser] = useState({});
    useEffect(()=>{
        async function gatherUserInformation(){
            let user = {};
            await AsyncStorage.multiGet([
                "@UserDisplayName",
                "@UserPhotoUrl",
                "@UserEmail",
                "@UserUID",
                '@UserKey',
                '@DonorKey',
                '@DonorStatus',
                '@DriverKey',
                '@DriverStatus',
            ]).then(response=>{
                user = {
                    'UserDisplayName':response[0][1],
                    'UserPhotoUrl':response[1][1],
                    'UserEmail':response[2][1],
                    'UserUID':response[3][1],
                    'UserKey':response[4][1],
                    'DonorKey':response[5][1],
                    'DonorStatus':response[6][1],
                    'DriverKey':response[7][1],
                    'DriverStatus':response[8][1]
                }
            });
            setUser(user);
        }
        gatherUserInformation();
    },[]);
    return(
        <View>
            <StatusBar backgroundColor={theme.secondary} style="light" animated/>
            <View style={styles.Upper}> 
                <Text style={[CommonStyles.MainHeading,styles.FontProfile]}>User Profile</Text>
            </View>
            <View style={styles.Lower}>
                <Image source={{uri:user.UserPhotoUrl}} style={styles.ImageStyle} resizeMode="stretch"/>
                <Text style={styles.Name}>{user.UserDisplayName}</Text>
                <Text style={styles.Email}>{user.UserEmail}</Text>
                <View>
                    <TouchableOpacity style={styles.Container} onPress={()=>console.log('Ambulance Saved!')}>
                    <MaterialCommunityIcons name="account" size={40} color={theme.greyOutline} style={styles.icon}/>
                        <Text style={styles.Text}>
                            Account
                        </Text>
                        <MaterialIcons name="navigate-next" size={40} color={theme.tabBar} style={styles.icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Container} onPress={async()=>{
                        try{
                            const result = await Share.share({
                                message:"Medi--> Be a part of a greater world by donating and accepting the donations\nLet's help each other",
                                title:"Medi - Medical Emergency Application"
                            });
                        }
                        catch(err){
                            console.log(err);
                        }
                    }}>
                    <MaterialIcons name="share" size={40} color={theme.greyOutline} style={styles.icon}/>
                        <Text style={styles.Text}>
                            Share with friends
                        </Text>
                        <MaterialIcons name="navigate-next" size={40} color={theme.tabBar} style={styles.icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Container} onPress={()=>{
                        props.navigation.navigate('Services');
                    }}>
                    <FontAwesome name="medkit" size={40} color={theme.greyOutline} style={styles.icon}/>
                        <Text style={styles.Text}>
                            Medi Services
                        </Text>
                        <MaterialIcons name="navigate-next" size={40} color={theme.tabBar} style={styles.icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Container} onPress={()=>console.log('Ambulance Saved!')}>
                    <FontAwesome name="star-o" size={40} color={theme.greyOutline} style={styles.icon}/>
                        <Text style={styles.Text}>
                            Review
                        </Text>
                        <MaterialIcons name="navigate-next" size={40} color={theme.tabBar} style={styles.icon}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{flexDirection:'row',marginTop:'5%',width:'90%',alignSelf:'center'}}>
                <TouchableOpacity style={{
                    flex:0.3,
                    borderColor:theme.tabBar,
                    borderWidth:0.2,
                    borderRadius:5,
                    marginRight:5
                }}
                onPress={()=>{
                    props.navigation.goBack();
                }}
                >
                    <MaterialIcons name="arrow-back" size={40} color={theme.tabBar} style={{alignSelf:'center'}}/>
                </TouchableOpacity>
                <Text style={{
                    backgroundColor:theme.secondary,
                    textAlign:'center',
                    color:'white',
                    fontWeight:'bold',
                    borderRadius:20,
                    padding:10,
                    flex:0.7,
                    fontSize:18
                }}>
                    Go Back
                </Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    Upper: { 
        height: 170, 
        backgroundColor: theme.secondary, 
        flexDirection: 'row',
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30
    },
    FontProfile:{
        color: theme.white,
        marginTop: '16%',
        fontSize: 30,
        paddingLeft: 10
    },
    ImageStyle:{
        height: 150,
        width: 130,
        borderRadius: 50,
        alignSelf: 'center',
        marginTop:'-5%'
    },
    Lower:{
        borderRadius: 30,
        width: '90%',
        alignSelf: 'center',
        marginTop: '-5%',
        backgroundColor:'white'
    },
    Name:{
        textAlign:'center',
        fontSize:19,
        fontWeight:'bold',
        color:theme.tabBar
    },
    Email:{
        textAlign:'center',
        fontSize:16,
        fontWeight:'bold',
        color:theme.greyOutline
    },
    Container:{
        flexDirection:'row',margin:1
    },
    icon:{
        flex:0.2,padding:10,alignSelf:'center',textAlignVertical:'center'
    },
    Text:{
        flex:0.8,fontSize:18,fontWeight:'bold',textAlignVertical:'center',color:theme.tabBar
    }
})
export default UserProfile;