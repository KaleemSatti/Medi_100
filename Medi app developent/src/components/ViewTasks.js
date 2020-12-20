import React from 'react';
import { View, Text, ScrollView, StyleSheet} from 'react-native';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return state.taskReducer;
}

const ViewTasks = ({Tasks}) => {
    return(
        <ScrollView>
            {(Tasks && Tasks.length) && (
                <View>
                    {Tasks.map((task,index)=>(
                        <View key={index}>

                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

export default connect(mapStateToProps)(ViewTasks);