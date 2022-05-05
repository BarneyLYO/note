import React from 'react'
import ReactDOM from 'react-dom/client'
import { Component } from './components'
import {
  CompoF,
  Contexted,
  TxtGetter,
} from './components/context-subscription-pattern'
import {
  Compo,
  Compo1,
  Compo2,
} from './components/module-store'
import { RenderCompares } from './components/render-compares'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
)
root.render(
  <React.StrictMode>
    <Component />
    <br />
    <RenderCompares />
    <br />
    <br />
    <br />
    <br />
    <Compo />
    <br />
    <Compo />
    <br />
    <Compo />
    <br />
    <Compo1 />
    <Compo2 />
    <br />
    <br />
    <br />
    <br />
    <br />
    No Context
    <CompoF />
    <CompoF />
    <TxtGetter />
    Context 1
    <Contexted init={10} />
    Context 2
    <Contexted init={20} />
  </React.StrictMode>,
)
