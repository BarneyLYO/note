# Sharing Module State with Subscription

## Module State

some constants or variables defined in ECMAScript module scopes.

```tsx
export const createContainer = (init) => {
  let state = init
  const getState = () => state
  const setState = (nextState) => {
    if (typeof nextState === 'function') {
      return nextState(state)
    }
    return (state = nextState)
  }

  return {
    getState,
    setState,
  }
}
```

## Using module state as a global state in React

```ts
import { useEffect, useState } from 'react'

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

const useStore = <T>(store: Store<T>) => {
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
```

## Working with selector and useSubscription

useStore hook we created in the previous section returns a whole state object. This means that any small part of the state object change will notify all useStore hooks and it can cause extra re-renders.

```tsx
const useStoreSelector = <T,>(
  store: Store<T>,
  selector: (state: T) => Partial<T>,
) => {
  const [state, setState] = useState(
    selector(store.getState()),
  )
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(selector(store.getState()))
    })
    /**
     * “It invokes the setState() function once in useEffect. This is due to the fact that useEffect is delayed and there's a chance that store already has a new state.”。
     */
    setState(selector(store.getState()))
    return unsubscribe
  }, [store])

  return [state, store.setState] as const
}
```

### caveat

here's a caveat when store or selector is changed. Because useEffect fires a little later, it will return a stale state value until re-subscribing is done. We could fix it by ourselves, but it's a little technical.

```tsx
// in furture react useSyncExternalStore hook
const useStoreSelector = (store, selector) =>
  useSubscription(
    useMemo(
      () => ({
        getCurrentValue: () => selector(store.getState()),
        subscribe: store.subscribe,
      }),
      [store, selector],
    ),
  )
```
