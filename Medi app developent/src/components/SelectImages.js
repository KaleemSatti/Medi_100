import React,{useState,useEffect,useRef} from 'react';
import { Text, View, StyleSheet,Modal, TouchableOpacity} from 'react-native';
import ImageBrowser from '../components/ImagePicker/ImageBrowser';
import {MaterialCommunityIcons} from 'react-native-vector-icons';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome, Ionicons,MaterialIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import theme from '../themes';
import { LogBox } from 'react-native';
function CameraModule(props){
  const CameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashmode,setFlashMode] = useState(Camera.Constants.FlashMode.off);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const snap = async () => {
    if (CameraRef) {
      let photo = await CameraRef.current.takePictureAsync();
      var Image = {
        "name":'AddTransaction_Customer.jpg',
        "type":'image/jpeg',
        "uri" :Platform.OS === "android" ? photo.uri : photo.uri.replace("file://","")
      }
      await MediaLibrary.saveToLibraryAsync(Image.uri);
    }
  };
  return(
    <React.Fragment>
      {/* CAMERA VIEW */}
      <Camera ref={CameraRef} style={{ flex: 1 }} type={type} flashMode={flashmode} autoFocus={Camera.Constants.AutoFocus.on}>
        {/* BOTTOM BUTTONS */}
        <View style={{flex: 2, backgroundColor: 'transparent', flexDirection: 'row'}}>
            {/* GALLERY BUTTON */}
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',
                flex:0.33,
                flexDirection:'row'                  
              }}
              onPress={props.handleImagePicker}
              >
              <Ionicons
                  name="ios-photos"
                  style={{ color: "#fff", fontSize: 40,marginLeft:'27%'}}
              />
            </TouchableOpacity>
            {/* CAPTURE IMAGE */}
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',
                flex:0.33
              }}
              onPress={()=>{
                snap();
              }}
              >
              <FontAwesome
                  name="camera"
                  style={{ color: "#fff", fontSize: 60}}
              />
            </TouchableOpacity>
            {/* FLASH BUTTON */}
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'transparent',
                flex:0.33
              }}
              onPress={()=>{
                if(flashmode==Camera.Constants.FlashMode.off){
                  setFlashMode(Camera.Constants.FlashMode.torch);
                }
                else{
                  setFlashMode(Camera.Constants.FlashMode.off);
                }
              }}

              >
              {flashmode==Camera.Constants.FlashMode.torch&&(
                <MaterialIcons
                  name="flash-on"
                  style={{ color: "white", fontSize: 40}}
              />
              )}
              {flashmode==Camera.Constants.FlashMode.off&&(
                <MaterialIcons
                  name="flash-off"
                  style={{ color: "#fff", fontSize: 40}}
              />
              )}
            </TouchableOpacity>
        </View>
      </Camera>
    </React.Fragment>

  );
}

var cPhotos = [];
var count = 0;
export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    showGalley:false,
    HeaderGallery:'Select Images',
    submitFunction:null,
  }; 
  handlerImagePicker=()=>{
    this.setState({showGalley:true})
  }
  imagesCallback = (callback) => {
    callback.then(async (photos) => {
      for(let photo of photos) {
        let blobObject = await fetch(photo.uri).then(response=>{return response.blob()});
        let Image = {
          lastModified:photo.modificationTime,
          lastModifiedDate:new Date(photo.modificationTime),
          name:photo.filename,
          size:blobObject.size,
          type:"image/jpeg",
          webkitRelativePath:"",
          __proto__:blobObject
        }
        cPhotos.push(Image);
      }
      if(cPhotos.length>0){
        this.props.route.params.setImages(cPhotos);
        this.props.navigation.goBack();      
      }
    })
    .catch((e) => console.log(e));
  };
  updateHandler = (count, onSubmit) => {
    if(count==0){
      this.setState({HeaderGallery:'Select Images'})
    }
    else{
      this.setState({submitFunction:onSubmit})
      this.setState({HeaderGallery:count+' Images Selected'})      
    }
  };
  renderSelectedComponent = (number) => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );
  componentDidMount(){
    cPhotos = [];
    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
    ]);    
  }
  render() {
    const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;
    const noCameraPermissionComponent = <Text style={styles.emptyStay}>No access to camera</Text>;
    
    return (
        <View style={{flex:1}}>
          <StatusBar backgroundColor="black" style="light"/>
          <CameraModule handleImagePicker={this.handlerImagePicker}/>
          {/* MULTIPLE IMAGE PICKER */}
          <Modal
            visible={this.state.showGalley}
            animationType='slide'
            onRequestClose={()=>{
              this.setState({HeaderGallery:'Select Images'})
              this.setState({showGalley:false})
            }}
          >
            <View style={[styles.flex,styles.container]}>
              <View style={{flexDirection:'row',backgroundColor:'black',height:60}}>
                <Text style={{flex:1,color:'white',textAlign:'center',textAlignVertical:'center',fontSize:18,fontWeight:'bold',paddingLeft:6}}>{this.state.HeaderGallery}</Text>
                <TouchableOpacity style={{padding:5,marginTop:8,marginRight:7}} onPress={()=>{
                  if(this.state.submitFunction==null){

                  }
                  else{
                    this.state.submitFunction();
                  }
                }}>
                  <MaterialCommunityIcons name="check" size={32} color='white'/>
                </TouchableOpacity>
              </View>
              <ImageBrowser
                max={2}
                onChange={this.updateHandler}
                callback={this.imagesCallback}
                renderSelectedComponent={this.renderSelectedComponent}
                emptyStayComponent={emptyStayComponent}
                noCameraPermissionComponent={noCameraPermissionComponent}
              />
            </View>
          </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
  },
  emptyStay:{
    textAlign: 'center',
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: 'absolute',
    right: 3,
    bottom: 3,
    justifyContent: 'center',
    backgroundColor: theme.secondary
  },
  countBadgeText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 'auto',
    color: '#ffffff'
  }
});