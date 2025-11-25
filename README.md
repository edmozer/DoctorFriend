<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js

### Para enviar e-mails com SendGrid

1. Crie uma conta gratuita em https://app.sendgrid.com/
2. Gere uma API Key em Settings > API Keys
3. Adicione ao seu arquivo `.env`:
   ```
   SENDGRID_API_KEY=SG.sua_chave_aqui
   EMAIL_FROM=seu@email.com
   ```
4. Instale o pacote:
   `npm install @sendgrid/mail`
5. Execute o script de lembrete:
   `node sendEmailReminders.js`

Se aparecer "Email sent to ..." no terminal, está funcionando!
