import React, { useState, useEffect } from 'react';
import './Chat.css';
import { Avatar, IconButton } from '@mui/material';
import { AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined, Send, Delete } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import EmojiPicker from 'emoji-picker-react';
import {
    collection,
    doc,
    onSnapshot,
    getDoc,
    orderBy,
    query,
    addDoc,
    serverTimestamp,
    deleteDoc,
    getDocs
} from 'firebase/firestore';
import db from './firebase';

const Chat = () => {
    const [seed, setSeed] = useState('');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState('');
    const [{ user }] = useStateValue();
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoomName = async () => {
            if (roomId) {
                const roomDoc = doc(db, 'rooms', roomId);
                const roomSnapshot = await getDoc(roomDoc);
                if (roomSnapshot.exists()) {
                    setRoomName(roomSnapshot.data().name);
                }
                const q = query(
                    collection(db, 'rooms', roomId, 'messages'),
                    orderBy('timestamp', 'asc')
                );

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const messagesData = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setMessages(messagesData);
                });

                return unsubscribe;
            }
        };
        setSeed(Math.floor(Math.random() * 5000));
        fetchRoomName();
    }, [roomId]);

    const onEmojiClick = (emojiObject) => {
        setInput(input + emojiObject.emoji);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim()) {
            addDoc(collection(db, 'rooms', roomId, 'messages'), {
                messages: input,
                name: user.displayName,
                userId: user.uid, // Store the user's ID with the message
                timestamp: serverTimestamp(),
            });
        }
        setInput('');
    };

    const deleteMessage = async (messageId) => {
        try {
            await deleteDoc(doc(db, 'rooms', roomId, 'messages', messageId));
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const deleteRoom = async () => {
        try {
            await deleteDoc(doc(db, 'rooms', roomId));
            const roomsCollection = await getDocs(collection(db, 'rooms'));
            const firstRoom = roomsCollection.docs[0]?.id;
            if (firstRoom) {
                navigate(`/rooms/${firstRoom}`);
            } else {
                navigate('/'); // Redirect to the main chat list if no rooms are left
            }
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };

    return (
        <div className='chat'>
            <div className='chat__header'>
                <Avatar src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${seed}`} />
                <div className='chat__headerInfo'>
                    <h2>{roomName}</h2>
                    <p>Last seen in previous life</p>
                </div>
                <div className='chat__headerRight'>
                    <IconButton onClick={deleteRoom}>
                        <Delete />
                    </IconButton>
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className='chat__body'>
                {messages.map((message, index) => (
                    <p key={index} className={`chat__message ${message.userId === user.uid ? 'chat__receiver' : ''}`}>
                        <span className='chat__name'>{message.name}</span>
                        {typeof message.messages === 'string' ? message.messages : JSON.stringify(message.messages)}
                        <span className='chat__time'>
                            {message.timestamp ? new Date(message.timestamp.toDate()).toUTCString() : 'No timestamp'}
                        </span>
                        {message.userId === user.uid && (
                            <IconButton onClick={() => deleteMessage(message.id)}>
                                <Delete />
                            </IconButton>
                        )}
                    </p>
                ))}
            </div>
            <div className='chat__footer'>
                <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <InsertEmoticon />
                </IconButton>
                {showEmojiPicker && (
                    <div className='emoji-picker-container'>
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                )}
                <form onSubmit={sendMessage}>
                    <input
                        placeholder='Type a message'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type='text'
                    />
                    <button type='submit'>
                        Send a message
                    </button>
                </form>
                <IconButton onClick={sendMessage}>
                    <Send />
                </IconButton>
                <IconButton>
                    <Mic />
                </IconButton>
            </div>
        </div>
    );
};

export default Chat;
