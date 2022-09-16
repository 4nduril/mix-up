import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Game } from '../src/components/Game'
import { attach } from '../src/state'

const Home: NextPage = () => {
  /*
   * const [isReady, setIsReady] = useState(false)
   * useEffect(() => {
   *   attach().then(x => setIsReady(true))
   * }, [])
   */
  return (
    <div>
      <h1>Mix Up</h1>
      <Game />
    </div>
  )
}

export default Home
