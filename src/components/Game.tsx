import { FunctionComponent, useEffect, useState } from 'react'
import { Deck, GameState, getAvailableDecks, initialGameState } from '../state'

export const Game: FunctionComponent = () => {
  const { gameState, availableDecks } = useGameState()
  return (
    <div>
      {gameState.players.length === 0 ? (
        <p>Please add players.</p>
      ) : (
        <ul>
          {gameState.players.map(player => (
            <li key={player.id}>{player.name}</li>
          ))}
        </ul>
      )}
      <ul>
        {availableDecks.map(deck => (
          <li key={deck.id}>{deck.name}</li>
        ))}
      </ul>
    </div>
  )
}

const useGameState = (): {
  gameState: GameState
  availableDecks: Array<Deck>
  actions: {
    addPlayer: (n: string) => void
  }
} => {
  const [players, setPlayers] = useState(initialGameState.players)
  const [availableDecks, setAvailableDecks] = useState<Array<Deck>>([])
  useEffect(() => {
    if (!availableDecks.length) {
      getAvailableDecks().then(decks => setAvailableDecks(decks))
    }
  })
  return {
    gameState: {
      players,
    },
    availableDecks,
    actions: {
      addPlayer: (name: string) => {
        const id = players.length.toString()
        setPlayers(players => [...players, { id, name, points: 0 }])
      },
    },
  }
}
