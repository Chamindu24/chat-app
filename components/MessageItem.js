import { View,Text } from "react-native";
import React from "react";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default function MessageItem({message,currentUser}) {
    const formattedTime = message?.createdAt ? new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    if (currentUser?.userId==message?.userId){
        //my messages
        //console.log('Rendering sent message:', message.text, 'Seen:', message.seen);
     return(
         <View className="flex-row justify-end mb-2  mr-4">
            <View style={{width:wp(80)}}>
                <View className="flex flex-row self-end p-2 pr-2 pl-6 rounded-2xl bg-white border border-neutral-300">
                     <Text style={{fontSize:hp(2.1),marginRight: wp(1.5)}}>
                        {message?.text}
                     </Text>
                     <View className="flex flex-row items-end ">
                        
                        <Text style={{ fontSize: hp(1.2), color: '#666',marginRight: wp(0.8) }}>
                            {formattedTime}
                        </Text>
                        <Text 
                            style={{ 
                                fontSize: hp(1.2), 
                                color: message.seen ? '#F97316' : '#6B7280' 
                            }}
                        >
                            ✓✓
                        </Text>
                        
                    </View>
                </View>
                
            </View>
         </View>
        
     )
    }else{
        // Messages from others
        return (
        <View style={{width:wp(80)}} className=" mb-2 ml-4">
            <View className="flex flex-row self-start p-2 px-5 rounded-2xl bg-orange-200 border border-red-300">
                 <Text style={{fontSize:hp(2.1), marginRight: wp(1.1)}}>
                {message?.text}
                 </Text>
                 <Text style={{ fontSize: hp(1.2), color: '#666', alignSelf: 'flex-end' }}>
                    {formattedTime}
                </Text>
            </View>
        </View>
        );
    }
}