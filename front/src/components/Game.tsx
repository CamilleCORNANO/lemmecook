import {
    Ticker,
    Assets,
    BlurFilter,
} from 'pixi.js'
import Food from '../sprites/Food';
import { Ingredient } from '../lib/Objects';
import CookingPot from '../sprites/CookingPot';
import { useEffect, useRef, useState } from 'react';
import { checkRecipeMatch } from '../lib/CookingFunctions';
import Book from './Book';
const Ingredients = [
    new Ingredient('Tomato', './sprites/Tomato.png'),
    new Ingredient('Chicken', './sprites/Chicken.png'),
    new Ingredient('Cheese', './sprites/Cheese.png'),
    new Ingredient('Eggs', './sprites/Eggs.png'),
]

function Game() {
  const ingredientRefs = useRef([])
  const potRef = useRef(null)
  const ingredientListRef = useRef(null)
  const ticker = Ticker.shared;
  const [collision, setCollision] = useState({detected: false, ingredient: null})
  const [currentRecipe, setCurrentRecipe] = useState([])
  const [collidingIndices, setCollidingIndices] = useState(new Set())
  const [bgTexture, setBgTexture] = useState(null)
  const bgSpriteRef = useRef(null)
  const [isCooking, setIsCooking] = useState(false)
  const [recipeResult, setRecipeResult] = useState('')
  const [showResult, setShowResult] = useState(false)


  useEffect(() => {
    Assets.load('./sprites/BG.jpg').then((texture) => {
      setBgTexture(texture)
    })
  }, [])

  useEffect(() => {
    if (bgSpriteRef.current) {
      const blurFilter = new BlurFilter();
      blurFilter.blur = 10;
      bgSpriteRef.current.filters = [blurFilter];
    }
  }, [bgTexture])

  const checkCollision  = (object1, object2) => {
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();


    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }
  
  const addToCurrentRecipe = (ingredient: Ingredient) => {
    if (currentRecipe.length >= 3 || isCooking) return
    setCurrentRecipe([...currentRecipe, ingredient])
  }

  const handleCook = () => {
    if (currentRecipe.length < 2 || isCooking) return
    
    setIsCooking(true)
    
    // After 1 second of cooking animation, check the recipe
    setTimeout(() => {
      const matched = checkRecipeMatch(currentRecipe)
      setRecipeResult(matched)
      setShowResult(true)
      setIsCooking(false)
      
      // Clear after 2 seconds
      setTimeout(() => {
        setShowResult(false)
        setCurrentRecipe([])
        setRecipeResult('')
      }, 2000)
    }, 1000)
  }
  useEffect(() => {
    ticker.add(() => {
      if (ingredientRefs.current && potRef.current) {
          let collisionDetected = false;
          const newCollidingIndices = new Set();
          ingredientRefs.current.forEach((ingredientRef, index) => {
            if (checkCollision(ingredientRef, potRef.current)) {
                collisionDetected = true;
                newCollidingIndices.add(index);
            }
          })
          setCollision({detected: collisionDetected, ingredient: collisionDetected ? ingredientRefs.current[0] : null});
          setCollidingIndices(newCollidingIndices);
      }
    });
    ticker.start();
  }, [ticker]);

  return (
    <>
      {bgTexture && (
      <pixiSprite 
      ref={bgSpriteRef} 
      texture={bgTexture} 
      width={window.innerWidth} 
      height={window.innerHeight} 
      />
      )}
      <pixiContainer
      x={(window.innerWidth +250) / 2}
      y={window.innerHeight / 2} 
      >
      <CookingPot spriteRef={potRef} hover={collision.detected} isCooking={isCooking}/>
      <pixiContainer>
          {currentRecipe.map((ingredient, index) => (
          <pixiSprite
              key={index}
              texture={Assets.get(ingredient.name)}
              x={-20 + index * 10}
              y={0}
              scale={1}
          />
          ))
          }
      </pixiContainer>
      <pixiContainer
          eventMode={'static'}
          onPointerDown={handleCook}
      >
          <pixiGraphics
          draw={(g) => {
              g.svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 180"><path d="M474.6 145.6a177.7 177.7 0 0 1 0-111.2 10 10 0 0 0-10.3-13 2654.4 2654.4 0 0 1-428.6 0 10 10 0 0 0-10.3 13 177.6 177.6 0 0 1 0 111.2 10 10 0 0 0 10.3 13c142.6-11.5 286-11.5 428.6 0a10 10 0 0 0 10.3-13Z" fill="#880400"></path></svg>`)
          }}
          x={-125}
          y={80}
          scale={0.5}
          >
          <pixiText
              text={'COOK'}
              style={{ fill: 'white', fontSize: 50, fontFamily: 'pixel-font' }}
              anchor={{x: -0.65, y: -0.8}}
          />
          </pixiGraphics>
      </pixiContainer>
      {showResult && (
          <pixiContainer
          y={-200}
          alpha={1}
          >
          <pixiSprite
              texture={Assets.get(currentRecipe[0]?.name || 'Tomato')}
              scale={2}
              anchor={0.5}
          />
          <pixiText
              text={recipeResult}
              anchor={0.5}
              y={60}
              style={{ fill: 'white', fontSize: 24, fontFamily: 'pixel-font' }}
          />
          </pixiContainer>
      )} 
      </pixiContainer>
      <pixiContainer >
      <pixiGraphics
          draw={(g) => {
          g.rect(0, 0, 250, window.innerHeight );
          g.fill('rgba(0, 0, 0)');
          }}
      />
      {
          Ingredients.map((ingredient, index) => (
          <pixiContainer key={ingredient.name} ref={ingredientListRef}>
              <Food ingredient={ingredient} isColliding={collidingIndices.has(index)}  spriteRef={(ref) => ingredientRefs.current[index] = ref} addToCurrentRecipe={addToCurrentRecipe} position={{ x: index%2 === 0 ? 75 : 175, y: 100 * (Math.floor(index / 2) + 1) }} />
              <pixiText
              text={ingredient.name}
              anchor={0.5}
              x={index%2 === 0 ? 75 : 175}
              y={100 * (Math.floor(index / 2) + 1) + 50}
              scale={0.5}
              style={{ fill: 'white', fontSize: 18, fontFamily: 'pixel-font'}}
              />
          </pixiContainer>
          ))
      }
      </pixiContainer>
      {/* <Book /> */}
    </>
  )
}



export default Game