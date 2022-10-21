import produce from 'immer'

type Recipe = {
  name: 'string'
  mainSpirit: 'string'
  otherIngredients: Array<string>
  addons: Array<string>
  mixing: string
}
export const attach = async () => {
  window['data'] = []
  const recipes: Array<Recipe> = await fetch('/api/hello').then(res =>
    res.ok ? res.json() : []
  )
  const drinks = recipes.map(recipe => recipe.name)
  const mainSpirits = recipes.map(recipe => recipe.mainSpirit)
  window['data'] = {
    recipes,
    decks: [drinks, mainSpirits],
  }
}

type Player = {
  id: string
  name: string
  points: number
}

export type Deck = {
  id: string
  name: string
  cards: Array<string>
}

export type GameState = {
  availableDecks: Array<Deck>
  deckOne?: Deck
  deckTwo?: Deck
  openIndexOne?: number
  openIndexTwo?: number
  players: Array<Player>
  activePlayerIndex?: number
}

export const initialGameState: GameState = {
  players: [],
  availableDecks: [],
}

export const getAvailableDecks = async (): Promise<Array<Deck>> => {
  const recipes: Array<Recipe> = await fetch('/api/hello').then(res =>
    res.ok ? res.json() : []
  )
  const drinks = recipes.map(recipe => recipe.name)
  const mainSpirits = recipes.map(recipe => recipe.mainSpirit)
  return [
    { id: 'drinks-id', name: 'Drinks', cards: drinks },
    { id: 'mainSpirits-id', name: 'Main Spirits', cards: mainSpirits },
  ]
}

const actions = [
  'addPlayer',
  'removePlayer',
  'addDeck',
  'removeDeck',
  'startGame',
  'resetGame',
  'openOne',
  'openTwo',
  'setAvailableDecks',
]

type AddPlayer = {
  type: 'addPlayer'
  payload: {
    name: string
  }
}

type RemovePlayer = {
  type: 'removePlayer'
  payload: {
    id: string
  }
}

type AddDeck = {
  type: 'addDeck'
  payload: {
    id: string
  }
}

type RemoveDeck = {
  type: 'removeDeck'
  payload: {
    id: string
  }
}

type StartGame = {
  type: 'startGame'
}

type ResetGame = {
  type: 'resetGame'
}

type OpenCardOne = {
  type: 'openOne'
  payload: {
    index: number
  }
}

type OpenCardTwo = {
  type: 'openTwo'
  payload: {
    index: number
  }
}

type SetDecks = {
  type: 'setAvailableDecks'
  payload: Array<Deck>
}

type GameAction =
  | AddPlayer
  | RemovePlayer
  | SetDecks
  | AddDeck
  | RemoveDeck
  | StartGame
  | ResetGame
  | OpenCardOne
  | OpenCardTwo

const reducer = (state = initialGameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'addPlayer': {
      if (state.activePlayerIndex) {
        return state
      }
      const newPlayer = {
        ...action.payload,
        id: Math.floor(Math.random() * 10000).toString(),
        points: 0,
      }
      return produce(state, draft => {
        draft.players.push(newPlayer)
      })
    }
    case 'removePlayer': {
      if (state.activePlayerIndex) {
        return state
      }
      const playerIndex = state.players.findIndex(
        p => p.id === action.payload.id
      )
      return playerIndex < 0
        ? state
        : produce(state, draft => {
            draft.players.splice(playerIndex, 1)
          })
    }
    case 'setAvailableDecks': {
      if (state.activePlayerIndex) {
        return state
      }
      return produce(state, draft => {
        draft.availableDecks = action.payload
      })
    }
    case 'addDeck': {
      if (
        state.activePlayerIndex || // Game started
        state.deckTwo || // All decks defined
        state.deckOne?.id === action.payload.id // Deck already in game
      ) {
        return state
      }
      if (state.deckOne) {
        return produce(state, draft => {
          draft.deckTwo = draft.availableDecks.find(
            d => d.id === action.payload.id
          )
        })
      }
      return produce(state, draft => {
        draft.deckOne = draft.availableDecks.find(
          d => d.id === action.payload.id
        )
      })
    }
    case 'removeDeck': {
      if (state.activePlayerIndex) {
        return state
      }
      if (state.deckOne?.id === action.payload.id) {
        return produce(state, draft => {
          draft.deckOne = undefined
        })
      }
      if (state.deckTwo?.id === action.payload.id) {
        return produce(state, draft => {
          draft.deckTwo = undefined
        })
      }
    }
    case 'startGame': {
      if (state.activePlayerIndex) {
        return state
      }
      return produce(state, draft => {
        draft.activePlayerIndex = 0
      })
    }
    case 'resetGame': {
      if (typeof state.activePlayerIndex === 'undefined') {
        return state
      }
      return produce(state, draft => {
        draft.deckOne = draft.availableDecks.find(
          d => d.id === draft.deckOne?.id
        )
        draft.deckTwo = draft.availableDecks.find(
          d => d.id === draft.deckTwo?.id
        )
        draft.players.forEach(player => {
          player.points = 0
        })
        draft.activePlayerIndex = undefined
      })
    }
    case 'openOne': {
      if (
        typeof state.activePlayerIndex === 'undefined' ||
        typeof state.openIndexOne !== 'undefined'
      ) {
        return state
      }
      return produce(state, draft => {
        draft.openIndexOne = action.payload.index
      })
    }
    case 'openTwo': {
      if (
        typeof state.activePlayerIndex === 'undefined' ||
        typeof state.openIndexTwo !== 'undefined'
      ) {
        return state
      }
      return produce(state, draft => {
        draft.openIndexTwo = action.payload.index
      })
    }
  }
}

const pull = <T>(predicate: (e: T) => boolean, list: Array<T>) => {
  const idx = list.findIndex(predicate)
  if (idx < 0) return list
  return [...list.slice(0, idx), ...list.slice(idx + 1, list.length)]
}
