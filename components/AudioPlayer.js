import React, {useState, useRef, useEffect} from 'react'
import styles from '../styles/AudioPlayer.module.css'
import {BsArrowLeftShort, BsFolder} from 'react-icons/bs'
import {BsArrowRightShort} from 'react-icons/bs'
import {BsFillPlayFill} from 'react-icons/bs'
import {BsFillPauseFill} from 'react-icons/bs'
import sound from '../resources/KayshaBPFQMM.mp3'
const AudioPlayer = () => {
    //state
   const [isPlaying, setIsPlaying] = useState(false);
   const [duration, setDuration] = useState(0); 
   const [currentTime, setCurrentTime] = useState(0);

    //references
   const audioPlayer = useRef(); // audioPlayer reference
   const progressBar = useRef(); //audioComp Reference
   const animationRef = useRef(); // reference animation
   useEffect( () => {
       const seconds = Math.floor(audioPlayer.current.duration);
       setDuration(seconds);
        progressBar.current.max = seconds;
   }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState])
   
   const togglePlayPause = () => {
        const prevValue = isPlaying;
        setIsPlaying(!prevValue)
        if(!prevValue){
            audioPlayer.current.play();
            animationRef.current = requestAnimationFrame(whilePlaying)
        }
        else{
            audioPlayer.current.pause();
            cancelAnimationFrame(animationRef.current);
        }
   }

   const calculateTime = (secs) => {
       const minutes = Math.floor(secs/60);
       const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
       const seconds = Math.floor(secs % 60);
       const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
       return `${returnedMinutes}:${returnedSeconds}`
    }
   
    const whilePlaying = () => {
        progressBar.current.value = audioPlayer.current.currentTime;
        changePlayerCurrentTime();
        animationRef.current = requestAnimationFrame(whilePlaying)
    }

    const changePlayerCurrentTime = () => {
        progressBar.current.style.setProperty('--seek-before-width', `${progressBar.current.value / duration * 100}%`)
        setCurrentTime(progressBar.current.value)
    }
   
    const changeRange = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        changePlayerCurrentTime();
    }
    return (
        <div className={styles.audioPlayer}>
            <audio ref={audioPlayer} src={sound} type="audio/mpeg"> </audio>
            <button className={styles.forwardBackward}><BsArrowLeftShort /> 30 </button>
            <button className={styles.playPause} onClick={togglePlayPause}>
                {isPlaying ? <BsFillPauseFill /> : <BsFillPlayFill />}
            </button>
            <button className={styles.forwardBackward}><BsArrowRightShort /> 30</button>
        

            {/* current time */}
            <div className={styles.currentTime}>{calculateTime(currentTime)}</div>
            
            {/*progress bar*/}
            <div>
                <input ref={progressBar} className={styles.progressBar} type="range" defaultValue="0" onChange={changeRange}/>
            </div>

            {/* duration */}
            <div className={styles.duration}>{calculateTime(duration)}</div>

        </div>
    )
}

export { AudioPlayer }
