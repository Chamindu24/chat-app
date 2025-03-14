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
import { db, storage } from '../../firebaseConfig';
import { Timestamp,collection,addDoc,doc,setDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import Typing from '../../components/typing';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

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
    const [imageUri, setImageUri] = useState(null); // Image URI to be uploaded

    useEffect(() =>{
        createRoomIfNotExists();

        //console.log('Listening to room:', roomId);

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
                    //console.log('Marking message as seen:', msg.id);
                    await setDoc(messageRef, { seen: true }, { merge: true });
                    //console.log('Message marked as seen:', msg.id);

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
        //if(!message) return;
        if (!message && !imageUri) return; // Don't send empty message unless image is attached

        try{

           
            let roomId = getRoomId(user?.userId,item?.userId);
            const docRef = doc(db, "rooms", roomId);
            const messagesRef = collection(docRef, "messages");

            // Log before clearing the input
            console.log('Message before clearing:', message);

            textRef.current = "";
            if(inputRef) inputRef?.current?.clear();
            setImageUri(null); // Reset imageUri immediately

            
            let newMessage = {
                userId: user?.userId,
                //text: message,
                text: message || "", // Send empty text if just an image
                profileUrl: user?.profileUrl,
                senderName: user?.username,
                createdAt: Timestamp.fromDate(new Date()),
                seen: false
            };


            // Log the message being sent
            console.log('Sending message:', newMessage);

            // If there's an image, upload it first and then send the URL
            if (imageUri) {
                console.log('Image URI before upload:', imageUri);
                
                const formData = new FormData();
                formData.append('file', {
                uri: imageUri,
                name: `image_${Date.now()}.jpg`,
                type: 'image/jpeg',
                });
                formData.append('upload_preset', 'gvyg8vmt');

                const response = await fetch(`https://api.cloudinary.com/v1_1/dtjmprr4g/image/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                });

                const data = await response.json();
                console.log('Cloudinary upload response:', data);

                if (data.secure_url) {
                newMessage = { ...newMessage, imageUrl: data.secure_url };
                //setImageUri(null);
                } else {
                throw new Error('Failed to upload image to Cloudinary');
                }
            }

            /*const newDoc = await addDoc(messagesRef, {
                userId: user?.userId,
                text:message,
                profileUrl: user?.profileUrl,
                senderName: user?.username,
                createdAt: Timestamp.fromDate(new Date()),
                seen: false
            });*/


             // Log before sending the final message
            console.log('Final message to be sent:', newMessage);
            
            //console.log('Message sent:', message, 'Seen status:', false);
            await addDoc(messagesRef, newMessage);
            console.log('Message sent successfully');
        }
        catch(e){
            console.error('Error sending message:', e.message);
            Alert.alert('Message',e.message);
        }
    }


    const pickImage = async () => {
        console.log('Opening image picker...');

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        // Log the result to check what is returned by the image picker
        console.log('Image picker result:', result);

        if (!result.canceled && result.assets.length > 0) {
            console.log('Image selected:', result.assets[0].uri); // Log the URI of the selected image
            setImageUri(result.assets[0].uri);
        } else {
            console.log('Image picker was canceled.');
        }
    };


    
    

    const updatescrollView = () => {
        setTimeout(()=>{
            scrollViewRef?.current?.scrollToEnd({animated: true});
        },100);
    }

    const updateTypingStatus = (typing) => {
        const typingStatusRef = ref(database, `typingStatus/${roomId}/${user.userId}`);
        //console.log(`Updating ${user.username}'s typing status to: ${typing}`);
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
            //console.log(`${item.username}'s typing status:`, status);
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


                        {imageUri && (
                            <View style={{ marginHorizontal: wp(22), position: 'relative', }} className='items-center justify-center '>
                                <Text style={{ fontSize: hp(2), color: '#666', margin: hp(0.4) }} className='tracking-wider font-semibold'>Image Preview</Text>
                                <View style={{ position: 'relative' }}>
                                    <Image
                                        source={{ uri: imageUri }}
                                        style={{
                                            width: wp(60),
                                            height: hp(30),
                                            borderRadius: 10,
                                            borderWidth: 2,
                                            borderColor: '#e5e7eb',
                                        }}
                                    />
                                    {/* Cancel Button (X) */}
                                    <TouchableOpacity
                                        onPress={() => setImageUri(null)}
                                        style={{
                                            position: 'absolute',
                                            top: -hp(1),
                                            right: -hp(1),
                                            backgroundColor: 'rgba(255, 59, 48, 0.9)', // Red with slight transparency
                                            width: hp(4),
                                            height: hp(4),
                                            borderRadius: hp(2),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.3,
                                            shadowRadius: 3,
                                            elevation: 5,
                                        }}
                                    >
                                        <Text style={{ color: '#fff', fontSize: hp(2.5), fontWeight: 'bold' }}>×</Text>
                                    </TouchableOpacity>
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
                                <TouchableOpacity onPress={pickImage} className='bg-neutral-50 p-3 mr-[4px] rounded-full' >
                                    <Feather name='image' size={hp(3)} color="#737373" />
                                </TouchableOpacity>
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