const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

const generateTicket = () => {
  const ticketNumbers = []

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

const checkTicket = (ticket, winningNumbers) => {
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

self.onmessage = event => {
  let match = false
  let attempts = 0

  while (!match) {
    attempts += 1
    const newTicket = generateTicket()
    if (checkTicket(newTicket, event.data.winningNumbers)) {
      match = true
    }
  }

  // Once finished, post the result back to the main thread
  self.postMessage(attempts)
}
