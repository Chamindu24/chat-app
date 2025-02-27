import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Entypo } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // To handle safe area insets


export default function ProfileHeader() {
    const router = useRouter();

    // Check if the platform is iOS
    const ios = Platform.OS === 'ios';
    const { top } = useSafeAreaInsets();
    
    return (
        <View
        style={{ paddingTop: ios ? top : top + 10 }} // Adjust padding for iOS and Android
            className="flex-row justify-between items-center px-8 bg-orange-500 pb-4 rounded-b-3xl shadow"
        >

            {/* Left section: Back button */}
            <View className="flex-row items-center gap-3">
                <TouchableOpacity onPress={() => router.back()}>
                    <Entypo name="chevron-left" size={hp(4)} color="white" />
                </TouchableOpacity>
            </View>

            {/* Centered section: Title */}
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: hp(2.7) }} className="font-medium tracking-widest text-white">
                    Profile Details
                </Text>
            </View>

            {/* Empty view for right section */}
            <View style={{ width: hp(4) }} /> {/* This ensures space for the back button */}
        </View>
    );
}
