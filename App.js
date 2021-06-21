import React, {useEffect, useState, useCallback} from 'react';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import RNLocation from 'react-native-location';
import { Dimensions, View, Text } from 'react-native';

const App = () => {
  const [position, setPosition] = useState([])
  const [region, setRegion] = useState({
    latitude: -6.1668271,
    longitude: 106.9177214,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  });

  console.log(position)

  RNLocation.configure({
    distanceFilter: 5.0
  })
  
  const getPosition = useCallback(async () => {
    await RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: "coarse"
      }
    }).then(granted => {
        if (granted) {
          RNLocation.subscribeToLocationUpdates(locations => {
            setPosition(locations);
            /* Example location returned
            {
              speed: -1,
              longitude: -0.1337,
              latitude: 51.50998,
              accuracy: 5,
              heading: -1,
              altitude: 0,
              altitudeAccuracy: -1
              floor: 0
              timestamp: 1446007304457.029,
              fromMockProvider: false
            }
            */
          })
        }
      })}, [setPosition])

  useEffect(() => {
    getPosition();
  }, [getPosition])

  return (
    <>
    <MapView
      style={{width: Dimensions.get('window').width, height: 300}}
      provider={PROVIDER_GOOGLE}
      region={region}
      onRegionChangeComplete={region => setRegion(region)}>
      <Marker coordinate={{ latitude: -6.1668271, longitude: 106.9177214 }} />
    </MapView>
    <View>
      <Text>My location</Text>
      <Text>latitude: </Text>
      <Text>longitude: </Text>
    </View>
    </>
  );
};

export default App;
