import { FC } from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import About from './pages/About'
import Home from './pages/Home'
import Header from './pages/Header'
const App:FC = () => {

  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/about/:slug" component={ About }/>
        <Route path="/" exact component={ Home } />
      </Switch>
    </Router>
  );
}

export default App;
