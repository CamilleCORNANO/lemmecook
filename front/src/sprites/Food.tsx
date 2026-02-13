import { useEffect, useRef, useState } from 'react'
import { Ingredient } from '../lib/Objects'
import { Assets, Texture } from 'pixi.js'

export default function Food({ ingredient, spriteRef, isColliding, addToCurrentRecipe, position }: { ingredient: Ingredient; spriteRef: any; isColliding: boolean; addToCurrentRecipe: (ingredient: Ingredient) => void; position: { x: number; y: number } }) {
    const [texture, setTexture] = useState(Texture.EMPTY)
    const localSpriteRef = useRef(null)
    
    const onDragMove = (event) => {
        if (localSpriteRef.current.dragging) {
            const newPosition = localSpriteRef.current.data.getLocalPosition(localSpriteRef.current.parent);
            localSpriteRef.current.x = newPosition.x;
            localSpriteRef.current.y = newPosition.y;
        }
    } 

    useEffect(() => {
        window.addEventListener('pointermove', onDragMove);
        if (localSpriteRef.current && spriteRef) {
            spriteRef(localSpriteRef.current);
        }
    }, [spriteRef]);

    useEffect(() => {
        if (texture === Texture.EMPTY) {
            Assets
                .load({
                    alias: ingredient.name,
                    src: ingredient.image,
                    data: {
                        scaleMode: 'nearest',
                    },
                })
                .then((result) => {
                    setTexture(result)
                });
        }
    }, [texture]);

    const onDragStart = (event) => {
        localSpriteRef.current.data = event.data;
        localSpriteRef.current.dragging = true;
    }
    const onDragEnd = (event) => {
        localSpriteRef.current.dragging = false;
        localSpriteRef.current.data = null;
        localSpriteRef.current.x = position.x;
        localSpriteRef.current.y = position.y;
        if (isColliding) {
            addToCurrentRecipe(ingredient)
        }
    } 
  return (
        <pixiSprite
            ref={localSpriteRef}
            anchor={0.5}
            eventMode={'static'}
            onPointerDown={onDragStart}
            onPointerUp={onDragEnd}
            scale={3}
            texture={texture}
            x={position.x}
            y={position.y} 
        />
  )
}