import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Utils } from '../utils/utils';
import SideBar from '../components/SideBar';
import TweetList from '../components/TweetList';

export default function Feed(props){
	const [tweetList, setTweetList] = useState([])
	const [tweetLoading, setTweetLoading] = useState(false)

	useEffect(() => {
		fetchFeedTweets()
	}, [])

	const fetchFeedTweets = async () => {
		setTweetLoading(true)
		let api = Utils.getApiEndpoint('feed')
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
				<div className='row'>
					<div className='col-xl-3 col-lg-3 col-md-2 col-sm-2 col-xs-2'>
						<div className='sticky-div'>
							<SideBar isLogin={props.isLogin} setIsLogin={props.setIsLogin}/>
						</div>
					</div>
					<div className='col-xl-5 col-lg-5 col-md-10 col-sm-10 col-xs-10'>
						<TweetList
							isLogin={props.isLogin}
							tweetList={tweetList}
							hideCreateBlock={false}
							fetchTweets={fetchFeedTweets}
							tweetLoading={tweetLoading}
							setTweetList={setTweetList}
						/>
					</div>
					<div className='col-xl-4 col-lg-4 col-md-0 col-sm-0 col-xs-0'>
					</div>
				</div>
			</div>
		</div>
	)
}
