// Finds the last row containing values within a column
function getLastDataRowInColumn(columnName, sheet) {
  let lastDataRow = 0;
  let targetSheet = sheet || dropDownSheet;

  // If the column name is empty, set columnName to 'A'
  if (!columnName) {
    columnName = 'A';
  } else {
    // Get the values in the specified column
    let columnValues = targetSheet.getRange(columnName + "1:" + columnName).getValues();

    // Find the last row with data in the column
    lastDataRow = columnValues.reverse().findIndex(row => row[0] !== "") + 1;

    // If the column is completely empty, set lastDataRow to 0
    if (lastDataRow === -1) {
      lastDataRow = 0;
    } else {
      // Convert the index to the actual row number
      lastDataRow = columnValues.length - lastDataRow + 1;
    }
  }
  return lastDataRow;
}

// Executes a passed function, with a timeout set with miliseconds - kills the script if it takes too long to execute
function timeoutFunction(func, timeout, functionName) {
  let start = new Date().getTime(); // Record start time
  func(); // Call the provided function
  let currentTime = new Date().getTime();

  // Check if the elapsed time exceeds the specified timeout
  if (currentTime - start > timeout) {
    Logger.log(`Timeout exceeded. Script terminated${functionName ? ` for function: ${functionName}` : ''}.`);
  }
}

// Gets all the values from the column, makes an array, and alphabetizes the array
function makeArray(columnLetter, columnNumber, sheet) {
  let lastRow = getLastDataRowInColumn(columnLetter, sheet);
  let goalRange = sheet.getRange(2, columnNumber, lastRow, 1);
  let finalArray = goalRange.getValues().flat().filter(Boolean).sort();
  return finalArray;
};

// Generates checkboxes for the New, Nomo, and Req columns, so that the sheet can use a filter without including the empty rows that would only contain checkboxes
function createCheckBoxes(currentRow) {
  Logger.log("createCheckBoxes function triggered");
  
  // Gets the location of the cells in columns J, L, M, N, and O
  let newTargetCell = orderSheet.getRange('L' + currentRow.toString()); // Column L
  let nomoTargetCell = orderSheet.getRange('O' + currentRow.toString()); // Column O
  let reqTargetCell = orderSheet.getRange('N' + currentRow.toString()); // Colmun N

  // Applies the checkboxes to the target cells in the appropriate columns
  newTargetCell.setDataValidation(checkBox);
  nomoTargetCell.setDataValidation(checkBox);
  reqTargetCell.setDataValidation(checkBox);
};

// Assigns the correct brands for each category
function findBrands(category) {      
  Logger.log("findBrands function triggered");
  // Resets the brand for each execution
  brands = ['N/A'];

  if (category == 'Coils & Pods' || category == 'Kits' || category == 'Mech' || category == 'Mods' || category == 'Tanks') {
    brands.push(...vapeCos);
  } else if (category == 'Disposables') {
    brands.push(...dispoCos);
  } else if (category == 'E-Liquid') {
    brands.push(...eLiquid);
  } else if (category == 'CBD' || category == 'Delta 8' || category == 'Herbal') {
    brands.push(...deltaCos);
  } else if (category == 'Nicotine Pouches') {
    brands.push(...pouchCos);
  }
  return brands;
};

// Generates a drop down menu for brands based on the category selected
function createBrandsMenu() {
  Logger.log("createsBrandMenu function triggered");
  // Gets the value of the category
  currentCell = orderSheet.getCurrentCell();
  let currentCellValue = currentCell.getValue();

  // Gets the location of the brand cell
  let targetCell = orderSheet.getCurrentCell().offset(0, 1);
  targetCell.setValue('N/A');

  // Assigns the brands based on the value of the category
  brands.push(...findBrands(currentCellValue));

  // Generates a drop down menu with the brand's values as options
  let brandsDD = SpreadsheetApp.newDataValidation().requireValueInList(brands).setAllowInvalid(false).setHelpText("That's not on the list - Go add it to the drop downs!").build();

  // Applies the drop down menu to the target cell in the subcategory column
  targetCell.setDataValidation(brandsDD);
};

// Assigns the correct devices for each brand
function findDevices(brand) {
  Logger.log("findDevices function triggered");
  // Resets the devices for each execution
  devices = ['N/A'];

  if (brand == 'Aspire') {
    devices.push(...aspireDevs);
  } else if (brand == 'Dazzleaf') {
    devices.push(...dazzleafDevs);
  } else if (brand == 'Freemax') {
    devices.push(...freemaxDevs);
  } else if (brand == 'Geekvape') {
    devices.push(...geekvapeDevs);
  } else if (brand == 'Horizontech') {
    devices.push(...horizontechDevs);
  } else if (brand == 'Joyetech') {
    devices.push(...joyetechDevs);
  } else if (brand == 'Juul') {
    devices.push(...juulDevs);
  } else if (brand == 'Kangertech') {
    devices.push(...kangertechDevs);
  } else if (brand == 'Lookah') {
    devices.push(...lookahDevs);
  } else if (brand == 'Moti x Play') {
    devices.push(...motiXplayDevs);
  } else if (brand == 'Puffco') {
    devices.push(...puffcoDevs);
  } else if (brand == 'Smok') {
    devices.push(...smokDevs);
  } else if (brand == 'Suorin') {
    devices.push(...suorinDevs);
  } else if (brand == 'Uwell') {
    devices.push(...uwellDevs);
  } else if (brand == 'Vaporesso') {
    devices.push(...vaporessoDevs);
  } else if (brand == 'Voopoo') {
    devices.push(...voopooDevs);
  } else if (brand == 'Yocan') {
    devices.push(...yocanDevs);
  } else {
    devices.push('Coils', 'Glass','Pods');
  }

  return devices;
};

// Generates a drop down menu for devices based on the brand
function createDevicesMenu() {
  Logger.log("createDevicesMenu function triggered")
  // Gets the value of the brand cell
  currentCell = orderSheet.getCurrentCell();
  let brandValue = currentCell.getValue();
  Logger.log("Brand Value: " + brandValue);

  // Gets the location of the subcat cell
  let subCatCell = orderSheet.getCurrentCell().offset(0,1);
  subCatCell.setValue('N/A');

  // Assigns the devices based on the value of the brand
  devices.push(...findDevices(brandValue));

  // Generates a drop down menu with the devices's values as options
  let devicesDD = SpreadsheetApp.newDataValidation().requireValueInList(devices).setAllowInvalid(false).setHelpText("That's not on the list - Go add it to the devices!").build();

  // Applies the drop down menu to the target cell in the subcategory column
  subCatCell.setDataValidation(devicesDD);
};

// Assigns the correct subcategory for each category
function findSubCategory(category) {
  Logger.log("findSubCategory function triggered");
  // Resets the subcategory for each execution
  subCategory.length = 0;

  if (category == 'Accessories') {
    subCategory.push(...accessoriesSubs);
  } else if (category == 'CBD' || category == 'Delta 8' || category == 'Herbal') {
    subCategory.push(...deltaSubs);
  } else if (category == 'Coils & Pods') {
    subCategory.push('Coils', 'Glass', 'N/A', 'Pods');
  } else if (category == 'Kits' || category == 'Mech' || category == 'Mods' || category == 'Tanks') {
    subCategory.push('N/A');
  } else if (category == 'E-Liquid') {
    subCategory.push('Freebase', 'N/A', 'Salt');
  } else if (category == 'SStash') {
    subCategory.push(...stashSubs);
  } else if (category == 'Vending') {
    subCategory.push('Candy', 'Vintage Soda', 'Other', 'N/A');
  } else {
    subCategory.push('N/A');
  }

  return subCategory;
};

// Generates a drop down menu for subcategories based on the category selected
function createSubCategoryMenu() {
  Logger.log("createSubCategoryMenu function triggered");
  // Gets the value of the category
  currentCell = orderSheet.getCurrentCell();
  let currentCellValue = currentCell.getValue();

  // Gets the location of the subcategory cell
  let targetCell = orderSheet.getCurrentCell().offset(0, 2);
  targetCell.setValue('N/A');

  // Assigns the subcategory based on the value of the category
  subCategory.push(...findSubCategory(currentCellValue));

  // Generates a drop down menu with the subcategory's values as options
  let subCategoryDD = SpreadsheetApp.newDataValidation().requireValueInList(subCategory).setAllowInvalid(false).setHelpText("That's not on the list - Go add it to the drop downs!").build();

  // Applies the drop down menu to the target cell in the subcategory column
  targetCell.setDataValidation(subCategoryDD);
};

// Function to transpose five columns of the Ordering List into an object, excluding empty rows and converting values to lowercase
function transposeData() {
  Logger.log("transposeData function triggered");
  let products = {}; 

  // Get data from the first five columns
  let range = orderSheet.getRange("A:E");
  let values = range.getValues();

  // Iterate through the rows
  for (let i = 0; i < values.length; i++) {
    let row = values[i];

    // Check if the row contains any non-empty values
    if (row.some(cell => cell !== "" && cell !== null)) {
      // Create an object to store data for each row
      let rowData = {
        column1: row[0] !== null ? row[0].toString().toLowerCase() : "",
        column2: row[1] !== null ? row[1].toString().toLowerCase() : "",
        column3: row[2] !== null ? row[2].toString().toLowerCase() : "",
        column4: row[3] !== null ? row[3].toString().toLowerCase() : "",
        column5: row[4] !== null ? row[4].toString().toLowerCase() : ""
      };

      // Store the row data in the object using row number as key
      products["row" + (i + 1)] = rowData;
    }
  }

  // Remove the last entry from the products object so that the newest row added to the sheet can be compared to all previous values NOT including the new row
  delete products["row" + Object.keys(products).length];
  return products;
};

// Function to transpose five columns of the spreadsheet into an object, excluding empty rows and converting values to lowercase
function transposeNomos() {
  Logger.log("transposeNomos function triggered");
  let nomos = {}; 

  // Get data from the first five columns
  let range = nomoSheet.getRange("A:E");
  let values = range.getValues();

  // Iterate through the rows
  for (let i = 0; i < values.length; i++) {
    let row = values[i];

    // Check if the row contains any non-empty values
    if (row.some(cell => cell !== "" && cell !== null)) {
      // Create an object to store data for each row
      let rowData = {
        column1: row[0] !== null ? row[0].toString().toLowerCase() : "",
        column2: row[1] !== null ? row[1].toString().toLowerCase() : "",
        column3: row[2] !== null ? row[2].toString().toLowerCase() : "",
        column4: row[3] !== null ? row[3].toString().toLowerCase() : "",
        column5: row[4] !== null ? row[4].toString().toLowerCase() : ""
      };

      // Store the row data in the object using row number as key
      nomos["row" + (i + 1)] = rowData;
    }
  }
  return nomos;
};

// Function to transpose five columns of the spreadsheet into an object, excluding empty rows and converting values to lowercase
function transposeTransfers() {
  Logger.log("transposeTransfers function triggered");
  let transferProducts = {};

  let range = transfersSheet.getRange("B:F"); // Adjust the range as needed
  let values = range.getValues();

  // Iterate through the rows
  for (let i = 0; i < values.length; i++) {
    let row = values[i];

    // Check if the row contains any non-empty values
    if (row.some(cell => cell !== "" && cell !== null)) {
      // Create an object to store data for each row
      let rowData = {
        column1: row[0] !== null ? row[0].toString().toLowerCase() : "",
        column2: row[1] !== null ? row[1].toString().toLowerCase() : "",
        column3: row[2] !== null ? row[2].toString().toLowerCase() : "",
        column4: row[3] !== null ? row[3].toString().toLowerCase() : "",
        column5: row[4] !== null ? row[4].toString().toLowerCase() : ""
      };

      // Store the row data in the object using row number as key
      transferProducts["row" + (i + 1)] = rowData;
    };
  };
  return transferProducts;
};

// Checks for duplicate listings when a new item is added - if a duplicate is found it returns the row index of the original and duplicate rows
function checkForDuplicateRow(e, products) {
  Logger.log("checkForDuplicateRow function triggered");
  // Get the edited range
  let editedRange = e.range;
  
  // Get the values from the edited row
  let editedRow = [];
  for (let i = 1; i <= 5; i++) {
    editedRow.push(activeSheet.getRange(editedRange.getRow(), i).getValue().toString().toLowerCase());
  }

  let originalRowIndex = -1;
  let duplicateRowIndex = -1;
  
  // Iterate through the products to check for duplicates
  for (let key in products) {
    let product = products[key];
    let isDuplicate = true;
    
    // Compare each value in the edited row with the product values
    for (let i = 0; i < editedRow.length; i++) {
      if (editedRow[i] !== product["column" + (i + 1)]) {
        isDuplicate = false;
        break;
      }
    }
    
    // If all values match, store the index of both original and duplicate rows
    if (isDuplicate) {
      originalRowIndex = parseInt(key.replace("row", ""));
      duplicateRowIndex = editedRange.getRow();
      Logger.log("Duplicate Found in Row: " + key);
      break; // Stop iteration once a duplicate is found
    }
  }
  
  // Log the index numbers of both original and duplicate rows
  Logger.log("Original Row Index: " + originalRowIndex);
  Logger.log("Duplicate Row Index: " + duplicateRowIndex);
  
  // Return the index numbers of both original and duplicate rows
  return {
    originalRowIndex: originalRowIndex,
    duplicateRowIndex: duplicateRowIndex
  };
};

// Takes the indices returned by the checkForDuplicateRow function, and highlights the row based on the index returned for duplicate rows on the Order Sheet
function highlightDuplicateRows(originalRowIndex, duplicateRowIndex, highlightColor) {
  Logger.log("highlightDuplicateRows function triggered");
  if (originalRowIndex === -1 || duplicateRowIndex === -1) {
    Logger.log("Invalid row indices provided.");
    return;
  }

  // Highlight duplicate row
  let duplicateRowRange = orderSheet.getRange(duplicateRowIndex, 1, 1, orderSheet.getLastColumn());
  duplicateRowRange.setBackground(highlightColor);

  Logger.log("Duplicate row highlighted: " + duplicateRowIndex);
};


// Compares the order date to today's date, and if the date is older than 14 days, the cells will be highlighted
function compareDates(valueInColumnI, row) {
  let parsedDate = parseDate(valueInColumnI);
  let checkedColumn = checkCheckboxesInRow(row);

  if (parsedDate) {
    // Compare the parsed date to today's date
    let timeDifference = today - parsedDate;
    let dayDifference = timeDifference / (1000 * 60 * 60 * 24);

    // Check if the date is older than 14 days
    if (dayDifference > 14) {
      Logger.log("Row " + row + ", Column I: " + valueInColumnI + " is older than 14 days.");
      // Highlight the list date and order date cells
      orderSheet.getRange(row, 8, 1, 2).setBackground(oldColor); // Change the background color as needed
    } else {
      if (checkedColumn != -1) {
        highlightCheckForBoxes(checkedColumn, row);
      } else {
        // Remove the highlighting
        orderSheet.getRange(row, 8, 1, orderSheet.getLastColumn()).setBackground(null);
      }
    }
  } else {
    highlightCheckForBoxes(checkedColumn, row);
    Logger.log("Row " + row + ", Column I: " + valueInColumnI + " could not be parsed.");
  }
};

// Runs on open to check for old ordering dates
function oldOrderingEntries() {
  // Get all the data in the sheet
  let data = orderSheet.getDataRange().getValues();
  let lastRow = getLastDataRowInColumn("A", orderSheet) + 1;

  // Iterate over each row, starting from the second row to skip the header
  for (let i = 1; i < data.length; i++) {
    let valueInColumnI = data[i][8]; // Column I is the 9th column (0-indexed)
    let row = i + 1;    
    if(row == lastRow) {break};
    // Check if the value in column I is not empty
    if (valueInColumnI !== '') {
      compareDates(valueInColumnI, row); 
    }
  }
};

// Function to parse date strings in various formats
function parseDate(dateStr) {
  // Ensure dateStr is a string
  dateStr = String(dateStr);

  // Replace dots with slashes to handle "5.3" as "5/3"
  dateStr = dateStr.replace(/\./g, '/');

  // Split the date string to check its components
  let dateParts = dateStr.split('/');
  
  // Get the current year
  let currentYear = new Date().getFullYear();

  // Check if the year is provided in the date string
  if (dateParts.length === 2) {
    // If only month and day are provided, add the current year
    dateStr += '/' + currentYear;
  }

  // Parse the date string
  let date = new Date(dateStr);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return null;
  }
  return date;
};

// Function to check if any checkboxes in columns A, L, N, and O are checked for a given row and return the column number of the first checked checkbox
function checkCheckboxesInRow(row) {
  let columnsToCheck = [1, 12, 14, 15]; // Columns A, L, N, O
  for (let i = 0; i < columnsToCheck.length; i++) {
    let col = columnsToCheck[i];
    let cell = orderSheet.getRange(row, col);
    let value = cell.getValue();
    
    // Check if the checkbox is checked
    if (value === true || value === 'TRUE') {
      return col; // Return the column number of the first checked checkbox
    };
  };
  return -1; // No checkboxes are checked
};

// Function to highlight based on checked column
function highlightCheckForBoxes(checkedColumn, row) {
  if (checkedColumn == 12) {  // If the "New" checkbox is checked, highlights the row
    Logger.log('New check triggered');
    orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(newColor);
  } else if (checkedColumn == 10) {
    Logger.log('Transfer check triggered');
    orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(transferColor);
  } else if (checkedColumn == 15) {
    Logger.log('Nomo check triggered');
    orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(nomoColor);
  } else if (checkedColumn == 14) {
    Logger.log('Req check triggered');
    orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(reqColor);
  } else if (checkedColumn == 11) {
    Logger.log('Complete check triggered');
    orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(completeColor);
  };
};
