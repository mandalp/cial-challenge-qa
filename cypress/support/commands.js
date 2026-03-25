const DEFAULT_BASE_URL = 'https://jsonplaceholder.typicode.com'
const DEFAULT_ROUTE = '/users'

// Validação do contrato da API
const assertUserContract = (user) => {
  expect(user).to.be.an('object')

  expect(user).to.have.property('id').that.is.a('number')
  expect(user).to.have.property('name').that.is.a('string').and.not.empty
  expect(user).to.have.property('username').that.is.a('string').and.not.empty
  expect(user).to.have.property('email').that.is.a('string').and.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  expect(user).to.have.property('phone').that.is.a('string').and.not.empty
  expect(user).to.have.property('website').that.is.a('string').and.match(/^[\w.-]+\.\w+$/)

  expect(user).to.have.nested.property('address.street').that.is.a('string').and.not.empty
  expect(user).to.have.nested.property('address.suite').that.is.a('string').and.not.empty
  expect(user).to.have.nested.property('address.city').that.is.a('string').and.not.empty
  expect(user).to.have.nested.property('address.zipcode').that.is.a('string').and.not.empty
  expect(user).to.have.nested.property('address.geo.lat').that.is.a('string').and.match(/^-?\d+(\.\d+)?$/)
  expect(user).to.have.nested.property('address.geo.lng').that.is.a('string').and.match(/^-?\d+(\.\d+)?$/)

  expect(user).to.have.nested.property('company.name').that.is.a('string').and.not.empty
  expect(user).to.have.nested.property('company.catchPhrase').that.is.a('string').and.not.empty
  expect(user).to.have.nested.property('company.bs').that.is.a('string').and.not.empty
}

// Validação das transformações aplicadas aos dados
const assertUserTransforms = (user) => {
  expect(user).to.have.property('emailDomain').that.is.a('string').and.not.include('@')
  expect(user.emailDomain, 'emailDomain formato').to.match(/^[\w.-]+\.\w+$/)

  expect(user).to.have.property('phoneDigits').that.is.a('string').and.match(/^\d+$/)
  expect(user.phoneDigits.length, 'phoneDigits tamanho minimo').to.be.gte(7)

  expect(user).to.have.property('companyKey').that.is.a('string').and.match(/^[a-z0-9-]+$/)
}

// Busca e processa usuários da API com transformações
Cypress.Commands.add('getUsers', (options = {}) => {
  const baseUrl = options.baseUrl ?? Cypress.env('API_BASE_URL') ?? DEFAULT_BASE_URL
  const route = options.route ?? Cypress.env('API_ROUTE') ?? DEFAULT_ROUTE
  const tldFilter = options.tldFilter ?? Cypress.env('API_TLD_FILTER') ?? null

  return cy.request('GET', `${baseUrl}${route}`).then(({ status, body }) => {
    expect(status).to.eq(200)
    expect(body).to.be.an('array')

    const users = body
      .map((user) => ({
        ...user,
        emailDomain: user.email.replace(/^[^@]+@/, ''),
        phoneDigits: user.phone.replace(/\D/g, ''),
        companyKey: user.company.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-'),
      }))
      .filter((user) => !tldFilter || user.emailDomain.endsWith(`.${tldFilter}`))

    cy.log(
      `**getUsers** - ${users.length} usuarios processados${tldFilter ? ` (filtro: .${tldFilter})` : ''
      }`
    )

    users.forEach(({ id, name, emailDomain, phoneDigits, companyKey }) => {
      cy.log(`#${id} ${name} | ${emailDomain} | ${phoneDigits} | ${companyKey}`)
    })

    return cy.wrap(users, { log: false }).as('processedData')
  })
})

// Validação do contrato da API
Cypress.Commands.add('validateUserContract', (user) => {
  assertUserContract(user)
})

// Validação das transformações aplicadas aos dados
Cypress.Commands.add('validateUserTransforms', (user) => {
  assertUserTransforms(user)
})

// Validação completa do usuário (contrato + transformações)
Cypress.Commands.add('validateUser', (user) => {
  assertUserContract(user)
  assertUserTransforms(user)
})