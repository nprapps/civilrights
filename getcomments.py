#!/usr/bin/env python

import httplib2
import pprint
import sys
import csvkit as csv

from apiclient.discovery import build
from oauth2client.client import SignedJwtAssertionCredentials

# Email of the Service Account.
SERVICE_ACCOUNT_EMAIL = '774678837715-tcbo6nc1qlrdohc2cci8f9mn0bubdrk8@developer.gserviceaccount.com'

# Path to the Service Account's Private Key file.
SERVICE_ACCOUNT_PKCS12_FILE_PATH = 'privatekey.pem'

def createDriveService():
  """Builds and returns a Drive service object authorized with the given service account.

  Returns:
    Drive service object.
  """
  f = file(SERVICE_ACCOUNT_PKCS12_FILE_PATH, 'rb')
  key = f.read()
  f.close()

  credentials = SignedJwtAssertionCredentials(SERVICE_ACCOUNT_EMAIL, key,
      scope='https://www.googleapis.com/auth/drive')
  http = httplib2.Http()
  http = credentials.authorize(http)

  return build('drive', 'v2', http=http)

def retrieve_comments(service, file_id):
  """Retrieve a list of comments.

  Args:
    service: Drive API service instance.
    file_id: ID of the file to retrieve comments for.
  Returns:
    List of comments.
  """
  try:
    comments = service.comments().list(fileId=file_id, maxResults=100).execute()
    return comments.get('items', [])
  except errors.HttpError, error:
    print 'An error occurred: %s' % error
  return None

service = createDriveService()
comments = retrieve_comments(service, '1cPuHCoLshw_srl-OG7dzdk4kDr7mwPGUUgW55JRPQlk')

output = []

slugs = {
  'Jennifer Lee': 'jennifer-lee',
  'Nikole Hannah-Jones': 'nikole-hannah-jones',
  'Clay Risen': 'clay-risen',  
  'Nicholas Espiritu': 'nicholas-espiritu', 
  'Samuel Bagenstos': 'samuel-bagenstos',  
  'Anonymous':'nina-totenberg', 
  'PHS':'phs',
  'awheeler': 'mark-updegrove',
}

comments = sorted(comments, key=lambda c: c['anchor'])

for comment in comments:
  d = {}
  name = comment['author']['displayName']

  d['author_key'] = slugs[name]
  d['content'] = comment['content']
  d['cited'] = comment['context']['value']
  output.append(d)


with open('comments.csv', 'w') as f:
	writer = csv.DictWriter(f, ['author_key', 'content', 'cited'])
	writer.writeheader()
	writer.writerows(output)