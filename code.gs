function generateToken() {
  // Prepare the request options


  // The API endpoint URL (replace with your actual URL)
  const apiEndpoint = 'https://apiendpoint.com'; // Replace with the actual API endpoint

  try {
    // Make the API request using UrlFetchApp
    const response = UrlFetchApp.fetch(apiEndpoint, options);

    // Parse the JSON response
    const result = JSON.parse(response.getContentText());

    // Check if a token is present in the response
    if (result.token) {
      Logger.log('Token generated:', result.token);
      return result.token;  // Return the token if successful
    } else {
      Logger.log('Error: Token not found in the response');
      throw new Error('Token not found in the API response.');
    }
  } catch (error) {
    Logger.log('Error generating token:', error.message);
    throw new Error('Failed to generate token. Please check your API configuration.');
  }
}
