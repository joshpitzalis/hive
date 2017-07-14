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
    cy.contains('Add a New Thing').click()
    cy.get('input[name=deliverable]').type(`something something`)
    cy.get('input[placeholder=someone]').type(`something@something.com`)
    cy.get('input[type=submit]').click()
    cy.contains('something something')
  })

  // test a specific date
})

describe('Delivering on a Task', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name=email-address]').type(username)
    cy.get('input[name=password]').type(`test123{enter}`)
  })

  it('upload and submit an image', () => {
    // cy.contains('Add a New Thing').click()
    // cy.get('input[name=deliverable]').type(`something something`)
    // cy.get('input[placeholder=someone]').type(`something@something.com`)
    // cy.get('input[type=submit]').click()
    // cy.contains('something something')
  })
  // test specific date
})

// make sure you delete user at the end
