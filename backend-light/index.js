'use strict';

import path from 'path';
import { fileURLToPath } from 'url';

import bodyParser from 'body-parser';
import express from 'express';

import { listSheets, readRange, writeRange } from './services/google_sheets.js';
import {
  createLinkToken,
  fireTestWebhookEvent,
  getAccessToken,
  listInstitutions,
  syncTransactions,
} from './services/plaid.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function listSheetsController(req, res) {
  res.json(await listSheets());
}

export async function writeRangeController(req, res) {
  const { range, value } = req.body;
  res.json(await writeRange(range, [[value]]));
}

export async function readRangeController(req, res) {
  const { range } = req.query;
  res.json(await readRange(range));
}

export async function listInstitutionsController(req, res) {
  res.json(await listInstitutions());
}

export async function getAccessTokenController(req, res) {
  const publicToken = await createLinkToken();
  const accessToken = await getAccessToken(publicToken);
  writeRange('credentials!PLAID', [[JSON.stringify(accessToken)]]);
  res.json(accessToken);
}

export async function syncTransactionsController(req, res) {
  const cellValue = (await readRange('credentials!PLAID')).values[0][0];
  const { access_token } = await JSON.parse(cellValue);
  const cursorCell = await readRange('credentials!CURSOR');
  let newTransactions;
  if (cursorCell.values) {
    newTransactions = await syncTransactions(
      access_token,
      cursorCell.values[0][0]
    );
  } else {
    newTransactions = await syncTransactions(access_token);
  }
  console.log(newTransactions);
  const transactionsRange = (await readRange('test_transactions!A2:F')).values;
  let transactions = transactionsRange.map((transaction) => {
    return {
      id: transaction[0],
      date: transaction[1],
      account: transaction[2],
      vendor: transaction[3],
      description: transaction[4],
      value: transaction[5],
    };
  });
  // add new transactions
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
  // modified transactions
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
  // removed transactions
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
  await writeRange('test_transactions!A2:F', values);
  res.json(await writeRange('credentials!CURSOR', [[newTransactions.cursor]]));
}

export async function receiveNotificationsController(req, res) {
  // receive notifications from Plaid, like new transactions with SYNC_UPDATES_AVAILABLE
  console.log(req.body);
  if (req.body.webhook_code === 'SYNC_UPDATES_AVAILABLE') {
    await syncTransactionsController(req, res);
    return;
  }
  res.sendStatus(200);
}

export async function fireTestWebhookEventController(req, res) {
  const cellValue = (await readRange('credentials!PLAID')).values[0][0];
  const { access_token } = await JSON.parse(cellValue);
  await fireTestWebhookEvent(access_token);
  res.sendStatus(200);
}

// For local development
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

app.get('/', (req, res) => res.sendFile('index.html', { root: __dirname }));
app.get('/listSheets', listSheetsController);
app.post('/writeRange', writeRangeController);
app.get('/readRange', readRangeController);
app.get('/listInstitutions', listInstitutionsController);
app.get('/getAccessToken', getAccessTokenController);
app.get('/syncTransactions', syncTransactionsController);
app.post('/receiveNotifications', receiveNotificationsController);
app.get('/fireTestWebhookEventController', fireTestWebhookEventController);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
