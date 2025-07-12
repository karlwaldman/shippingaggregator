import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = 'AIzaSyCLcOdimBZFwt8aKHOeruFDC2VWRNBmKVY'
  const results: any = {
    apiKeyProvided: true,
    tests: []
  }

  // Test 1: GA4 Admin API - List accounts
  try {
    const accountsResponse = await fetch(
      `https://analyticsadmin.googleapis.com/v1beta/accounts?key=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    )
    
    const responseText = await accountsResponse.text()
    let accountsData
    try {
      accountsData = JSON.parse(responseText)
    } catch {
      accountsData = { error: 'Non-JSON response', body: responseText.substring(0, 200) }
    }

    results.tests.push({
      name: 'GA4 Admin API - List Accounts',
      endpoint: 'analyticsadmin.googleapis.com/v1beta/accounts',
      status: accountsResponse.status,
      statusText: accountsResponse.statusText,
      response: accountsData,
      requiresAuth: accountsResponse.status === 401 || accountsResponse.status === 403
    })
  } catch (error) {
    results.tests.push({
      name: 'GA4 Admin API - List Accounts',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 2: Management API v3 (older API)
  try {
    const mgmtResponse = await fetch(
      `https://www.googleapis.com/analytics/v3/management/accounts?key=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    )
    
    const mgmtData = await mgmtResponse.json()
    
    results.tests.push({
      name: 'Management API v3 - List Accounts',
      endpoint: 'googleapis.com/analytics/v3/management/accounts',
      status: mgmtResponse.status,
      statusText: mgmtResponse.statusText,
      response: mgmtData,
      requiresAuth: mgmtResponse.status === 401 || mgmtResponse.status === 403
    })
  } catch (error) {
    results.tests.push({
      name: 'Management API v3',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 3: Check if API key is valid for any Google service
  try {
    const booksResponse = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=test&key=${apiKey}&maxResults=1`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    )
    
    const booksData = await booksResponse.json()
    
    results.tests.push({
      name: 'Books API - Validate API Key',
      endpoint: 'googleapis.com/books/v1/volumes',
      status: booksResponse.status,
      statusText: booksResponse.statusText,
      apiKeyValid: booksResponse.status === 200,
      note: 'Testing if API key is valid for any Google service'
    })
  } catch (error) {
    results.tests.push({
      name: 'Books API - Validate API Key',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Summary
  results.summary = {
    apiKeyValid: results.tests.some((t: any) => t.apiKeyValid),
    requiresOAuth: results.tests.filter((t: any) => t.requiresAuth).length > 0,
    recommendation: 'Google Analytics APIs require OAuth2 or Service Account authentication. API keys alone are not sufficient for accessing Analytics data.'
  }

  return res.status(200).json(results)
}