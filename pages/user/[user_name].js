import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import SideBar from "../../components/SideBar"
import TweetList from "../../components/TweetList"
import { Utils } from "../../utils/utils"
import { Modal } from "antd"
import Link from "next/link"

export default function User(props) {
    const [username, setUsername] = useState(null)
    const [tweetList, setTweetList] = useState([])
    const [tweetLoading, setTweetLoading] = useState(false)
    const [ownProfile, setOwnProfile] = useState(false)
    const [userInfo, setUserInfo] = useState(null)
    const [followersList, setFollowersList] = useState([])
    const [followingsList, setFollowingsList] = useState([])
    const [showFollowersModal, setShowFollowersModal] = useState(false)
    const [listTitle, setListTitle] = useState('Followers')
    const [modalList, setModalList] = useState([])
    const router = useRouter()
    const { query } = useRouter()

    useEffect(() => {
        if (query.user_name) {
            setUsername(query.user_name)
        }
        setShowFollowersModal(false)
    }, [router])
    
    useEffect(() => {
        if (username) {
            setOwnProfile(username === localStorage.getItem('username'))
            fetchTweetList()
            fetchUserInfo()
        }
    }, [username])

    useEffect(() => {
        if (userInfo && 'id' in userInfo) {
            fetchFollowers()
            fetchFollowings()
        }
    }, [userInfo])

    const fetchTweetList = () => {
        setTweetLoading(true)
        let api = Utils.getApiEndpoint('tweets-by-username') + username + '/'
        axios.get(api).then(res => {
            setTweetList(res.data)
            setTweetLoading(false)
        }).catch(err => {
            console.log(err)
            setTweetLoading(false)
            alert("Something went wrong! Please try again later.")
        })
    }

    const fetchFollowers = () => {
        let api = Utils.getApiEndpoint('followers') + userInfo.id + '/'
        axios.get(api).then(res => {
            setFollowersList(res.data)
        }).catch(err => {
            console.log(err)
            alert("Couldn't load followers. Please try again later")
        })
    }

    const fetchFollowings = () => {
        let api = Utils.getApiEndpoint('followings') + userInfo.id + '/'
        axios.get(api).then(res => {
            setFollowingsList(res.data)
        }).catch(err => {
            console.log(err)
            alert("Couldn't load followings. Please try again later")
        })
    }

    const fetchUserInfo = () => {
        let api = Utils.getApiEndpoint('user-details-by-username') + username + '/'
        axios.get(api).then(res => {
            setUserInfo(res.data)
        }).catch(err => {
            console.log(err)
            alert("Something went wrong! Please try again later.")
        })
    }

    const followUser = () => {
        let api = Utils.getApiEndpoint('follow-user')
        let body = {
            "id": userInfo.id 
        }
        axios.post(api, body).then(res => {
            if (res.status === 200) {
                let tmpUserInfo = { ...userInfo }
                tmpUserInfo.already_following = !tmpUserInfo.already_following
                setUserInfo(tmpUserInfo)
            }
        }).catch(err => {
            console.log(err)
            alert("Something went wrong!")
        })
    }

    const showUserListModal = (listType) => {
        setModalList(listType === 'followers' ? followersList : followingsList)
        setListTitle(listType === 'followers' ? "Followers" : "Followings")
        setShowFollowersModal(true)
    }

    return (
        <div className='user-container'>
			<div className='container'>
				<div className='row'>
					<div className='col-xl-3 col-lg-3 col-md-2 col-sm-2 col-xs-2'>
						<div className='sticky-div'>
							<SideBar isLogin={props.isLogin} />
						</div>
					</div>
					<div className='col-xl-5 col-lg-5 col-md-10 col-sm-10 col-xs-10'>
                        {userInfo !== null && <div className="user-info-block">
                            <div className="user-top-section">
                                <div className="top-left">
                                    <div className="profile-pic">
                                        <i className="fa-solid fa-user user-icon-color"></i>
                                    </div>
                                    <div>
                                        <div className="full-name">{`${userInfo.first_name} ${userInfo.last_name}`}</div>
                                        <div className="user-name">{`@${userInfo.user_name}`}</div>
                                    </div>
                                </div>
                                {ownProfile
                                    ? <div className="edit-block" onClick={() => {
                                        router.push('/edit-profile')
                                    }}>
                                        <i className="fa-solid fa-pen"></i>
                                        &nbsp;Edit Pofile
                                    </div>
                                    : <div
                                        className="edit-block"
                                        onClick={() => {
                                            followUser()
                                        }}>
                                        <i className={"fa-solid fa-user-" + (!userInfo.already_following ? "plus": "minus")}></i>
                                        &nbsp;{userInfo.already_following ? "Unfollow" : "Follow"}
                                    </div>}
                            </div>
                            <div className="bio">{userInfo.bio}</div>
                            <div className="follow-block">
                                <div onClick={() => showUserListModal('followers')}>{userInfo.followers_count} Followers</div>
                                <div onClick={() => showUserListModal('followings')}>{userInfo.followings_count} Followings</div>
                            </div>
                        </div>}
                        <TweetList
                            isLogin={props.isLogin}
                            tweetList={tweetList}
                            hideCreateBlock={!ownProfile}
                            fetchTweets={fetchTweetList}
                            tweetLoading={tweetLoading}
                        />
					</div>
					<div className='col-xl-4 col-lg-4 col-md-0 col-sm-0 col-xs-0'>
					</div>
                </div>
                <Modal
                    visible={showFollowersModal}
                    onCancel={() => setShowFollowersModal(false)}
                    footer={null}
                    title={listTitle}
                    width={400}
                >
                    <div className="user-list">
                        {modalList.map(item => 
                            <div className="user-row">
                                <div className="icon cursor-pointer" onClick={() => {
                                    router.push(`/user/${item.user_name}`)
                                }}>
                                    <i className='fa-solid fa-user user-icon-color'></i>
                                </div>
                                    <div className="user-row-right">
                                        <div className="cursor-pointer" onClick={() => {
                                            router.push(`/user/${item.user_name}`)
                                        }}>
                                            <span className="fullname">{item.first_name + ' ' + item.last_name}</span>
                                            <span className="username mx-2">@{item.user_name}</span>
                                        </div>
                                        <div>
                                            <span className="follow-count">{item.followers_count} Followers</span>
                                            <span className="follow-count mx-3">{item.followings_count} Followings</span>
                                        </div>
                                    </div>
                            </div>
                        )}
                        {modalList.length === 0 && 
                            <div className="no-data-div">
                                <i class="fa-solid fa-magnifying-glass mx-1"></i> No data found
                            </div>
                        }
                    </div>
                </Modal>
			</div>
		</div>
    )
}