import { View, Text, Image, Animated, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/authContext'; // Custom authentication context
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons'; // For icons

export default function Profile() {
    const { user, logout } = useAuth(); // Get user data and logout function from context

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    // Animation effect on component mount (only for the profile image)
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
        
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 2,
            useNativeDriver: true,
        }).start();
    }, []);

    // Edit Profile function
    const editProfile = () => {
        console.log('Edit Profile clicked');
        // Handle the Edit Profile functionality here
    };

    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
                <Text style={{ fontSize: hp(2), color: '#ff7f50' }}>Loading...</Text>
            </View>
        );
    }

    return (
        
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
            {/* Profile Image with Animation */}
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 10,
                }}
            >
                <Image
                    style={{
                        height: hp(25),
                        aspectRatio: 1,
                        borderRadius: 100,
                        borderWidth: 3,
                        borderColor: '#ff7f50',
                    }}
                    source={user?.profileUrl ? { uri: user.profileUrl } : require('../../assets/images/avatar.png')}
                />
            </Animated.View>

            {/* Username */}
            <Text
                style={{
                    fontSize: hp(3),
                    marginTop: hp(2),
                    fontWeight: 'bold',
                    color: '#333',
                }}
            >
                {user?.username}
            </Text>

            {/* Email with Icon */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: hp(1),
                }}
            >
                <Ionicons name="mail-outline" size={hp(2.5)} color="#777" />
                <Text style={{ fontSize: hp(2.5), marginLeft: wp(2), color: '#777' }}>
                    {user?.email || 'Email not available'}
                </Text>
            </View>

            {/* Edit Profile Button */}
            <TouchableOpacity
                onPress={editProfile}
                style={{
                    marginTop: hp(2),
                    backgroundColor: '#ff7f50',
                    paddingHorizontal: wp(5),
                    paddingVertical: hp(1.2),
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    elevation: 5,
                }}
            >
                <Ionicons name="create-outline" size={hp(2.5)} color="white" />
                <Text style={{ fontSize: hp(2.2), marginLeft: wp(2), color: 'white', fontWeight: 'semibold' }}>
                    Edit Profile
                </Text>
            </TouchableOpacity>
            {/* Logout Button */}
            <TouchableOpacity
                onPress={logout}
                style={{
                    marginTop: hp(1),
                    backgroundColor: '#ff7f50',
                    paddingHorizontal: wp(7.2),
                    paddingVertical: hp(1.2),
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    elevation: 5,
                }}
            >
                <Ionicons name="log-out-outline" size={hp(2.5)} color="white"  />
                <Text style={{ fontSize: hp(2.2), marginLeft: wp(2), color: 'white', fontWeight: 'semibold' }}>
                    Sign Out
                </Text>
            </TouchableOpacity>

            
        </View>
    );
}
