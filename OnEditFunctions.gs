// Generates drop-down menus and inserts checkboxes if the cell containing the category is edited on the Ordering List sheet
function onEditTriggerDropDown(e) {
  // Check if the edit occurred in the desired range
  let editedRange = e.range;
  let targetRangeA1Notation = 'B2:B';  // Adjust this to the desired range

  // Check if the edited cell is within the target range
  let targetRange = orderSheet.getRange(targetRangeA1Notation);
  let isIntersecting =
    editedRange.getRow() >= targetRange.getRow() &&
    editedRange.getRow() <= targetRange.getLastRow() &&
    editedRange.getColumn() == targetRange.getColumn() &&
    editedRange.getColumn() == targetRange.getLastColumn();

  if (isIntersecting) {
    Logger.log("onEditTriggerDropDown function triggered");
    let currentRow = e.range.getRow();
    createBrandsMenu();
    createSubCategoryMenu();
    createCheckBoxes(currentRow);
    insertListDate(e);
  }
};

// Generates drop-down menu containing devices if Coils & Pods is selected from the category column on the Ordering List sheet
function onEditTriggerDevices(e) {
  // Check if the edit occurred in the desired range
  let editedRange = e.range;
  let targetRangeA1Notation = 'C2:C';  // Adjust this to the desired range

  // Check if the edited cell is within the target range
  let targetRange = orderSheet.getRange(targetRangeA1Notation);
  let isIntersecting =
    editedRange.getRow() >= targetRange.getRow() &&
    editedRange.getRow() <= targetRange.getLastRow() &&
    editedRange.getColumn() == targetRange.getColumn() &&
    editedRange.getColumn() == targetRange.getLastColumn();

  if (isIntersecting) {
    Logger.log("onEditTriggerDevices function triggered");
    currentCell = orderSheet.getCurrentCell().offset(0, -1);
    let categoryValue = currentCell.getValue();
    Logger.log("Category Value: " + categoryValue);
    if (categoryValue === "Coils & Pods") {
      createDevicesMenu();
    }
  }
};

// Updates the drop down menus for all categories and subcategories if the column containing a list is edited on the Drop Downs sheet
function onEditUpdateDropdowns(e) {
  let editedRange = e.range;
  let targetRangeA1Notation = 'B2:I';  // Adjust this to the desired range

  // Check if the edited cell is within the target range
  let targetRange = orderSheet.getRange(targetRangeA1Notation);
  let isIntersecting =
    editedRange.getRow() >= targetRange.getRow() &&
    editedRange.getRow() <= targetRange.getLastRow() &&
    editedRange.getColumn() == targetRange.getColumn() &&
    editedRange.getColumn() == targetRange.getLastColumn();

  // Check which column was edited
  let editedColumn = editedRange.getColumn();

  // Update a subcategory variable or brand/company variable on the edited column
  if (isIntersecting) {
    Logger.log("onEditUpdateDropdowns function triggered");
    if (editedColumn == 2) {
      Logger.log('Updating Delta Companies');
      deltaCos.length = 0;
      deltaCos.push(...makeArray('B', 2, dropDownSheet));
    } else if (editedColumn == 3) {
      Logger.log('Updating Vape Companies');
      vapeCos.length = 0;
      vapeCos.push(...makeArray('C', 3, dropDownSheet));
    } else if (editedColumn == 4) {
      Logger.log('Updating eLiquid Companies');
      eLiquidCos.length = 0;
      eLiquidCos.push(...makeArray('D', 4, dropDownSheet));
    } else if (editedColumn == 5) {
      Logger.log('Updating Disposable Companies');
      dispoCos.length = 0;
      dispoCos.push(...makeArray('E', 5, dropDownSheet));
    } else if (editedColumn == 6) {
      Logger.log('Updating Accessories Subcategories');
      accessoriesSubs.length = 0;
      accessoriesSubs.push(...makeArray('F', 6, dropDownSheet));
    } else if (editedColumn == 7) {
      Logger.log('Updating Delta Subcategories');
      deltaSubs.length = 0;
      deltaSubs.push(...makeArray('G', 7, dropDownSheet));
    } else if (editedColumn == 8) {
      Logger.log('Updating Stash Subcategories');
      stashSubs.length = 0;
      stashSubs.push(...makeArray('H', 8, dropDownSheet));
    } else if (editedColumn == 9) {
      Logger.log('Updating Nicotine Pouch Companies');
      pouchCos.length = 0;
      pouchCos.push(...makeArray('I', 9, dropDownSheet));
    }
  }
};

// Updates the drop down menus for devices if the column containing the list is edited on the Devices sheet
function onEditUpdateDevices(e) {
  let editedRange = e.range;
  let targetRangeA1Notation = 'A2:R';  // Adjust this to the desired range

  // Check if the edited cell is within the target range
  let targetRange = orderSheet.getRange(targetRangeA1Notation);
  let isIntersecting =
    editedRange.getRow() >= targetRange.getRow() &&
    editedRange.getRow() <= targetRange.getLastRow() &&
    editedRange.getColumn() == targetRange.getColumn() &&
    editedRange.getColumn() == targetRange.getLastColumn();

  // Check which column was edited
  let editedColumn = editedRange.getColumn();

  // Update a brand's device list variable based on the edited column
  if (isIntersecting) {
    Logger.log("onEditUpdateDevices function triggered");
    if (editedColumn == 1) {
      Logger.log('Updating Aspire Devices');
      aspireDevs.length = 0;
      aspireDevs.push(...makeArray('A', 1, deviceSheet));
    } else if (editedColumn == 2) {
      Logger.log('Updating Dazzleaf Devices');
      dazzleafDevs.length = 0;
      dazzleafDevs.push(...makeArray('B', 2, deviceSheet));
    } else if (editedColumn == 3) {
      Logger.log('Updating Freemax Devices');
      freemaxDevs.length = 0;
      freemaxDevs.push(...makeArray('C', 3, deviceSheet));
    } else if (editedColumn == 4) {
      Logger.log('Updating Geekvape Devices');
      geekvapeDevs.length = 0;
      geekvapeDevs.push(...makeArray('D', 4, deviceSheet));
    } else if (editedColumn == 5) {
      Logger.log('Updating Horizontech Devices');
      horizontechDevs.length = 0;
      horizontechDevs.push(...makeArray('E', 5, deviceSheet));
    } else if (editedColumn == 6) {
      Logger.log('Updating Joyetech Devices');
      joyetechDevs.length = 0;
      joyetechDevs.push(...makeArray('F', 6, deviceSheet));
    } else if (editedColumn == 7) {
      Logger.log('Updating Juul Devices');
      juulDevs.length = 0;
      juulDevs.push(...makeArray('G', 7, deviceSheet));
    } else if (editedColumn == 8) {
      Logger.log('Updating Kangertech Devices');
      kangertechDevs.length = 0;
      kangertechDevs.push(...makeArray('H', 8, deviceSheet));
    } else if (editedColumn == 9) {
      Logger.log('Updating Lookah Devices');
      lookahDevs.length = 0;
      lookahDevs.push(...makeArray('I', 9, deviceSheet));
    } else if (editedColumn == 10) {
      Logger.log('Updating Lost Vape Devices');
      lostvapeDevs.length = 0;
      lostvapeDevs.push(...makeArray('J', 10, deviceSheet));
    } else if (editedColumn == 11) {
      Logger.log('Updating Moti x Play Devices');
      motiXplayDevs.length = 0;
      motiXplayDevs.push(...makeArray('K', 11, deviceSheet));
    } else if (editedColumn == 12) {
      Logger.log('Updating Puffco Devices');
      puffcoDevs.length = 0;
      puffcoDevs.push(...makeArray('L', 12, deviceSheet));
    } else if (editedColumn == 13) {
      Logger.log('Updating Smok Devices');
      smokDevs.length = 0;
      smokDevs.push(...makeArray('M', 13, deviceSheet));
    } else if (editedColumn == 14) {
      Logger.log('Updating Suorin Devices');
      suorinDevs.length = 0;
      suorinDevs.push(...makeArray('N', 14, deviceSheet));
    } else if (editedColumn == 15) {
      Logger.log('Updating Uwell Devices');
      uwellDevs.length = 0;
      uwellDevs.push(...makeArray('O', 15, deviceSheet));
    } else if (editedColumn == 16) {
      Logger.log('Updating Vaporesso Devices');
      vaporessoDevs.length = 0;
      vaporessoDevs.push(...makeArray('P', 16, deviceSheet));
    } else if (editedColumn == 17) {
      Logger.log('Updating Voopoo Devices');
      voopooDevs.length = 0;
      voopooDevs.push(...makeArray('Q', 17, deviceSheet));
    } else if (editedColumn == 18) {
      Logger.log('Updating Yocan Devices');
      yocanDevs.length = 0;
      yocanDevs.push(...makeArray('R', 18, deviceSheet));
    } 
  }
};

// Implement formatting rules on the Ordering List sheet based on the column that is edited
function onEditFormatRules(e) {
  Logger.log("onEditFormatRules function triggered");
  let range = e.range;
  let column = range.getColumn();
  let row = range.getRow();
  let finalRow = getLastDataRowInColumn("A", orderSheet);

  if (column == 5 && row == finalRow ) {   // If the cell in the last row of column E (the item name) is edited, check for duplicates & nomos
    Logger.log("Duplicate check triggered");
    orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(null);

    let products = transposeData();
    let indices = checkForDuplicateRow(e, products);
    highlightDuplicateRows(indices.originalRowIndex, indices.duplicateRowIndex, duplicateColor);

    let transferProducts = transposeTransfers();
    let transferIndices = checkForDuplicateRow(e, transferProducts);
    highlightDuplicateRows(transferIndices.originalRowIndex, transferIndices.duplicateRowIndex, transferColor);

    let nomoProducts = transposeNomos();
    let nomoIndices = checkForDuplicateRow(e, nomoProducts);
    highlightDuplicateRows(nomoIndices.originalRowIndex, nomoIndices.duplicateRowIndex, nomoColor);
    
  } else if (column == 9 && row > 1) {  // If the order date cell is filled, strikes through the row
    Logger.log("Strikethrough check triggered");
    let valueI = orderSheet.getRange(row, 9).getValue(); // Value in column I

    if (valueI !== "") {
      Logger.log("Order date filled - striking through the row")
      orderSheet.getRange(row, 1, 1, 5).setFontLine("line-through");
      compareDates(valueI, row);
    }  else {
      Logger.log("Order date cleared - removing strikethrough for the row")
      orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setFontLine(null);
      Logger.log("Order date cleared - removing the highlighting.")
      let checkedColumn = checkCheckboxesInRow(row);
      highlightCheckForBoxes(checkedColumn, row);
    }

  } else if (column == 12 && row > 1) {  // If the "New" checkbox is checked, highlights the row
    Logger.log('New check triggered')
    if (range.isChecked()) {
      orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(newColor); // Change the background color as needed
    } else {
      orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(null);
    }

  } else if (column == 10 && row > 1) {  // If the "Transfer" cell has a value, highlights the row
    Logger.log('Transfer check triggered')
    let valueL = orderSheet.getRange(row, 10).getValue(); // Value in column L
    if (valueL !== "") {
      orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(transferColor); // Change the background color as needed
    } else {
      orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(null);
    }

  } else if (column == 15 && row > 1) {  // If the "Nomo" checkbox is checked, highlights the row
    Logger.log('Nomo check triggered');
    if (range.isChecked()) {
      orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(nomoColor); // Change the background color as needed
    } else {
      orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(null);
    }

  } else if (column == 14 && row > 1) {  // If the "Req" checkbox is checked, highlights the row
    Logger.log('Req check triggered');
    if (range.isChecked()) {
      orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(reqColor); // Change the background color as needed
    } else {
      orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(null);
    }
    
  } else if (column == 11 && row > 1) {  // If the "Complete" cell has a value, highlights the row
    Logger.log('Complete check triggered');
    let valueO = orderSheet.getRange(row, 11).getValue(); // Value in column 
    if (valueO !== "") {
      orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(completeColor); // Change the background color as needed
    } else {
      orderSheet.getRange(row, 1, 1, orderSheet.getLastColumn()).setBackground(null);
    }
  }
};

// For the Ordering List Sheet - Automatically inserts today's date into the list date cell whenever a new row is added
function insertListDate(e) {
  Logger.log("Insert List Date function triggered");
  let currentRow = e.range.getRow();
  let listDateCell = orderSheet.getRange(currentRow, 8, 1, 1);
  listDateCell.setValue(formattedDate);
};

// For the MF for NP Sheet - Automatically inserts today's date into the list date cell whenever a liquid is added or strikes through the row if the complete date is filled, and removes values and formatting if the cell is empty
function insertNPListDate(e) {
  Logger.log("Insert NP list date function triggered")
  let currentRow = e.range.getRow();
  let editedValue = e.range.getValue();
  let listDateCell = mfForNpSheet.getRange(currentRow, 8); // Column H for list date
  let completeDateCell = mfForNpSheet.getRange(currentRow, 18); // Column R for complete date
  let listDateValue = listDateCell.getValue();
  let completeDateValue = completeDateCell.getValue();

  if (currentRow >= 6 && currentRow <= 25) { // Ignores headers or any rows below the liquid logs
  
    if (e.range.getColumn() >= 2 && e.range.getColumn() <= 8) { // NP's Request range
      if (!listDateValue && editedValue) { // (list date WAS empty) AND (the current cell IS NOT empty)
        listDateCell.setValue(formattedDate); // Update list date
      };
    };
    
    if (e.range.getColumn() >= 12 && e.range.getColumn() <= 18) { // Venice's Complete range
      if (!completeDateValue && editedValue) { // (complete date WAS empty) AND (the edited cell IS NOT empty)
        completeDateCell.setValue(formattedDate); // insert today's date in the Complete column
        mfForNpSheet.getRange(currentRow, 12, 1, 6).setFontLine("line-through")
      };
    };

  };
};

// Runs the correct functions with a 10 second time-out, based on which sheet is edited 
function onEditSheetCheck(e) {
  Logger.log("onEditSheetCheck function triggered");
  let sheetName = e.range.getSheet().getName();

  // Timeout set in milliseconds, adjust as needed
  if (sheetName === 'Drop Downs') {
    Logger.log('Drop Downs sheet is being edited')
    timeoutFunction(() => onEditUpdateDropdowns(e), 10000, 'onEditUpdateDropdowns');
  } else if (sheetName === 'Devices') {
    Logger.log('Devices Sheet is being edited');
    timeoutFunction(() => onEditUpdateDevices(e), 10000, 'onEditUpdateDevices');
  } else if (sheetName === 'Ordering List') {
    Logger.log('Ordering List sheet is being edited');
    timeoutFunction(() => onEditTriggerDropDown(e), 10000, 'onEditTriggerDropDowns');
    timeoutFunction(() => onEditTriggerDevices(e), 10000, 'onEditTriggerDevices');
    timeoutFunction(() => onEditFormatRules(e), 10000, 'onEditFormatRules');      
  } else if (sheetName === 'MF for NP') {
    Logger.log('MF for NP Sheet is being edited');
    timeoutFunction(() => insertNPListDate(e), 10000, 'insertNPListDate');
  } else if (sheetName === 'Requests') {
    Logger.log('Requests Sheet is being edited');
    timeoutFunction(() => onCheckMoveRow(e), 10000, 'onCheckMoveRow');
  }
};

// General function to run all On Edit functions with a time-out of 10 seconds
function onEdit(e) {
  Logger.log("onEdit function triggered");
  timeoutFunction(() => onEditSheetCheck(e), 10000);
};
