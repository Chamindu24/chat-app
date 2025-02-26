import {View, Text,TextInput, TouchableOpacity,Keyboard , Alert} from 'react-native';
import React,{useEffect, useState,useRef} from 'react';
import { useLocalSearchParams,useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ChatRoomHeader from '../../components/ChatRoomHeader';
import MessageList from '../../components/MessageList';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/authContext';
import { getRoomId } from '../../utils/common'; 
import { db } from '../../firebaseConfig';
import { Timestamp,collection,addDoc,doc,setDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function ChatRoom() {
    const item = useLocalSearchParams(); //second user
    const {user} = useAuth(); //logged in user
    console.log("got item data",item);
    const router = useRouter();
    const [messages,setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);

    useEffect(() =>{
        createRoomIfNotExists();

        let roomId = getRoomId(user?.userId,item?.userId);
        const docRef = doc(db,"rooms",roomId);
        const messagesRef = collection(docRef,"messages");
        const q = query(messagesRef,orderBy('createdAt','asc'));

        let unsub = onSnapshot(q, (snapShot)=>{
            let allMessages = snapShot.docs.map(doc=>{
                return  doc.data();
            });
            setMessages([...allMessages]);
        });

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow', updatescrollView
        )

        return ()=>{
            unsub();
            keyboardDidShowListener.remove();
        }

    },[]);

    const createRoomIfNotExists = async ()=>{
        //roomId
        const roomId = getRoomId(user?.userId,item?.userId);
        await setDoc(doc(db, "rooms", roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date())
        });
    }
    const handleSendMessage = async ()=>{
        let message = textRef.current.trim();
        if(!message) return;
        try{
            let roomId = getRoomId(user?.userId,item?.userId);
            const docRef = doc(db, "rooms", roomId);
            const messagesRef = collection(docRef, "messages");
            textRef.current = "";
            if(inputRef) inputRef?.current?.clear();

            const newDoc = await addDoc(messagesRef, {
                userId: user?.userId,
                text:message,
                profileUrl: user?.profileUrl,
                senderName: user?.username,
                createdAt: Timestamp.fromDate(new Date())
            });
        }
        catch(e){
        Alert.alert('Message',e.message);
        }
    }

    useEffect(() => {
        updatescrollView();
    }, [messages]);

    const updatescrollView = () => {
        setTimeout(()=>{
            scrollViewRef?.current?.scrollToEnd({animated: true});
        },100);
    }

    return (
        <CustomKeyboardView inChat={true}>
            <View className='flex-1 bg-white'>
                <StatusBar style="dark" />
                <ChatRoomHeader user={item} router={router}  />

                <View className='h-full border-b border-neutral-300'>
                    <View className='flex-1 justify-between bg-neutral-100 overflow-visible'>
                        <View className='flex-1'>
                            <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={user}/>
                        </View>


                        <View style={{marginBottom: hp(1) , height: hp(7)}} className='pt-1'>
                            <View className='flex-row mx-3  justify-between bg-white border p-1 border-neutral-300 rounded-full pl-5'>
                                <TextInput
                                    ref={inputRef}
                                    onChangeText={value=>textRef.current = value}
                                    style={{fontSize: hp(2.2)}}
                                    className='flex-1 mr-2'
                                    placeholder='Type message...'
                                />
                                <TouchableOpacity onPress={handleSendMessage} className='bg-neutral-200 p-3 mr-[4px] rounded-full' >
                                    <Feather name='send' size={hp(3)} color="#737373" />
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                </View>
            </View>
        </CustomKeyboardView>
    )
}