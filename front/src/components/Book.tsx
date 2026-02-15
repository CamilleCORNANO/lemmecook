import { Assets } from 'pixi.js'
import { useEffect, useState } from 'react'
import { Recipes } from '../lib/CookingFunctions'
import '@pixi/layout';


const Book = () => {
    const [recipes, setRecipes] = useState<any>(Recipes)
    const [bookLeftSprite, setBookLeftSprite] = useState<any>(null)
    const [bookRightSprite, setBookRightSprite] = useState<any>(null)
    const [bookCoverSprite, setBookCoverSprite] = useState<any>(null)
    const [ingredientTextures, setIngredientTextures] = useState({} as Record<string, any>)

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

    useEffect(() => {
        const loadIngredientTextures = async () => {
            const textures: Record<string, any> = {}
            for (const recipe of recipes) {
                for (const ingredient of recipe.ingredients) {
                    if (!textures[ingredient.name]) {
                        try {
                            const texture = await Assets.load({
                                alias: ingredient.name,
                                src: ingredient.image,
                                data: {
                                    scaleMode: 'nearest',
                                },
                            })
                            textures[ingredient.name] = texture
                        } catch (e) {
                            console.error(`Failed to load ${ingredient.name}`, e)
                        }
                    }
                }
            }
            setIngredientTextures(textures)
        }
        loadIngredientTextures()
    }, [])

    return (
        <pixiContainer
            y={window.innerHeight / 4}
            x={window.innerWidth / 3}
            scale={3}
        >
            {bookCoverSprite && <pixiSprite texture={bookCoverSprite}   >
                {bookLeftSprite && <pixiSprite texture={bookLeftSprite} anchor={{x:-0.07, y: -0.04}}  x={104}/>}
                {bookRightSprite && <pixiSprite texture={bookRightSprite} anchor={{x:-0.07, y: -0.04}} >
                    <layoutContainer
                        scale={0.3}
                        x={-215}
                        y={-145}
                        layout={{
                            width: 650,
                            height: 440,
                            flexWrap: 'wrap',
                            gap: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            overflow: 'scroll',
                        }}
                    >
                        {recipes.map((recipe, recipeIndex) => (
                            <layoutContainer key={recipeIndex} 
                                layout={{
                                    gap: 4,
                                    width: 300,
                                    height: 60,
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <layoutText
                                    text={recipe.name}
                                    layout={{
                                        width: 300,
                                        height: 20,
                                    }}
                                    style={{
                                        fill: 'black',
                                        fontSize: 10,
                                        fontFamily: 'pixel-font',
                                    }}
                                    resolution={2}
                                />
                                <layoutContainer y={8}
                                    layout={{
                                        gap: 4,
                                    }}
                                >
                                    {recipe.ingredients.map((ingredient, ingredientIndex) => (
                                        ingredientTextures[ingredient.name] && (
                                            <layoutSprite
                                                key={ingredientIndex}
                                                layout={{
                                                    width: 26,
                                                    height: 26,
                                                }}
                                                texture={ingredientTextures[ingredient.name]}
                                            />
                                        )
                                    ))}
                                </layoutContainer>
                            </layoutContainer>
                        ))}
                    </layoutContainer>
                </pixiSprite>} 
            </pixiSprite>}

        </pixiContainer>
  )
}

export default Book
