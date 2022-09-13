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
