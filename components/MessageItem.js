import { View,Text } from "react-native";
import React from "react";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default function MessageItem({message,currentUser}) {
    if (currentUser?.userId==message?.userId){
        //my messages
     return(
         <View className="flex-row justify-end mb-2  mr-4">
            <View style={{width:wp(80)}}>
                <View className="flex self-end p-2 px-5 rounded-2xl bg-white border border-neutral-200">
                     <Text style={{fontSize:hp(2)}}>
                        {message?.text}
                     </Text>
                </View>
            </View>
         </View>
        
     )
    }else{
        // Messages from others
        return (
        <View style={{width:wp(80)}} className=" mb-2  ml-4">
                <View className="flex self-start p-2 px-5 rounded-2xl bg-indigo-100 border border-indigo-200">
                     <Text style={{fontSize:hp(2)}}>
                        {message?.text}
                     </Text>
                </View>
        </View>
        );
    }
}