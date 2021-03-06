import React from 'react'
import PropTypes from 'prop-types'
import Validator from 'validator'
import InlineError from '../../../../../../components/Notifications/components/InlineError/inlineError.jsx'

/*
Redux will be used to store some state, but not forms. There is no need to because you do not need to store the data that the user enters, you are just interested in submitting the data. Using redux for forms is really only useful when you want to have very functional, very cool, and very smart forms.
*/

/*
Typical flow for form component:
· scenes/ > Sign/ > scenes/ > Login/ > index.js
· Login/index.js imports (login) components/
· (login) components/ contains components/Form/
*/

/*
1. typing in email field > calls "onChange()" > sets field and user value as new state

2. clicking submit button > calls "onSubmit()" which is defined as attribute in form element jsx > which calls "validate()" on state > which passes state as param: "validate(this.state.data)" > validate takes state param and creates an empty error obj {} > then runs Validator with isEmail and has password > if errors, append to empty error {} and return it, otherwise return empty error {} > "onSubmit()" gets returned errors back (since it called the "validate()"), then sets state errors property equal to error object passed from validate > then checks if state errors property length is 0, then submit the data. If the errors object remained empty the whole time (no errors), then its length would be 0 still, even though the state errors object was still updated, even when there were no errors.
*/


class LoginForm extends React.Component {
  state = {
    data: {
      email: '',
      password: ''
    },
    loading: false,
    errors: {}
  }

  /*
    this code says "set the data property to current values that they are, then override the property name that is the "target" of the users input to the new value. For example, if the e.target.name is the email field, then in state, override the value of the "email" property to text currently being entered by the user."

    Destructuring (...this.state.data) is used to set the data object in state to their current values. So ...this.state.data translates to "email: '', password: ''".
  */
  onChange = e => {
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value
      }
    })
  }

/*

//-----------------------

STEP 8 (redux): In case there is an error with the response or at any other place in this long chain of promises, redux, and react, it will be placed in the .catch() method. That method can be appended to the component that calls 'this.props.submit(this.state.data)' (the submit function of the submit button) since if you look at the actual sumbit function, defined in the LoginPage component (../../index.jsx), it returns a promise. ALSO, another reason you are appending it to the onSubmit function is because remember, even though we are using redux for global state management (getting user data and token), we are using LOCAL state for the form. So in the catch method of the CALLED submit function (not the actual defined submit function), the .catch() method is appended.

Recall that in the local state of this component, there are 3 properties: data, loading, and errors. In the catch method below, the setState({}) method is used (which is only used for setting local state, otherwise redux is used), and it sets the errors property equal to the response property of the err object passed into the catch method. Specifically, that response property also contains a property called data, which itself contains a property called errors. It is here that the values are used to update the error state.



**That's it!!! Redux > backend > state in 8 steps!!!**
*/

  onSubmit = (e) => {
    e.preventDefault()
    const errors = this.validate(this.state.data)
    this.setState({ errors })
    if (Object.keys(errors).length === 0) {
      this.props.submit(this.state.data).catch(err => {
        this.setState({ errors: err.response.data.errors })
      })
    }
  }

  /*
    even though the return statement is implicit in arrow functions, you need it in this instance because you are merely "defining" a const variable ("errors"), so you need to return that since definitions are not returned (?).
  */
  validate = (data) => {
    const errors = {}
    if (!Validator.isEmail(data.email)) errors.email = "Invalid email"
    if (!data.password) errors.password = "Can't be blank"

    return errors
  }

  render() {

    /*
    pulls out the "data" and "errors" properties from state and assigns them directly to the variables "data" and "errors"
    */
    const { data, errors } = this.state

    return (
      <form className="form login-form" onSubmit={this.onSubmit}>
        {/*
          If global errors exist, spawn a message div. This will be for server-side errors.
        */}
        { errors.global && <div className="error-overlay"><p>{errors.global}</p></div> }
        <h1>Login page</h1>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="example@example.com"
          value={data.email}
          onChange={this.onChange}
        />
        {/*
          This code says "if errors.email property of state has something in it (i.e. not undefined), then use inline error and pass the actual value of the errors.email property (a string) to the component.
        */}
        {errors.email && <InlineError text={errors.email} />}

        <label htmlFor="password">Password</label>
        <input
        type="password"
        id="password"
        name="password"
        placeholder="Make it secure"
        value={data.password}
        onChange={this.onChange}
        />
        {errors.password && <InlineError text={errors.password} />}

        <button>Login</button>
      </form>
    )
  }
}

/*submit function (that is a prop passed down from the parent LoginPage component) must be a function*/

LoginForm.propTypes = {
  submit: PropTypes.func.isRequired
}

export default LoginForm