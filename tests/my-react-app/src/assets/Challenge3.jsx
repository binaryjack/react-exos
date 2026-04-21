import { useEffect, useState } from "react"


export function WindowWidthTracker() {
    // your code here
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleSetWidth = () => {
            const width =  window.innerWidth
            console.log('resizing',width)
            setWindowWidth(width)
        }
      
        window.addEventListener('resize', handleSetWidth)
        
        return () => {
            window.removeEventListener('resize', handleSetWidth )
        }
    }, [])

    return <div>windowWidth : {windowWidth }</div>
}