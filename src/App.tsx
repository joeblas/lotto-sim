import { useState, useEffect } from 'react'
import { useSpring, animated } from '@react-spring/web'
import LottoWorker from './workers/lottoWorker?worker'
import './App.css'
import Game from './components/Game'

function App() {
  const [worker, setWorker] = useState<Worker | null>(null)
  const [attempts, setAttempts] = useState<number>(0)
  const [gameState, setGameState] = useState<
    'idle' | 'processing' | 'finished'
  >('idle')
  const [ticketGenerated, setTicketGenerated] = useState<boolean>(false)

  const [card1Props, card1Api] = useSpring(() => ({
    opacity: 0,
    scale: 0,
    transform: 'translateY(50px)',
  }))

  const [card2Props, card2Api] = useSpring(() => ({
    opacity: 0,
    scale: 0,
    transform: 'translateY(50px)',
  }))

  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  const generateTicket = () => {
    const ticketNumbers: number[] = []

    // Generate 5 unique numbers for the white balls
    while (ticketNumbers.length < 5) {
      const randomNumber = getRandomNumber(1, 70)
      if (!ticketNumbers.includes(randomNumber)) {
        ticketNumbers.push(randomNumber)
      }
    }

    // Sort the numbers
    ticketNumbers.sort((a, b) => a - b)

    // Generate 1 number for the Mega Ball
    const megaBall = getRandomNumber(1, 25)

    return [...ticketNumbers, megaBall]
  }

  const [ticket, setTicket] = useState<number[]>([])

  const handleGenerateTicket = () => {
    const newTicket = generateTicket()
    setTicket(newTicket)
    setTicketGenerated(true)
  }

  const playGame = () => {
    if (worker) {
      setGameState('processing')
      worker.postMessage({ winningNumbers: ticket })
    }
  }

  const handlePlayGame = () => {
    playGame()
  }

  useEffect(() => {
    const lottoWorker = new LottoWorker() as unknown as Worker

    lottoWorker.onmessage = event => {
      setAttempts(event.data)
      setGameState('finished')
      card2Api.start({
        opacity: 1,
        scale: 1,
        transform: 'translateY(0)',
      })
    }

    setWorker(lottoWorker)

    return () => {
      lottoWorker.terminate()
    }
  }, [card2Api])

  useEffect(() => {
    if (ticketGenerated) {
      card1Api.start({
        opacity: 1,
        transform: 'translateY(0)',
        scale: 1,
      })
    }
  }, [card1Api, ticketGenerated])

  return (
    <main>
      <h1>Lotto Sim</h1>
      <div className='game-container'>
        <animated.div
          className='card'
          style={{
            borderBottom: '1px solid #ccc',
            ...card1Props,
          }}
        >
          <h2>Ticket</h2>
          <ul>
            {ticket.map((number, index) => (
              <li key={index}>{number}</li>
            ))}
          </ul>
        </animated.div>

        <Game
          attempts={attempts}
          gameState={gameState}
          animationProps={card2Props}
        />

        <div
          className='card'
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1em',
            marginTop: '2em',
          }}
        >
          <button onClick={handleGenerateTicket}>Generate Ticket</button>
          <button onClick={handlePlayGame} disabled={ticket.length === 0}>
            Play
          </button>
        </div>
      </div>
    </main>
  )
}

export default App
