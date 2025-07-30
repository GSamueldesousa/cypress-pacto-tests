describe('Buscar "Pacto Soluções" no Yahoo e acessar o site oficial', () => {
  it('deve encontrar o link e acessar o site da Pacto Soluções', () => {
   
    cy.visit('https://search.yahoo.com');


    cy.get('input[name="p"]', { timeout: 10000 })
      .type('Pacto Soluções')
      .type('{enter}');

    cy.get('#web a[href*="sistemapacto"]', { timeout: 10000 }).should('be.visible');

    cy.get('#web a[href*="sistemapacto"]')
      .first()
      .invoke('attr', 'href')
      .then((href) => {
        cy.log('🔍 URL do Yahoo:', href);

        const patterns = [
          /RU=([^&]+)/i,
          /(https?%3A%2F%2Fsistemapacto\.com\.br[^&]*)/i,
          /(https?:\/\/sistemapacto\.com\.br)/i
        ];

        let targetUrl = null;

        for (const pattern of patterns) {
          const match = href.match(pattern);
          if (match && match[1]) {
            targetUrl = decodeURIComponent(match[1]);
            break;
          }
        }

        if (!targetUrl) {
          targetUrl = href;
        }

        cy.log('URL final:', targetUrl);

        const domain = new URL(targetUrl).origin;

        cy.origin(domain, () => {
          cy.visit('/');

        
          cy.contains('Uma solução completa para auxiliar no crescimento do seu negócio fitness!', { timeout: 30000 })
            .should('be.visible');

          cy.title().should('contain', 'Pacto');
          cy.url().should('include', 'sistemapacto.com.br');

        
          cy.screenshot('acesso-via-yahoo-sistemapacto-com-br', {
            capture: 'viewport'
          });
        });
      });
  });
});
