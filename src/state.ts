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
  deckOne?: Deck
  deckTwo?: Deck
  openIndexOne?: number
  openIndexTwo?: number
  players: Array<Player>
  activePlayer?: string
}

type Play = {
  type: 'OpenOne' | 'OpenTwo' | 'Evaluate'
  payload?: number
}

export const initialGameState: GameState = {
  players: [],
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

declare function addPlayer(name: string): Player

declare function resetGame(decks: [Deck, Deck]): GameState

const turn = (state = initialGameState, action?: Play): GameState => {
  return state
}
