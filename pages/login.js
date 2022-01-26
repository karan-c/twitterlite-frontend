import { Button, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import { Utils } from '../utils/utils';
import axios from 'axios';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode'
import Cookies from 'universal-cookie';
import Link from 'next/link';

export default function Login (props) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showErrMag, setShowErrMag] = useState(false)
    const router = useRouter()
    const cookie = new Cookies()

    useEffect(() => {
        if (cookie.get('show_register_msg')) {
            notification.success({ message: "Account created successfully! Please login to continue", duration: 3 })
            cookie.remove('show_register_msg')
        }
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
                handleAfterlogin(res.data.access, res.data.refresh)
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

    const handleAfterlogin = (access_token, refresh_token)  => {
        localStorage.setItem("access_token", access_token)
        localStorage.setItem("refresh_token", refresh_token)
        let token_data = jwt_decode(access_token)
        localStorage.setItem('userid', token_data.user_id)
        getUserDetails(token_data.user_id)
    }

    const getUserDetails = (userid) => {
        let api = Utils.getApiEndpoint('user-details') + userid + '/'
        axios.get(api).then(res => {
            let data = res.data
            localStorage.setItem('username', data.user_name)
            localStorage.setItem('firstname', data.first_name)
            localStorage.setItem('lastname', data.last_name)
            router.push('/')
        }).catch(err => {
            console.log(err)
            alert("Something went wrong! Please try again.")
        })
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
                <div className='sign-up-text'>Don't have an account? <Link href="/create-account"><a className='blue-fonts'>Sign up</a></Link> here.</div>
            </div>
        </div>
    )
}