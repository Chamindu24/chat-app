import {View, Text,TouchableOpacity} from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Entypo, Ionicons } from '@expo/vector-icons';


export default function ChatRoomHeader({user,router}) {
    return (
        <Stack.Screen 
            options={{
                title:'',
                headerShadowVisible:false,
                headerStyle: { paddingTop: hp(2) },
                headerLeft:()=>(
                    <View className='flex-row items-center gap-3'>
                        <TouchableOpacity onPress={()=>router.back()}>
                            <Entypo name='chevron-left' size={hp(4)} color='#737373'/>
                        </TouchableOpacity>
                        <View className='flex-row items-center gap-2'>
                            <Image
                                style={{height:hp(4.5), width: hp(4.5), borderRadius: 100}}
                                source={user?.profileUrl}
                            />
                            <Text style={{fontSize: hp(2.5)}} className='font-medium text-neutral-700'>
                                {user?.username}
                            </Text>
                        </View>
                    </View>

                ),
                headerRight:()=>(
                    <View className='flex-row items-center gap-6' style={{paddingRight: wp(4)}}>
                        
                            <Ionicons name='call' size={hp(2.8)} color='#737373'/>
                        
                            <Ionicons name='videocam' size={hp(2.8)} color='#737373'/>
                    </View>
                )
            }}
        />
    )
    }            
