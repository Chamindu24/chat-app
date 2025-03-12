import { View,Text } from "react-native";
import React from "react";
import LottieView from 'lottie-react-native';

export default function Typing({size}) {
  return (
    <View style={{height: size, aspectRatio:1}} >
      <LottieView style={{flex:1}} source={require('../assets/images/typing.json')} autoPlay loop />
    </View>
  );
}