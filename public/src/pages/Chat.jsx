import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import request from '../service/request';
import { useNavigate } from 'react-router-dom'
import { allUsersRoute } from '../utils/APIRoutes'
import Contacts from '../components/Contacts'
import Welcome from '../components/Welcome'
import ChatContainer from '../components/ChatContainer'
import {io} from 'socket.io-client'
import {host} from '../utils/APIRoutes'

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      if (!(localStorage.getItem('chat-app-user') && localStorage.getItem('chat-app-token'))) {
        navigate('/login');
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-user')));
        setIsLoaded(true);
      }
    })()
  }, [])
  useEffect(() => {
    (async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const { data } = await request.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data);
        } else {
          navigate("/setAvatar");
        }
      }
    })()
  }, [currentUser]);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit('add-user', currentUser._id);
    }
  }, [currentUser])

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  }
  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}></Contacts>
        {
          isLoaded && (currentChat === undefined ? <Welcome currentUser={currentUser}/> : <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>)
        }
      </div>
    </Container>
  )
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    border-radius: 1.5rem;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat