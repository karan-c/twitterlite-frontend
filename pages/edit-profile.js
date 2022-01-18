import { Button, Input, notification } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { Utils } from "../utils/utils";

export default function EditProfile(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [userInfo, setUserInfo] = useState(null)
    const [username, setUsername] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [showErr, setShowErr] = useState(false)
    const [sideBarLink, setSideBarLink] = useState('')
    const [bio, setBio] = useState('')
    const [userId, setUserId] = useState(null)
    const router = useRouter()
    const { TextArea } = Input

    useEffect(() => {
        if (!props.isLogin) {
            router.push('/login')
        }
        else {
            setUserId(localStorage.getItem('userid'))
            setSideBarLink(`/user/${localStorage.getItem('username')}`)
        }
    }, [props])

    useEffect(() => {
        if (userId) {
            fetchUserInfo()
        }
    }, [userId])

    const fetchUserInfo = () => {
        let api = Utils.getApiEndpoint('user-details') + userId + '/'
        axios.get(api).then(res => {
            setUserInfo(res.data)
            setUsername(res.data.user_name)
            setFirstname(res.data.first_name)
            setLastname(res.data.last_name)
            setBio(res.data.bio)
        }).catch(err => {
            console.log(err);
            alert("Something went wrong! Please try again later.")
        })
    }

    const validateData = () => {
        return !(username === '' || firstname === '' || lastname === '')
    }
    const updateDetails = () => {
        if (!validateData()) {
            setShowErr(true)
            return
        }
        let api = Utils.getApiEndpoint('update-user')
        let body = {
            "id": userInfo.id,
            "user_name": username,
            "last_name": lastname,
            "first_name": firstname,
            "bio": bio
        }
        axios.post(api, body).then(res => {
            if (res.status === 200) {
                localStorage.setItem('username',res.data.user_name)
                localStorage.setItem('firstname', res.data.first_name)
                localStorage.setItem('lastname', res.data.last_name)
                notification.success({ message: "Information updated successfully!", duration: 3 })
                setSideBarLink(`/user/${username}`)
            }
        }).catch(err => {
            alert(err.response.data.message ?? "Something went wrong")
            console.log(err)
        })
    }
    return (
        <div className="edit-profile-container">
            <div className="container">
                <div className='row'>
					<div className='col-xl-3 col-lg-3 col-md-2 col-sm-2 col-xs-2'>
						<div className='sticky-div'>
							<SideBar isLogin={props.isLogin} profileLink={sideBarLink} setIsLogin={props.setIsLogin}/>
						</div>
					</div>
                    <div className='col-xl-5 col-lg-5 col-md-10 col-sm-10 col-xs-10'>
                        <div className="ep-title">Edit Profile</div>
                        <div className="ep-form">
                            <div className="field-div">
                                <div className="label">Username:</div>
                                <div>
                                    <input value={username} onChange={(e) => { setUsername(e.target.value) }} className="ep-input" />
                                    {showErr && username === '' && <div className="err-msg">*This field is required</div>}
                                </div>
                            </div>
                            <div className="field-div">
                                <div className="label">First Name:</div>
                                <div>
                                    <input value={firstname} onChange={(e) => { setFirstname(e.target.value) }} className="ep-input" />
                                    {showErr && firstname === '' && <div className="err-msg">*This field is required</div>}
                                </div>
                            </div>
                            <div className="field-div">
                                <div className="label">Last Name:</div>
                                <div>
                                    <input value={lastname} onChange={(e) => { setLastname(e.target.value) }} className="ep-input" />
                                    {showErr && lastname === '' && <div className="err-msg">*This field is required</div>}
                                </div>
                            </div>
                            <div className="field-div align-items-start">
                                <div className="label">Bio:</div>
                                <div>
                                    <TextArea
                                        autoSize={{ minRows : 3 }}
                                        placeholder={`About Yourself`}
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className='ep-bio'
                                    />
                                    {/* <input value={username} onChange={(e) => { setUsername(e.target.value) }} className="ep-input" /> */}
                                </div>
                            </div>
                            <div className="mx-auto fit-content mt-3">
                                <Button type="primary" size="middle" onClick={() => updateDetails()}>Save</Button>
                            </div>
                        </div>
					</div>
					<div className='col-xl-4 col-lg-4 col-md-0 col-sm-0 col-xs-0'>
					</div>
				</div>
            </div>
        </div>
    )
}