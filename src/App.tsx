import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LottoWorker from './workers/lottoWorker?worker'
import './App.css'

const variants = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: 100 },
}

function App() {
  const [worker, setWorker] = useState<Worker | null>(null)
  const [attempts, setAttempts] = useState<number>(0)
  const [gameState, setGameState] = useState<
    'idle' | 'processing' | 'finished'
  >('idle')

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

  useEffect(() => {
    const lottoWorker = new LottoWorker() as unknown as Worker

    lottoWorker.onmessage = event => {
      setAttempts(event.data)
      setGameState('finished')
    }

    setWorker(lottoWorker)

    return () => {
      lottoWorker.terminate()
    }
  }, [])

  const [ticket, setTicket] = useState<number[]>([])

  const handleGenerateTicket = () => {
    const newTicket = generateTicket()
    setTicket(newTicket)
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

  return (
    <main>
      <h1>Lotto Sim</h1>
      <div className='game-container'>
        <motion.div
          className='card'
          animate={ticket.length > 0 ? 'visible' : 'hidden'}
          variants={variants}
        >
          <h2>Ticket</h2>
          <ul>
            {ticket.map((number, index) => (
              <li key={index}>{number}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className='card'
          animate={attempts > 0 ? 'visible' : 'hidden'}
          variants={variants}
        >
          <h2>Attempts</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            It took{' '}
            <div style={{ fontSize: '2em' }}>
              {gameState === 'processing'
                ? 'Calculating...'
                : attempts.toLocaleString()}
            </div>{' '}
            attempts to win the lotto.
          </div>
        </motion.div>

        <motion.div
          className='card'
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1em',
          }}
        >
          <button onClick={handleGenerateTicket}>Generate Ticket</button>
          <button onClick={handlePlayGame} disabled={ticket.length === 0}>
            Play
          </button>
        </motion.div>
      </div>
    </main>
  )
}

export default App
