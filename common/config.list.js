module.exports = [{
  cus_id: 1,
  variation: 1,
  //Start: olr excel read parameters
  olrValidations: {
    sheetName: 'SIZED',
    filterKey: 'Tech Pack Style',
    joinParameters: {
      join: true,
      data01Key: 'mastsizedesc', //Excel data
      data02Key: 'size_name', //Size template data
    },
    mandatoryKeys: ['Division', 'Tech Pack Style', 'Style Desc', 'Tech Pack Style', 'Size', 'Size Qty', 'Tech Pack Season', 'Style Color Name', 'Style Color Extension', 'Style Color'],
    outputModel: {
      custname: 'custname',
      divisioncode: 'divisioncode',
      vpono: 'vpono',
      techpackno: 'techpackno',
      maststyledesc: 'maststyledesc',
      custstyle: 'custstyle',
      custstyledesc: 'custstyledesc',
      stylecolorname: 'stylecolorname',
      mastcolordesc: 'mastcolordesc',
      computecolordesc: 'computecolordesc',
      stylecolorextension: 'stylecolorextension',
      stylecolor: 'stylecolor',
      mastsizedesc: 'mastsizedesc',
      orderqty: 'orderqty',
      season: 'season'
    },
    fieldMappings: [ //config: { replace: ['-', ' '], trim: true , split: ',' }
      //{ inputKey: '', outputKey: 'custname', config: { trim: true } },
      { inputKey: 'Division', outputKey: 'divisioncode', config: { trim: true } },
      //{ inputKey: '', outputKey: 'vpono', config: { trim: true } },
      { inputKey: 'Tech Pack Style', outputKey: 'techpackno', config: { trim: true } },
      { inputKey: 'Style Desc', outputKey: 'maststyledesc', config: { trim: true } },
      { inputKey: 'PrePack Style#', outputKey: 'custstyle', config: { trim: true } },
      { inputKey: 'Item Description', outputKey: 'custstyledesc', config: { trim: true } },
      { inputKey: 'Style Color Name', outputKey: 'stylecolorname', config: { trim: true } },
      { inputKey: 'Style Color Extension', outputKey: 'stylecolorextension', config: { trim: true } },
      { inputKey: 'Style Color', outputKey: 'stylecolor', config: { trim: true } },
      { inputKey: 'Size', outputKey: 'mastsizedesc', config: { trim: true } },
      { inputKey: 'Size Qty', outputKey: 'orderqty', config: { trim: true } },
      { inputKey: 'Tech Pack Season', outputKey: 'season', config: { trim: true } }
    ],
    groupingSpec: { // field: 'name', spans: [[0, 1], [1, 3], [3, 7]]
      field: 'techpackno'
    },
    concatenateKeys: [
      {
        newKey: 'mastcolordesc',
        keysToConcatenate: ['stylecolorname', 'stylecolorextension', 'stylecolor'],
        delimiter: '-'
      },
      {
        newKey: 'computecolordesc',
        keysToConcatenate: ['stylecolor'],
        delimiter: ''
      }
    ],
    arrayKeySpecs: [ //{ key: 'ArrayKey2', repeatValue: 'Value2' }
      { key: 'custname', repeatValue: '-' },
      { key: 'vpono', repeatValue: '-' }
    ],
    mergeKeys: [//'Tags'

    ],
  },
  //End: olr excel read parameters

  //Start: plm api data read parameters
  plmValidations: {
    //Start: plm bom read parameters
    matTypes: [
      { matType: "Sewing", validateSubTypes: true, matSubTypes: ["Tape", "Snap tape", "Neck tape", "Mobilon tape", "Elastic", "Zipper", "Buttons", "Snap"] },
      { matType: "Fabric", validateSubTypes: false, matSubTypes: [] },
      { matType: "Embellishments and Graphics", validateSubTypes: false, matSubTypes: [] },
      { matType: "Washes and Finishes", validateSubTypes: false, matSubTypes: [] }
    ],
    plmSkipValue: 'centric%3A',
    letterNumber: /^[0-9a-zA-Z]+$/,
    //dyeRoots: [[/^Name$/i]]
    dyeRoots: [[/^_HTR$/i, ''], [/^_NATURAL$/i, ''], [/^_PRINT$/i, ''], [/^_SOLID$/i, ''], [/^_NDD$/i, ''], [/^_YD$/i, ''], [/^_PD$/i, ''],
    [/^_SD$/i, ''], [/^_DSD$/i, ''], [/^_PSD$/i, ''], [/^_DD$/i, ''], [/^_ND$/i, ''], [/^_NPSD$/i, ''], [/^_NDD$/i, ''],
    [/^_NPD$/i, ''], [/^_PFD$/i, ''], [/ - TOP$/i, ''], [/^-TOP$/i, ''], [/ - BOTTOM$/i, ''], [/^-BOTTOM$/i, ''],
    [/ - BTM$/i, ''], [/^-BTM$/i, ''], [/ - KIM$/i, ''], [/^-KIM$/i, '']
    ],
    //End: plm bom read parameters
    
    sheetName: 'SIZED',
    filterKey: 'Tech Pack Style',
    joinParameters: {
      join: true,
      data01Key: 'mastsizedesc', //Excel data
      data02Key: 'size_name', //Size template data
    },
    mandatoryKeys: ['Division', 'Tech Pack Style', 'Style Desc', 'Tech Pack Style', 'Size', 'Size Qty', 'Tech Pack Season', 'Style Color Name', 'Style Color Extension', 'Style Color'],
    outputModel: {
      custname: 'custname',
      divisioncode: 'divisioncode',
      vpono: 'vpono',
      techpackno: 'techpackno',
      maststyledesc: 'maststyledesc',
      custstyle: 'custstyle',
      custstyledesc: 'custstyledesc',
      stylecolorname: 'stylecolorname',
      mastcolordesc: 'mastcolordesc',
      computecolordesc: 'computecolordesc',
      stylecolorextension: 'stylecolorextension',
      stylecolor: 'stylecolor',
      mastsizedesc: 'mastsizedesc',
      orderqty: 'orderqty',
      season: 'season'
    },
    fieldMappings: [ //config: { replace: ['-', ' '], trim: true , split: ',' }
      //{ inputKey: '', outputKey: 'custname', config: { trim: true } },
      { inputKey: 'Division', outputKey: 'divisioncode', config: { trim: true } },
      //{ inputKey: '', outputKey: 'vpono', config: { trim: true } },
      { inputKey: 'Tech Pack Style', outputKey: 'techpackno', config: { trim: true } },
      { inputKey: 'Style Desc', outputKey: 'maststyledesc', config: { trim: true } },
      { inputKey: 'PrePack Style#', outputKey: 'custstyle', config: { trim: true } },
      { inputKey: 'Item Description', outputKey: 'custstyledesc', config: { trim: true } },
      { inputKey: 'Style Color Name', outputKey: 'stylecolorname', config: { trim: true } },
      { inputKey: 'Style Color Extension', outputKey: 'stylecolorextension', config: { trim: true } },
      { inputKey: 'Style Color', outputKey: 'stylecolor', config: { trim: true } },
      { inputKey: 'Size', outputKey: 'mastsizedesc', config: { trim: true } },
      { inputKey: 'Size Qty', outputKey: 'orderqty', config: { trim: true } },
      { inputKey: 'Tech Pack Season', outputKey: 'season', config: { trim: true } }
    ],
    groupingSpec: { // field: 'name', spans: [[0, 1], [1, 3], [3, 7]]
      field: 'techpackno'
    },
    concatenateKeys: [
      {
        newKey: 'mastcolordesc',
        keysToConcatenate: ['stylecolorname', 'stylecolorextension', 'stylecolor'],
        delimiter: '-'
      },
      {
        newKey: 'computecolordesc',
        keysToConcatenate: ['stylecolor'],
        delimiter: ''
      }
    ],
    arrayKeySpecs: [ //{ key: 'ArrayKey2', repeatValue: 'Value2' }
      { key: 'custname', repeatValue: '-' },
      { key: 'vpono', repeatValue: '-' }
    ],
    mergeKeys: [//'Tags'

    ],
  },
  //End: plm api data read parameters
}];