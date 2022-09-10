import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import ChatInput from './ChatInput'
import Logout from './Logout'
import request from '../service/request'
import { sendMessageRoute, getAllMessagesRoute } from '../utils/APIRoutes'
import {v4 as uuidv4} from 'uuid'

function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  useEffect(() => {
    (async () => {
      const { data } = await request.post(getAllMessagesRoute, {
        from: currentUser._id,
        to: currentChat._id,
      });
      setMessages(data);
    })()
  }, [currentChat, currentUser]);

  const handleSendMsg = async (msg) => {
    await request.post(sendMessageRoute, {
      message: msg,
      from: currentUser._id,
      to: currentChat._id,
    });
    socket.current.emit('send-msg', {
      from: currentUser._id,
      to: currentChat._id,
      message: msg
    })
    setMessages([...messages, {fromSelf: true, message: msg}]);
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-receive', (message) => {
        setArrivalMessage({fromSelf: false, message});
      })
    }
  })

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage])

  //让最后一个消息滚动入视图
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviour: 'smooth'})
  })
  return (
    <>
      {
        currentChat && (
          <Container>
            <div className="chat-header">
              <div className="user-details">
                <div className="avatar">
                  <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
                </div>
                <div className="username">
                  <h3>{currentChat.username}</h3>
                </div>
              </div>
              <Logout />
            </div>
            <div className="chat-messages">
              {
                messages.map((message, index) => {
                  return (
                    <div key={index} ref={scrollRef}>
                      <div className={`message ${message.fromSelf ? 'sended' : 'received'}`}>
                        <div className='content'>
                          <p>{message.message}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
          </Container>
        )
      }
    </>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  border-radius: 0 1.5rem 1.5rem 0;
  @media sceen and (min-width: 720px) and (max-width: 1080px) {
    grid-auto-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #9a86f3;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: #fff;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #9900ff20;
        color: #fff;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #9a86f3;
        color: #fff;
      }
    }
    &::-webkit-scrollbar {
      width: 0.4rem;
      &-thumb {
        width: 0.4rem;
        background-color: #ffffff39;
        border-radius: 1rem;
      }
    }
  }
`

export default ChatContainer