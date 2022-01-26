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
					<div className='col-xl-3 col-lg-3 col-md-2 col-sm-0 col-xs-0 display-desktop'>
						<div className='sticky-div'>
							<SideBar isLogin={props.isLogin} setIsLogin={props.setIsLogin}/>
						</div>
					</div>
					<div className='col-xl-6 col-lg-6 col-md-10 col-sm-12 col-xs-12'>
						<TweetList
							isLogin={props.isLogin}
							tweetList={tweetList}
							hideCreateBlock={false}
							fetchTweets={fetchFeedTweets}
							tweetLoading={tweetLoading}
							setTweetList={setTweetList}
						/>
					</div>
					<div className='col-xl-3 col-lg-3 col-md-0 col-sm-0 col-xs-0 display-desktop'>
						<div className='static-block sticky-div'>

						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
