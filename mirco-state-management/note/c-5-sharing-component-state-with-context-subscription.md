# Sharing component state with context and subscription

## limitations of module state

module state resides outside React component, the module state defined globally is a singleton, and you cant have different states for different component trees or subtrees

```tsx
const store = createStore({ count: 0 })
const Counter = () => {
  const [state, setState] = useStore(store)
  const inc = () =>
    setState((prev) => ({ ...prev, count: prev.count + 1 }))
  return (
    <div>
      {state.count}
      <button onClick={inc}>+1</button>
    </div>
  )
}
const store1 = createStore({ count: 0 })
const Counter1 = () => {
  const [state, setState] = useStore(store1)
  const inc = () =>
    setState((prev) => ({ ...prev, count: prev.count + 1 }))
  return (
    <div>
      {state.count}
      <button onClick={inc}>+1</button>
    </div>
  )
}
```

Counter1 and Counter2 only differed by the store, if we pass the store by props, we might encounter props drilling or referencial identity issue. we want to find a way to limit the state within scopes

```tsx
const Component = () => (
  <StoreProvider>
    <Counter />
    <Counter />
  </StoreProvider>
)
```

## Understanding when to use Context

```tsx
<ThemeContext.Provider value="this value is not used">
    
  <ThemeContext.Provider value="this value is not used">
        
    <ThemeContext.Provider value="this is the value used">
            
      <Component />
          
    </ThemeContext.Provider>
      
  </ThemeContext.Provider>
</ThemeContext.Provider>
```

if multiple same context is used, the most recent value will be used, if there are no providers in component tree, it will use the default value.

The default value for Context is important, the Context provider can be seen as a method to override the default Context value or a value provided by the parent provider if it exists.

If we have the proper default value, then what's the point of using a provider? It will be required to provide a different value for a subtree of entire component tree. Otherwise we can just yse the default value from Context.

## Implementing the Context and Subscripition pattern

Using one Context to propage a global state value has a limitation; it causes re-renders

Module state with Subscription doesn't have such a limitation, but there is another: it providers a single value for the entire compoenent tree.

Solution: Context and Subscription pattern

```tsx
type State = {
  count: number
  text?: string
}
const StoreContext = createContext<Store<State>>(
  createStore<State>({
    count: 0,
    text: 'hello',
  }),
)

const StoreProvider = ({ initialState, children }) => {
  // useRef is used to make sure that the store object is initialized only once at the first render
  const storeRef = useRef<Store<State>>()
  if (!storeRef.current) {
    storeRef.current = createStore(initState)
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
  return useSubscription(
    useMemo(() => ({
      getCurrentValue: () => selector(store.getState()),
      subscribe: store.subscribe,
    })),
    [store, selector],
  )
}

const useSetState = () => {
  return useContext(StoreContext).setState
}

const selectCount = (state: State) => state.count
const Component = () => {
  const count = useSelector(selectCount)
  const setState = useSetState()
  const inc = () => {
    setState((prev) => ({
      ...prev,
      count: prev.count + 1,
    }))
  }

  return (
    <div>
      count: {count}
      <button onClick={inc}> +1</button>
    </div>
  )
}
```

The Component can have in various places

- outside any providers
- inside the first provider
- inside the second provider
