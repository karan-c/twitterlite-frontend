import moment from 'moment'
import React, { useState, useEffect } from 'react'

export default function Tweet({ tweetData, likeTweet, reTweet, depthIndex }){
    return (
        <div className='tweet-block'>
            <div className='d-flex align-items-end'>
                <div className='user-full-name'>
                    {`${tweetData.user.first_name} ${tweetData.user.last_name}`}
                </div>
                <div className='username'>
                    {`@${tweetData.user.user_name}`}
                </div>
                <div className='date'>
                    {moment(tweetData.timestamp).fromNow()}
                </div>
            </div>
            <div className='tweet-text'>
                {tweetData.content}
            </div>
            {depthIndex <= 1 && <div>
                {tweetData.retweet_obj && <Tweet tweetData={tweetData.retweet_obj} likeTweet={likeTweet} depthIndex={depthIndex + 1}/>}
            </div>}
            <div className='d-flex mt-2'>
                <div className='like-count' onClick={() => likeTweet(tweetData.id, tweetData.is_liked)}>
                    <i className={`fa-${tweetData.is_liked ? "solid": "regular"} fa-heart`}></i>
                    <span className='mx-1'>{tweetData.likes}</span>
                </div>
                <div className='rt-count mx-2'>
                    <i className='fa-solid fa-retweet'></i>
                    <span className='mx-1'>{tweetData.retweet_count}</span>
                </div>
            </div>
        </div>
    )
}
