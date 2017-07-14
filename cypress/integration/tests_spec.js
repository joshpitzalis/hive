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
    cy.get('input[placeholder=Password]').type(`test123{enter}`)
    cy.url().should('include', '/dashboard')
  })
})

describe('The Login Process', () => {
  it('logs in successfully', () => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(username)
    cy.get('input[name=password]').type(`test123{enter}`)
  })
})

describe('Creating a New Task', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(username)
    cy.get('input[name=password]').type(`test123{enter}`)
  })

  it('creates a new task', () => {
    cy.contains('Promise To Do Something').click()
    cy.get('input[name=deliverable]').type(`something something`)
    cy.get('input[type=email]').type(`test@two.com`)
    cy.get('input[type=submit]').click()
    cy.contains('something something')
  })

  // test a specific date
  // test with a link
})

describe('Delivering on a Task', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(username)
    cy.get('input[name=password]').type(`test123{enter}`)
  })

  it('upload and submit a task', () => {
    // cy.contains('Add a New Thing').click()
    // cy.get('input[name=deliverable]').type(`something something`)
    // cy.get('input[placeholder=someone]').type(`something@something.com`)
    // cy.get('input[type=submit]').click()
    // cy.contains('something something')
  })

  // test that user account gets created from email in task
  // test that a user can deliver a file and that teh recipeint gets it
})

// make sure you delete user at the end
