import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function ChatRoomHeader({ user, router }) {
    const [onlineStatus, setOnlineStatus] = useState('offline');
    const [lastSeen, setLastSeen] = useState(null);

    useEffect(() => {

        /*console.log("User ID for status check:", user?.userId); // Debugging log
        if (!user?.userId) {
            console.log("No userId provided for status tracking.");
            return;
        }*/

        const database = getDatabase();
        const userStatusRef = ref(database, `status/${user.userId}`);
        //console.log("User status ref path:", `status/${user.userId}`); // Debugging log

        // Listen for changes in user status
        const unsubscribe = onValue(userStatusRef, (snapshot) => {
            const data = snapshot.val();
            //console.log("User status snapshot:", data); // Log the raw snapshot data

            if (data) {
                setOnlineStatus(data.status);
                setLastSeen(data.lastSeen);
                //console.log("Online Status:", data.status);
                //console.log("Last Seen:", data.lastSeen);
            } else {
                console.log("No status data found for user:", user.userId);
            }
        });

        return () => unsubscribe();
    }, [user.userId]);

    const formatLastSeen = (timestamp) => {
        if (!timestamp) return 'Last seen recently';
    
        const now = new Date();
        const lastSeenDate = new Date(timestamp);
    
        // Check if it's today
        const isToday = now.toDateString() === lastSeenDate.toDateString();
        if (isToday) {
            const timeString = lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            //console.log("Formatted last seen: Today", timeString); // Log formatted time
            return `Last seen at ${timeString}`;
        }
    
        // Check if it's this month
        const isThisMonth = now.getMonth() === lastSeenDate.getMonth() && now.getFullYear() === lastSeenDate.getFullYear();
        if (isThisMonth) {
            const dayOfWeek = lastSeenDate.toLocaleString('en-US', { weekday: 'short' });
            const timeString = lastSeenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            //console.log("Formatted last seen: This month", `${lastSeenDate.getDate()} ${dayOfWeek} at ${timeString}`);
            return `Last seen on ${lastSeenDate.getDate()} ${dayOfWeek} at ${timeString}`;
        }
    
        // For a different year
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = lastSeenDate.toLocaleString('en-US', options);
        //console.log("Formatted last seen: Different year", formattedDate); // Log formatted full date
        return `Last seen on ${formattedDate}`;
    };
    
    
    

    return (
        <Stack.Screen
            options={{
                title: '',
                headerShadowVisible: false,
                headerStyle: { paddingTop: hp(2) },
                headerLeft: () => (
                    <View className='flex-row items-center gap-3'>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Entypo name='chevron-left' size={hp(4)} color='#737373' />
                        </TouchableOpacity>
                        <View className='flex-row items-center gap-2'>
                            <Image
                                style={{ height: hp(4.5), width: hp(4.5), borderRadius: 100 }}
                                source={user?.profileUrl}
                            />
                            <View>
                                <Text style={{ fontSize: hp(2.5) }} className='font-medium text-neutral-700'>
                                    {user?.username}
                                </Text>
                                <Text style={{ fontSize: hp(1.5) }} className='text-neutral-500'>
                                    {onlineStatus === 'online' ? 'Online' : formatLastSeen(lastSeen)}
                                </Text>
                            </View>
                        </View>
                    </View>
                ),
                headerRight: () => (
                    <View className='flex-row items-center gap-6' style={{ paddingRight: wp(4) }}>
                        <TouchableOpacity>
                            <Ionicons name='call' size={hp(2.8)} color='#737373' />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name='videocam' size={hp(2.8)} color='#737373' />
                        </TouchableOpacity>
                    </View>
                ),
            }}
        />
    );
}