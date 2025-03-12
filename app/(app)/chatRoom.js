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
import Typing from '../../components/typing';
import { getDatabase, ref, set, onValue } from 'firebase/database';

export default function ChatRoom() {
    const item = useLocalSearchParams(); //second user
    const {user} = useAuth(); //logged in user
    //console.log("got item data",item);
    const router = useRouter();
    const [messages,setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false); 
    const [otherUserTyping, setOtherUserTyping] = useState(false); // Track only other user's typing
    const [typingTimeout, setTypingTimeout] = useState(null); // Timeout for typing status
    const database = getDatabase();
    const roomId = getRoomId(user?.userId,item?.userId);

    useEffect(() =>{
        createRoomIfNotExists();

        console.log('Listening to room:', roomId);

        //let roomId = getRoomId(user?.userId,item?.userId);
        const docRef = doc(db,"rooms",roomId);
        const messagesRef = collection(docRef,"messages");
        const q = query(messagesRef,orderBy('createdAt','asc'));

        let unsub = onSnapshot(q, (snapShot)=>{
            /*let allMessages = snapShot.docs.map(doc=>{
                return  doc.data();
            });
            setMessages([...allMessages]);*/

            let allMessages = snapShot.docs.map(doc => {
                const msgData = doc.data();
                //console.log('Message data from Firestore:', msgData);
                return { ...msgData, id: doc.id }; // Ensure id is included too
            });
            setMessages(allMessages);

            // Mark messages as seen
            allMessages.forEach(async (msg) => {
                if (msg.userId !== user?.userId && !msg.seen) {
                    const messageRef = doc(messagesRef, msg.id);
                    console.log('Marking message as seen:', msg.id);
                    await setDoc(messageRef, { seen: true }, { merge: true });
                    console.log('Message marked as seen:', msg.id);

                }
            });
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
                createdAt: Timestamp.fromDate(new Date()),
                seen: false
            });
            //console.log('Message sent:', message, 'Seen status:', false);
        }
        catch(e){
        Alert.alert('Message',e.message);
        }
    }

    const updatescrollView = () => {
        setTimeout(()=>{
            scrollViewRef?.current?.scrollToEnd({animated: true});
        },100);
    }

    const updateTypingStatus = (typing) => {
        const typingStatusRef = ref(database, `typingStatus/${roomId}/${user.userId}`);
        console.log(`Updating ${user.username}'s typing status to: ${typing}`);
        set(typingStatusRef, typing);
    };

    useEffect(() => {
        updatescrollView();
    }, [messages]);

    

    const handleTyping = (text) => {
        textRef.current = text;

        // Only update my typing status in database, don't show it locally
        updateTypingStatus(true);

        if (!isTyping) {
            updateTypingStatus(true);
            setIsTyping(true);
        }

        if (typingTimeout) clearTimeout(typingTimeout);

        const timeout = setTimeout(() => {
            updateTypingStatus(false);
            setIsTyping(false);
        }, 1500);

        setTypingTimeout(timeout);
    };

    

    // Listen for typing status changes
    useEffect(() => {
        if (!roomId || !item?.userId) return;
        const typingStatusRef = ref(database, `typingStatus/${roomId}/${item.userId}`);
        const unsubscribe = onValue(typingStatusRef, (snapshot) => {
            const status = snapshot.val();
            console.log(`${item.username}'s typing status:`, status);
            setOtherUserTyping(status || false);
        });

        return () => unsubscribe();
    }, [roomId, item?.userId, database]);

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

                        {/* Typing Indicator */}
                        {otherUserTyping && (
                            <View className='mx-4 flex-row items-end justify-start ' style={{marginTop: hp(0.4)}}> 
                                <View style={{ flexDirection: 'row' }} className='self-start p-1 px-3 rounded-2xl bg-orange-100 border border-red-400'>
                                    <Text style={{ fontSize: hp(1.7) }} className='text-neutral-500 font-semibold'>
                                        {item.username} is typing
                                    </Text>
                                    <Typing size={hp(3)}  />
                                </View>
                            </View>
                        )}
                        <View style={{marginBottom: hp(1) , height: hp(7)}} className='pt-1'>
                            <View className='flex-row mx-3  justify-between bg-white border p-1 border-neutral-300 rounded-full pl-5'>
                                <TextInput
                                    ref={inputRef}
                                    onChangeText={handleTyping} // <-- Call handleTyping
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