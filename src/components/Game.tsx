import { SpringValue, animated } from '@react-spring/web'

type GameProps = {
  attempts: number
  gameState: 'idle' | 'processing' | 'finished'
  animationProps: {
    opacity: SpringValue<number>
    transform: SpringValue<string>
  }
}

function Game({ attempts, gameState, animationProps }: GameProps) {

  return (
    <animated.div className='card' style={animationProps}>
      <h2>Attempts</h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <p>It took</p>
        <div style={{ fontSize: '2em' }}>
          {gameState === 'processing'
            ? 'Calculating...'
            : attempts.toLocaleString()}
        </div>
        <p>attempts to win the lotto.</p> <p>That would have cost you:</p>
        <div style={{ fontSize: '2em' }}>
          {gameState === 'processing'
            ? 'Calculating...'
            : `$${(attempts * 2).toLocaleString()}`}
        </div>
      </div>
    </animated.div>
  )
}

export default Game
