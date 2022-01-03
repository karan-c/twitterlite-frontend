import { Input, Modal, notification } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { Utils } from "../utils/utils";
import Tweet from "./Tweet";
import axios from "axios";

export default function TweetList({ tweetList, isLogin, hideCreateBlock, fetchTweets, tweetLoading }) {
	const [tweetText, setTweetText] = useState('')
	const [retweetText, setRetweetText] = useState('')
	const [showTweetErr, setShowTweetErr] = useState(false)
    const [showRetweetModal, setShowRetweetModal] = useState(false)
	const [loginModalVisible, setLoginModalVisible] = useState(false)
	const [reTweetData, setRetweetData] = useState(null)
    const { TextArea } = Input
    const router = useRouter()

    const likeTweet = (tweetId, isLiked) => {
		if (!isLogin) {
			setLoginModalVisible(true)
			return
		}
		let api = Utils.getApiEndpoint('like-tweet')
		let body = {
			"tweet_id": tweetId,
			"action": isLiked ? "unlike": "like"
		}
		axios.post(api, body).then(res => {
			if(res.status === 200) {
				fetchTweets()
				// handleAfterLike(tweetId, isLiked)
			}
			else {
				alert("Something went wrong!")
			}
		}).catch(err => {
			console.log(err);
			alert("Something went wrong!")
		})
	}

	const retweetClick = (tweetData) => {
		if (!isLogin) {
			setLoginModalVisible(true)
			return
		}
		setRetweetData(tweetData)
		setShowRetweetModal(true)
	}

	const retweetSubmit = () => {
		let api = Utils.getApiEndpoint('retweet')
		let body = {
			"tweet_id": reTweetData.id,
			"content": retweetText
		}
		axios.post(api, body).then(res => {
			if (res.status === 200) {
				notification.success({ message: "Re-Tweeted successfully!", duration: 2 })
				fetchTweets()
			}
			else {
				notification.error({message: "Something went wrong!", duration: 2})
			}
			defaultRetweetData()
		}).catch(err => {
			defaultRetweetData()
			console.log(err)
			alert("Something went wrong")
		})
	}

	const defaultRetweetData = () => {
		setShowRetweetModal(false)
		setRetweetData(null)
		setRetweetText('')
	}
	const createTweet = () => {
		if (tweetText === '')  {
			setShowTweetErr(true)
			return
		}
		let api = Utils.getApiEndpoint('create-tweet')
		let body = {
			"content": tweetText
		}
		axios.post(api, body).then(res => {
			if (res.status === 200) {
				fetchTweets()
				setTweetText('')
				setShowTweetErr(false)
				notification.success({"message": "Tweet created successfully!", duration: 2})
			}
		}).catch(err => {
			console.log(err)
			alert("Something went wrong!")
		})
    }
    
    return (
        <div className="tweetlist-block">
            {isLogin && <div className='create-tweet-block'>
                <TextArea
                    autoSize={{ minRows : 3 }}
                    placeholder={`What's Happening?`}
                    value={tweetText}
                    onChange={(e) => setTweetText(e.target.value)}
                    className='tweet-input'
                />
                {showTweetErr && tweetText === '' && <div className='err-msg'>*This field cannot be empty</div>}
                <div className='d-flex justify-content-end'>
                    <button className='tweet-button' onClick={() => createTweet()}>Tweet</button>
                </div>
            </div>}
            <div className='tweet-board'>
                {tweetList.map((item, idx) => 
                    <Tweet 
                        tweetData={item}
                        key={"tweet_" + idx}
                        likeTweet={likeTweet}
                        depthIndex={0}
                        isDummy={false}
                        reTweet={retweetClick}
                    />
                )}
            </div>
            <Modal
				visible={loginModalVisible}
				okText={"Login"}
				onOk={() => {
					router.push("/login")
				}}
				onCancel={() => { setLoginModalVisible(false)}}
				cancelText={"Skip"}
			>
				<div>Please Login to continue</div>
			</Modal>
            <Modal
				visible={showRetweetModal}
				footer={null}
				onCancel={() => { setShowRetweetModal(false) }}
				className='retweet-modal'
				title={"Retweet"}
			>
				<TextArea
					autoSize={{ minRows : 3 }}
					placeholder={`Add a comment... (optional)`}
					value={retweetText}
					onChange={(e) => setRetweetText(e.target.value)}
					className='tweet-input mt-2'
				/>
				<div style={{ marginTop: "-10px" }}>
					<Tweet
						tweetData={reTweetData}
						likeTweet={likeTweet}	
						reTweet={retweetClick}
						depthIndex={0}
						isDummy={true}
					/>
				</div>
				<div className='d-flex justify-content-end'>
					<button className='tweet-button' onClick={() => retweetSubmit()}>Retweet</button>
				</div>
			</Modal>
        </div>
    )
}