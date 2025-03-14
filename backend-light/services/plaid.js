'use strict';

import { configDotenv } from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

configDotenv();

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export async function listInstitutions() {
  const request = {
    count: 100,
    offset: 0,
    country_codes: process.env.PLAID_COUNTRY_CODES.split(','),
  };
  try {
    const response = await plaidClient.institutionsGet(request);
    return response.data.institutions;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function createLinkToken(request, response) {
  const publicTokenRequest = {
    institution_id: 'ins_130358',
    initial_products: process.env.PLAID_PRODUCTS.split(','),
    options: {
      // webhook: 'https://webhook.site/43be2e82-79a7-4cf1-aa6f-1d4fc192a2d3',
      webhook: `${process.env.WEBHOOK_HOST}/receiveNotifications`,
    },
  };
  try {
    const publicTokenResponse = await plaidClient.sandboxPublicTokenCreate(
      publicTokenRequest
    );
    return publicTokenResponse.data.public_token;
  } catch (error) {
    console.error(error);
  }
}

export async function getAccessToken(publicToken) {
  try {
    // The generated public_token can now be exchanged
    // for an access_token
    const exchangeRequest = {
      public_token: publicToken,
    };
    const exchangeTokenResponse = await plaidClient.itemPublicTokenExchange(
      exchangeRequest
    );
    console.log('Exchange response: ', exchangeTokenResponse.data);
    return exchangeTokenResponse.data;
  } catch (error) {
    console.error(error);
  }
}

export async function syncTransactions(accessToken, cursor = null) {
  // Provide a cursor from your database if you've previously
  // received one for the Item. Leave null if this is your
  // first sync call for this Item. The first request will
  // return a cursor.
  // let cursor = database.getLatestCursorOrNull(itemId);

  // New transaction updates since "cursor"
  let added = [];
  let modified = [];
  // Removed transaction ids
  let removed = [];
  let hasMore = true;

  // Iterate through each page of new transaction updates for item
  while (hasMore) {
    const request = {
      access_token: accessToken,
      cursor: cursor,
    };
    const response = await plaidClient.transactionsSync(request);
    const data = response.data;

    // Add this page of results
    added = added.concat(data.added);
    modified = modified.concat(data.modified);
    removed = removed.concat(data.removed);

    hasMore = data.has_more;

    // Update cursor to the next cursor
    cursor = data.next_cursor;
  }

  // Persist cursor and updated data
  return {
    added,
    modified,
    removed,
    cursor,
  };
}

export async function fireTestWebhookEvent(accessToken) {
  const request = {
    access_token: accessToken,
    webhook_code: 'SYNC_UPDATES_AVAILABLE',
    // webhook_code: 'DEFAULT_UPDATE',
    webhook_type: 'TRANSACTIONS',
  };
  try {
    const response = await plaidClient.sandboxItemFireWebhook(request);
    return response;
  } catch (error) {
    console.error(error);
  }
}
