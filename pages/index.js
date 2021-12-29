import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tweet from '../components/Tweet';
import { Utils } from '../utils/utils';
import { Button, notification } from 'antd';

export default function Feed(props){
	const [tweetList, setTweetList] = useState([])
	const [tweetLoading, setTweetLoading] = useState(false)
	const [tweetText, setTweetText] = useState('')
	const [showTweetErr, setShowTweetErr] = useState(false)

	useEffect(() => {
		fetchTweets()
	}, [])

	const fetchTweets = async () => {
		setTweetLoading(true)
		let api = Utils.getApiEndpoint('tweet')
		try {
			let data = await axios.get(api)
			if (data.status === 200) {
				setTweetList(data.data)
			}
			setTweetLoading(false)
		}
		catch(err) {
			alert("Something went wrong!")
			setTweetLoading(false)
			console.log(err)
		}
	}

	const likeTweet = (tweetId, isLiked) => {
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

	const handleAfterLike = (tweetId, isLiked) =>  {
		let tmpList = tweetList.slice()
		tmpList = tmpList.map(item => {
			let tmpItem = item
			if (tmpItem['id'] === tweetId) {
				tmpItem['is_liked'] = !tmpItem['is_liked']
				tmpItem['likes'] = tmpItem['likes'] + (isLiked ? -1 : 1)
			}
			return tmpItem 
		})
		setTweetList(tmpList)
	}
	return(
		<div className='feed-container'>
			<div className='container'>
				<div className='row'>
					<div className='col-xl-4 col-lg-4 col-md-2 col-sm-2 col-xs-2'>

					</div>
					<div className='col-xl-6 col-lg-6 col-md-10 col-sm-10 col-xs-10'>
						<div className='create-tweet-block'>
							<textarea 
								placeholder={`What's Happening?`} 
								value={tweetText} 
								onChange={(e) => setTweetText(e.target.value) } 
								className='tweet-input' 
								rows={3}
							/>
							{showTweetErr && tweetText === '' && <div className='err-msg'>*This field cannot be empty</div>}
							<div className='d-flex justify-content-end'>
								<button className='tweet-button' onClick={() => createTweet()}>Tweet</button>
							</div>
						</div>
						<div className='tweet-board'>
							{tweetList.map((item, idx) => 
								<Tweet 
									tweetData={item} key={"tweet_" + idx}
									likeTweet={likeTweet}	
									depthIndex={0}
								/>
							)}
						</div>
					</div>
					<div className='col-xl-2 col-lg-2 col-md-0 col-sm-0 col-xs-0'>

					</div>
				</div>
				
			</div>
		</div>
	)
}
