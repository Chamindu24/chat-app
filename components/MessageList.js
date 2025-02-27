import {View, Text, FlatList, ScrollView} from 'react-native';
import React from 'react';
import MessageItem from './MessageItem';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function MessageList({messages,scrollViewRef, currentUser}) {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    };

    let lastDate = null;

    return (
        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop:10}}>
            {
                messages.map((message,index)=>{
                    const messageDate = formatDate(message.createdAt);
                    const showDateHeader = messageDate !== lastDate;
                    lastDate = messageDate;

                    return (
                        <React.Fragment key={index}>
                            {showDateHeader && (
                                <View style={{ alignItems: 'center', marginVertical: 4 }}>
                                    <Text style={{ fontSize: hp(1.3), color: 'text-gray-400', backgroundColor: 'bg-gray-200', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 10 }}>
                                        {messageDate}
                                    </Text>
                                </View>
                            )}
                            <MessageItem message={message} currentUser={currentUser} />
                        </React.Fragment>
                    );
                })}
            </ScrollView>
        );
    }