import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { Ingredient } from '../lib/Objects'
import { Assets, Texture } from 'pixi.js'

function Food({ ingredient, spriteRef, isColliding, addToCurrentRecipe, position }: { ingredient: Ingredient; spriteRef: any; isColliding: boolean; addToCurrentRecipe: (ingredient: Ingredient) => void; position: { x: number; y: number } }) {
    const [texture, setTexture] = useState(Texture.EMPTY)
    const localSpriteRef = useRef(null)
    
    const onDragMove = useCallback((event) => {
        if (localSpriteRef.current?.dragging) {
            const newPosition = localSpriteRef.current.data.getLocalPosition(localSpriteRef.current.parent);
            localSpriteRef.current.x = newPosition.x;
            localSpriteRef.current.y = newPosition.y;
        }
    }, [])

    useEffect(() => {
        window.addEventListener('pointermove', onDragMove);
        if (localSpriteRef.current && spriteRef) {
            spriteRef(localSpriteRef.current);
        }
        return () => {
            window.removeEventListener('pointermove', onDragMove);
        }
    }, [spriteRef, onDragMove]);

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
    const onDragEnd = useCallback((event) => {
        localSpriteRef.current.dragging = false;
        localSpriteRef.current.data = null;
        localSpriteRef.current.x = position.x;
        localSpriteRef.current.y = position.y;
        if (isColliding) {
            addToCurrentRecipe(ingredient)
        }
    }, [isColliding, addToCurrentRecipe, ingredient, position]) 
  return (
        <pixiSprite
            ref={localSpriteRef}
            anchor={0.5}
            eventMode={'static'}
            onPointerDown={onDragStart}
            onPointerUp={onDragEnd}
            texture={texture}
            scale={3}
            x={position.x}
            y={position.y} 
        />
  )
}

export default memo(Food)