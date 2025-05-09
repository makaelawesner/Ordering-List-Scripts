// Function to transpose five columns of the spreadsheet into an object, excluding empty rows and converting values to lowercase
function transposeRejects() {
  Logger.log("transposeRejects function triggered");
  let rejectsArray = [];

  // Get data from the five columns containing category, brand, subcat, and item name
  let range = rejectSheet.getRange("C2:F");
  let values = range.getValues();

  // Iterate through the rows
  for (let i = 0; i < values.length; i++) {
    let row = values[i];
    
    // Check if the row contains any non-empty values
    if (row.some(cell => cell !== "" && cell !== null)) {
      // Concatenate the lowercase values into a single string for each row
      let combinedString = row.map(cell => cell.toString().toLowerCase()).join(" ");
      
      // Push the combined string into the array
      rejectsArray.push(combinedString);
    }
  }
  return rejectsArray;
}

// Function which gets the data whenever a new request is submitted via the form, then formats and cleans up the data, and prepares it to be appended to the Requests sheet
function formatData(e) {
  Logger.log("formatData function triggered")

  let formResponse = e.values; // Array containing form responses
  let fullFormData = {
    timestamp: formResponse[0],
    location: formResponse[1],
    customerStatus: formResponse[2],
    customerName: formResponse[3],
    contact: formResponse[4],
    phone: formResponse[5].toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'),
    productCategory: formResponse[6],
    accessorySubcat: formResponse[7],
    cbdSubcat: formResponse[8],
    cbdBrand: formResponse[9],
    dispoBrand: formResponse[10],
    dispoNic: formResponse[11],
    vapeBrand: formResponse[12],
    eliquidBrand: formResponse[13],
    eliquidNic: formResponse[14],
    stashSubcat: formResponse[15],
    vendingSubcat: formResponse[16],
    miscCategory: formResponse[17],
    miscBrand: formResponse[18],
    productName: formResponse[19],
    productPrice: formResponse[20],
    productLink: formResponse[21],
    employeeNotes: formResponse[22],
    employeeInitials: formResponse[23]
  };

  let formDate = new Date(fullFormData.timestamp);
  let dateOnly = formDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });

  // Reformat the data into a shorter form before transferring to the manager's request sheet for processing
  let formData = {
    location: fullFormData.location,
    customerStatus: fullFormData.customerStatus,
    sumbissionDate: dateOnly,
    category: "",
    brand: "",
    subcategory: "",
    productName: fullFormData.productName,
    nicotine: "",
    productPrice: fullFormData.productPrice,
    productLink: fullFormData.productLink,
    employeeNotes: fullFormData.employeeNotes,
    customerName: fullFormData.customerName,
    contact: true,
    phone: fullFormData.phone,
    employeeInitials: fullFormData.employeeInitials,
    duplicate: false
  };

  if (fullFormData.productCategory !== "Other") {
    formData.category = fullFormData.productCategory;
  } else {
    formData.category = fullFormData.miscCategory;
  };

  if (fullFormData.dispoNic || fullFormData.eliquidNic) {
    formData.nicotine = fullFormData.dispoNic || fullFormData.eliquidNic;
    if (formData.nicotine === '0mg' || formData.nicotine === '3mg' || formData.nicotine === '6mg') {
      formData.subcategory = 'Freebase';
    } else if (formData.nicotine === '25/30mg (Half Strength)' || formData.nicotine === '50mg (Full Strength)') {
      formData.subcategory = 'Salt';
    }
  };

  if (fullFormData.cbdBrand || fullFormData.dispoBrand || fullFormData.eliquidBrand || fullFormData.vapeBrand || fullFormData.miscBrand) {
    formData.brand = fullFormData.cbdBrand || fullFormData.dispoBrand || fullFormData.eliquidBrand || fullFormData.vapeBrand || fullFormData.miscBrand;
  };

  if (fullFormData.accessorySubcat || fullFormData.cbdSubcat || fullFormData.stashSubcat || fullFormData.vendingSubcat) {
    formData.subcategory = fullFormData.accessorySubcat || fullFormData.cbdSubcat || fullFormData.stashSubcat || fullFormData.vendingSubcat;
  };

  formData.contact = fullFormData.contact === "Yes" ? true : false;
  
  // Concatenate the values and convert to lowercase
  let newEntryString = `${formData.category} ${formData.brand} ${formData.subcategory} ${formData.productName}`.toLowerCase();
  let rejects = transposeRejects();

  Logger.log("New Entry String: ");
  Logger.log(newEntryString);
  
  Logger.log("Rejects Array: ");
  Logger.log(rejects);

  // Check if newEntryString matches any string in the rejects array
  rejects.some(reject => {
    if (reject === newEntryString) {
      // If a match is found, set formData.duplicate to true and return true to stop the iteration
      formData.duplicate = true;
      Logger.log("Found a duplicate!")
    }
  });
  
  return formData;
}

// Appends a new row to the Requests sheet whenever an item is submitted via the form
function appendToRequestSheet(data) {
  Logger.log("appendToRequestSheet function triggered")
  // Append the data starting from column C (skipping columns A and B)
  requestSheet.getRange(requestSheet.getLastRow() + 1, 3, 1, 14).setValues([[
    data.sumbissionDate,
    data.location,
    data.category,
    data.brand,
    data.subcategory,
    data.productName,
    data.nicotine,
    data.productPrice,
    data.productLink,
    data.employeeNotes,
    data.customerName,
    data.contact,
    data.phone,
    data.employeeInitials
  ]]);
}

// Finishes the formatting on the Requests sheet after an item is added
function formatNewRequest(data) {
  Logger.log("formatNewRequest function triggered")
  let newRequestRow = requestSheet.getLastRow();
  let requestRange = requestSheet.getRange(newRequestRow, 1, 1, requestSheet.getLastColumn());

  if (data.customerStatus === "Regular") {
    requestRange.setBackground(regularColor);
  } else if (data.customerStatus === "Potential Regular") {
    requestRange.setBackground(potentialRegularColor);
  };

  // Gets the location of the cells in columns A, B, and N
  let orderedTargetCell = requestSheet.getRange(newRequestRow, 1); // Column A
  let rejectedTargetCell = requestSheet.getRange(newRequestRow, 2); // Column B
  let contactTargetCell = requestSheet.getRange(newRequestRow, 14); // Column N
 
  // Applies the checkboxes to the target cells in the appropriate columns
  orderedTargetCell.setDataValidation(checkBox);
  rejectedTargetCell.setDataValidation(checkBox);
  contactTargetCell.setDataValidation(checkBox);

  // If the item already has been listed on the Rejected Requests sheet, highlight the row with 'nomo'
  if (data.duplicate) {
    requestRange.setBackground(nomoColor);
  }
}

// Executes certain functions whenever the "Requests" Form is submitted
function onFormSubmit(e) {
  let tidyData = formatData(e);
  appendToRequestSheet(tidyData);
  formatNewRequest(tidyData);
  Logger.log("Form Submitted.");
  Logger.log("Form Data: ");
  Logger.log(tidyData);
}

// Moves the row to either the Ordering List or Rejected Requests sheet if a checkbox is marked in column A or B
function onCheckMoveRow(e) {
  if (lock) return; // If already executing, exit function
  
  lock = true; // Set lock to true to prevent concurrent executions
  
  try {
    Logger.log("onCheckMoveRow function triggered")
    let range = e.range;
    let row = range.getRow();
    let col = range.getColumn();
    let productName = "";
    let combinedNotes = "";
    
    // Check if the edit was made in column A or B and a checkbox was checked
    if (e.value == "TRUE" && (col === 1 || col === 2)) {

      // Get the values of the row
      const values = requestSheet.getRange(row, 3, 1, requestSheet.getLastColumn()).getValues()[0];

      // Formatting for the list date on the Ordering List
      let requestDate = new Date(values[0]);
      let dateOnly = requestDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });

      // If there is a nicotine strength listed it will be added to the product name
      if (values[6]) {
        productName = values[5] + " - " + values[6];
      } else {
        productName = values[5]
      };

      // Column Indices: 0:C:Date, 1:D:Location, 2:E:Category, 3:F:Brand, 4:G:Subcategory, 5:H:Product Name, 6:I:Nicotine, 7:J:Price, 8:K:Link, 9:L:Notes, 10:M:Customer, 11:N:Contact, 12:O:Phone, 13:P:Employee

      // Logic to combine the Notes, Employee, Customer, and Phone fields into the Notes of the Ordering List based on the values provided
      if (values[9] && values[10] && values[11]) { // if contact = true, there are employee notes, and a customer name
        combinedNotes = values[9] + " - " + values[13] + " | " + values[10] + " - " + values[12]; // Notes - Employee | Customer - Phone
      } else if ((values[9] === "") && values[10] && values[11]) { // if contact = true, there are NO employee notes, and a customer name
        combinedNotes = values[13] + " | " + values[10] + " - " + values[12]; // Employee | Customer - Phone
      } else if (values[9] && values[10] && !values[11]) { // if contact = false, there are employee notes, and a customer name
        combinedNotes = values[9] + " - " + values[13] + " | " + values[10]; // Notes - Employee | Customer
      } else if (values[9] && (values[10] === "") && !values[11]) { // if contact = false, there are employee notes, and NO customer name
        combinedNotes = values[9] + " - " + values[13]; // Notes - Employee
      } else { 
        combinedNotes = values[13]; // Employee
      }

      // Reformat the rest of the data into a shorter form before transferring
      let newListEntry = {
        moveDate: formattedDate, // Becomes the Order Date on the Ordering List or Reject Date on the Rejects sheet
        listDate: dateOnly, // The date that the item was originally requested
        location: values[1],
        category: values[2],
        brand: values[3],
        subcategory: values[4],
        productName: productName,
        notes: combinedNotes,
        requestValue: true
      };

      // Sets the destination sheet name based on whether the checkbox was in column A or B, then moves the row to the correct sheet based on the destination name
      const destinationSheetName = col === 1 ? "Ordering List" : "Rejected Requests";
      
      if (destinationSheetName === "Ordering List") {
        Logger.log("Moving a Request to the Ordering List")
        // Adds an array to the Ordering List as an item on a new row
        orderSheet.appendRow([
          newListEntry.location,
          newListEntry.category,
          newListEntry.brand,
          newListEntry.subcategory,
          newListEntry.productName,
          "",
          "",
          newListEntry.listDate,
          "",
          "",
          "",
          "",
          "",
          true,
          "",
          newListEntry.notes,
        ]);

        // Add checkboxes to the new row, and sets the background color to indicate that the item is a request, and strikethrough to indicate that it has been ordered
        createCheckBoxes(orderSheet.getLastRow()); // Pass the current row to createCheckBoxes()
        orderSheet.getRange(orderSheet.getLastRow(), 1, 1, orderSheet.getLastColumn()).setBackground(reqColor)

        // Adds an empty row to the end of the sheet (to fix range errors), then alphabetizes the ordering list
        let lastRow = getLastDataRowInColumn("A", orderSheet);
        let numColumns = orderSheet.getLastColumn();
        let emptyRow = Array(numColumns).fill('');
        orderSheet.appendRow(emptyRow);
        let orderRange = orderSheet.getRange(2, 1, lastRow, orderSheet.getLastColumn());
        orderRange.sort([{column: 2, ascending: true}, {column: 3, ascending: true}, {column: 4, ascending: true}, {column: 5, ascending: true}]);
        
        requestSheet.deleteRow(row);
        
      } else if (destinationSheetName === "Rejected Requests") {
        Logger.log("Moving a Request to the Rejects List")
        // Append the data to the Rejected Requests sheet
        rejectSheet.getRange(rejectSheet.getLastRow() + 1, 1, 1, rejectSheet.getLastColumn()).setValues([[
          newListEntry.moveDate,
          newListEntry.location,
          newListEntry.category,
          newListEntry.brand,
          newListEntry.subcategory,
          newListEntry.productName,
          newListEntry.notes,
        ]]);
        requestSheet.deleteRow(row);

      }
    }
    lock = false;
  } catch (error) {
    // Log or handle any errors
    Logger.log("Error occurred: " + error.message);
    lock = false; // Reset lock in case of error
  }
}
