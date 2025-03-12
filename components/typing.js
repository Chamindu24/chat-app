import { View } from "react-native";
import React from "react";
import LottieView from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function Typing({ size }) {
  return (
    <View style={{ height: size, aspectRatio: 1, justifyContent: 'center' }}>
      <LottieView
        style={{
          flex: 1,
          transform: [{ scale: size / hp(2) }],  // Adjust the scale based on the size prop
        }}
        source={require('../assets/images/typing.json')}
        autoPlay
        loop
      />
    </View>
  );
}
