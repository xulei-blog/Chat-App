import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import {loginRoute} from '../utils/APIRoutes'

function Login() {
  const [values, setValues] = useState({
    username: '',
    password: '',
  })

  const navigate = useNavigate();

  const toastOption = {
    position: 'bottom-right',
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark'
  }

  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate('/');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { password, username } = values;
      const {data} = await axios.post(loginRoute, {
        username,
        password
      });
      if (data.status === false) {
        toast.error(data.msg, toastOption);
      }
      if (data.status === true) {
        localStorage.setItem('chat-app-user', JSON.stringify(data.user));
        navigate('/');
      }
    };
  }

  const handleValidation = () => {
    const { password, username} = values;
    if (password === '') {
      toast.error('password is required.', toastOption);
      return false;
    } else if (username === '') {
      toast.error('username is required.', toastOption);
      return false;
    }
    return true;
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  }


  return (
    <>
      <FormContainer>
        <form onSubmit={e => handleSubmit(e)}>
          <div className='brand'>
            <img src={Logo} alt="Logo" />
            <h1>snappy</h1>
          </div>
          <input type="text" placeholder='Username' name="username" onChange={e => handleChange(e)} min="3"/>
          <input type="password" placeholder='Password' name="password" onChange={e => handleChange(e)} />
          <button type='submit'>Login</button>
          <span>Don't have an account ? <Link to="/register">Refister</Link></span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  background-color: #131324;

  .brand {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    img {
      height: 5rem;
    }

    h1 {
      color: #fff;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: #fff;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }

    button {
      background-color: #997af0;
      color: #fff;
      padding: 1rem 2rem;
      border: none;
      font-weight: 700;
      cursor: pointer;
      border-radius: .4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;
      &:hover {
        background-color: #4e0eff;
      }
    }
    span {
      color: #fff;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: 700;
      }
    }
  }
`;

export default Login