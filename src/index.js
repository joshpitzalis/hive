import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom';
import Nav from './components/Nav';
import Login from './components/Login';
// import Register from './components/Register';
import Home from './components/Home';
import Settings from './components/Settings';
import Dashboard from './components/Dashboard';
import { firebaseAuth } from './constants/firebase';
import registerServiceWorker from './registerServiceWorker';
import './styles/styles.css';
import { StripeProvider } from 'react-stripe-elements';
import { stripeKey } from './constants/stripe.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authed: false,
      loading: true
    };
  }

  componentDidMount() {
    this.removeListener = firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authed: true,
          loading: false
        });
      } else {
        this.setState({
          authed: false,
          loading: false
        });
      }
    });
  }
  componentWillUnmount() {
    this.removeListener();
  }
  render() {
    return this.state.loading === true ? (
      <h1 className="tc">Loading...</h1>
    ) : (
      <BrowserRouter>
        <main>
          <PropsRoute path="/" component={Nav} authed={this.state.authed} />
          <Switch>
            <div className="pa3">
              <Route path="/" exact component={Home} />
              <PublicRoute
                authed={this.state.authed}
                path="/login"
                component={Login}
              />
              {/* <PublicRoute
                authed={this.state.authed}
                path="/register"
                component={Register}
              /> */}
              <PrivateRoute
                authed={this.state.authed}
                path="/dashboard"
                component={Dashboard}
              />
              <PrivateRoute
                authed={this.state.authed}
                path="/settings"
                component={Settings}
                user={firebaseAuth.currentUser}
              />
            </div>
            <Route render={() => <h3>No Match</h3>} />
          </Switch>
        </main>
      </BrowserRouter>
    );
  }
}

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )}
    />
  );
}

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/dashboard" />
        )}
    />
  );
}

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
};

function PropsRoute({ component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        return renderMergedProps(component, props, rest);
      }}
    />
  );
}

ReactDOM.render(
  <StripeProvider apiKey={stripeKey}>
    <App />
  </StripeProvider>,
  document.getElementById('root')
);
registerServiceWorker();
