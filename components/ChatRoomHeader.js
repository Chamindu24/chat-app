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
        const database = getDatabase();
        const userStatusRef = ref(database, `status/${user.userId}`);

        // Listen for changes in user status
        const unsubscribe = onValue(userStatusRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setOnlineStatus(data.status);
                setLastSeen(data.lastSeen);
            }
        });

        return () => unsubscribe();
    }, [user.userId]);

    const formatLastSeen = (timestamp) => {
        if (!timestamp) return 'Last seen recently';
        const date = new Date(timestamp);
        return `Last seen ${date.toLocaleTimeString()}`;
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