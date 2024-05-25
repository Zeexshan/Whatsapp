import React, { useEffect } from 'react'
import './SidebarChat.css'
import { Avatar } from '@mui/material'
import { useState } from 'react'
import db from './firebase'
import { addDoc, collection, onSnapshot, orderBy, query, } from "firebase/firestore";
import { Link } from 'react-router-dom'

const SidebarChat = ({ id, name, addNewChat }) => {
    const [seed, setSeed] = useState('');
    const [messages, setMessages] = useState("");

    useEffect(() => {
        const fetchMessages = () => {
            if (id) {
                const q = query(
                    collection(db, "rooms", id, "messages"),
                    orderBy("timestamp", "desc")
                );

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    setMessages(snapshot.docs.map((doc) => doc.data()));
                });

                return unsubscribe;
            }
        };

        const unsubscribe = fetchMessages();

        return () => {
            unsubscribe && unsubscribe();
        };
    }, [id]);

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [])

    const createChat = () => {
        const roomName = prompt("Please enter name for chat room");
        if (roomName) {
            addDoc(collection(db, "rooms"), { name: roomName });
        }
    }
    return !addNewChat ? (
        <Link to={`/rooms/${id}`} >
            <div className='sidebarchat'>
                <Avatar src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${seed}`} />
                <div className="sidebarchat__info">
                    <h3>{name}</h3>
                    <p>{messages[0]?.messages}</p>
                </div>
            </div>
        </Link>
    ) : (<div onClick={createChat}
        className='sidebarchat'>
        <h2>Add new Chat</h2>
    </div>)
}

export default SidebarChat
