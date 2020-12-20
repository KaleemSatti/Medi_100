import * as Location from 'expo-location';
import { LocationTaskOptions, LocationObject, PermissionStatus, Accuracy, ActivityType } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Permission from 'expo-permissions';
import theme from '../../themes';

type Listener = (location: LocationObject) => void;

class LocationServiceClass {
  
  public lastLocation: LocationObject | undefined;
  public readonly backgroundTaskName = 'Medi | Driver GPS';
  private readonly listeners = new Map<string, Listener>();
  public running = false;
  
  constructor() {
    if (this.checkPermission()) {
      this.init();
    }
    
  }

  async init() {
    console.log('Defining location background task');
    try {
      this.lastLocation = await Location.getLastKnownPositionAsync();
      console.log('Got last location');
      if (this.listeners.size > 0) {
        Array.from(this.listeners.values())
          .forEach((listener => listener(this.lastLocation as LocationObject)))
      }
    } catch (err) {
      console.log('Unable to get last known location', err.message);
    }
    
    if (TaskManager.isTaskDefined(this.backgroundTaskName)) {
      return;
    }
    TaskManager.defineTask(this.backgroundTaskName, ({ error, data }) => {
      if (error) {
        console.log('Background location error', error);
        return;
      }
    //   console.log('Location updated')
      let locations: LocationObject[] = (data as any).locations;
      locations = locations.filter(loc => loc.coords.accuracy <= 8);

    //   console.log('LOCATIONS', locations)

      locations.forEach(location =>
        Array.from(this.listeners.values())
          .forEach((listener => listener(location))
        )
      );

      this.lastLocation = locations[locations.length - 1];
    });
  }

  async addListener(id: string, listener: Listener) {
    console.log('Started listening for location', id);
    this.listeners.set(id, listener);
    if (!this.running && this.listeners.size > 0) {
      this.startWatching();
    }
    if (this.lastLocation) {
      listener(this.lastLocation as LocationObject);
    }
  }

  removeListener(id: string) {
    console.log('Stopped listening for location', id);
    this.listeners.delete(id);
    if (this.running && this.listeners.size === 0) {
      this.stopWatching();
    }
  }

  async startWatching(): Promise<void> {
    console.log('Starting location watch',)
    const options: LocationTaskOptions = {
      accuracy: Accuracy.BestForNavigation,
      timeInterval: 10000,
      distanceInterval: 0,
      showsBackgroundLocationIndicator: true,
      activityType: ActivityType.AutomotiveNavigation,
      foregroundService: {
        notificationTitle: 'Medi GPS Service',
        notificationBody: 'Medi GPS Service is running',
        notificationColor: theme.secondary,
      }
    }
    const locationRunning = await Location.hasStartedLocationUpdatesAsync(this.backgroundTaskName)
    if (!locationRunning) {
      console.log('Starting location background service')
      await Location.startLocationUpdatesAsync(this.backgroundTaskName, options);
      console.log('Started location background service')
    } else {
      console.log('Location background service already running');
    }

    this.running = true;
  }

  async stopWatching() {
    const locationRunning = await Location.hasStartedLocationUpdatesAsync(this.backgroundTaskName);
    if (locationRunning) {
      await Location.stopLocationUpdatesAsync(this.backgroundTaskName);
      console.log('Removed background location service')
    } else {
      console.log('Location background service not running');
    }
    this.running = false;
  }

  async checkPermission() {
    console.log('Checking location permission');
    const { status } = await Permission.askAsync(Permission.LOCATION);
    console.log('Location permission', status);
    if (status === PermissionStatus.GRANTED) {
      this.init();
    }
    return status === PermissionStatus.GRANTED;
  }

  async getCurrentLocation(){
    return (this.lastLocation);
  }
}

const LocationService = new LocationServiceClass();
export { LocationService };