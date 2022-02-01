import moment from 'moment'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Popconfirm } from 'antd'

export default function Tweet({ tweetData, likeTweet, reTweet, depthIndex, isDummy, deleteTweet }){
    const [showDeleteIcon, setShowDeleteIcon] = useState(false);

    useEffect(() => {
        let localUsername = localStorage.getItem('username')
        if (localUsername && localUsername === tweetData.user.user_name && depthIndex === 0 && !isDummy) {
            setShowDeleteIcon(true)
        }
    }, [tweetData])

    return (
        <div className='tweet-block'>
            <div>
                <div className='user-icon'>
                    <Link href={`/user/${tweetData.user.user_name}`}>
                        <a className='d-flex align-items-end'>
                            {tweetData.user.profile_pic
                                ? <Image src={tweetData.user.profile_pic} width={40} height={40} className="user-dp" /> 
                                : <i className='fa-solid fa-user user-icon-color'></i>}
                        </a>
                    </Link>
                </div>
            </div>
            <div className='tweet-right-block'>
                <div className='username-outer-layout'>
                    <Link href={`/user/${tweetData.user.user_name}`}>
                        <a className='username-inner-layout'>
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
                {'image' in tweetData && tweetData.image && <div className='image-cover'>
                    <img src={tweetData.image} className="tweet-image" />
                </div>}
                {depthIndex < 1 && <div>
                    {tweetData.retweet_obj &&
                        <Tweet
                            tweetData={tweetData.retweet_obj}
                            likeTweet={likeTweet}
                            depthIndex={depthIndex + 1}
                            isDummy={isDummy}
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
            {showDeleteIcon && <div className='delete-icon'>
                <Popconfirm
                    title={"Are you sure you want to delete this tweet?"}
                    onConfirm={() => { deleteTweet(tweetData.id) }}
                    okText="Yes"
                    cancelText="No"
                    placement="top"
                >
                    <i className='fa-solid fa-trash-can'></i>
                </Popconfirm>
            </div>}
        </div>
    )
}
