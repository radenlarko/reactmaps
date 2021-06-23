import React, {useEffect, useState, useCallback} from 'react';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import RNLocation from 'react-native-location';
import {
  Dimensions,
  View,
  Text,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';

const App = () => {
  const [region, setRegion] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  });

  console.log('region: ', region);

  RNLocation.configure({
    distanceFilter: 100, // Meters
    desiredAccuracy: {
      ios: 'best',
      android: 'balancedPowerAccuracy',
    },
    // Android only
    androidProvider: 'auto',
    interval: 5000, // Milliseconds
    fastestInterval: 10000, // Milliseconds
    maxWaitTime: 5000, // Milliseconds
    // iOS Only
    activityType: 'other',
    allowsBackgroundLocationUpdates: false,
    headingFilter: 1, // Degrees
    headingOrientation: 'portrait',
    pausesLocationUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: false,
  });

  const getLocation = useCallback(async () => {
    let permission = await RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'coarse',
        rationale: {
          title: 'We need to access your location',
          message: 'We use your location to show where you are on the map',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      },
    });

    let location;
    if (!permission) {
      permission = await RNLocation.requestPermission({
        ios: 'whenInUse',
        android: {
          detail: 'coarse',
          rationale: {
            title: 'We need to access your location',
            message: 'tolong diokehin',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        },
      });
      console.log(permission);
      location = await RNLocation.getLatestLocation({timeout: 100});
      console.log(location);
    } else {
      try {
        location = await RNLocation.getLatestLocation({timeout: 100});

        if(location.longitude === null){
          return Promise.reject(location)
        }

        console.log('Berhasil ambil lokasi..!!', location);
        setRegion({
          ...region,
          latitude: location.latitude,
          longitude: location.longitude,
        });

        return Promise.resolve(location)
      } catch (err) {
        console.log(err);
      }
    }
  }, [setRegion]);

  return region.latitude ? (
    <>
      <MapView
        style={{width: Dimensions.get('window').width, height: 300}}
        provider={PROVIDER_GOOGLE}
        region={region}>
        <Marker
          coordinate={{latitude: region.latitude, longitude: region.longitude}}
        />
      </MapView>
      <View style={{alignItems: 'flex-end', marginTop: -20, marginRight: 20}}>
        <TouchableOpacity
          onPress={getLocation}
          style={{
            padding: 10,
            borderRadius: 10,
            width: 40,
            backgroundColor: '#007fbf',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: 'white'}}>[ ]</Text>
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center', marginTop: 10}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>My location</Text>
        <Text>Latitude: {region.latitude} </Text>
        <Text>Longitude: {region.longitude} </Text>
      </View>
    </>
  ) : (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#007fbf" />
      <View style={{marginTop: 30, alignItems: 'center'}}>
        <Text style={{fontSize: 16}}>Getting location...</Text>
        <TouchableOpacity
          onPress={getLocation}>
          <Text style={{color: '#007fbf', textDecorationLine: 'underline'}}>try get location manualy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;

// old version

// import React, {useEffect, useState, useCallback} from 'react';

// import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
// import RNLocation from 'react-native-location';
// import { Dimensions, View, Text } from 'react-native';

// const App = () => {
//   const [position, setPosition] = useState([])
//   const [region, setRegion] = useState({
//     latitude: -6.1668271,
//     longitude: 106.9177214,
//     latitudeDelta: 0.009,
//     longitudeDelta: 0.009,
//   });

//   console.log(position)

//   RNLocation.configure({
//     distanceFilter: 5.0
//   })

//   const getPosition = useCallback(async () => {
//     await RNLocation.requestPermission({
//       ios: "whenInUse",
//       android: {
//         detail: "coarse"
//       }
//     }).then(granted => {
//         if (granted) {
//           RNLocation.subscribeToLocationUpdates(locations => {
//             setPosition(locations);
//             /* Example location returned
//             {
//               speed: -1,
//               longitude: -0.1337,
//               latitude: 51.50998,
//               accuracy: 5,
//               heading: -1,
//               altitude: 0,
//               altitudeAccuracy: -1
//               floor: 0
//               timestamp: 1446007304457.029,
//               fromMockProvider: false
//             }
//             */
//           })
//         }
//       })}, [setPosition])

//   useEffect(() => {
//     getPosition();
//   }, [getPosition])

//   return (
//     <>
//     <MapView
//       style={{width: Dimensions.get('window').width, height: 300}}
//       provider={PROVIDER_GOOGLE}
//       region={region}
//       onRegionChangeComplete={region => setRegion(region)}>
//       <Marker coordinate={{ latitude: -6.1668271, longitude: 106.9177214 }} />
//     </MapView>
//     <View>
//       <Text>My location</Text>
//       <Text>latitude: </Text>
//       <Text>longitude: </Text>
//     </View>
//     </>
//   );
// };

// export default App;
