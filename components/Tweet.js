import moment from 'moment'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Tweet({ tweetData, likeTweet, reTweet, depthIndex, isDummy }){
    return (
        <div className='tweet-block'>
            <div>
                <div className='user-icon'>
                    <Link href={`/user/${tweetData.user.user_name}`}>
                        <a className='d-flex align-items-end'>
                            <i className='fa-solid fa-user user-icon-color'></i>
                        </a>
                    </Link>
                </div>
            </div>
            <div>
                <div className='d-flex align-items-end'>
                    <Link href={`/user/${tweetData.user.user_name}`}>
                        <a className='d-flex align-items-end'>
                            <div className='user-full-name'>
                                {`${tweetData.user.first_name} ${tweetData.user.last_name}`}
                            </div>
                            {/* <span className='center-dot'>&#183;</span> */}
                            <div className='username'>
                                {`@${tweetData.user.user_name}`}
                            </div>
                        </a>
                    </Link>
                    <span className='center-dot'>&#183;</span>
                    <div className='date'>
                        {moment(tweetData.timestamp).fromNow()}
                    </div>
                </div>
                <div className='tweet-text'>
                    {tweetData.content}
                </div>
                {'image' in tweetData && tweetData.image && <div className='image-block' >
                    <Image src={tweetData.image} layout='fill' objectFit='contain' />
                </div>}
                {depthIndex <= 1 && <div>
                    {tweetData.retweet_obj &&
                        <Tweet
                            tweetData={tweetData.retweet_obj}
                            likeTweet={likeTweet}
                            depthIndex={depthIndex + 1}
                            isDummy={true}
                            reTweet={reTweet}
                        />}
                </div>}
                <div className='d-flex mt-2'>
                    <div className={'like-count' + (!isDummy ? ' cursor-pointer' : '')}
                        onClick={() => !isDummy ? likeTweet(tweetData.id, tweetData.is_liked) : null}>
                        <i className={`fa-${tweetData.is_liked ? "solid": "regular"} fa-heart`}></i>
                        <span className='mx-1'>{tweetData.likes}</span>
                    </div>
                    <div className={'rt-count mx-2' + (!isDummy ? ' cursor-pointer' : '')}
                        onClick={() => !isDummy ? reTweet(tweetData) : null}
                    >
                        <i className='fa-solid fa-retweet'></i>
                        <span className='mx-1'>{tweetData.retweet_count}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
