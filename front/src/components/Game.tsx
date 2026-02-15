import {
    Ticker,
    Assets,
    BlurFilter,
} from 'pixi.js'
import Food from '../sprites/Food';
import { Ingredient } from '../lib/Objects';
import CookingPot from '../sprites/CookingPot';
import { useEffect, useRef, useState, useCallback } from 'react';
import { checkRecipeMatch, Ingredients } from '../lib/CookingFunctions';
import Book from './Book';
import BookToggle from '../sprites/BookToggle';
import IngredientList from './IngredientList';

function Game() {
  const ingredientRefs = useRef<any[]>([])
  const potRef = useRef<any>(null)
  const ticker = Ticker.shared;
  const [collision, setCollision] = useState<any>({detected: false, ingredient: null})
  const [currentRecipe, setCurrentRecipe] = useState<Ingredient[]>([])
  const [bgTexture, setBgTexture] = useState<any>(null)
  const bgSpriteRef = useRef<any>(null)
  const [isCooking, setIsCooking] = useState(false)
  const [recipeResult, setRecipeResult] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [showBook, setShowBook] = useState(false)
  const [collidingIndices, setCollidingIndices] = useState<Set<number>>(new Set())



  useEffect(() => {
    Assets.load('./sprites/BG.jpg').then((texture) => {
      setBgTexture(texture)
    })
  }, [])

  useEffect(() => {
    if (bgSpriteRef.current) {
      const blurFilter = new BlurFilter();
      blurFilter.blur = 10;
      (bgSpriteRef.current as any).filters = [blurFilter];
    }
  }, [bgTexture])

  const checkCollision  = useCallback((object1: any, object2: any) => {
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }, [])
  
  const addToCurrentRecipe = useCallback((ingredient: Ingredient) => {
    setCurrentRecipe((prev: Ingredient[]) => {
      if (prev.length >= 3 || isCooking) return prev
      return [...prev, ingredient]
    })
  }, [isCooking])

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
    const handleTick = () => {
      if (ingredientRefs.current && potRef.current) {
          let collisionDetected = false;
          const newCollidingIndices = new Set<number>();
          ingredientRefs.current.forEach((ingredientRef: any, index: number) => {
            if (ingredientRef && checkCollision(ingredientRef, potRef.current)) {
                collisionDetected = true;
                newCollidingIndices.add(index);
            }
          })
          setCollision({detected: collisionDetected, ingredient: collisionDetected ? ingredientRefs.current[0] : null});
          setCollidingIndices(newCollidingIndices);
      }
    };
    
    ticker.add(handleTick);
    ticker.start();
    
    return () => {
      ticker.remove(handleTick);
    }
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
          {currentRecipe.map((ingredient: Ingredient, index: number) => (
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
      <IngredientList addToCurrentRecipe={addToCurrentRecipe} ingredientRefs={ingredientRefs} collidingIndices={collidingIndices}/>
      <BookToggle BookToggled={showBook} setBookToggled={setShowBook  }/>
      {showBook && <Book />}
      
    </>
  )
}



export default Game