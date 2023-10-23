import React, { useState, useEffect } from "react";
import axios from "axios";
import youtubelogo from "../../assets/youtubeicon.svg";
import playicon from "../../assets/solar_play-bold.svg";
import loadingGif from "../../assets/loading.svg";
import toprated from '../../assets/toprated.svg';
import eyeicon from '../../assets/eye.svg';
import likeicon from '../../assets/like.svg';
import commenticon from '../../assets/comment.svg';
import styles from "./Form.module.css";

const baseURL = "https://youtube.googleapis.com/youtube/v3";

const regExp =
  /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

const STATUS_VALUE = {
  INITIAL: "initial",
  LOADING: "loading",
  COMPLETED: "completed",
};

export default function Form() {
  const [dots, setDots] = useState(".");
  const [status, setStatus] = useState(STATUS_VALUE.INITIAL);
  const [topVideo, setTopVideo] = useState(undefined);
  const [videosDataArray, setVideosDataArray] = useState([]);
  const [url, setUrl] = useState("");
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        switch (prevDots) {
          case ".":
            return ". .";
          case ". .":
            return ". . .";
          case ". . .":
            return ".";
          default:
            return ".";
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchDataByVideoID = async (ID) => {
    try {
      const response = await axios.get(
        `${baseURL}/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${ID}&key=${apiKey}`
      );
      if (response.status === 200) {
        const item = {
          statistics: response.data.items[0].statistics,
          title: response.data.items[0].snippet.title,
          publishedAt: response.data.items[0].snippet.publishedAt,
          thumbnailURL: response.data.items[0].snippet.thumbnails.default.url,
          earnings:
            Math.min(
              response.data.items[0].statistics.viewCount,
              subscriberCount
            ) +
            response.data.items[0].statistics.likeCount * 5 +
            response.data.items[0].statistics.commentCount * 10,
        };
        return item;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getVideoData = async () => {
    setStatus(STATUS_VALUE.LOADING);
    try {
      const id = youtubeURLParser(url);
      const response = await axios.get(
        `${baseURL}/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${apiKey}`
      );
      if (response.status === 200) {
        const channelId = response.data.items[0].snippet.channelId;
        const [channelResponse, innerResponse] = await Promise.all([
          axios.get(
            `${baseURL}/channels?part=statistics&id=${channelId}&key=${apiKey}`
          ),
          axios.get(
            `${baseURL}/search?part=snippet&channelId=${channelId}&maxResults=15&order=date&key=${apiKey}`
          ),
        ]);

        if (channelResponse.status === 200) {
          setSubscriberCount(
            channelResponse.data.items[0].statistics.subscriberCount
          );
        }

        if (innerResponse.status === 200) {
          const videoDataArray = await Promise.all(
            innerResponse.data.items.map(async (item) => {
              const data = await fetchDataByVideoID(item.id.videoId);
              return data;
            })
          );
          const mainVideo = {
            title: response.data.items[0].snippet.title,
            statistics: response.data.items[0].statistics,
            publishedAt: response.data.items[0].snippet.publishedAt,
            thumbnailURL: response.data.items[0].snippet.thumbnails.default.url,
            earnings:
              Math.min(
                response.data.items[0].statistics.viewCount,
                subscriberCount
              ) +
              response.data.items[0].statistics.likeCount * 5 +
              response.data.items[0].statistics.commentCount * 10,
          };
          setTopVideo(mainVideo);
          setVideosDataArray([...videoDataArray]);
          setStatus(STATUS_VALUE.COMPLETED);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const youtubeURLParser = (url) => {
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    } else {
      throw new Error("Invalid URL");
    }
  };

  function getSimpleDate(str) {
    const originalDate = new Date(str);
    return originalDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <main className={styles.mainSection}>
      {status === STATUS_VALUE.INITIAL && (
        <>
          <div className={styles.boxContainer}>
            <h1>Discover your earning potential</h1>
            <h2>
              Turn your Youtube expertise into a lucrative income through
              resource sharing
            </h2>
            <div className={styles.inputBoxContainer}>
              <div className={styles.inputBox}>
                <img src={youtubelogo} alt="Youtube logo" />
                <input
                  type="text"
                  placeholder="enter youtube video link"
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <button className={styles.btn} onClick={getVideoData}>
                Earnings
              </button>
            </div>
          </div>
          <div className={styles.circleDivContainer}>
            <div className={styles.playicon}>
              <img src={playicon} alt="playicon" />
            </div>
          </div>
        </>
      )}
      {status === STATUS_VALUE.LOADING && (
        <div className={styles.loading}>
          <div>
            <img src={loadingGif} alt="Loading image" />
            <div>Loading {dots} </div>
          </div>
        </div>
      )}
      {status === STATUS_VALUE.COMPLETED && (
        <div className={styles.completed}>
          <div className={styles.mainVideo}>
            <div className={styles.mainVideoDetails}>
              <div className={styles.thumbnailSide}>
                <div className={styles.topRatedText}><img src={toprated} atl='toprated logo'/>Top earner video</div>
                <img src={topVideo.thumbnailURL} alt="thumbnail" />
                <div className={styles.dateText}>Uploaded on - {getSimpleDate(topVideo.publishedAt)}</div>
              </div>
              <div className={styles.videoStats}>
                <h1>{topVideo.title}</h1>
                <div>
                  <div><img src={eyeicon} alt="image" />{topVideo.statistics.viewCount}</div>
                  <div><img src={likeicon} alt="image" />{topVideo.statistics.likeCount}</div>
                  <div><img src={commenticon} alt="image" />{topVideo.statistics.commentCount}</div>
                </div>
              </div>
            </div>
            <div className={styles.earningsDiv}>
              <div className={styles.earnings}>&#8377; {topVideo.earnings}</div>
              <div className={styles.checkOtherBtn} onClick={()=>setStatus(STATUS_VALUE.INITIAL)}>Check another</div>
            </div>
          </div>
          <div className={styles.otherVideos}>
            <p>Other Videos Potentials</p>
            <div className={styles.headerRow}>
              <div className={styles.boxFlex1}>Rank</div>
              <div className={styles.title}>Title</div>
              <div className={styles.boxFlex1}>Thumbnail</div>
              <div className={styles.boxFlex1}>Views</div>
              <div className={styles.boxFlex1}>Likes</div>
              <div className={styles.boxFlex1}>Comments</div>
              <div className={styles.boxFlex1}>Uploaded on</div>
              <div className={styles.boxFlex1}>*Estimated Earnings</div>
            </div>
            {videosDataArray.map((video, index) => (
              <div className={styles.dataRow} key={index}>
                <div className={styles.boxFlex1}>{index + 1}</div>
                <div className={styles.title}>{video.title}</div>
                <div className={styles.boxFlex1}>
                  <img src={video.thumbnailURL} alt="thumbnail" />
                </div>
                <div className={styles.boxFlex1}>
                  {video.statistics.viewCount}
                </div>
                <div className={styles.boxFlex1}>
                  {video.statistics.likeCount}
                </div>
                <div className={styles.boxFlex1}>
                  {video.statistics.commentCount}
                </div>
                <div className={styles.boxFlex1}>
                  {getSimpleDate(video.publishedAt)}
                </div>
                <div className={styles.boxFlex1}>&#8377; {video.earnings}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

// https://www.youtube.com/watch?v=cjWxZKShuWg
