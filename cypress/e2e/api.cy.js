describe('API JSONPlaceholder — /users', () => {
  const TOTAL_USERS = 10
  const TOTAL_BIZ_USERS = 3
  const withUsers = (callback) => cy.get('@processedData').then(callback)

  describe('sem filtro', () => {
    beforeEach(() => {
      cy.getUsers()
    })

    // Contrato — estrutura e tipos dos dados retornados
    it('valida estrutura e tipos de todos os usuários', () => {
      withUsers((users) => {
        expect(users).to.be.an('array').with.length(TOTAL_USERS)
        users.forEach((user) => {
          cy.log(`Validando contrato de #${user.id} ${user.name}`)
          cy.validateUserContract(user)
        })
      })
    })

    // Transformação 1 — emailDomain
    // permite filtrar/agrupar usuários por provedor de email
    it('extrai o domínio do email de todos os usuários', () => {
      withUsers((users) => {
        users.forEach((user) => {
          cy.log(`#${user.id} ${user.email} → ${user.emailDomain}`)
          expect(user.emailDomain).to.not.include('@')
          expect(user.emailDomain).to.match(/^[\w.-]+\.\w+$/)
        })
      })
    })

    // Transformação 2 — phoneDigits
    // padroniza 4 formatos diferentes de telefone para facilitar comparações
    it('padroniza telefone para somente dígitos em todos os usuários', () => {
      withUsers((users) => {
        users.forEach((user) => {
          cy.log(`#${user.id} "${user.phone}" → "${user.phoneDigits}"`)
          expect(user.phoneDigits).to.match(/^\d+$/)
          expect(user.phoneDigits.length).to.be.gte(7)
        })
      })
    })

    // Transformação 3 — companyKey
    // identificador estável da empresa que pode ser usado para fixtures e seletores
    it('gera slug único por empresa para todos os usuários', () => {
      withUsers((users) => {
        const companyKeys = users.map((u) => u.companyKey)
        users.forEach((user) => {
          cy.log(`#${user.id} "${user.company.name}" → "${user.companyKey}"`)
          expect(user.companyKey).to.match(/^[a-z0-9-]+$/)
        })
        expect(new Set(companyKeys).size, 'keys únicos').to.eq(TOTAL_USERS)
      })
    })

    it('valida os campos transformados de todos os usuários', () => {
      withUsers((users) => {
        users.forEach((user) => {
          cy.log(`Validando campos transformados de #${user.id} ${user.name}`)
          cy.validateUserTransforms(user)
        })
      })
    })
  })

  describe('com filtro por TLD', () => {
    beforeEach(() => {
      cy.getUsers({ tldFilter: 'biz' })
    })

    // Parametrização — filtro por TLD via opção ou Cypress.env
    // filtrar por TLD (top-level domain) do email (iteração com um dado transformado)
    it('filtra usuários por TLD de email (.biz retorna exatamente 3)', () => {
      withUsers((users) => {
        cy.log(`Usuários .biz: ${users.map((u) => u.email).join(', ')}`)
        expect(users).to.have.length(TOTAL_BIZ_USERS)
        users.forEach((u) => expect(u.emailDomain).to.match(/\.biz$/))
      })
    })
  })
})