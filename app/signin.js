// Import necessary components and libraries
import { View, Text, TextInput, Button, Image, TouchableOpacity, Pressable, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; // For responsive design
import { StatusBar } from 'expo-status-bar'; // To control the status bar
import { Octicons } from '@expo/vector-icons'; // For icons
import { useRouter } from 'expo-router'; // For navigation
import Loading from '../components/loading'; // Custom loading component
import CustomKeyboardView from '../components/CustomKeyboardView'; // Custom keyboard view component
import { useAuth } from '../context/authContext'; // Custom authentication context

// Define the SignIn component
export default function SignIn() {
    // Initialize the router for navigation
    const router = useRouter();

    // Create refs to store email and password input values
    const emailRef = useRef("");
    const passwordRef = useRef("");

    // State to manage loading state during login
    const [loading, setLoading] = useState(false);

    // Destructure the login function from the authentication context
    const { login } = useAuth();

    // Function to handle the login process
    const handleLogin = async () => {
        // Check if email or password is empty
        if (!emailRef.current || !passwordRef.current) {
            alert("Please fill all fields"); // Show an alert if fields are empty
            return;
        }

        // Set loading to true to show the loading spinner
        setLoading(true);

        // Call the login function from the auth context
        const response = await login(emailRef.current, passwordRef.current);

        // Set loading to false after the login attempt is complete
        setLoading(false);

        // Log the response from the login function
        console.log('sign in response', response);

        // If login is unsuccessful, show an alert
        if (!response.success) {
            Alert.alert('SignIn', "Please fill all fields");
        }
    };

    return (
        // Wrap the component in a custom keyboard view to handle keyboard behavior
        <CustomKeyboardView>
            {/* Set the status bar style to dark */}
            <StatusBar style="dark" />

            {/* Main container with padding and spacing */}
            <View style={{ paddingTop: hp(16), paddingHorizontal: wp(6) }} className="flex-1 gap-12">
                {/* SignIn Image */}
                <View className="items-center">
                    <Image
                        style={{ height: hp(25) }} // Set image height responsively
                        resizeMode='contain' // Ensure the image fits within the container
                        source={require('../assets/images/login.png')} // Load the image from assets
                    />
                </View>

                {/* Form container */}
                <View className="gap-10">
                    {/* SignIn Title */}
                    <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">
                        Sign In
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

                        {/* Password Input Field */}
                        <View className="gap-3">
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
                            {/* Forgot Password Link */}
                            <Text style={{ fontSize: hp(1.8) }} className="text-right text-neutral-500 font-semibold">
                                Forgot Password?
                            </Text>
                        </View>

                        {/* Submit Button */}
                        <View>
                            {loading ? ( // Show loading spinner if loading is true
                                <View className="flex-row justify-center">
                                    <Loading size={hp(6.5)} />
                                </View>
                            ) : ( // Otherwise, show the Sign In button
                                <TouchableOpacity
                                    onPress={handleLogin} // Trigger handleLogin on press
                                    style={{ fontSize: hp(6.5) }}
                                    className="bg-indigo-500 py-3 rounded-xl justify-center items-center"
                                >
                                    <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider">
                                        Sign In
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* SignUp Link */}
                        <View className="flex-row justify-center">
                            <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">
                                Don't have an account?{' '}
                            </Text>
                            {/* Navigate to SignUp screen on press */}
                            <Pressable onPress={() => router.push('signUp')}>
                                <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-indigo-500">
                                    Sign Up
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </CustomKeyboardView>
    );
}