import { useRef, useState, type RefObject } from 'react'
import { Ingredients } from '../lib/CookingFunctions';
import { Ingredient } from '../lib/Objects';
import Food from '../sprites/Food';

const IngredientList = ( {addToCurrentRecipe, ingredientRefs, collidingIndices}: {addToCurrentRecipe: (ingredient: Ingredient) => void, ingredientRefs: RefObject<any[]>, collidingIndices: Set<number>} ) => {
    const ingredients = Object.values(Ingredients)
    const ingredientListRef = useRef(null)
    
    return (
        <pixiContainer >
            <pixiGraphics
                draw={(g) => {
                g.rect(0, 0, 250, window.innerHeight );
                g.fill('rgba(0, 0, 0)');
                }}
            />
            {
                ingredients.map((ingredient, index) => (
                <pixiContainer key={ingredient.name} ref={ingredientListRef}>
                    <Food ingredient={ingredient} isColliding={collidingIndices.has(index)}  spriteRef={(ref) => ingredientRefs?.current && (ingredientRefs.current[index] = ref)} addToCurrentRecipe={addToCurrentRecipe} position={{ x: index%2 === 0 ? 75 : 175, y: 110 * (Math.floor(index / 2) + 1) }} />
                    <pixiText
                    text={ingredient.name}
                    anchor={0.5}
                    x={index%2 === 0 ? 75 : 175}
                    y={110 * (Math.floor(index / 2) + 1) + 55}
                    scale={0.5}
                    style={{ fill: 'white', fontSize: 18, fontFamily: 'pixel-font'}}
                    />
                </pixiContainer>
                ))
            }
            </pixiContainer>
  )
}

export default IngredientList
