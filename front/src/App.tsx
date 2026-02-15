import './App.css'
import {
    Application,
    extend,
} from '@pixi/react';
import {
    Container,
    Graphics,
    Sprite,
    Ticker,
    Text,
    AnimatedSprite
} from 'pixi.js';
import { useRef, useEffect } from 'react';
import Game from './components/Game';
import { LayoutContainer, LayoutSprite, LayoutText } from '@pixi/layout/components';
import '@pixi/layout/react';


extend({
    Container,
    Graphics,
    Sprite,
    LayoutContainer,
    LayoutSprite,
    LayoutText,
    AnimatedSprite,
    Ticker,
    Text
});

function App() {
  const app = useRef<any>(null)

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (app.current) {
        (app.current as any).getApplication().renderer.resize(window.innerWidth, window.innerHeight);
      }
    })
  })

  return (
    <Application ref={app} width={window.innerWidth} height={window.innerHeight}>
      <Game/>
    </Application>
  )
}



export default App