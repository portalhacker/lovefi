'use strict';

import { authenticate } from '@google-cloud/local-auth';
import { promises as fs } from 'fs';
import { google } from 'googleapis';
import { join } from 'path';
import { cwd } from 'process';

class GoogleSheetsService {
  constructor() {
    this.SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
    this.TOKEN_PATH = join(cwd(), 'token.json');
    this.CREDENTIALS_PATH = join(cwd(), 'credentials.json');
    this.spreadsheetId = '1rw2oyzLdl8qv2jzwmb3kqD_52azvG18bNLGO36lRB1s';
  }

  async loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(this.TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  async saveCredentials(client) {
    const content = await fs.readFile(this.CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(this.TOKEN_PATH, payload);
  }

  async authorize() {
    let client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: this.SCOPES,
      keyfilePath: this.CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }

  async listSheets() {
    const auth = await this.authorize();
    const googleSheets = google.sheets({ version: 'v4', auth });
    const googleResponse = await googleSheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
    });
    const sheets = googleResponse.data.sheets;
    if (!sheets || sheets.length === 0) {
      return;
    }
    return sheets;
  }

  async writeRange(range, values) {
    const auth = await this.authorize();
    const googleSheets = google.sheets({ version: 'v4', auth });
    const googleResponse = await googleSheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: values,
      },
    });
    return googleResponse.data;
  }

  async readRange(range) {
    const auth = await this.authorize();
    const googleSheets = google.sheets({ version: 'v4', auth });
    const googleResponse = await googleSheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: range,
      valueRenderOption: 'UNFORMATTED_VALUE',
    });
    return googleResponse.data;
  }
}

export default GoogleSheetsService;
