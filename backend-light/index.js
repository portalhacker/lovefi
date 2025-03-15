'use strict';

import path from 'path';
import { fileURLToPath } from 'url';

import bodyParser from 'body-parser';
import express from 'express';

import GoogleSheetsService from './services/google_sheets.js';
import PlaidService from './services/plaid.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const googleSheetsService = new GoogleSheetsService();
const plaidService = new PlaidService();

export async function listSheetsController(req, res) {
  try {
    const sheets = await googleSheetsService.listSheets();
    res.json(sheets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function writeRangeController(req, res) {
  try {
    const { range, value } = req.body;
    const result = await googleSheetsService.writeRange(range, [[value]]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function readRangeController(req, res) {
  try {
    const { range } = req.query;
    const result = await googleSheetsService.readRange(range);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function listInstitutionsController(req, res) {
  try {
    const institutions = await plaidService.listInstitutions();
    res.json(institutions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getLinkTokenController(req, res) {
  try {
    const linkToken = await plaidService.createLinkToken();
    res.redirect(linkToken.hosted_link_url);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAccessTokenController(req, res) {
  try {
    const publicToken = await plaidService.createLinkToken();
    const accessToken = await plaidService.getAccessToken(publicToken);
    await Promise.all([
      googleSheetsService.writeRange('credentials!PLAID', [
        [JSON.stringify(accessToken)],
      ]),
      googleSheetsService.writeRange('credentials!CURSOR', [['']]),
    ]);
    res.json(accessToken);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function syncTransactionsController(req, res) {
  try {
    const [cellValue, cursorCell] = await Promise.all([
      googleSheetsService.readRange('credentials!PLAID'),
      googleSheetsService.readRange('credentials!CURSOR'),
    ]);
    const { access_token } = JSON.parse(cellValue.values[0][0]);
    const newTransactions = cursorCell.values
      ? await plaidService.syncTransactions(
          access_token,
          cursorCell.values[0][0]
        )
      : await plaidService.syncTransactions(access_token);

    console.log(newTransactions);

    const transactionsRange = await googleSheetsService.readRange(
      'test_transactions!A2:F'
    );
    let transactions = transactionsRange.values.map((transaction) => ({
      id: transaction[0],
      date: transaction[1],
      account: transaction[2],
      vendor: transaction[3],
      description: transaction[4],
      value: transaction[5],
    }));

    newTransactions.added.forEach((transaction) => {
      if (!transactions.some((t) => t.id === transaction.transaction_id)) {
        transactions.push({
          id: transaction.transaction_id,
          date: transaction.date,
          account: transaction.account_id,
          vendor: transaction.merchant_name,
          description: transaction.name,
          value: transaction.amount,
        });
      }
    });

    newTransactions.modified.forEach((transaction) => {
      const index = transactions.findIndex(
        (t) => t.id === transaction.transaction_id
      );
      transactions[index] = {
        id: transaction.transaction_id,
        date: transaction.date,
        account: transaction.account_id,
        vendor: transaction.merchant_name,
        description: transaction.name,
        value: transaction.amount,
      };
    });

    newTransactions.removed.forEach((transaction) => {
      transactions = transactions.filter(
        (t) => t.id !== transaction.transaction_id
      );
    });

    const values = transactions.map((transaction) => [
      transaction.id,
      transaction.date,
      transaction.account,
      transaction.vendor,
      transaction.description,
      transaction.value,
    ]);

    await Promise.all([
      googleSheetsService.writeRange('test_transactions!A2:F', values),
      googleSheetsService.writeRange('credentials!CURSOR', [
        [newTransactions.cursor],
      ]),
    ]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function receiveNotificationsController(req, res) {
  try {
    console.log('🚨 Webhook received:', req.body);
    if (req.body.webhook_code === 'SYNC_UPDATES_AVAILABLE') {
      await syncTransactionsController(req, res);
      return;
    } else if (
      req.body.webhook_type === 'LINK' &&
      req.body.webhook_code === 'ITEM_ADD_RESULT'
    ) {
      const public_token = req.body.public_token;
      const accessToken = await plaidService.getAccessToken(public_token);
      await Promise.all([
        googleSheetsService.writeRange('credentials!PLAID', [
          [JSON.stringify(accessToken)],
        ]),
        googleSheetsService.writeRange('credentials!CURSOR', [['']]),
      ]);
    }
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function fireTestWebhookEventController(req, res) {
  try {
    const cellValue = (await googleSheetsService.readRange('credentials!PLAID'))
      .values[0][0];
    const { access_token } = JSON.parse(cellValue);
    await plaidService.fireTestWebhookEvent(access_token);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// For local development
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

app.get('/', (req, res) => res.sendFile('index.html', { root: __dirname }));
// app.get('/listSheets', listSheetsController);
// app.post('/writeRange', writeRangeController);
// app.get('/readRange', readRangeController);
// app.get('/listInstitutions', listInstitutionsController);
app.get('/getLinkToken', getLinkTokenController);
// app.get('/getAccessToken', getAccessTokenController);
app.get('/syncTransactions', syncTransactionsController);
app.post('/receiveNotifications', receiveNotificationsController);
app.get('/fireTestWebhookEventController', fireTestWebhookEventController);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
