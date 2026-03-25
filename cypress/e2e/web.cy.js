import LoginActions from '../support/actions/login.actions'
import { validUser, invalidUsers } from '../fixtures/users.json'

describe('Login', () => {
  it('deve fazer login com credenciais válidas', () => {
    cy.log('Acessa pagina de login')
    LoginActions.doLogin(validUser.username, validUser.password)
    
    cy.log('Verifica mensagem de sucesso esta visivel e se url contem /secure')
    cy.contains(validUser.welcomeMessage).should('be.visible')
    cy.url().should('include', '/secure')
  })

  describe('Credenciais Inválidas', () => {
    invalidUsers.forEach(({ scenario, username, password, message }) => {
      it(`deve mostrar erro com ${scenario}`, () => {
        cy.log(`Acessa pagina de login com ${scenario}`)
        LoginActions.doLogin(username, password)
        
        cy.log(`Verifica mensagem de erro para ${scenario} e se classe error esta presente`)
        cy.contains(message).should('be.visible')
        cy.get('#flash').should('have.class', 'error')
      })
    })
  })
})

describe('CheckBoxes', () => {
  it('deve marcar checkbox', () => {
    cy.log('Acessa pagina de checkboxes')
    cy.visit('/checkboxes')
    
    cy.log('Marca primeira checkbox')
    cy.get('#checkboxes input').first().check()
    
    cy.log('Valida que checkbox esta marcada')
    cy.get('#checkboxes input').first().should('be.checked')
  })

  it('deve desmarcar checkbox', () => {
    cy.log('Acessa pagina de checkboxes')
    cy.visit('/checkboxes')
    
    cy.log('Desmarca primeira checkbox')
    cy.get('#checkboxes input').first().uncheck()
    
    cy.log('Valida que checkbox esta desmarcada')
    cy.get('#checkboxes input').first().should('not.be.checked')
  })
})

describe('Dropdown', () => {
  it('deve selecionar opcao no dropdown', () => {
    cy.log('Acessa pagina de dropdown')
    cy.visit('/dropdown')
    
    cy.log('Seleciona Option 1')
    cy.get('#dropdown').select(1)
    
    cy.log('Valida valor selecionado e se valor corresponde ao texto exibido')
    cy.get('#dropdown').should('have.value', '1')
    cy.get('#dropdown option:selected').should('contain', 'Option 1')
  })
})

describe('Drag and Drop', () => {
  it('deve arrastar coluna A para B', () => {
    cy.log('Acessa pagina de drag and drop')
    cy.visit('/drag_and_drop')
    
    cy.log('Inicia DataTransfer para simular drag and drop')
    const dataTransfer = new DataTransfer()
    
    cy.log('Disparando evento dragstart na coluna A')
    cy.get('#column-a').trigger('dragstart', { dataTransfer })
    
    cy.log('Soltando coluna A sobre a coluna B (evento drop)')
    cy.get('#column-b').trigger('drop', { dataTransfer })
    
    cy.log('Finalizando ação de drag (evento dragend)')
    cy.get('#column-a').trigger('dragend')
    
    cy.log('Validando se os headers foram trocados corretamente após o drag and drop')
    cy.get('#column-a header').should('contain', 'B')
    cy.get('#column-b header').should('contain', 'A')
  })
})

describe('Upload File', () => {
  it('deve fazer upload de arquivo', () => {
    cy.log('Acessa pagina de upload')
    cy.visit('/upload')
    
    cy.log('Seleciona arquivo para upload')
    cy.get('#file-upload').selectFile('cypress/fixtures/test.txt')
    
    cy.log('Envia arquivo')
    cy.get('#file-submit').click()
    
    cy.log('Valida mensagem de sucesso e se o arquivo foi listado')
    cy.contains('File Uploaded!').should('be.visible')
    cy.get('#uploaded-files').should('contain', 'test.txt')
  })
})

describe('Redirect', () => {
  it('deve redirecionar para outra pagina', () => {
    cy.log('Acessa pagina de redirect')
    cy.visit('/redirector')
    
    cy.log('Clica no link de redirect')
    cy.get('#redirect').click()
    
    cy.log('Verifica que a URL mudou e se página contem "Status Codes"')
    cy.url().should('include', '/status_codes')
    cy.contains('Status Codes').should('be.visible')
  })
})
