'use strict';

import { configDotenv } from 'dotenv';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

configDotenv();

class PlaidService {
  constructor() {
    const configuration = new Configuration({
      basePath: PlaidEnvironments.sandbox,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
          'PLAID-SECRET': process.env.PLAID_SECRET,
        },
      },
    });
    this.plaidClient = new PlaidApi(configuration);
  }

  async listInstitutions() {
    const request = {
      count: 100,
      offset: 0,
      country_codes: process.env.PLAID_COUNTRY_CODES.split(','),
    };
    try {
      const response = await this.plaidClient.institutionsGet(request);
      return response.data.institutions;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async createLinkToken() {
    const request = {
      user: {
        client_user_id: '1',
      },
      client_name: 'lovefi',
      products: process.env.PLAID_PRODUCTS.split(','),
      transactions: {
        days_requested: 730,
      },
      country_codes: process.env.PLAID_COUNTRY_CODES.split(','),
      language: 'en',
      webhook: `${process.env.WEBHOOK_HOST}/receiveNotifications`,
      hosted_link: {},
      // redirect_uri: 'https://domainname.com/oauth-page.html',
      // account_filters: {
      //   credit: {
      //     account_subtypes: ['credit card'],
      //   },
      // },
    };
    try {
      const linkTokenResponse = await this.plaidClient.linkTokenCreate(request);
      return linkTokenResponse.data;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * This method is only for development purposes to bypass the Plaid Link flow on the sandbox environment
   * In production, you should use the createLinkToken method
   *
   * @returns {string} publicToken
   */
  async getPublicTokenInDev() {
    const publicTokenRequest = {
      institution_id: 'ins_130358',
      initial_products: process.env.PLAID_PRODUCTS.split(','),
      options: {
        webhook: `${process.env.WEBHOOK_HOST}/receiveNotifications`,
      },
    };
    try {
      const publicTokenResponse =
        await this.plaidClient.sandboxPublicTokenCreate(publicTokenRequest);
      return publicTokenResponse.data.public_token;
    } catch (error) {
      console.error(error);
    }
  }

  async getAccessToken(publicToken) {
    try {
      const exchangeRequest = {
        public_token: publicToken,
      };
      const exchangeTokenResponse =
        await this.plaidClient.itemPublicTokenExchange(exchangeRequest);
      console.log('Exchange response: ', exchangeTokenResponse.data);
      return exchangeTokenResponse.data;
    } catch (error) {
      console.error(error);
    }
  }

  async syncTransactions(accessToken, cursor = null) {
    let added = [];
    let modified = [];
    let removed = [];
    let hasMore = true;

    while (hasMore) {
      const request = {
        access_token: accessToken,
        cursor: cursor,
      };
      const response = await this.plaidClient.transactionsSync(request);
      const data = response.data;

      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);

      hasMore = data.has_more;
      cursor = data.next_cursor;
    }

    return {
      added,
      modified,
      removed,
      cursor,
    };
  }

  async fireTestWebhookEvent(accessToken) {
    const request = {
      access_token: accessToken,
      webhook_code: 'SYNC_UPDATES_AVAILABLE',
      webhook_type: 'TRANSACTIONS',
    };
    try {
      const response = await this.plaidClient.sandboxItemFireWebhook(request);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

export default PlaidService;
