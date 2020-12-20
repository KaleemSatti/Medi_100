import { DeviceEventEmitter } from 'react-native';
import { PermissionStatus, Accuracy, ActivityType } from 'expo-location';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Permission from 'expo-permissions';
import theme from '../../themes';

let LocationNow = {};
let started = false;
let running = false;
const TASK_FETCH_LOCATION = "TASK_FETCH_LOCATION";
async function checkPermission() {
    console.log('Checking location permission');
    const { status } = await Permission.askAsync(Permission.LOCATION);
    console.log('Location permission', status);
    if (status === PermissionStatus.GRANTED) {
        return status === PermissionStatus.GRANTED;
    }
    else{
        return false;
    }
}

async function startLocationService(){
    const options = {
        accuracy: Accuracy.BestForNavigation,
        timeInterval: 15000,
        distanceInterval: 0,
        showsBackgroundLocationIndicator: true,
        activityType: ActivityType.AutomotiveNavigation,
        foregroundService: {
            notificationTitle: 'Medi GPS Service',
            notificationBody: 'Medi GPS Service is running',
            notificationColor: theme.secondary,
        }
    }
    const locationRunning = await Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION);
    started = locationRunning;
    if (!locationRunning) {
      console.log('Starting location background service')
      await Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, options);
      running = true;
      console.log('Started location background service')
    } else {
      console.log('Location background service already running');
    }
    
}

function getCurrentLocation(){
    return LocationNow;
}
function stopLocationService(){
    Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
        console.log('Location Services are running: '+value);
        if (value) {
          Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
          running = false
        }
    });    
}

function checkLocationServices(){
    Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
        console.log('Location Services are running: '+value);
        running = value;
    });      
    return running;
}

async function init(){
    if(checkPermission()){
        try{
            TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data: { locations }, error }) => {
                if (error) {
                    console.error(error);
                    return;
                }
                const [location] = locations;
                LocationNow = location;
                DeviceEventEmitter.emit('UpdatedLocation', location);
            });
        }
        catch(e){

        }
    }
}

const AllFunctions = {
    startLocationService,
    stopLocationService,
    getCurrentLocation,
    init,
    checkLocationServices,
    running,
    started
}

export default AllFunctions;

