import { useState } from 'react'

interface UseLottoGame {
  playGame: () => void
  generateTicket: () => number[]
  gameState: 'processing' | 'finished' | 'ready'
  attempts: number
}

const useLottoGame = (winningNumbers?: number[]): UseLottoGame => {
  const [attempts, setAttempts] = useState(0)
  // const [ticket, setTicket] = useState<number[]>([]);
  const [gameState, setGameState] = useState<UseLottoGame['gameState']>('ready')

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

  const checkTicket = (ticket: number[]): boolean => {
    // Check if the ticket is a winner
    const winning = winningNumbers || generateTicket()
    const matchingNumbers = ticket.filter(num => winning.includes(num))
    const matchingMegaBall =
      ticket[ticket.length - 1] === winning[winning.length - 1]

    if (matchingNumbers.length === 5 && matchingMegaBall) {
      return true
    } else {
      return false
    }
  }

  const playGame = () => {
    setGameState('processing')
    const newTicket = generateTicket()
    setAttempts(attempts => attempts + 1)

    if (checkTicket(newTicket)) {
      setGameState('finished')
    } else {
      // Use setTimeout to delay the next execution of playGame and allow the component to re-render
      setTimeout(playGame, 0)
    }
  }

  console.log({
    gameState,
  })

  return { playGame, generateTicket, gameState, attempts }
}

export default useLottoGame
