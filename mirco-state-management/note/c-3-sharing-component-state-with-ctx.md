# Sharing Component State with Context

## useContext with a static value

Providers can be nested, consumer component will pick the closest provider in the component tree to get the context value.

```tsx
const ColorContext = createContext('black')
const Component = () => {
  const color = useContext(ColorContext)
  return <div style={{ color }}>Hello {color}</div>
}

const App = () => {
  return (
    <>
      <ColorContext.Provider value="red"></ColorContext.Provider>
    </>
  )
}
```

## Using useState with useContext

remember to memo to wrap the chil component.

## Limitations when using Context for objects

Using primitive values for Context value is intuitive. but using object values may requires caution due to their behavior. An object may contain several values, and Countext consumers may not use all of them.
we need a selector function

```tsx
const CountContext = createContext({
  count1: 0,
  count2: 0,
})
const Counter1 = () => {
  const { count1 } = useContext(CountContext)
  const renderCount = useRef(1)
  useEffect(() => {
    renderCount.current += 1
  })
  return (
    <div>
      Count1: {count1}
      (renders: {renderCount.current})     
    </div>
  )
}
const MemoedCounter1 = memo(Counter1)
const Counter2 = () => {
  const { count2 } = useContext(CountContext)
  const renderCount = useRef(1)
  useEffect(() => {
    renderCount.current += 1
  })
  return (
    <div>
            Count2: {count2} (renders: {renderCount.current})
          
    </div>
  )
}
const MemoCounter2 = memo(Counter2)

const Parent = () => (
  <>
        
    <MemoCounter1 />
        
    <MemoCounter2 />
      
  </>
)
const App = () => {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  return (
    <CountContext.Provider value={{ count1, count2 }}>
            
      <button onClick={() => setCount1((c) => c + 1)}>
                {count1}
              
      </button>
            
      <button onClick={() => setCount2((c) => c + 1)}>
                {count2}
              
      </button>
            
      <Parent />
          
    </CountContext.Provider>
  )
}
```

Above code will cause re-rendering because when update the counter, the object pass in with different memory address

## Creating custom hooks and provider component

hide contexts and restrict usage.

```tsx
type CountContextType = [
  number,
  Dispatch<SetStateAction<number>>,
]
const Count1Context =
  createContext<CountContextType | null>(null)
export const Count1Provider: React.FC = ({ children }) => (
  <Count1Context.Provider value={useState(0)}>
    {children}
  </Count1Context.Provider>
)
export const useCount1 = () => {
  const val = useContext(Count1Context) // we cam do crazy things here
  return val
}
```

## Factory pattern with custom hook

```tsx
const createStateContext<T> = (
  useValue: (init:T) => State<T>
) => {
  const StateContext = createContext<State<T> | null>(null)
  const StateProvider = ({
    init,
    children
  }) => (
    <StateContext.Provider value={useValue(init)}>
      {children}
    </StateContext.Provider>
  )
  const useContextState = () => {
    const val = useContext(StateContext)
    return val
  }
  return [
    StateProvider,
    useContextState
  ] as const
}
const [MyCountProvider, useMyCount] = createStateContext(init => useState(0))
const [
  MyCount1Provider, useMyCount1Provider
] = createStateContext(
  init => useReducer(....)
)
```

## Avoiding provider nesting with reduceRight

```tsx
const providers = [
  [Provider1, { init: 10 }],
  [Provider2, { init: 2 }],
  [Provider3, { init: 3 }],
  [Provider4, { init: 4 }],
] as const
return providers.reduceRight(
  (children, [Component, props]) =>
    createElement(Component, props, children),
  <Parent />,
)
```
