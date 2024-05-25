import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import { Avatar, IconButton } from '@mui/material';
import { Chat, DonutLarge, MoreVert, SearchOutlined } from '@mui/icons-material';
import SidebarChat from './SidebarChat';
import db from "./firebase";
import { onSnapshot } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { useStateValue } from './StateProvider';

const Sidebar = () => {
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    return () => unsubscribe();
  }, []);

  return (
    <div className="sidebar">
      <div className='sidebar__header'>
        <Avatar src={user?.photoURL} />
        <h5>{user?.displayName}</h5>
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchCont">
          <SearchOutlined />
          <input placeholder='Search or start new chat' type='text' />
        </div>
      </div>

      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar
