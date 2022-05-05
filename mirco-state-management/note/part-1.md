# Part 1

## State

State in react is any data that represents the user interface. States can change over time, but react takes care of components to render with the state.

## Why not monolithic state

1. Form state should be treated separatey from a global state, single-state solution failed
2. Server cache state has some unique characteristics, such as refetching.
3. Navigation state has a special requirement that the original state resides on the browser end.

## state in difference type of application.

- rich graphical app require many large global states
- server states app would require only one or a few small global states

<stong>we need a lightweight solution</strong>

## Suspense for Data Fetching and Concurrent Rendering

### Suspense for Data Fetching:

Mechanism that basically allows you to code your components without worrying about async

### Concurrent Rendering

Mechanism to split the render process into chunks to avoid blocking the CPU for long periods of time.

## Rule of Hook

1. not mutate an existing state object or ref object.(re-rendering)
2. component function can be invoked multiple times, function need to pure enough so they behave consistently

## Component

A component is a reusable piece of a unit, like a function, if you define a component. it can be used many times. This is only possible if a component definition is self-contained, if a component depends on something outside. it may not be reusable cause its behavior can be inconsistent. Technically, a component itself should not depend on a global state.

## useState

### Bailout

Technical term in React and means avoiding triggering re-rendering. setState with same value.

### Lazy Initialization

useState can receive a function for initialization which will be evaluated only in the first render(onMount).

```ts
const init = () => 0
const Component = () => {
  const [count, setCount] = useState(init)
  return (
    <div>
      {count}
      <button onClick={() => setCount((c) => c + 1)}>
        Increment Count
      </button>
    </div>
  )
}
```

## useReducer

For complex states

### Bailout

same story as setState

### primitive value

same story as useState

### Lazy Initialization

same story as useState
So what is useReducer, the primitive version of useState.

```ts
const init = (count) => ({ count, text: 'h1' })
useReducer(
  reducer,
  0, // init value
  init, // init function, take init value produce output
)
```

## useState is implemented with useReducer inside react

```ts
const isFunction = (arg: any): arg is function => {
  return typeof arg === 'function'
}
const useState = (initState) => {
  const [state, dispatch] = useReducer(
    (prev, action) =>
      isFunction(action) ? action(prev) : action,
    initialState,
  )
  return [state, dispatch]
}
```
