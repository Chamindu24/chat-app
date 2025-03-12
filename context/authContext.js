import { use } from 'react';
import {useState,useContext, createContext,useEffect} from 'react';
import { onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut } from 'firebase/auth';
import { auth, db, database } from '../firebaseConfig';  // Import db from firebaseConfig
import {doc, setDoc,getDoc} from 'firebase/firestore';
import { onDisconnect, ref, set } from "firebase/database";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);
   
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            console.log('got user', user);
            if(user){
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid);
            }else{
                setIsAuthenticated(false);
                setUser(null);
            }
        });
        return unsub;    
        
    }, []);

    const updateUserData = async (userId) => {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let data = docSnap.data();
                    setUser({...user,username: data.username,profileUrl: data.profileUrl,userId: data.userId});
                
                // Set online status
                //const database = getDatabase();
                const statusRef = ref(database, `status/${userId}`);
                set(statusRef, {
                    status: 'online',
                    lastSeen: Date.now(),
                });

                // Handle disconnection
                onDisconnect(statusRef).set({
                    status: 'offline',
                    lastSeen: Date.now(),
                });
            }
        }

    const login = async (email, password) => {
        try{
            const response = await signInWithEmailAndPassword(auth, email, password);
            return {success: true};


        }catch(e){
            let msg=e.message;
            if(msg.includes('(auth/invalid-email)')){
                msg='Invalid email';
            }
            if(msg.includes('(auth/invalid-credential)')){
                msg='Wrong Credentials';
            }
            return {success: false, msg};
        }
    }

    const logout = async () => {
        try {
            //const database = getDatabase();
            const statusRef = ref(database, `status/${user?.userId}`);
    
            // Update status to offline
            await set(statusRef, {
                status: 'offline',
                lastSeen: Date.now(),
            });
    
            await signOut(auth);
            return { success: true };

        }catch(e){
            return {success: false,msg: e.message,error: e};
        }
    }

    const register = async (email, password, username, profileUrl) => {
        try{
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log('response.user', response?.user);

            await setDoc(doc(db,"users",response?.user?.uid), {
                username,
                profileUrl,
                userId: response?.user?.uid,
            });
            return {success: true,data: response?.user};

        }catch(e){
            let msg=e.message;
            if(msg.includes('(auth/invalid-email)')){
                msg='Invalid email';
            }
            if(msg.includes('(auth/email-already-in-use)')){
                msg='This email is already in use';
            }
            return {success: false, msg};
        }
    }
    return (
        <AuthContext.Provider value={{user, isAuthenticated, login, logout, register}}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error('useAuth must be used within an AuthProvider.');
    }
    return value;
}    
