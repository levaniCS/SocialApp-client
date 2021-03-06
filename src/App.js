import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './App.css';

import { AuthProvider } from './context/auth'
import AuthRoute from './utils/AuthRoute'
//Components
import MenuBar from './components/MenuBar'
// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import SinglePost from './pages/SinglePost'
import Chat from './pages/Chat'

// Google Analytics
import AnalyticUtils from './utils/GoogleAnalytics'

function App() {

  useEffect(() => {
    AnalyticUtils.trackPage()
  }, [])


  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home}/>
          <Route exact path="/chat" component={Chat}/>
          <AuthRoute exact path="/login" component={Login}/>
          <AuthRoute exact path="/register" component={Register}/>
          <Route exact path="/posts/:postId" component={SinglePost}/>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
