import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tweet from '../components/Tweet';
import { Utils } from '../utils/utils';

export default function Feed(props){
	const [tweetList, setTweetList] = useState([])
	const [tweetLoading, setTweetLoading] = useState(false)
	
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
				{tweetList.map((item, idx) => 
					<Tweet 
						tweetData={item} key={"tweet_" + idx}
						likeTweet={likeTweet}	
						depthIndex={0}
					/>
				)}
			</div>
		</div>
	)
}
