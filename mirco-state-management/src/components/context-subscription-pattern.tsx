import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

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

type State = {
  count: number
  text: string
}

const StoreContext = createContext<Store<State>>(
  createStore({
    count: 0,
    text: 'hello',
  }),
)

const StoreProvider = ({
  initialState,
  children,
}: {
  initialState: State
  children: React.ReactNode
}) => {
  const storeRef = useRef<Store<State>>()
  if (!storeRef.current) {
    storeRef.current = createStore(initialState)
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

const useSelector = <S extends unknown>(
  selector: (state: State) => S,
) => {
  const store = useContext(StoreContext)
  return useStoreSelector(store, selector)
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

const selector = (state: State) => state.count
export const CompoF: React.FC = () => {
  const [count, updateStore] = useSelector(selector)
  return (
    <div>
      count: {count}
      <button
        onClick={() =>
          updateStore((prev) => ({
            ...prev,
            count: prev.count + 1,
          }))
        }
      >
        +1
      </button>
    </div>
  )
}

export const Contexted: React.FC<{ init: number }> = ({
  init,
}) => {
  return (
    <StoreProvider
      initialState={{ count: init, text: '1' }}
    >
      component init {init}
      <CompoF />
      <CompoF />
      <TxtGetter />
    </StoreProvider>
  )
}

const textSelector = (s: State) => s.text
export const TxtGetter = () => {
  const [text, updateText] = useSelector(textSelector)
  return (
    <div>
      text: {text}
      <button
        onClick={() =>
          updateText((prev) => ({
            ...prev,
            text: Math.random() + '',
          }))
        }
      >
        changeText
      </button>
    </div>
  )
}
