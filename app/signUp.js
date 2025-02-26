// Import necessary components and libraries
import { View, Text, TextInput, Button, Image, Touchable, TouchableOpacity, Pressable, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; // For responsive design
import { StatusBar } from 'expo-status-bar'; // To control the status bar
import { Feather, Octicons } from '@expo/vector-icons'; // For icons
import { useRouter } from 'expo-router'; // For navigation
import Loading from '../components/loading'; // Custom loading component
import CustomKeyboardView from '../components/CustomKeyboardView'; // Custom keyboard view component
import { useAuth } from '../context/authContext'; // Custom authentication context

// Define the SignUp component
export default function SignUp() {
    // Initialize the router for navigation
    const router = useRouter();

    // Create refs to store input values for email, password, username, and profile URL
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const usernameRef = useRef("");
    const profileRef = useRef("");

    // State to manage loading state during registration
    const [loading, setLoading] = useState(false);

    // Destructure the register function from the authentication context
    const { register } = useAuth();

    // Function to handle the registration process
    const handleRegister = async () => {
        // Check if any field is empty
        if (!emailRef.current || !passwordRef.current || !usernameRef.current || !profileRef.current) {
            alert("Please fill all fields"); // Show an alert if any field is empty
            return;
        }

        // Set loading to true to show the loading spinner
        setLoading(true);

        // Call the register function from the auth context
        let response = await register(emailRef.current, passwordRef.current, usernameRef.current, profileRef.current);

        // Set loading to false after the registration attempt is complete
        setLoading(false);

        // Log the response from the register function
        console.log('got result', response);

        // If registration is unsuccessful, show an alert with the error message
        if (!response.success) {
            Alert.alert('SignUp', response.message);
        }
    };

    return (
        // Wrap the component in a custom keyboard view to handle keyboard behavior
        <CustomKeyboardView>
            {/* Set the status bar style to dark */}
            <StatusBar style="dark" />

            {/* Main container with padding and spacing */}
            <View style={{ paddingTop: hp(14), paddingHorizontal: wp(6) }} className="flex-1 gap-12">
                {/* SignUp Image */}
                <View className="items-center">
                    <Image
                        style={{ height: hp(22) }} // Set image height responsively
                        resizeMode='contain' // Ensure the image fits within the container
                        source={require('../assets/images/register.png')} // Load the image from assets
                    />
                </View>

                {/* Form container */}
                <View className="gap-10">
                    {/* SignUp Title */}
                    <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">
                        Sign Up
                    </Text>

                    {/* Input fields container */}
                    <View className="gap-4">
                        {/* Email Input Field */}
                        <View style={{ fontSize: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                            {/* Email icon */}
                            <Octicons name="mail" size={hp(2.7)} color="gray" />
                            {/* Email input */}
                            <TextInput
                                onChangeText={(value) => (emailRef.current = value)} // Update emailRef on text change
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder="Email Address"
                                placeholderTextColor={'gray'}
                            />
                        </View>

                        {/* Username Input Field */}
                        <View style={{ fontSize: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                            {/* Username icon */}
                            <Feather name="user" size={hp(2.7)} color="gray" />
                            {/* Username input */}
                            <TextInput
                                onChangeText={(value) => (usernameRef.current = value)} // Update usernameRef on text change
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder="Username"
                                placeholderTextColor={'gray'}
                            />
                        </View>

                        {/* Password Input Field */}
                        <View style={{ fontSize: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                            {/* Password icon */}
                            <Octicons name="lock" size={hp(2.7)} color="gray" />
                            {/* Password input */}
                            <TextInput
                                onChangeText={(value) => (passwordRef.current = value)} // Update passwordRef on text change
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder="Password"
                                secureTextEntry // Hide password text
                                placeholderTextColor={'gray'}
                            />
                        </View>

                        {/* Profile URL Input Field */}
                        <View style={{ fontSize: hp(7) }} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
                            {/* Profile icon */}
                            <Feather name="image" size={hp(2.7)} color="gray" />
                            {/* Profile URL input */}
                            <TextInput
                                onChangeText={(value) => (profileRef.current = value)} // Update profileRef on text change
                                style={{ fontSize: hp(2) }}
                                className="flex-1 font-semibold text-neutral-700"
                                placeholder="Profile URL"
                                placeholderTextColor={'gray'}
                            />
                        </View>

                        {/* Submit Button */}
                        <View>
                            {loading ? ( // Show loading spinner if loading is true
                                <View className="flex-row justify-center">
                                    <Loading size={hp(6.5)} />
                                </View>
                            ) : ( // Otherwise, show the Sign Up button
                                <TouchableOpacity
                                    onPress={handleRegister} // Trigger handleRegister on press
                                    style={{ fontSize: hp(6.5) }}
                                    className="bg-indigo-500 py-3 rounded-xl justify-center items-center"
                                >
                                    <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider">
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* SignIn Link */}
                        <View className="flex-row justify-center">
                            <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">
                                Already have an account{' '}
                            </Text>
                            {/* Navigate to SignIn screen on press */}
                            <Pressable onPress={() => router.push('signin')}>
                                <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-indigo-500">
                                    Sign In
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </CustomKeyboardView>
    );
}