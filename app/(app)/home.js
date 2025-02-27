// Import necessary components and libraries
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext'; // Custom authentication context
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'; // For responsive design
import { StatusBar } from 'expo-status-bar'; // To control the status bar
import { getDocs, query, where } from 'firebase/firestore'; // Firebase Firestore functions
import { usersRef } from '../../firebaseConfig'; // Firestore collection reference
import ChatList from '../../components/ChatList'; // Custom component to display the list of chats
import Loading from '../../components/loading'; // Custom loading component (commented out)


export default function Home() {
    // Destructure logout function and user object from the authentication context
    const { logout, user } = useAuth();

    // State to store the list of users
    const [users, setUsers] = useState([]);

    // useEffect hook to fetch users when the component mounts or when the user's UID changes
    useEffect(() => {
        if (user?.uid) {
            getUsers(); // Fetch users if the user is authenticated
        }
    }, [user?.uid]); // Dependency array ensures this runs only when user?.uid changes

    // Function to fetch users from Firestore
    const getUsers = async () => {
        // Create a Firestore query to fetch all users except the current user
        const q = query(usersRef, where('userId', '!=', user?.uid));

        // Execute the query and get the snapshot
        const querySnapshot = await getDocs(q);

        // Initialize an empty array to store user data
        let data = [];

        // Loop through the query snapshot and push each user's data into the array
        querySnapshot.forEach((doc) => {
            data.push({ ...doc.data() });
        });

        // Sort users by the latest message timestamp
        const sortedData = data.sort((a, b) => {
            const aLastMessageDate = a.lastMessage?.createdAt?.seconds || 0;
            const bLastMessageDate = b.lastMessage?.createdAt?.seconds || 0;
            return bLastMessageDate - aLastMessageDate;
        });

        setUsers(sortedData);
    };

    return (
        // Main container with a white background
        <View className="flex-1 bg-white">
            {/* Set the status bar style to light */}
            <StatusBar style="light" />

            {/* Conditional rendering based on the number of users */}
            {users.length > 0 ? (
                // If users are available, render the ChatList component
                <ChatList currentUser={user} users={users} />
            ) : (
                // If no users are available, show a loading indicator
                <View className="flex items-center" style={{ top: hp(40) }}>
                    <ActivityIndicator size="large" />
                    {/* Alternatively, you can use a custom loading component (commented out) */}
                    {/* <Loading size={hp(10)} /> */}
                </View>
            )}
        </View>
    );
}