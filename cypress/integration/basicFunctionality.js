const username = 'test@test.com'

describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/')
  })
})

describe('The Registration Page', () => {
  it('creates a test user', () => {
    cy.visit('/register')
    cy.get('input[placeholder=Email]').type(username)
    cy.get('input[placeholder=Password]').type(`test123`)
    cy.get('[data-test="registerButton"]').click()
    cy.url().should('include', '/dashboard')
  })
})

describe('The Login Process', () => {
  it('logs in successfully', () => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(username)
    cy.get('input[name=password]').type(`test123`)
    cy.get('[data-test="loginButton"]').click()
    cy.url().should('include', '/dashboard')
  })
})

describe('Creating a New Task', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(username)
    cy.get('input[name=password]').type(`test123`)
    cy.get('[data-test="loginButton"]').click()
  })

  it('creates a new task', () => {
    cy.contains('Send Someone A Realsie').click()
    cy.get('input[type=email]').type(`something@something.com`)
    cy.get('input[type=text]').type(`something something`)
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
    cy.get('input[name=email-address]').type(`something@something.com`)
    cy
      .get('input[name=password]')
      .type(`changeme`)
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

describe('Accepting a Pending Task', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(`something@something.com`)
    cy.get('input[name=password]').type(`changeme`)
    cy.get('[data-test="loginButton"]').click()
  })

  it('accepts a pending task', () => {
    cy.url().should('include', '/dashboard')
    cy.contains('something hey')
  })

  it('rejects a pending task', () => {
    cy.url().should('include', '/dashboard')
    cy.contains('something hey')
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
  it('deletes a user account', () => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(username)
    cy.get('input[name=password]').type(`test123`)
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

  it('deletes a user account', () => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(`something@something.com`)
    cy.get('input[name=password]').type(`changeme`)
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
