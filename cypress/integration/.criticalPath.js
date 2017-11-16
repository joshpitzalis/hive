const user1 = 'test1@realsies.com'
const password1 = 'abc123'
const user2 = 'test2@realsies.com'
const password2 = 'changeme'

describe('The Home Page', () => {
  it.skip('successfully loads', () => {
    cy.visit('/')
  })
})

describe('The Registration Page', () => {
  it.skip('creates a test user', () => {
    cy.visit('/register')
    cy.get('input[placeholder=Email]').type(user1)
    cy.get('input[placeholder=Password]').type(password1)
    cy.get('[data-test="registerButton"]').click()
    cy.url().should('include', '/dashboard')
  })
})

describe('The Login Process', () => {
  it.skip('logs in successfully', () => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user1)
    cy.get('input[name=password]').type(password1)
    cy.get('[data-test="loginButton"]').click()
    cy.url().should('include', '/dashboard')
  })
})

describe('Creating a New Task', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user1)
    cy.get('input[name=password]').type(password1)
    cy.get('[data-test="loginButton"]').click()
  })

  it.skip('Creates a new task', () => {
    cy.contains('Send Someone A Realsie').click()
    cy.get('input[type=email]').type(user2)
    cy.get('input[type=date]').type(`${new Date().toISOString().split('T')[0]}`)
    cy.get('input[type=text]').type('something something ')

    // for date
    //   cy.get('input').val('424')
    //   .trigger('change')

    cy.contains(`Send Realsie to ${user2}`).click({})
    cy.url().should('include', '/dashboard')
    cy.contains('something something')
  })

  // test that previous dates are not allowed
})

describe('Recieving a New Task', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user2)
    cy
      .get('input[name=password]')
      .type(password2)
      .then({ timeout: 10000 }, () => {
        // you need to wait a little while for cloud functions to create the user
        cy.get('[data-test="loginButton"]').click()
      })
  })

  it.skip('recieved a new task', () => {
    cy.url().should('include', '/dashboard')
    cy.contains('something something')
  })
})

describe('Sending multiple tasks to the same User', () => {
  it.skip('sends a second task', () => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user1)
    cy.get('input[name=password]').type(password1)
    cy.get('[data-test="loginButton"]').click()

    cy.contains('Send Someone A Realsie').click()
    cy.get('input[type=email]').type(user2)
    cy.get('input[type=text]').type('something something else')
    cy.contains('Send Realsie').click()
    cy.url().should('include', '/dashboard')
    cy.contains('something something else')
  })

  it.skip('Recieves the second task', () => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user2)
    cy.get('input[name=password]').type(password2)
    cy.get('[data-test="loginButton"]').click()
    cy.url().should('include', '/dashboard')
    cy.contains('something something else')
  })
})

describe('Accepting a Pending Task', () => {
  Cypress.Commands.add('iframe', { prevSubject: 'element' }, $iframe => {
    return new Cypress.Promise(resolve => {
      $iframe.on('load', () => {
        resolve($iframe.contents().find('body'))
      })
    })
  })

  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user1)
    cy.get('input[name=password]').type(password1)
    cy.get('[data-test="loginButton"]').click()
  })

  it('accepts a pending task', () => {
    cy.url().should('include', '/dashboard')
    cy
      .contains('something something')
      .parentsUntil('.Polaris-Card')
      .parent()
      .within(() => {
        cy.get('.Polaris-Button--primary').click()
      })

    cy.get('.StripeCheckout').click()

    cy
      .get('iframe.stripe_checkout_app')
      .wait(5000)
      .then($iframe => {
        const iframe = $iframe.contents()
        const myInput0 = iframe.find('input:eq(0)')
        const myInput1 = iframe.find('input:eq(1)')
        const myInput2 = iframe.find('input:eq(2)')
        const myButton = iframe.find('button')
        cy.wrap(myInput0).type('4000056655665556')
        cy.wrap(myInput1).type('112019')
        cy.wrap(myInput2).type('424')
        cy.wrap(myButton).click({ force: true })
      })
    // cy
    //   .get('.stripe_checkout_app')
    //   .iframe()
    //   .find('.Modal')
    //   .within(() => {
    //     cy
    //       .get('.Fieldset-childTop')
    //       .find('input')
    //       .type('4000056655665556')
    //     // .trigger('change')
    //
    //     // .invoke('val', 4000056655665556)
    //     // .trigger('change')
    //
    //     cy.get('.Fieldset-childLeft').within(() => {
    //       cy.get('input').type('112019')
    //       // .trigger('change')
    //     })
    //     cy.get('.Fieldset-childRight').within(() => {
    //       cy.get('input').type('424{enter}')
    //       // .trigger('change')
    //     })
    //     cy.get('button').click()
    //
    //   })

    cy
      .contains('something something else')
      .parentsUntil('.Polaris-Card')
      .parent()
      .contains('Active')
      .should('exist')
  })
})

describe('Sender can see their task has been accepted', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user1)
    cy.get('input[name=password]').type(password1)
    cy.get('[data-test="loginButton"]').click()
  })

  it.skip('accepts a pending task', () => {
    cy.url().should('include', '/dashboard')
    cy
      .contains('something something else')
      .parentsUntil('.Polaris-Card')
      .parent()
      .contains('Active')
      .should('exist')
  })
})

describe('Rejecting a Pending Task', () => {
  it.skip('Sends a task to user 2', () => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user1)
    cy.get('input[name=password]').type(password1)
    cy.get('[data-test="loginButton"]').click()

    cy.contains('Send Someone A Realsie').click()
    cy.get('input[type=email]').type(user2)
    cy.get('input[type=text]').type('something something hey')
    cy.contains('Send Realsie').click()
    cy.url().should('include', '/dashboard')
    cy.contains('something something hey').should('exist')
  })

  it.skip('User 2 rejects the task', () => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user2)
    cy.get('input[name=password]').type(password2)
    cy.get('[data-test="loginButton"]').click()
    cy.url().should('include', '/dashboard')
    cy
      .contains('something something hey')
      .parentsUntil('.Polaris-Card')
      .parent()
      .contains('Decline')
      .click()

    cy.contains('something something hey').should('not.exist')
  })

  it.skip('User 1 can see the task has been rejected', () => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user1)
    cy.get('input[name=password]').type(password1)
    cy.get('[data-test="loginButton"]').click()
    cy.wait(15000)
    cy.get('[data-test="taskDeclined"]').should('exist')
  })
})

describe('Delivering on a Task', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(username)
    cy.get('input[name=password]').type(`test123`)
    cy.get('[data-test="loginButton"]').click()
  })

  it.skip('upload and submit a task', () => {
    cy.contains('Send Someone A Realsie').click()
    cy.get('input[type=text]').type(`something something`)
    cy.get('input[type=email]').type(`something@something.com`)
    cy.get('input[type=submit]').click()
    cy.contains('something something')
  })

  // test that user account gets created from email in task
  // test that a user can deliver a file and that teh recipeint gets it
})

// make sure you delete user at the end
describe('Delete test User Accounts', () => {
  it.skip('deletes user1 account', () => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user1)
    cy.get('input[name=password]').type(password1)
    cy
      .get('[data-test="loginButton"]')
      .click()
      .then({ timeout: 8000 }, () => {
        cy.url().should('include', '/dashboard')
      })
    cy.visit('/settings')
    cy.url().should('include', '/settings')
    cy.get('[data-test="deleteUser"]').click()
    cy.url().should('include', '/login')
  })

  it.skip('deletes user2 account', () => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user2)
    cy.get('input[name=password]').type(password2)
    cy
      .get('[data-test="loginButton"]')
      .click()
      .then({ timeout: 8000 }, () => {
        cy.url().should('include', '/dashboard')
      })
    cy.visit('/settings')
    cy.url().should('include', '/settings')
    cy.get('[data-test="deleteUser"]').click()
    cy.url().should('include', '/login')
  })
})

// it('deliver an accepted task', () => {})
// it('archive a complete task', () => {})
// test submissions
