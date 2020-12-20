import React from 'react';
import { connect } from 'react-redux';
import { addTask } from '../redux/actions/task.actions';
import {View,Text,StyleSheet,TextInput,TouchableOpacity, ActionSheetIOS} from 'react-native';
import store from '../redux/store';

class AddTaskScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            ID:"",
            Task:"",
            User:{
                Name:"Hassan",
                ID:1
            }
        }
    }

    AddTasks = () =>{

        const {Task,User} = this.state;
        const content = {
            Task,
            User
        }
        this.props.addTask(content);
    }

    ViewState(){

    }

    render(){
        return( 
            <View style={{flex:1}}>
                <Text style={styles.Main}>Add New Tasks Here</Text>

                <Text style={styles.Label}>Add Task Information</Text>
                <TextInput 
                   value={this.state.Task}
                   onChangeText={(text)=>this.setState({Task:text})} 
                />

                <TouchableOpacity onPress={()=>this.AddTasks()}>
                    <Text style={styles.Button}>Add New Task</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>this.ViewState()}>
                    <Text style={styles.Button}>View All Tasks</Text>
                </TouchableOpacity>


            </View>
        );
    }

}

const styles = StyleSheet.create({
    Main:{
        fontWeight:'bold',
        fontSize:22,
        padding:20,
        textAlign:'center',
        backgroundColor:'black',
        color:'white',
        marginTop:'5%'
    },
    Label:{
        textAlign:'left',
        padding:20,
        borderRadius:20,
        borderWidth:1,
        fontWeight:'bold',
        fontSize:19
    },
    Button:{
        margin:30,
        padding:20,
        backgroundColor:'green',
        color:'white',
        fontWeight:'bold',
        fontSize:19
    }
})

export default connect(null,
    { addTask }
    )(AddTaskScreen);