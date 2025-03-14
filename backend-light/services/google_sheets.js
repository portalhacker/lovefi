'use strict';

import { authenticate } from '@google-cloud/local-auth';
import { promises as fs } from 'fs';
import { google } from 'googleapis';
import { join } from 'path';
import { cwd } from 'process';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = join(cwd(), 'token.json');
const CREDENTIALS_PATH = join(cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Prints the identifiers and names of sheets in a sample spreadsheet:
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
export async function listSheets() {
  const auth = await authorize();
  const googleSheets = google.sheets({ version: 'v4', auth });
  const googleResponse = await googleSheets.spreadsheets.get({
    spreadsheetId: '1rw2oyzLdl8qv2jzwmb3kqD_52azvG18bNLGO36lRB1s',
  });
  const sheets = googleResponse.data.sheets;
  if (!sheets || sheets.length === 0) {
    return;
  }
  return sheets;
}

export async function writeRange(range, values) {
  const auth = await authorize();
  const googleSheets = google.sheets({ version: 'v4', auth });
  const googleResponse = await googleSheets.spreadsheets.values.update({
    spreadsheetId: '1rw2oyzLdl8qv2jzwmb3kqD_52azvG18bNLGO36lRB1s',
    range: range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: values,
    },
  });
  return googleResponse.data;
}

export async function readRange(range) {
  const auth = await authorize();
  const googleSheets = google.sheets({ version: 'v4', auth });
  const googleResponse = await googleSheets.spreadsheets.values.get({
    spreadsheetId: '1rw2oyzLdl8qv2jzwmb3kqD_52azvG18bNLGO36lRB1s',
    range: range,
    valueRenderOption: 'UNFORMATTED_VALUE',
  });
  return googleResponse.data;
}
