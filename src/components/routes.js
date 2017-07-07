import React, { Component } from 'react'
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom'
import Nav from './Nav'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Dashboard from './Dashboard'
import { firebaseAuth } from '../constants/firebase'

export default class App extends Component {
  state = {
    authed: false,
    loading: true
  }
  componentDidMount() {
    this.removeListener = firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authed: true,
          loading: false
        })
      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }
  componentWillUnmount() {
    this.removeListener()
  }
  render() {
    return this.state.loading === true
      ? <h1 className="tc">Loading...</h1>
      : <BrowserRouter>
          <main className="ba b5 b--near-black bw4 h-100">
            <PropsRoute path="/" component={Nav} authed={this.state.authed} />
            <Switch>
              <div className="pa3">
                <Route path="/" exact component={Home} />
                <PublicRoute
                  authed={this.state.authed}
                  path="/login"
                  component={Login}
                />
                <PublicRoute
                  authed={this.state.authed}
                  path="/register"
                  component={Register}
                />
                <PrivateRoute
                  authed={this.state.authed}
                  path="/dashboard"
                  component={Dashboard}
                />
              </div>
              <Route render={() => <h3>No Match</h3>} />
            </Switch>
          </main>
        </BrowserRouter>
  }
}

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true
          ? <Component {...props} />
          : <Redirect
              to={{ pathname: '/login', state: { from: props.location } }}
            />}
    />
  )
}

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false
          ? <Component {...props} />
          : <Redirect to="/dashboard" />}
    />
  )
}

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest)
  return React.createElement(component, finalProps)
}

function PropsRoute({ component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        return renderMergedProps(component, props, rest)
      }}
    />
  )
}
