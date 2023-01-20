import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
        
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()

    }
    else if(e.target.id === 'reply-btn'){
        handleReplyBtnClick(e.target.dataset.replybtn)
        // console.log(e.target.dataset.replybtn) gives the same uuid as the tweet
    }
    else if (e.target.dataset.delete){
        handleDeleteTweet(e.target.dataset.delete)
    }
})

function getTargetTweetObj(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    return targetTweetObj
    
}
function handleLikeClick(tweetId){ 
    const targetTweetObj = getTargetTweetObj(tweetId)

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = getTargetTweetObj(tweetId)
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    let replies = document.getElementById(`replies-${replyId}`)
    replies.classList.toggle('hidden')

}

function handleReplyBtnClick(tweetId){
    const targetTweetObj = getTargetTweetObj(tweetId)
    console.log(tweetId)
    
 
    const replyInput = document.getElementById(`reply-input-${tweetId}`)
    // console.log(replyInput.value)

    if (replyInput.value){
        tweetsData.unshift({
            handle: `@randomperson`,
            profilePic: `./images/randomperson.png`,
            likes: 0,
            retweets: 0,
            tweetText: `${targetTweetObj.handle} ` + replyInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    replyInput.value = ''

    }
   
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@randomperson`,
            profilePic: `./images/randomperson.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleDeleteTweet(tweetId){
    for (let i in tweetsData ){
        if (tweetsData[i].uuid == tweetId){
            tweetsData.splice(i,1)
        }
    }
    // For splice () the first argument is the index of the element to remove, 
    // the second argument is the number of elements to remove.
    render()
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){


    let likeIconClass = ''
    
    if (tweet.isLiked){
        likeIconClass = 'liked'
    }
    
    let retweetIconClass = ''
    
    if (tweet.isRetweeted){
        retweetIconClass = 'retweeted'
    }
    
    let repliesHtml = ''
    
    if(tweet.replies.length > 0){
        tweet.replies.forEach(function(reply){
            repliesHtml+=`
            <div class="tweet-reply">
                <div class="tweet-inner">
                    <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
            </div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <div class="handle-line">
                <p class="handle">${tweet.handle}</p> 
                <i class="fa-solid fa-trash" data-delete="${tweet.uuid}"></i>
            </div>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        <div class="tweet-reply">
            <div class="tweet-inner">
            <img src="images/randomperson.png" class="profile-pic">
                <div>
                    <p class="handle">@randomperson</p>
                    <textarea placeholder="Reply to ${tweet.handle}'s tweet" class="reply-input-area" id="reply-input-${tweet.uuid}"></textarea>
                    <button id="reply-btn" data-replybtn="${tweet.uuid}">Reply</button>

                </div>
            </div>
        </div>
        ${repliesHtml}

    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

