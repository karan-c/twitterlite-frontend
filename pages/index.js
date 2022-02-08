import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Utils } from '../utils/utils';
import SideBar from '../components/SideBar';
import TweetList from '../components/TweetList';
import FloatingMenu from '../components/FloatingMenu';
import StaticBlock from '../components/StaticBlock';

export default function Home(props){
	const [tweetList, setTweetList] = useState([])
	const [tweetLoading, setTweetLoading] = useState(false)
	const [activePage, setActivePage] = useState(1)
	const [isLastPage, setIsLastPage] = useState(false)

	useEffect(() => {
		window.addEventListener('scroll', handleOnScroll)
		return () => {
			window.removeEventListener('scroll', handleOnScroll)
		}
	}, [tweetList, activePage, isLastPage, tweetLoading])

	useEffect(() => {
		fetchTweets()
	}, [activePage])

	const fetchTweets = async () => {
		if (!isLastPage) {
			setTweetLoading(true)
			let api = Utils.getApiEndpoint('tweet') + '?page=' + activePage
			try {
				let data = await axios.get(api)
				if (data.status === 200) {
					setTweetList(tweetList => tweetList.concat(data.data.results))
					if (!data.data.next) {
						setIsLastPage(true)
					}
				}
				setTweetLoading(false)
			}
			catch (err) {
				if (err.response.status !== 404) {
					alert("Something went wrong!")

				}
				setTweetLoading(false)
				console.log(err)
			}
		}
	}

	const handleOnScroll = () => {
		if (!isLastPage && tweetList.length > 0 && !tweetLoading) {
			let totalScroll = document.body.offsetHeight + Math.round(window.scrollY)
			let scrollHeight = document.body.scrollHeight
			if (totalScroll === scrollHeight || totalScroll - 1 === scrollHeight || totalScroll + 1 === scrollHeight) {
				setActivePage(activePage => activePage + 1)
			}
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
							fetchTweets={fetchTweets}
							tweetLoading={tweetLoading}
							setTweetList={setTweetList}
						/>
					</div>
					<div className='col-xl-3 col-lg-3 col-md-0 col-sm-0 col-xs-0 display-desktop'>
						<StaticBlock />
					</div>
				</div>
				<FloatingMenu isLogin={props.isLogin} setIsLogin={props.setIsLogin}/>
			</div>
		</div>
	)
}
