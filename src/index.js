import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom';
import Nav from './components/Nav';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import { firebaseAuth } from './constants/firebase';
import registerServiceWorker from './registerServiceWorker';
import './styles/styles.css';
// import ReactGA from 'react-ga';

// ReactGA.initialize('UA-86031259-4');
// ReactGA.pageview(window.location.pathname + window.location.search);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authed: false,
      loading: true,
    };
  }

  componentDidMount() {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
        });
      } else {
        this.setState({
          authed: false,
          loading: false,
        });
      }
    });
  }
  componentWillUnmount() {
    this.removeListener();
  }
  render() {
    return this.state.loading === true ? (
      <h1 className="tc pv5 f1">Loading...</h1>
    ) : (
      <BrowserRouter>
        <main>
          <PropsRoute path="/" component={Nav} authed={this.state.authed} />
          <Switch>
            <Route path="/" exact component={Home} />
            <PublicRoute authed={this.state.authed} path="/login" component={Login} />
            {process.env.NODE_ENV === 'production' ? null : (
              <PublicRoute authed={this.state.authed} path="/register" component={Register} />
            )}
            <PrivateRoute authed={this.state.authed} path="/dashboard" component={Dashboard} />
            <PrivateRoute
              authed={this.state.authed}
              path="/settings"
              component={Settings}
              user={firebaseAuth.currentUser}
            />

            <Route render={() => <h3>No Match</h3>} />
          </Switch>
          <Footer />
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
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
}

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => (authed === false ? <Component {...props} /> : <Redirect to="/dashboard" />)}
    />
  );
}

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
};

function PropsRoute({ component, ...rest }) {
  return <Route {...rest} render={props => renderMergedProps(component, props, rest)} />;
}

const Footer = () => (
  <footer className="w-100 pv4 tc">
    <p className="f4">
      If you find a bug please{' '}
      <a href="https://twitter.com/joshpitzalis" target="_blank" rel="noopener noreferrer">
        let me know
      </a>.
    </p>
    <p className="f6">Version 0.0.3</p>
  </footer>
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
