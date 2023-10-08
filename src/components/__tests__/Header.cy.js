import Header from '../Header.vue'

describe('Header', () => {
  it('playground', () => {
    cy.mount(Header, { props: { msg: 'Hello Cypress' } })
  })

  it('renders properly', () => {
    cy.mount(Header, { props: { msg: 'Hello Cypress' } })
    cy.get('h1').should('contain', 'Hello Cypress')
  })
})
