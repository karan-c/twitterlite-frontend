import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { Utils } from '../utils/utils';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Login (props) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showErrMag, setShowErrMag] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            router.push('/')
        }
    }, [])

    const submitLoginDetails = () => {
        if (username === '' || password === '') {
            setShowErrMag(true)
            return
        }
        let api = Utils.getApiEndpoint('login')
        let body = {
            "user_name": username,
            "password": password
        }
        axios.post(api, body).then((res) => {
            if (res.status === 200) {
                props.setIsLogin(true)
                localStorage.setItem("access_token", res.data.access)
                localStorage.setItem("refresh_token", res.data.refresh)
                router.push('/')
            }
            else {
                alert("Username or Password is invalid")
            }
        }).catch(err => {
            console.log(err);
            alert("Username or Password is invalid")
        })
    }

    const handlePasswordKeyDown = (e) => {
        if (e.key === 'Enter') {
            submitLoginDetails()
        }
    }
    return(
        <div className='login-box'>
            <div className='title'>Login to continue</div>
            <div className='form-box'>
                <div className='label'>Username</div>
                <input type={"text"} value={username} onChange={(e) => { setUsername(e.target.value) }}/>
                {showErrMag && username === '' && <div className='err-msg'>*Please provide username</div>}
                <div className='label'>Password</div>
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} onKeyDown={handlePasswordKeyDown}/>
                {showErrMag && password === '' && <div className='err-msg'>*Please provide password</div>}
                <div className='mt-5 mx-auto fit-content'>
                    <Button type='primary' size='middle' onClick={(e) => submitLoginDetails()}>Login</Button>
                </div>
            </div>
        </div>
    )
}