describe('backoffice-common: BackofficeCommon component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=backofficecommon--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to BackofficeCommon!');
    });
});
