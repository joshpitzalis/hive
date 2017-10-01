const user1 = 'test@test.com'
const password1 = 'test123'
const user2 = 'something@something.com'
const password2 = 'changeme'

describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/')
  })
})

describe('The Registration Page', () => {
  it('creates a test user', () => {
    cy.visit('/register')
    cy.get('input[placeholder=Email]').type(user1)
    cy.get('input[placeholder=Password]').type(password1)
    cy.get('[data-test="registerButton"]').click()
    cy.url().should('include', '/dashboard')
  })
})

describe('The Login Process', () => {
  it('logs in successfully', () => {
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

  it('creates a new task', () => {
    cy.contains('Send Someone A Realsie').click()
    cy.get('input[type=email]').type(user2)
    cy.get('input[type=text]').type('something something')
    cy.contains('Send Realsie').click()
    cy.url().should('include', '/dashboard')
    cy.contains('something something')
  })

// test a specific date
// test with a link
})

describe('Recieving a New Task', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user2)
    cy
      .get('input[name=password]')
      .type(password2)
      .then({ timeout: 8000 }, () => {
        // you need to wait a little while for cloud functions to create the user
        cy.get('[data-test="loginButton"]').click()
      })
  })

  it('recieved a new task', () => {
    cy.url().should('include', '/dashboard')
    cy.contains('something something')
  })
})

describe('Sending multiple tasks to the same User', () => {
  it('sends a second task', () => {
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

  it('recieves the second task', () => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user2)
    cy.get('input[name=password]').type(password2)
    cy.get('[data-test="loginButton"]').click()
    cy.url().should('include', '/dashboard')
    cy.contains('something something else')
  })
})

describe('Accepting a Pending Task', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user2)
    cy.get('input[name=password]').type(password2)
    cy.get('[data-test="loginButton"]').click()
  })

  it('accepts a pending task', () => {
    cy.url().should('include', '/dashboard')
    cy
      .contains('something something else')
      .parentsUntil('.Polaris-Card')
      .parent()
      .contains('Accept')
      .click()

    cy
      .get('[aria-label="Credit or debit card number"]')
      .type('4242 4242 4242 4242')

    cy.get('[aria-label="Credit or debit card expiration date"]').type('0424')
    cy.get('[aria-label="Credit or debit card CVC/CVV"]').type('242')
    cy.get('[aria-label="ZIP"]').type('42424')
    cy.get('.Polaris-Button--primary').click()

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

  it('accepts a pending task', () => {
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
  it('Sends a task to user 2', () => {
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

  it('User 2 rejects the task', () => {
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

  it('User 1 can see the task has been rejected', () => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(user1)
    cy.get('input[name=password]').type(password1)
    cy.get('[data-test="loginButton"]').click()
    cy.wait(15000)
    cy.get('[data-test="taskDeclined"]').should('exist')
  })
})

// describe('Delivering on a Task', () => {
//   beforeEach(() => {
//     cy.visit('/login')
//     cy.get('input[name=email-address]').type(username)
//     cy.get('input[name=password]').type(`test123`)
//     cy.get('[data-test="loginButton"]').click()
//   })
//
//   it('upload and submit a task', () => {
//     cy.contains('Send Someone A Realsie').click()
//     cy.get('input[type=text]').type(`something something`)
//     cy.get('input[type=email]').type(`something@something.com`)
//     cy.get('input[type=submit]').click()
//     cy.contains('something something')
//   })
//
//   // test that user account gets created from email in task
//   // test that a user can deliver a file and that teh recipeint gets it
// })

// make sure you delete user at the end
describe('Delete test User Accounts', () => {
  it('deletes user1 account', () => {
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

  it('deletes user2 account', () => {
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

it('deliver an accepted task', () => {
})
it('archive a complete task', () => {
})
