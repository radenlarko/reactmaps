import React, {useEffect, useState, useCallback} from 'react';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import RNLocation from 'react-native-location';
import Geocoder from 'react-native-geocoder-reborn';
import {
  Dimensions,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';

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

const App = () => {
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState({
    latitude: 40.7809261,
    longitude: -73.9637594,
    latitudeDelta: 0.022,
    longitudeDelta: 0.022,
  });

  console.log('region: ', region);

  // lokasi adyawinsa
  // const myPosition = {
  //   lat: -6.1668271,
  //   lng: 106.9177214,
  // };

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
      try {
        const location = await RNLocation.getLatestLocation({timeout: 100});

        if (location.longitude === null) {
          return Promise.reject(location);
        }

        console.log('Berhasil ambil lokasi..!!', location);
        setRegion({
          ...region,
          latitude: location.latitude,
          longitude: location.longitude,
        });

        return Promise.resolve(location);
      } catch (err) {
        console.log(err);
        Alert.alert('Error!!', 'Cannot get maps api, please try again later.');
      }
    } else {
      try {
        const location = await RNLocation.getLatestLocation({timeout: 100});

        if (location.longitude === null) {
          return Promise.reject(location);
        }

        console.log('Berhasil ambil lokasi..!!', location);
        setRegion({
          ...region,
          latitude: location.latitude,
          longitude: location.longitude,
        });

        return Promise.resolve(location);
      } catch (err) {
        console.log(err);
        Alert.alert('Error!!', 'Cannot get maps api, please try again later.');
      }
    }
  }, [setRegion]);

  const getAddress = useCallback(async () => {
    try {
      const lat = region.latitude;
      const lng = region.longitude;

      const response = await Geocoder.geocodePosition({lat, lng});

      if (!region.longitude || !region.latitude) {
        return Promise.reject(lat, lng, response);
      }

      console.log('Address: ', response[0].formattedAddress);
      setAddress(response[0].formattedAddress);

      return Promise.resolve(lat, lng, response);
    } catch (err) {
      console.log(err);
    }
  }, [setAddress, region.latitude, region.longitude]);

  useEffect(() => {
    getLocation();
    getAddress();
  }, [getLocation, getAddress]);

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
      <View
        style={{alignItems: 'center', marginTop: 10, paddingHorizontal: 30}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>My location</Text>
        <Text>Latitude: {region.latitude} </Text>
        <Text>Longitude: {region.longitude} </Text>
        <Text style={{marginTop: 16}}>Address:</Text>
        <Text style={{fontSize: 11, color: 'grey', textAlign: 'center'}}>
          {address}
        </Text>
      </View>
    </>
  ) : (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#007fbf" />
      <View style={{marginTop: 30, alignItems: 'center'}}>
        <Text style={{fontSize: 16}}>Getting location...</Text>
        <TouchableOpacity onPress={getLocation}>
          <Text style={{color: '#007fbf', textDecorationLine: 'underline'}}>
            try get location manualy
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;

// Formated Address ===================================================

// import React, {useEffect, useState} from 'react';

// import Geocoder from 'react-native-geocoder-reborn';
// import {View, Text} from 'react-native';

// const App = () => {
//   const [posisi, setPosisi] = useState("");
//   const myPosition = {
//     lat: -6.1668271,
//     lng: 106.9177214,
//   };

//   console.log('posisi set: ', posisi);

//   const getAdress = async () => {
//     await Geocoder.geocodePosition(myPosition)
//       .then(res => {
//         setPosisi(res[0].formattedAddress);
//         console.log('res 1: ', res[0].formattedAddress);
//       })
//       .catch(err => console.log(err));
//   };

//   // Address Geocoding
//   Geocoder.geocodeAddress('Jakarta')
//     .then(res => {
//       console.log('res 2: ', res);
//     })
//     .catch(err => console.log(err));

//   useEffect(() => {
//     getAdress();
//   }, []);

//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text style={{fontSize: 24, color: 'grey'}}>My location</Text>
//       <Text>{posisi}</Text>
//     </View>
//   );
// };

// export default App;

// Maps and current location ===================================================

// import React, {useEffect, useState, useCallback} from 'react';

// import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
// import RNLocation from 'react-native-location';
// import {
//   Dimensions,
//   View,
//   Text,
//   Button,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';

// RNLocation.configure({
//   distanceFilter: 100, // Meters
//   desiredAccuracy: {
//     ios: 'best',
//     android: 'balancedPowerAccuracy',
//   },
//   // Android only
//   androidProvider: 'auto',
//   interval: 5000, // Milliseconds
//   fastestInterval: 10000, // Milliseconds
//   maxWaitTime: 5000, // Milliseconds
//   // iOS Only
//   activityType: 'other',
//   allowsBackgroundLocationUpdates: false,
//   headingFilter: 1, // Degrees
//   headingOrientation: 'portrait',
//   pausesLocationUpdatesAutomatically: false,
//   showsBackgroundLocationIndicator: false,
// });

// const App = () => {
//   const [region, setRegion] = useState({
//     latitude: null,
//     longitude: null,
//     latitudeDelta: 0.022,
//     longitudeDelta: 0.022,
//   });

//   console.log('region: ', region);

//   const getLocation = useCallback(async () => {
//     let permission = await RNLocation.requestPermission({
//       ios: 'whenInUse',
//       android: {
//         detail: 'coarse',
//         rationale: {
//           title: 'We need to access your location',
//           message: 'We use your location to show where you are on the map',
//           buttonPositive: 'OK',
//           buttonNegative: 'Cancel',
//         },
//       },
//     });

//     if (!permission) {
//       permission = await RNLocation.requestPermission({
//         ios: 'whenInUse',
//         android: {
//           detail: 'coarse',
//           rationale: {
//             title: 'We need to access your location',
//             message: 'tolong diokehin',
//             buttonPositive: 'OK',
//             buttonNegative: 'Cancel',
//           },
//         },
//       });
//       console.log(permission);
//       try {
//         const location = await RNLocation.getLatestLocation({timeout: 100});

//         if (location.longitude === null) {
//           return Promise.reject(location);
//         }

//         console.log('Berhasil ambil lokasi..!!', location);
//         setRegion({
//           ...region,
//           latitude: location.latitude,
//           longitude: location.longitude,
//         });

//         return Promise.resolve(location);
//       } catch (err) {
//         console.log(err);
//         Alert.alert('Error!!', 'Cannot get maps api, please try again later.');
//       }
//     } else {
//       try {
//         const location = await RNLocation.getLatestLocation({timeout: 100});

//         if (location.longitude === null) {
//           return Promise.reject(location);
//         }

//         console.log('Berhasil ambil lokasi..!!', location);
//         setRegion({
//           ...region,
//           latitude: location.latitude,
//           longitude: location.longitude,
//         });

//         return Promise.resolve(location);
//       } catch (err) {
//         console.log(err);
//         Alert.alert('Error!!', 'Cannot get maps api, please try again later.');
//       }
//     }
//   }, [setRegion]);

//   useEffect(() => {
//     getLocation();
//   }, [getLocation]);

//   return region.latitude ? (
//     <>
//       <MapView
//         style={{width: Dimensions.get('window').width, height: 300}}
//         provider={PROVIDER_GOOGLE}
//         region={region}>
//         <Marker
//           coordinate={{latitude: region.latitude, longitude: region.longitude}}
//         />
//       </MapView>
//       <View style={{alignItems: 'flex-end', marginTop: -20, marginRight: 20}}>
//         <TouchableOpacity
//           onPress={getLocation}
//           style={{
//             padding: 10,
//             borderRadius: 10,
//             width: 40,
//             backgroundColor: '#007fbf',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//           <Text style={{color: 'white'}}>[ ]</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={{alignItems: 'center', marginTop: 10}}>
//         <Text style={{fontSize: 16, fontWeight: 'bold'}}>My location</Text>
//         <Text>Latitude: {region.latitude} </Text>
//         <Text>Longitude: {region.longitude} </Text>
//       </View>
//     </>
//   ) : (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <ActivityIndicator size="large" color="#007fbf" />
//       <View style={{marginTop: 30, alignItems: 'center'}}>
//         <Text style={{fontSize: 16}}>Getting location...</Text>
//         <TouchableOpacity onPress={getLocation}>
//           <Text style={{color: '#007fbf', textDecorationLine: 'underline'}}>
//             try get location manualy
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default App;

// Current location ===================================================

// import React, {useState} from 'react';

// import RNLocation from 'react-native-location';
// import {View, Text, Button, Alert} from 'react-native';

// RNLocation.configure({
//   distanceFilter: 100, // Meters
//   desiredAccuracy: {
//     ios: 'best',
//     android: 'balancedPowerAccuracy',
//   },
//   // Android only
//   androidProvider: 'auto',
//   interval: 5000, // Milliseconds
//   fastestInterval: 10000, // Milliseconds
//   maxWaitTime: 5000, // Milliseconds
//   // iOS Only
//   activityType: 'other',
//   allowsBackgroundLocationUpdates: false,
//   headingFilter: 1, // Degrees
//   headingOrientation: 'portrait',
//   pausesLocationUpdatesAutomatically: false,
//   showsBackgroundLocationIndicator: false,
// });

// const App = () => {
//   const [posisi, setPosisi] = useState([]);

//   console.log('posisi ku: ', posisi);

//   const getLocation = async () => {
//     let permission = await RNLocation.requestPermission({
//       ios: 'whenInUse',
//       android: {
//         detail: 'coarse',
//         rationale: {
//           title: 'We need to access your location',
//           message: 'We use your location to show where you are on the map',
//           buttonPositive: 'OK',
//           buttonNegative: 'Cancel',
//         },
//       },
//     });

//     let location;

//     if (!permission) {
//       permission = await RNLocation.requestPermission({
//         ios: 'whenInUse',
//         android: {
//           detail: 'coarse',
//           rationale: {
//             title: 'We need to access your location',
//             message: 'We use your location to show where you are on the map',
//             buttonPositive: 'OK',
//             buttonNegative: 'Cancel',
//           },
//         },
//       });
//       console.log(permission);
//       try {
//         location = await RNLocation.getLatestLocation({timeout: 100});

//         if (location.latitude === null) {
//           return Promise.reject(location);
//         }

//         setPosisi(location);
//         console.log(location);

//         return Promise.resolve(location);
//       } catch (err) {
//         console.log(err);
//         Alert.alert('Error!!', `cannot get location, ${String(err)}`);
//       }
//     } else {
//       console.log('Berhasil!!');
//       try {
//         location = await RNLocation.getLatestLocation({timeout: 100});

//         if (location.latitude === null) {
//           return Promise.reject(location);
//         }

//         setPosisi(location);
//         console.log(location);

//         return Promise.resolve(location);
//       } catch (err) {
//         console.log(err);
//         Alert.alert('Error!!', `cannot get location, ${String(err)}`);
//       }
//     }
//   };

//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <View
//         style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
//         <Button onPress={getLocation} title="Get Location" />
//       </View>
//       <Text>Latitude: {posisi.latitude}</Text>
//       <Text>Longitude: {posisi.longitude}</Text>
//     </View>
//   );
// };

// export default App;

// old version ===================================================

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
