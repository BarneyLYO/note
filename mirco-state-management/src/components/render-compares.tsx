import { memo, useState } from 'react'
import { useRenderCount } from '../hooks/use-render-count'
import { ColorProvider } from './color-context'

export const RenderCompares = () => {
  const [color, setColor] = useState('red')
  return (
    <>
      <br />
      <button onClick={() => setColor(Math.random() + '')}>
        click {color}
      </button>
      <ColorProvider value={color}>
        dummy:
        <br />
        <DummyC />
        memoed:
        <br />
        <Memoed />
      </ColorProvider>
    </>
  )
}

const DummyC = () => {
  const renderCount = useRenderCount()

  return <div>count: {renderCount}</div>
}

const Memoed = memo(DummyC)
