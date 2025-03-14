import { View, Text } from 'react-native'; // Importing components to build the UI
import React, { useEffect } from 'react'; // Importing React and useEffect hook for side effects
import { Slot, useRouter, useSegments } from 'expo-router'; // Importing routing utilities from expo-router
import '../global.css'; // Importing global CSS for styling
import { MenuProvider } from 'react-native-popup-menu'; // Importing MenuProvider for handling pop-up menus


import { useAuth, AuthContextProvider } from '../context/authContext'; // Importing authentication context and provider
import StartPage from './index'; // Importing the StartPage component


const MainLayout = () => {
    const { isAuthenticated } = useAuth(); // Get authentication status from the context
    const segments = useSegments(); // Get the current route segments
    const router = useRouter(); // Initialize the router for navigation

    // Handle authentication and routing logic
    useEffect(() => {
        if (typeof isAuthenticated === 'undefined') return; // If authentication status is still loading, exit early
    
        const inApp = segments[0] === '(app)'; // Check if the user is in the app section
        
        if (isAuthenticated && !inApp) {
            router.replace('home'); // If authenticated and not in the app, redirect to home
        } else if (!isAuthenticated && segments[0] !== 'signUp') {
            router.replace('signin'); // If not authenticated and not on the sign-up page, redirect to sign-in
        }
    }, [isAuthenticated, segments, router]);
    if (isAuthenticated === undefined) {
        return <StartPage />; // Show loading state while authentication status is being determined
    }

    return <Slot />; // Render the appropriate page based on the current route
};

export default function RootLayout() {
    return (
        <MenuProvider> {/* Wrap the entire app with MenuProvider to handle pop-up menus */}
            <AuthContextProvider> {/* Provide authentication context to the app */}
                <MainLayout /> {/* Render the main layout with routing and authentication logic */}
            </AuthContextProvider>
        </MenuProvider>
    );
}

// Let me know if anything is unclear or if you’d like me to dig deeper into any part of the code! 🚀
