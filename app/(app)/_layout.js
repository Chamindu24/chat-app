import {View, Text, TextInput, Button} from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import HomeHeader from '../../components/HomeHeader';
import ProfileHeader from '../../components/ProfileHeader';

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name='home' options={{ header:()=><HomeHeader/>
          }} 
      />
      <Stack.Screen name='profile' options={{ header:()=><ProfileHeader/>
          }} 
      />
    </Stack>
  );
}