function generateToken() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TokenStorage");

  // Check if the sheet exists, if not, create it
  if (!sheet) {
    const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("TokenStorage");
    newSheet.appendRow(["Date & Time", "Token"]); // Header row
  }

  // Get the last row's data
  const data = sheet.getDataRange().getValues();
  if (data.length > 1) {
    const lastRow = data[data.length - 1];
    const lastTimestamp = new Date(lastRow[0]); // Get the date from the first column
    const currentTime = new Date();

    // Calculate the time difference in hours
    const timeDifference = (currentTime - lastTimestamp) / (1000 * 60 * 60); // Convert milliseconds to hours

    if (timeDifference < 24) {
      throw new Error(
        `A token was already generated within the last 24 hours. Please wait ${Math.ceil(
          24 - timeDifference
        )} more hours.`
      );
    }
  }

  
  // Make the API call
  const response = UrlFetchApp.fetch(apiEndpoint, options);
  const result = JSON.parse(response.getContentText());

  if (!result || !result.token) {
    throw new Error("Failed to generate token. Please check your API configuration.");
  }

  const token = result.token;
  const now = new Date();
  sheet.appendRow([now.toLocaleString(), token]);

  return `New token generated: ${token}`;
}

// Set up daily trigger
function setupTrigger() {
  ScriptApp.newTrigger("generateToken")
    .timeBased()
    .atHour(8) // Set your desired time
    .everyDays(1)
    .create();
}

function getCurrentToken() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TokenStorage");
  if (!sheet) return "No token available.";

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return "No token available.";

  const latestEntry = data[data.length - 1]; // Last row
  const dateTime = latestEntry[0]; // Date & Time column
  const token = latestEntry[1]; // Token column

  return `Token: ${token}\nGenerated At: ${dateTime}`;
}
