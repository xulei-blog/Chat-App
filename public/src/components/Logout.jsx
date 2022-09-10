import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { BiPowerOff } from 'react-icons/bi'

function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    localStorage.clear();
    navigate('/login')
  }
  return (
    <div>
      <Button onClick={() => handleClick()}>
        <BiPowerOff/>
      </Button>
    </div>
  )
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`



export default Logout