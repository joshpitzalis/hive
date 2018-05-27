import React, { Component } from 'react';
import { login, resetPassword } from '../helpers/auth';

function setErrorMsg(error) {
  return {
    loginMessage: error,
  };
}

export default class Login extends Component {
  state = { loginMessage: null, email: null, password: null };

  handleSubmit = e => {
    e.preventDefault();
    login(this.state.email, this.state.password).catch(error => {
      this.setState(setErrorMsg('Invalid username/password.'));
    });
  };

  resetPassword = () => {
    this.state.email
      ? resetPassword(this.state.email)
          .then(() =>
            this.setState(setErrorMsg(`Password reset email sent to ${this.state.email}.`)),
          )
          .catch(error => this.setState(setErrorMsg(`Email address not found.`)))
      : this.setState(setErrorMsg(`Add an email please.`));
  };

  updateInput = (value, field) => this.setState({ [field]: value });

  static Message = ({ message }) => {
    return (
      <div className="alert alert-danger red" role="alert">
        <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true" />
        <span className="sr-only">Error:</span>
        &nbsp;{message}
      </div>
    );
  };

  static ExtraButtons = ({ resetPassword, email }) => (
    <div className="lh-copy mt3">
      {/* <Link to="/register" href="#0" className="f6 link dim black db">
    Sign Up
  </Link> */}
      <a href="https://www.realsies.com/" className="f6 link dim black db">
        Sign Up
      </a>
      {email && (
        <a href="#0" className="f6 link dim black db" onClick={resetPassword}>
          Forgot your password?
        </a>
      )}
    </div>
  );

  static InputBox = ({ updateInput, field, value }) => {
    return (
      <div className="mt3">
        <label className="db fw6 lh-copy f6 ttu" htmlFor={field}>
          {field}
        </label>
        <input
          className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
          type={field}
          name={field}
          onChange={e => updateInput(e.target.value, field)}
          value={value}
        />
      </div>
    );
  };

  render() {
    return (
      <form className="measure center" onSubmit={this.handleSubmit}>
        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
          <legend className="f4 fw6 ph0 mh0">Login</legend>
          <Login.InputBox field="email" value={this.state.email} updateInput={this.updateInput} />
          <Login.InputBox
            field="password"
            value={this.state.password}
            updateInput={this.updateInput}
          />
          {this.state.loginMessage && <Login.Message message={this.state.loginMessage} />}
        </fieldset>
        <div>
          <input
            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
            type="submit"
            value="Log in"
            data-test="loginButton"
          />
        </div>
        <Login.ExtraButtons resetPassword={this.resetPassword} email={this.state.email} />
      </form>
    );
  }
}
