import React from 'react'
import { Assets } from 'pixi.js'

const BookToggle = ({BookToggled, setBookToggled}: {BookToggled: boolean, setBookToggled: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [bookToggledSprite, setBookToggledSprite] = React.useState(undefined)
    const [bookClosedSprite, setBookClosedSprite] = React.useState(undefined)
    
    React.useEffect(() => {
        Assets.load({
            alias: 'BookToggled',
            src: './sprites/Book_toggle2.png',
            data: {
                scaleMode: 'nearest',
            },
        }).then((texture) => {setBookToggledSprite(texture) })
        Assets.load({
            alias: 'BookClosed',
            src: './sprites/Book_toggle1.png',
            data: {
                scaleMode: 'nearest',
            },
        }).then((texture) => {setBookClosedSprite(texture) }) 
    }, [])

  return (
    <pixiSprite
        anchor={0.5}
        texture={BookToggled ? bookToggledSprite : bookClosedSprite}
        x={window.innerWidth - 20}
        y={window.innerHeight - 20}
        scale={3}
        eventMode={'static'}
        onPointerDown={() => setBookToggled(!BookToggled)}
    />
  )
}

export default BookToggle
