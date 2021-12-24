import React from 'react'
import { doc, onSnapshot, setDoc, getDoc, where, collection, addDoc, query, documentId, Timestamp } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { signOut } from "firebase/auth";
import ChatArea from './ChatArea';

export default function Chat({ user, setUser, db, auth}) {
    const [users, setUsers] = useState([])
    const [chatId, setChatId] = useState(null)
    const [chatField, setChatField] = useState('')

    useEffect(() => {
        const q = query(collection(db, "users"), where("email", "!=", user.email));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setUsers(querySnapshot.docs.map(doc => doc.data()))
        });

        return () => {
            unsubscribe()
        }
    }, [db])


    const handleLogout = () => {

        signOut(auth).then(() => {
            setUser(null)
        }).catch((error) => {
            // An error happened.
        });
    }

    const sendMessage = () => {

        if (chatField != '') {
            addDoc(collection(db, 'chat', chatId, 'messages'), {
                createdAt: Timestamp.now(),
                message: chatField,
                from: user.uid
            })
            setChatField('')
        }
    }

    const openChat = async (user1) => {
        try {
            const docSnap = await getDoc(doc(db, "users", user.uid, 'connected', user1.uid));
            const docSnap1 = await getDoc(doc(db, "users", user1.uid, 'connected', user.uid));
            if (docSnap.exists() && docSnap1.exists()) {
                setChatId(docSnap.data().chatId);
            } else {
                addDoc(collection(db, "chat"), {
                    users: [user1.uid, user.uid],
                    messages: []
                }).then((document) => {
                    setDoc(doc(db, "users", user.uid, 'connected', user1.uid), {
                        chatId: document.id
                    })
                    setDoc(doc(db, "users", user1.uid, 'connected', user.uid), {
                        chatId: document.id
                    })
                })
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    return (
        <div>
            <div>
                <div className="grid grid-rows-6 grid-flow-col h-screen">
                    <div className="col-span-12 row-span-1 bg-purple-500 rounded-xl m-2 shadow-xl p-4 flex items-center justify-between px-8">
                        <div className="flex justify-center text-white">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                                </svg>
                            </span>
                            <span className="font-semibold text-4xl tracking-tight">Chatto</span>
                        </div>
                        <div>
                            <button className="inline-block px-4 py-2 leading-none border rounded text-2xl text-white border-white hover:border-transparent hover:text-purple-700 hover:bg-white mt-4 lg:mt-0" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                    <div className="row-span-5 col-span-3 ... bg-purple-500 rounded-xl m-2 shadow-xl p-4 py-8 overflow-y-scroll">

                        {
                            users.map((value, key) => {
                                return (
                                    <div className="row bg-purple-200 rounded-lg px-2 py-2 mx-1 my-2 hover:bg-purple-700 hover:text-white" key={key} onClick={() => openChat(value)}>
                                        <div className="grid grid-cols-4">
                                            <div className="col-span-1">
                                                <img src={value.photoURL || "https://thumbs.dreamstime.com/b/faceless-businessman-avatar-man-suit-blue-tie-human-profile-userpic-face-features-web-picture-gentlemen-85824471.jpg"} alt="profile" className='rounded-full h-12 w-12' />
                                            </div>
                                            <div className="col-span-3 flex justify-start items-center">
                                                {value.name}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="row-span-4 col-span-9 ... bg-purple-500 rounded-xl m-2 shadow-xl p-4">
                        <ChatArea user={user} chatId={chatId} db={db} />
                    </div>
                    <div className="row-span-1 col-span-9 ... bg-purple-500 rounded-xl m-2 shadow-xl p-4 flex items-center justify-center">
                        <input type="text" name="message" id="message" className='shadow appearance-none border rounded w-5/6 py-2 h-full text-2xl px-3 mx-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' value={chatField} onChange={(e) => setChatField(e.target.value)} />
                        <button className="m-2" onClick={sendMessage} >
                            <svg
                                className="svg-inline--fa text-white hover:text-gray-300 fa-paper-plane fa-w-16 w-12 h-12 py-2 mr-2"
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="paper-plane"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                            >
                                <path
                                    fill="currentColor"
                                    d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}



/*

                
  

  */
