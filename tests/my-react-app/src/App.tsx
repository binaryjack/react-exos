
import './App.css'
import { Challenge1 } from './assets/Challenge1'
import { MainApp } from './assets/Challenge2'
import { WindowWidthTracker } from './assets/Challenge3'
import { FullNameForm } from './assets/Challenge4'
import { DynamicList } from './assets/Challenge5'
import { DetailsToggle } from './assets/Challenge6'

function App() {
  return (
    <>
      <Challenge1 challengeName={'challenge 1'} />
      <MainApp />
      <WindowWidthTracker />
      <FullNameForm />
      <DynamicList />
      <DetailsToggle />
    </>
  )
}

export default App
