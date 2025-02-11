import {View, Text} from 'react-native';
import React,{useEffect} from 'react';
import { Slot,useRouter,useSegments } from "expo-router";
import '../global.css';

import { useAuth,AuthContextProvider } from '../context/authContext';
import StartPage from './index'; // Import StartPage from index.js

const MainLayout = () => {
    const {isAuthenticated} = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (typeof isAuthenticated === 'undefined') return; // If authentication status is still being determined

        const inApp = segments[0] === '(app)';
        if (isAuthenticated && !inApp) {
            router.replace('home'); // Default to home if authenticated
        } else if (!isAuthenticated) {
            router.replace('signin'); // If not authenticated, redirect to signin
        }
    }, [isAuthenticated, segments, router]); // Add router as a dependency to avoid stale closure issues

    if (isAuthenticated === undefined) {
        // Show the StartPage (loading state) while authentication state is being determined
        return <StartPage />;
    }

    return <Slot />;
};

export default function RootLayout() {
    return (
        <AuthContextProvider>
            <MainLayout />
        </AuthContextProvider>       
    );
}