import moment from 'moment'
import React, { useState, useEffect } from 'react'


export default function Tweet({ tweetData }){
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
            <div>
                {tweetData.retweet_obj && <Tweet tweetData={tweetData.retweet_obj}/>}
            </div>
            <div className='d-flex mt-2'>
                <div className='like-count'>
                    {tweetData.likes} Likes
                </div>
                <div className='rt-count mx-2'>
                    {tweetData.retweet_count} Retweets
                </div>
            </div>
        </div>
    )
}
