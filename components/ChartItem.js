import { View, Text, TouchableOpacity, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { blurhash, getRoomId, formatDate } from '../utils/common';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Feather } from '@expo/vector-icons'; // For icons

export default function ChartItem({ item, router, noBorder, currentUser }) {
    const [lastMessage, setLastMessage] = useState(undefined);
    const [unreadCount, setUnreadCount] = useState(0);
    const scaleValue = useRef(new Animated.Value(1)).current; // For scaling animation
    const opacityValue = useRef(new Animated.Value(0)).current; // For fade-in animation

    useEffect(() => {
        let roomId = getRoomId(currentUser?.userId, item?.userId);
        const docRef = doc(db, "rooms", roomId);
        const messagesRef = collection(docRef, "messages");
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        let unsub = onSnapshot(q, (snapShot) => {
            let allMessages = snapShot.docs.map(doc => {
                return doc.data();
            });
            setLastMessage(allMessages[0] ? allMessages[0] : null);

            // Count unread messages
            const unreadMessages = allMessages.filter(msg => !msg.seen && msg.userId !== currentUser?.userId);
            setUnreadCount(unreadMessages.length);
        });

        // Fade-in animation
        Animated.timing(opacityValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        return unsub;
    }, []);

    const openChatRoom = () => {
        router.push({ pathname: '/chatRoom', params: item });
    };

    const renderTime = () => {
        if (lastMessage) {
            let date = lastMessage?.createdAt;
            return formatDate(new Date(date?.seconds * 1000));
        }
    };

    const renderLastMessage = () => {
        //console.log("lastMessage:", lastMessage); // Log lastMessage to check its state
    
        if (lastMessage === undefined) {
            //console.log("Loading message..."); // Log to check if it's in loading state
            return <Text style={{ fontSize: hp(1.8), color: '#6B7280' }}>Loading...</Text>;
        }
        if (lastMessage === null) {
            //console.log("Fallback: No message or undefined data Say Hi! 👋"); // Log when fallback is hit
            return <Text style={{ fontSize: hp(1.8), color: '#6B7280' }}>Say Hi! 👋</Text>;
        }
    
        if (currentUser?.userId === lastMessage?.userId) {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Text style={{ fontSize: hp(1.8) }} className='text-neutral-500'>
                        You: {lastMessage?.text}
                    </Text>
                    <Text style={{ color: lastMessage.seen ? '#F97316' : '#6B7280', fontSize: hp(1.5), paddingRight: wp(4) }}>
                        ✓✓
                    </Text>
                </View>
            );
        } else {
            return (
                <Text
                    style={{
                        fontSize: lastMessage?.seen ? hp(1.8) : hp(2.1),
                        fontWeight: lastMessage?.seen ? 'normal' : 'bold',
                        color: lastMessage?.seen ? '#6B7280' : '#000',
                    }}
                >
                    {lastMessage?.text}
                </Text>
            );
        }
    };


    // Handle press-in animation
    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    // Handle press-out animation
    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const lastMessageText = renderLastMessage();

    return (
        <Animated.View style={{ transform: [{ scale: scaleValue }], opacity: opacityValue }}>
            <TouchableOpacity
                onPress={openChatRoom}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.8}
                style={{ paddingHorizontal: wp(4.2), paddingVertical: hp(1.5) }}
                className={`flex-row items-center justify-between gap-3 ${noBorder ? "" : "border-b border-neutral-200"}`}
            >
                {/* User Avatar */}
                <View className="relative">
                    <Image
                        style={{ height: hp(7.5), width: hp(7.5), borderRadius: 100 }}
                        source={{ uri: item?.profileUrl }}
                        placeholder={blurhash}
                        transition={500}
                    />
                    {unreadCount > 0 && (
                        <View className="absolute -top-1 -right-1 bg-orange-400 rounded-full px-2 py-0.5">
                            <Text style={{ fontSize: hp(1.5), fontWeight: 'bold', color: '#FFF' }}>
                                {unreadCount}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Name and Last Message */}
                <View className='flex-1 gap-1 ml-2'>
                    <View className='flex-row justify-between items-center'>
                        <Text style={{ fontSize: hp(2.5) }} className='font-semibold text-neutral-700'>
                            {item?.username}
                        </Text>
                        <Text style={{ fontSize: hp(1.6),paddingRight:wp(1.2) }} className='font-medium text-neutral-500'>
                            {renderTime()}
                        </Text>
                    </View>
                    <View style={{ width: '100%' }}>
                        {renderLastMessage()}
                    </View>
                </View>

                
            </TouchableOpacity>
        </Animated.View>
    );
}