import { Button, Input, Modal, notification } from "antd";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Utils } from "../utils/utils";
import Tweet from "./Tweet";
import axios from "axios";
import Image from 'next/image'

export default function TweetList({ tweetList, isLogin, hideCreateBlock, fetchTweets, tweetLoading, setTweetList }) {
	const [tweetText, setTweetText] = useState('')
	const [retweetText, setRetweetText] = useState('')
	const [showTweetErr, setShowTweetErr] = useState(false)
    const [showRetweetModal, setShowRetweetModal] = useState(false)
	const [loginModalVisible, setLoginModalVisible] = useState(false)
	const [reTweetData, setRetweetData] = useState(null)
	const [imageBase64, setImageBase64] = useState(null)
	const [tweetCreateLoading, setTweetCreateLoading] = useState(false);
	const [retweetLoading, setRetweetLoading] = useState(false);
    const { TextArea } = Input
    const router = useRouter()
	const editBox = useRef()
	const textareaRef = useRef()

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
				// fetchTweets()
				handleAfterLike(isLiked ? -1 : 1, tweetId)
			}
			else {
				alert("Something went wrong!")
			}
		}).catch(err => {
			console.log(err);
			alert("Something went wrong!")
		})
	}

	const handleAfterLike = (action, tweetId) => {
		let tmpList = tweetList.slice()
		tmpList = tmpList.map((item) => {
			if (item.id === tweetId) {
				item.is_liked = !item.is_liked		
				item.likes = item.likes + (action)
			}
			if (item.retweet_obj && item.retweet_obj.id === tweetId) {
				item.retweet_obj.is_liked = !item.retweet_obj.is_liked		
				item.retweet_obj.likes = item.retweet_obj.likes + (action)
			}
			return item
		})
		setTweetList(tmpList)
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
		setRetweetLoading(true)
		let api = Utils.getApiEndpoint('retweet')
		let body = {
			"tweet_id": reTweetData.id,
			"content": retweetText
		}
		axios.post(api, body).then(res => {
			if (res.status === 200) {
				notification.success({ message: "Re-Tweeted successfully!", duration: 2 })
				handleAfterTweet(res.data)
			}
			else {
				notification.error({message: "Something went wrong!", duration: 2})
			}
			defaultRetweetData()
			setRetweetLoading(false)
		}).catch(err => {
			setRetweetLoading(false)
			defaultRetweetData()
			console.log(err)
			alert("Something went wrong")
		})
	}

	const handleAfterTweet = (tweetObj) => {
		let tmpList = tweetList.slice()
		tmpList.unshift(tweetObj)
		setTweetList(tmpList)
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
		setTweetCreateLoading(true)
		let api = Utils.getApiEndpoint('create-tweet')
		let body = {
			"content": tweetText
		}
		if (imageBase64) {
			body['image'] = imageBase64.split('base64,')[1]
		}
		axios.post(api, body).then(res => {
			if (res.status === 200) {
				handleAfterTweet(res.data)
				setTweetText('')
				setShowTweetErr(false)
				notification.success({ "message": "Tweet created successfully!", duration: 2 })
				setImageBase64(null)
			}
			setTweetCreateLoading(false)
		}).catch(err => {
			setTweetCreateLoading(false)
			setImageBase64(null)
			console.log(err)
			alert("Something went wrong!")
		})
	}	
	
	const onImageUpload = (e) => {
		if (e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png') {
			if (e.target.files[0].size / (1024 * 1024) < 2) {
				encodeBase64(e.target.files[0])
			}
			else {
				alert("Image must be smaller than 2MB")
			}
		}
		else {
			alert("Currently we only allow JPEG and PNG files")
		}
	} 
    
	const encodeBase64 = (file) => {
		let reader = new FileReader()
		if (file) {
			reader.readAsDataURL(file)
			reader.onload = () => {
				let base64 = reader.result;
				setImageBase64(base64)
			}
			reader.onerror = (err) => {
				console.log(err);
				alert("Something went wrong while uploading!")
			}
		}
	}
	
	const deleteTweet = (tweetId) => {
		let api = Utils.getApiEndpoint('delete-tweet')  + tweetId + '/'
		axios.delete(api).then(res => {
			handleAfterDelete(tweetId)
		}).catch(err => {
			console.log(err)
			alert("Something went wrong! Please try again later.")
		})
	}

	const handleAfterDelete = (tweetId) => {
		let tmpList = tweetList.slice()
		tmpList = tmpList.filter(item => item.id !== tweetId)
		setTweetList(tmpList)
		notification.success({message: "Tweet Deleted successfully"})
	}

	return (
		
        <div className="tweetlist-block">
			{isLogin && !hideCreateBlock && <div className='create-tweet-block'>
				<div className="edit-box" ref={editBox}>
					<TextArea
						ref={textareaRef}
						autoSize={{ minRows : 3 }}
						placeholder={`What's Happening?`}
						value={tweetText}
						onChange={(e) => setTweetText(e.target.value)}
						className='tweet-input'
						onFocus={() => {
							editBox.current.className = 'edit-box focus-style'
						}}
						onBlur={() => {
							editBox.current.className = 'edit-box'
						}}
					/>
					<div className="upload-block" onClick={() => {
						textareaRef.current.focus()
					}}>
						{imageBase64 && <div className="image-preview">
							<Image src={imageBase64} layout="fill" objectFit="contain" />
						</div>}
						<input type={'file'} id="image-input" style={{ display: "none" }} onChange={onImageUpload} />
						<i className="fa-regular fa-image cursor-pointer" onClick={(e) => {
							document.getElementById('image-input').click()
						}}></i>
					</div>
				</div>
                {showTweetErr && tweetText === '' && <div className='err-msg'>*This field cannot be empty</div>}
                <div className='d-flex justify-content-end'>
					<Button
						shape="round"
						className='tweet-button'
						onClick={() => createTweet()}
						loading={tweetCreateLoading}
					>
						Tweet
					</Button>
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
						deleteTweet={deleteTweet}
                    />
				)}
				{!tweetLoading && tweetList.length === 0 && <div className="no-data">
					<div className="icon">
						<i className="fas fa-search"></i>
					</div>
					<div className="text">
						Nothing to show here.
					</div>
				</div>}
			</div>
			{tweetLoading && <div className="lds-ripple"><div></div><div></div></div>}
            <Modal
				visible={loginModalVisible}
				okText={"Login"}
				onOk={() => {
					router.push("/login")
				}}
				onCancel={() => { setLoginModalVisible(false)}}
				cancelText={"Skip"}
			>
				<div>Please Login to perform this action</div>
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
						deleteTweet={deleteTweet}
					/>
				</div>
				<div className='d-flex justify-content-end'>
					<Button shape="round" className='tweet-button' loading={retweetLoading} onClick={() => retweetSubmit()}>Retweet</Button>
				</div>
			</Modal>
        </div>
    )
}