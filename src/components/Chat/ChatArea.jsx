import { useEffect, useState, useRef } from 'react'
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";

export default function ChatArea({ user, db, chatId }) {
    const [chats, setChats] = useState([])
    const scrollChatArea = useRef()

    useEffect(() => {
        if (chatId) {
            const q = query(collection(db, "chat", chatId, "messages"), orderBy("createdAt"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                setChats(querySnapshot.docs.map(doc => doc.data()))
                scrollChatArea.current.scroll({ top: scrollChatArea.current.scrollHeight, behavior:"smooth" })
            });
            return () => {
                unsubscribe()
            }
        }
    }, [chatId])// eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div className=" bg-white h-full grid-flow-row rounded-xl overflow-y-scroll" ref={scrollChatArea}>{
            chatId != null ? <>
                {
                    chats.length > 0 ? chats.map((value, key) =>
                        <div key={key} className={`row-span-auto w-1/2 my-6 rounded-lg mx-2 px-2 py-1 ${value.from === user.uid ? 'ml-auto bg-green-200 ' : 'bg-blue-400 '}`} style={{minHeight:'70px'}}>
                            {value.message}
                        </div>
                    ) : <div>Nothing to show</div>
                }
                {/* <div className="row-span-auto h-24 bg-blue-400 w-1/2 my-2 mx-2 rounded-lg"></div>
                <div className="row-span-auto h-24 bg-green-200 w-1/2 my-2 ml-auto rounded-lg"></div>
                <div className="row-span-auto h-24 bg-green-200 w-1/2 my-2 ml-auto rounded-lg"></div>
                <div className="row-span-auto h-24 bg-blue-400 w-1/2 my-2 mx-2 rounded-lg"></div>
                <div className="row-span-auto h-24 bg-green-200 w-1/2 my-2 ml-auto rounded-lg"></div>
                <div className="row-span-auto h-24 bg-green-200 w-1/2 my-2 ml-auto rounded-lg"></div>
                <div className="row-span-auto h-24 bg-blue-400 w-1/2 my-2 mx-2 rounded-lg"></div>
                <div className="row-span-auto h-24 bg-green-200 w-1/2 my-2 ml-auto rounded-lg"></div> */}
            </>
                : <div>Done</div>
        }

        </div>
    )
}
