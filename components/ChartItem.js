import {View, Text, TouchableOpacity,Animated} from 'react-native';
import React, { useState,useEffect, useRef } from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { blurhash,getRoomId,formatDate } from '../utils/common';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function ChartItem({item, router , noBorder,currentUser}) {
    const [lastMessage,setLastMessage] = useState(undefined);
    const scaleValue = useRef(new Animated.Value(1)).current; // For scaling animation

    useEffect(() =>{
            
    
            let roomId = getRoomId(currentUser?.userId,item?.userId);
            const docRef = doc(db,"rooms",roomId);
            const messagesRef = collection(docRef,"messages");
            const q = query(messagesRef,orderBy('createdAt','desc'));
    
            let unsub = onSnapshot(q, (snapShot)=>{
                let allMessages = snapShot.docs.map(doc=>{
                    return  doc.data();
                });
                setLastMessage(allMessages[0]? allMessages[0]:null);

                
            });
    
            return unsub;
    
        },[]);

    const openChatRoom = () => {
        router.push({pathname: '/chatRoom', params: item});
    }

    const renderTime = () => {      
        if (lastMessage){
            let date = lastMessage?.createdAt;
            return formatDate(new Date(date?.seconds*1000));
        }
    }

    const renderLastMassege = () => {
        if(typeof lastMessage === 'undefined') return 'Loading...';
        if(lastMessage ) {
            if(currentUser?.userId === lastMessage?.userId) {
                return `You: ${lastMessage?.text}`;
            }else{
                return lastMessage?.text;
            }
        }else{
            return 'Say Hi! 👋';
        }
    }

    // Handle press-in animation
    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95, // Scale down to 95%
            useNativeDriver: true, // Enable native driver for better performance
        }).start();
    };

    // Handle press-out animation
    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1, // Scale back to 100%
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <TouchableOpacity onPress={openChatRoom} style={{  paddingHorizontal: wp(4) }} className={`flex-row items-center justify-between gap-3 mb-4 pb-4 ${noBorder ?"": "border-b border-neutral-200"  }`}>
                {/*<Image 
                    soure={{uri: item?.profileUrl}} 
                    style={{height:hp(6), width: hp(6)}} 
                    className='rounded-full'    
                />*/}
                <Image
                    style={{height:hp(7), width: hp(7), borderRadius: 100}}
                    source={{ uri: item?.profileUrl }}
                    placeholder={blurhash}
                    transition={500}
                />


                {/*name and last message */}
                <View className='flex-1 gap-1'>
                    <View className='flex-row justify-between'>
                        <Text style={{fontSize:hp(2.3)}} className='font-semibold text-neutral-600'>{item?.username}</Text>
                        <Text style={{fontSize:hp(1.8)}} className='font-medium text-neutral-500'>
                            {renderTime()}
                        </Text>
                    </View>
                    <Text style={{fontSize:hp(1.8)}} className='text-neutral-500'>
                        {renderLastMassege()}
                    </Text>
                </View>
            </TouchableOpacity>
            </Animated.View>
    )
}