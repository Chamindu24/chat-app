// Import necessary components and libraries
import { View, Text, StyleSheet, Platform } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; // For responsive design
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // To handle safe area insets
import { Image } from 'react-native'; // For displaying images
import { blurhash } from '../utils/common'; // A placeholder blurhash for images
import { useAuth } from '../context/authContext'; // Custom authentication context
import { MenuItem } from './CustomMenuitems'; // Custom menu item component
import { useRouter } from 'expo-router'; // Add this import

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu'; // For the popup menu
import { AntDesign, Feather } from '@expo/vector-icons'; // For icons

// Check if the platform is iOS
const ios = Platform.OS === 'ios';

// Define the HomeHeader component
export default function HomeHeader() {
    // Destructure user and logout function from the authentication context
    const { user, logout } = useAuth();

    // Get the safe area insets (e.g., top padding for notch devices)
    const { top } = useSafeAreaInsets();
    const router = useRouter(); // Initialize router

    // Function to handle profile action (currently empty)
    const handleProfile = () => {
        // Add functionality for profile action here
        console.log("Profile button clicked! Navigating to profile page...");
        router.push('/profile'); // Navigate to the Profile screen

    };

    // Function to handle logout
    const handleLogout = async () => {
        await logout(); // Call the logout function from the auth context
    };

    return (
        // Main container with padding, background color, and rounded corners
        <View
            style={{ paddingTop: ios ? top : top + 10 }} // Adjust padding for iOS and Android
            className="flex-row justify-between px-8 bg-orange-500 pb-3 rounded-b-3xl shadow"
        >
            {/* Left section: Title */}
            <View>
                <Text style={{ fontSize: hp(3) }} className="font-medium text-white">
                    Chats
                </Text>
            </View>

            {/* Right section: Profile menu */}
            <View>
                {/* Popup menu for profile options */}
                <Menu>
                    {/* Menu trigger (profile image) */}
                    <MenuTrigger
                        customStyles={{
                            triggerWrapper: {
                                // Custom styles for the trigger wrapper
                            },
                        }}
                    >
                        {/* Profile image */}
                        <Image
                            style={{ 
                                height: hp(4.9), 
                                aspectRatio: 1, 
                                borderRadius: 100, 
                                borderWidth: 1, // Add border width
                                borderColor: 'white' // Add border color
                            }}
                            source={user?.profileUrl ? { uri: user.profileUrl } : null} // Use plain URL for now
                            placeholder={{ blurhash }}
                            transition={500}
                        />

                        </MenuTrigger>

                        {/* Menu options */}
                    <MenuOptions
                        customStyles={{
                            optionsContainer: {
                                borderRadius: 10, // Rounded corners for the menu
                                borderColor: 'continuous', // Border color
                                marginTop: 40, // Position the menu below the trigger
                                marginLeft: -30, // Adjust horizontal position
                                backgroundColor: 'white', // Background color
                                shadowColor: '#000', // Shadow color
                                shadowOpacity: 0.2, // Shadow opacity
                                shadowOffset: { width: 0, height: 0 }, // Shadow offset
                                width: 160, // Width of the menu
                            },
                        }}
                    >
                        {/* Profile menu item */}
                        <MenuItem
                            text="Profile" // Menu item text
                            action={handleProfile} // Function to call when clicked
                            value={null} // Optional value
                            icon={<Feather name="user" size={hp(2.5)} color="#737373" />} // Icon for the menu item
                        />

                        {/* Divider between menu items */}
                        <Divider />

                        {/* Logout menu item */}
                        <MenuItem
                            text="Sign Out" // Menu item text
                            action={handleLogout} // Function to call when clicked
                            value={null} // Optional value
                            icon={<AntDesign name="logout" size={hp(2.5)} color="#737373" />} // Icon for the menu item
                        />
                    </MenuOptions>
                </Menu>
            </View>
        </View>
    );
}

// Divider component to separate menu items
const Divider = () => {
    return (
        <View className="p-[1px] w-full bg-neutral-200"></View> // Thin horizontal line
    );
};