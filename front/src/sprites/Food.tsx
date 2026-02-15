import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { Ingredient } from '../lib/Objects'
import { Assets, Texture } from 'pixi.js'

function Food({ ingredient, spriteRef, isColliding, addToCurrentRecipe, position }: { ingredient: Ingredient; spriteRef: any; isColliding: boolean; addToCurrentRecipe: (ingredient: Ingredient) => void; position: { x: number; y: number } }) {
    const [texture, setTexture] = useState(Texture.EMPTY)
    const localSpriteRef = useRef<any>(null)
    
    const onDragMove = useCallback((event: any) => {
        if (localSpriteRef.current?.dragging) {
            const newPosition = (localSpriteRef.current as any).data.getLocalPosition((localSpriteRef.current as any).parent);
            (localSpriteRef.current as any).x = newPosition.x;
            (localSpriteRef.current as any).y = newPosition.y;
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

    const onDragStart = (event: any) => {
        (localSpriteRef.current as any).data = event.data;
        (localSpriteRef.current as any).dragging = true;
    }
    const onDragEnd = useCallback((event: any) => {
        (localSpriteRef.current as any).dragging = false;
        (localSpriteRef.current as any).data = null;
        (localSpriteRef.current as any).x = position.x;
        (localSpriteRef.current as any).y = position.y;
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