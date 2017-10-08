import React, { Component } from 'react';
import { login, resetPassword } from '../helpers/auth';
import { Link } from 'react-router-dom';

function setErrorMsg(error) {
  return {
    loginMessage: error
  };
}

export default class Login extends Component {
  state = { loginMessage: null };
  handleSubmit = e => {
    e.preventDefault();
    login(this.email.value, this.pw.value).catch(error => {
      this.setState(setErrorMsg('Invalid username/password.'));
    });
  };
  resetPassword = () => {
    resetPassword(this.email.value)
      .then(() =>
        this.setState(
          setErrorMsg(`Password reset email sent to ${this.email.value}.`)
        )
      )
      .catch(error => this.setState(setErrorMsg(`Email address not found.`)));
  };
  render() {
    return (
      <form className="measure center" onSubmit={this.handleSubmit}>
        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
          <legend className="f4 fw6 ph0 mh0">Login</legend>
          <div className="mt3">
            <label className="db fw6 lh-copy f6" htmlFor="email-address">
              Email
            </label>
            <input
              className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
              type="email"
              name="email-address"
              id="email-address"
              ref={email => (this.email = email)}
            />
          </div>
          <div className="mv3">
            <label className="db fw6 lh-copy f6" htmlFor="password">
              Password
            </label>
            <input
              className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
              type="password"
              name="password"
              id="password"
              ref={pw => (this.pw = pw)}
            />
          </div>
          {this.state.loginMessage && (
            <div className="alert alert-danger" role="alert">
              <span
                className="glyphicon glyphicon-exclamation-sign"
                aria-hidden="true"
              />
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.loginMessage}{' '}
              <a href="#" onClick={this.resetPassword} className="alert-link">
                Forgot Password?
              </a>
            </div>
          )}
        </fieldset>
        <div className="">
          <input
            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
            type="submit"
            value="Log in"
            data-test="loginButton"
          />
        </div>
        <div className="lh-copy mt3">
          {/* <Link to="/register" href="#0" className="f6 link dim black db">
            Sign Up
          </Link> */}
          <a href="https://www.realsies.com/" className="f6 link dim black db">
            Sign Up
          </a>
          <a
            href="#0"
            className="f6 link dim black db"
            onClick={this.resetPassword}
          >
            Forgot your password?
          </a>
        </div>
      </form>
    );
  }
}
