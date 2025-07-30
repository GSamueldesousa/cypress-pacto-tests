// cypress/e2e/yahoo-pacto.cy.js
describe('Buscar "Pacto Soluções" no Yahoo e acessar o site oficial', () => {
  it('deve encontrar o link e acessar o site da Pacto Soluções', () => {
    // Acessa o Yahoo
    cy.visit('https://search.yahoo.com');

    // Faz a busca
    cy.get('input[name="p"]', { timeout: 10000 })
      .type('Pacto Soluções')
      .type('{enter}');

    // Espera o resultado com "sistemapacto" ficar visível
    cy.get('#web a[href*="sistemapacto"]', { timeout: 10000 }).should('be.visible');

    // Extrai o href do link
    cy.get('#web a[href*="sistemapacto"]')
      .first()
      .invoke('attr', 'href')
      .then((href) => {
        cy.log('🔍 URL do Yahoo:', href);

        // Padrões para extrair a URL real
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

        // Fallback: usa o próprio href
        if (!targetUrl) {
          targetUrl = href;
        }

        cy.log('✅ URL final:', targetUrl);

        // ✅ ACESSA DIRETAMENTE O SITE SEM cy.origin()
        cy.visit(targetUrl, {
          onBeforeLoad: (win) => {
            // Remove o target de todas as janelas
            win.open = cy.stub().as('windowOpen');
          }
        });
      });

    // ✅ VALIDA O CONTEÚDO DA PÁGINA (único e confiável)
    cy.contains('Uma solução completa para auxiliar no crescimento do seu negócio fitness!', { timeout: 30000 }).should('be.visible');
    cy.title().should('contain', 'Pacto');
    cy.url().should('include', 'sistemapacto.com.br');

    // Tira um print como evidência
    cy.screenshot('acesso-via-yahoo-sistemapacto-com-br', {
      capture: 'viewport'
    });
  });
});