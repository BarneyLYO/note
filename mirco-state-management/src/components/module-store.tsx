import { useCallback, useEffect, useState } from 'react'

type Dispatch<T> = (action: T | ((prev: T) => T)) => void
type Store<T> = {
  getState: () => T
  setState: Dispatch<T>
  subscribe: (cb: () => void) => () => void
}
const createStore = <T extends unknown>(
  initialState: T,
): Store<T> => {
  let state = initialState
  const callbacks = new Set<() => void>()
  const getState = () => state
  const setState: Store<T>['setState'] = (next) => {
    state =
      typeof next === 'function'
        ? (next as (prev: T) => T)(state)
        : next
    callbacks.forEach((cb) => cb())
  }

  const subscribe = (cb: () => void) => {
    callbacks.add(cb)
    return () => {
      callbacks.delete(cb)
    }
  }

  return {
    getState,
    setState,
    subscribe,
  }
}

const useStore = <T,>(store: Store<T>) => {
  const [state, setState] = useState(store.getState())
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getState())
    })
    /**
     * “It invokes the setState() function once in useEffect. This is due to the fact that useEffect is delayed and there's a chance that store already has a new state.”。
     */
    setState(store.getState())
    return unsubscribe
  }, [store])

  return [state, store.setState] as const
}

const store = createStore(10)

export const Compo = () => {
  const [state, setState] = useStore(store)
  const inc = () => setState((prev) => prev + 1)

  return (
    <div>
      {state}
      <br />
      <button onClick={inc}> +1 </button>
    </div>
  )
}

const useStoreSelector = <T, S>(
  store: Store<T>,
  selector: (state: T) => S,
) => {
  const [state, setState] = useState(
    selector(store.getState()),
  )
  // useEffect fires a little later, return a stale value until re-subscribing is done
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(selector(store.getState()))
    })
    /**
     * “It invokes the setState() function once in useEffect. This is due to the fact that useEffect is delayed and there's a chance that store already has a new state.”。
     */
    setState(selector(store.getState()))
    return unsubscribe
  }, [selector, store])

  return [state, store.setState] as const
}

const store1 = createStore({
  count1: 0,
  count2: 0,
})

export const Compo1 = () => {
  const [count, setCount] = useStoreSelector(
    store1,
    useCallback((prev) => prev.count1, []),
  )

  return (
    <div>
      store1, count1 {count}
      <button
        onClick={() =>
          setCount((prev) => ({
            ...prev,
            count1: prev.count1 + 1,
          }))
        }
      >
        +1
      </button>
    </div>
  )
}

export const Compo2 = () => {
  const [count, setCount] = useStoreSelector(
    store1,
    useCallback((prev) => prev.count2, []),
  )

  return (
    <div>
      store1, count2 {count}
      <button
        onClick={() =>
          setCount((prev) => ({
            ...prev,
            count2: prev.count2 + 1,
          }))
        }
      >
        +1
      </button>
    </div>
  )
}
