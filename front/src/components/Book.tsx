import { Assets } from 'pixi.js'
import React, { useEffect, useState } from 'react'

const Book = () => {
    const [recipes, setRecipes] = useState([])
    const [bookLeftSprite, setBookLeftSprite] = useState(null)
    const [bookRightSprite, setBookRightSprite] = useState(null)
    const [bookCoverSprite, setBookCoverSprite] = useState(null)

    useEffect(() => {
        Assets.load({
            alias: 'BookLeft',
            src: './sprites/BookLeft.png',
            data: {
                scaleMode: 'nearest',
            },
        }).then((texture) => {setBookLeftSprite(texture) })
        Assets.load({
            alias: 'BookRight',
            src: './sprites/BookRight.png',
            data: {
                scaleMode: 'nearest',
            },
        }).then((texture) => {setBookRightSprite(texture) }) 
        Assets.load({
            alias: 'BookCover',
            src: './sprites/BookCover.png',
            data: {
                scaleMode: 'nearest',
            },
        }).then((texture) => {setBookCoverSprite(texture) })
    }, [])
    return (
        <pixiContainer
            y={window.innerHeight / 4}
            x={window.innerWidth / 3}
            scale={3}
        >
            {bookCoverSprite && <pixiSprite texture={bookCoverSprite}   >
                {bookLeftSprite && <pixiSprite texture={bookLeftSprite} anchor={{x:-0.07, y: -0.04}}  x={104}/>}
                {bookRightSprite && <pixiSprite texture={bookRightSprite} anchor={{x:-0.07, y: -0.04}} />} 
            </pixiSprite>}

        </pixiContainer>
  )
}

export default Book
