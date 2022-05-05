import { useCount } from '../hooks/use-count'

export const Component = () => {
  const [count, setCount] = useCount(0)
  return (
    <div>
      {count}
      <button onClick={() => setCount((prev) => prev + 1)}>
        +1
      </button>
    </div>
  )
}
