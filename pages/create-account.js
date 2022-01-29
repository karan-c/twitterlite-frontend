import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { Utils } from '../utils/utils';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'universal-cookie';

export default function Login(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [showErrMag, setShowErrMag] = useState(false)
    const router = useRouter()
    const cookie = new Cookies()

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            router.push('/')
        }
    }, [])

    const validateData = () => {
        if (username === '' || password === '' || firstname === '' || lastname === '' || password !== confirmPassword) {
            setShowErrMag(true)
            return false
        }
        return true
    }
    const submitCreateAccount = () => {
        if (!validateData()) {
            return
        }
        setIsLoading(true)
        let api = Utils.getApiEndpoint('create-account')
        let body = {
            "user_name": username,
            "password": password,
            "first_name": firstname,
            "last_name": lastname
        }
        axios.post(api, body).then((res) => {
            if (res.status === 201) {
                cookie.set('show_register_msg', true)
                router.push('/login')   
            }
            setIsLoading(false)
        }).catch(err => {
            setIsLoading(false)
            console.log(err.response);
            if (err.response.status === 400) {
                let alertmsg = 'Please solve following issues\r\n'
                for (let key in err.response.data) {
                    alertmsg += `\xb7 ${err.response.data[key]}`
                    alertmsg += '\r\n'
                }
                alert(alertmsg)
            }
        })
    }

    const handlePasswordKeyDown = (e) => {
        if (e.key === 'Enter') {
            submitCreateAccount()
        }
    }
 
    return(
        <div className='login-box'>
            <div className='title'>Login to continue</div>
            <div className='form-box'>
                <div className='label'>Username</div>
                <input type={"text"} value={username} onChange={(e) => { setUsername(e.target.value) }}/>
                {showErrMag && username === '' && <div className='err-msg'>*Please provide username</div>}
                <div className='label'>First Name</div>
                <input value={firstname} onChange={(e) => { setFirstname(e.target.value) }} />
                {showErrMag && firstname === '' && <div className='err-msg'>*Please provide First Name</div>}
                <div className='label'>Last Name</div>
                <input value={lastname} onChange={(e) => { setLastname(e.target.value) }} />
                {showErrMag && lastname === '' && <div className='err-msg'>*Please provide Last Name</div>}
                <div className='label'>Password</div>
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }}/>
                {showErrMag && password === '' && <div className='err-msg'>*Please provide password</div>}
                <div className='label'>Confirm Password</div>
                <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} onKeyDown={handlePasswordKeyDown}/>
                {showErrMag && confirmPassword === '' && <div className='err-msg'>*Please provide password</div>}
                {showErrMag && confirmPassword !== password && <div className='err-msg'>*Password does not match</div>}
                <div className='mt-5 mx-auto fit-content'>
                    <Button type='primary' size='middle' onClick={(e) => submitCreateAccount()} loading={isLoading}>Create Account</Button>
                </div>
            </div>
        </div>
    )
}