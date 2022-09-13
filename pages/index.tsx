import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { attach } from '../src/state'

const Home: NextPage = () => {
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    attach().then(x => setIsReady(true))
  }, [])
  return <div>{`Mix-Up: ${isReady}`}</div>
}

export default Home
