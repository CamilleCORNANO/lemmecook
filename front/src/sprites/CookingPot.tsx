import { useEffect, useState } from 'react'
// import { Ingredient } from '../lib/Objects'
import {  Assets, Texture } from 'pixi.js'
import { } from '@pixi/react';

const CookingPot = ({ spriteRef, hover, isCooking }: { spriteRef: any, hover: boolean, isCooking: boolean }) => {

    const [texture, setTexture] = useState(Texture.EMPTY)
    const [animatedTexture, setAnimatedTexture] = useState([] as Texture[])

    useEffect(() => {
        Assets
            .load({
                alias: 'Pot',
                src: './sprites/Pot.png',
                data: {
                    scaleMode: 'nearest',
                },
            })
            .then((result) => {
                setTexture(result)
            });

        Promise.all([
            Assets.load({
                alias: 'PotFire1',
                src: './sprites/Pot-Fire1.png',
                data: {
                    scaleMode: 'nearest',
                },
            }),
            Assets.load({
                alias: 'PotFire2',
                src: './sprites/Pot-Fire2.png',
                data: {
                    scaleMode: 'nearest',
                },
            }),
        ]).then(([fire1, fire2]) => {
            setAnimatedTexture([fire1, fire2])
        });
    }, []);

    useEffect(() => {
        if (isCooking && spriteRef.current && animatedTexture.length > 0) {
            spriteRef.current.play()
        }
    }, [isCooking, animatedTexture])
    return (
        !isCooking ? (
            <pixiSprite
                ref={spriteRef}
                anchor={0.5}
                eventMode={'static'}
                scale={hover ? 5.5 : 5}
                texture={texture}
            />
        ) : (
            <pixiAnimatedSprite
                ref={spriteRef}
                anchor={0.5}
                eventMode={'static'}
                scale={5}
                textures={animatedTexture}
                animationSpeed={0.1}
            />
        )
    )
}

export default CookingPot
