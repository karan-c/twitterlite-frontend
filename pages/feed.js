import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tweet from '../components/Tweet';

export default function Feed(props){
	const [tweetList, setTweetList] = useState([])
	const [tweetLoading, setTweetLoading] = useState(false)
	
	useEffect(() => {
		fetchTweets()
	}, [])

	const fetchTweets = async () => {
		setTweetLoading(true)
		let api = 'http://127.0.0.1:8000/api/tweet/'
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

	return(
		<div className='feed-container'>
			<div className='container'>
				{tweetList.map((item, idx) => <Tweet tweetData={item} key={"tweet_" + idx}/>)}
			</div>
		</div>
	)
}
