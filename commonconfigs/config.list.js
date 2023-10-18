module.exports = [
  //Pink
  {
    cus_id: 1,
    variation: 1,
    //Start: olr excel read parameters
    olrValidations: {
      sheetName: 'number',
      sheetNumber: 0,
      blankRows: false,
      joinParameters: {
        join: true,
        data01Key: 'mastsizedesc', //Excel data
        data02Key: 'size_name', //Size template data
      },
      sections: false,
      headerKeys: ['CUSTNAME', 'DIVISIONCODE', 'VPONO', 'TECHPACKNO', 'MASTSTYLEDESC', 'CUSTSTYLE', 'CUSTSTYLEDESC', 'MASTCOLORDESC', 'MASTSIZEDESC', 'ORDERQTY', 'SEASON'],
      mandatoryKeys: ['CUSTNAME', 'DIVISIONCODE', 'VPONO', 'TECHPACKNO', 'MASTSTYLEDESC', 'CUSTSTYLE', 'CUSTSTYLEDESC', 'MASTCOLORDESC', 'MASTSIZEDESC', 'ORDERQTY', 'SEASON'],
      filterKey: 'TECHPACKNO',
      //dont change - this the database table model
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
      fieldMappings: [ //config: { replace: ['-', ' '], trim: true , split: ',' , sub: {option: 'init, last, mid, find', numberofletters: 0, startnumber: 2, findchar: ? ''}}
        //{ inputKey: '', outputKey: 'custname', config: { trim: true } },
        { inputKey: 'CUSTNAME', outputKey: 'custname', config: { trim: true } },
        { inputKey: 'DIVISIONCODE', outputKey: 'divisioncode', config: { trim: true } },
        { inputKey: 'VPONO', outputKey: 'vpono', config: { trim: true } },
        { inputKey: 'TECHPACKNO', outputKey: 'techpackno', config: { trim: true } },
        { inputKey: 'MASTSTYLEDESC', outputKey: 'maststyledesc', config: { trim: true } },
        { inputKey: 'CUSTSTYLE', outputKey: 'custstyle', config: { trim: true } },
        { inputKey: 'CUSTSTYLEDESC', outputKey: 'custstyledesc', config: { trim: true } },
        { inputKey: 'MASTCOLORDESC', outputKey: 'stylecolorname', config: { trim: true } },
        { inputKey: 'MASTCOLORCODE', outputKey: 'stylecolorextension', config: { trim: true } },
        { inputKey: 'CUSTCOLORCODE', outputKey: 'stylecolor', config: { trim: true } },
        { inputKey: 'MASTSIZEDESC', outputKey: 'mastsizedesc', config: { trim: true } },
        { inputKey: 'ORDERQTY', outputKey: 'orderqty', config: { trim: true } },
        { inputKey: 'SEASON', outputKey: 'season', config: { trim: true } }
      ],
      groupingSpec: { // field: 'name', spans: [[0, 1], [1, 3], [3, 7]]
        field: 'techpackno'
      },
      concatenateKeys: [
        {
          newKey: 'mastcolordesc',
          keysToConcatenate: ['stylecolorname'],
          delimiter: '-',
          config: {}
        },
        {
          newKey: 'computecolordesc',
          keysToConcatenate: ['stylecolorname'],
          delimiter: '',
          config: {}
        }
      ],
      arrayKeySpecs: [ //{ key: 'ArrayKey2', repeatValue: 'Value2' }
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

      filterKey: '',
      joinParameters: {
        join: false
      },
      mandatoryKeys: ['plm_color'],
      outputModel: null, //{} 
      fieldMappings: [ //config: { replace: ['-', ' '], trim: true , split: ',' , sub: {option: 'init, last, mid, find', numberofletters: 0, startnumber: 2, findchar: ? ''}}
        //BOM Items
        { inputKey: 'fabyy_id', outputKey: 'fabyy_id', config: { trim: true } },
        { inputKey: 'plm_item_id', outputKey: 'plm_item_id', config: { trim: true } },
        { inputKey: 'plm_actual', outputKey: 'plm_actual', config: { trim: true } },
        { inputKey: 'plm_item_name', outputKey: 'plm_item_name', config: { trim: true } },
        { inputKey: 'plm_item_desc', outputKey: 'plm_item_desc', config: { trim: true } },
        { inputKey: 'plm_colorway_type', outputKey: 'plm_colorway_type', config: { trim: true } },
        { inputKey: 'plm_supplier', outputKey: 'plm_supplier', config: { trim: true } },
        { inputKey: 'plm_fab_type', outputKey: 'plm_fab_type', config: { trim: true } },
        { inputKey: 'plm_cw', outputKey: 'plm_cw', config: { trim: true } },
        { inputKey: 'plm_placement', outputKey: 'plm_placement', config: { trim: true } },
        { inputKey: 'plm_color', outputKey: 'plm_color', config: { trim: true } },
        { inputKey: 'gmt_color_order', outputKey: 'gmt_color_order', config: { trim: true } },
        //Colors
        { inputKey: 'plm_cw_id', outputKey: 'plm_cw_id', config: { trim: true } },
        { inputKey: 'cw_name', outputKey: 'cw_name', config: { trim: true } },
        { inputKey: 'cw_desc', outputKey: 'cw_desc', config: { trim: true } },
        { inputKey: 'colorway', outputKey: 'colorway', config: { trim: true } },
        { inputKey: 'garmentway', outputKey: 'garmentway', config: { trim: true } },
        { inputKey: 'cw_order', outputKey: 'cw_order', config: { trim: true } },
      ],
      groupingSpec: { // field: 'name', spans: [[0, 1], [1, 3], [3, 7]]
      },
      concatenateKeys: [
        {
          newKey: 'computecolordesc_item',
          keysToConcatenate: ['plm_color'],
          delimiter: '',
          config: { trim: true }
        },
        {
          newKey: 'computecolordesc_color',
          keysToConcatenate: ['plm_color'],
          delimiter: '',
          config: { trim: true }
        },
      ],
      arrayKeySpecs: [ //{ key: 'ArrayKey2', repeatValue: 'Value2' }
      ],
      mergeKeys: [//'Tags'
      ],
    },
    //End: plm api data read parameters
  },
  //VS
  {
    cus_id: 2,
    variation: 1,
    //Start: olr excel read parameters
    olrValidations: {
      sheetName: 'number',
      sheetNumber: 0,
      blankRows: false,
      joinParameters: {
        join: true,
        data01Key: 'mastsizedesc', //Excel data
        data02Key: 'size_name', //Size template data
      },
      sections: false,
      headerKeys: ['CUSTNAME', 'DIVISIONCODE', 'VPONO', 'TECHPACKNO', 'MASTSTYLEDESC', 'CUSTSTYLE', 'CUSTSTYLEDESC', 'MASTCOLORDESC', 'MASTSIZEDESC', 'ORDERQTY', 'SEASON'],
      mandatoryKeys: ['CUSTNAME', 'DIVISIONCODE', 'VPONO', 'TECHPACKNO', 'MASTSTYLEDESC', 'CUSTSTYLE', 'CUSTSTYLEDESC', 'MASTCOLORDESC', 'MASTSIZEDESC', 'ORDERQTY', 'SEASON'],
      filterKey: 'TECHPACKNO',
      //dont change - this the database table model
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
      fieldMappings: [ //config: { replace: ['-', ' '], trim: true , split: ',' , sub: {option: 'init, last, mid, find', numberofletters: 0, startnumber: 2, findchar: ? ''}}
        //{ inputKey: '', outputKey: 'custname', config: { trim: true } },
        { inputKey: 'CUSTNAME', outputKey: 'custname', config: { trim: true } },
        { inputKey: 'DIVISIONCODE', outputKey: 'divisioncode', config: { trim: true } },
        { inputKey: 'VPONO', outputKey: 'vpono', config: { trim: true } },
        { inputKey: 'TECHPACKNO', outputKey: 'techpackno', config: { trim: true } },
        { inputKey: 'MASTSTYLEDESC', outputKey: 'maststyledesc', config: { trim: true } },
        { inputKey: 'CUSTSTYLE', outputKey: 'custstyle', config: { trim: true } },
        { inputKey: 'CUSTSTYLEDESC', outputKey: 'custstyledesc', config: { trim: true } },
        { inputKey: 'MASTCOLORDESC', outputKey: 'stylecolorname', config: { trim: true } },
        { inputKey: 'MASTCOLORCODE', outputKey: 'stylecolorextension', config: { trim: true } },
        { inputKey: 'CUSTCOLORCODE', outputKey: 'stylecolor', config: { trim: true } },
        { inputKey: 'MASTSIZEDESC', outputKey: 'mastsizedesc', config: { trim: true } },
        { inputKey: 'ORDERQTY', outputKey: 'orderqty', config: { trim: true } },
        { inputKey: 'SEASON', outputKey: 'season', config: { trim: true } }
      ],
      groupingSpec: { // field: 'name', spans: [[0, 1], [1, 3], [3, 7]]
        field: 'techpackno'
      },
      concatenateKeys: [
        {
          newKey: 'mastcolordesc',
          keysToConcatenate: ['stylecolorname'],
          delimiter: '-',
          config: {}
        },
        {
          newKey: 'computecolordesc',
          keysToConcatenate: ['stylecolorname'],
          delimiter: '',
          config: {}
        }
      ],
      arrayKeySpecs: [ //{ key: 'ArrayKey2', repeatValue: 'Value2' }
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

      filterKey: '',
      joinParameters: {
        join: false
      },
      mandatoryKeys: ['plm_color'],
      outputModel: null, //{} 
      fieldMappings: [ //config: { replace: ['-', ' '], trim: true , split: ',' , sub: {option: 'init, last, mid, find', numberofletters: 0, startnumber: 2, findchar: ? ''}}
        //BOM Items
        { inputKey: 'fabyy_id', outputKey: 'fabyy_id', config: { trim: true } },
        { inputKey: 'plm_item_id', outputKey: 'plm_item_id', config: { trim: true } },
        { inputKey: 'plm_actual', outputKey: 'plm_actual', config: { trim: true } },
        { inputKey: 'plm_item_name', outputKey: 'plm_item_name', config: { trim: true } },
        { inputKey: 'plm_item_desc', outputKey: 'plm_item_desc', config: { trim: true } },
        { inputKey: 'plm_colorway_type', outputKey: 'plm_colorway_type', config: { trim: true } },
        { inputKey: 'plm_supplier', outputKey: 'plm_supplier', config: { trim: true } },
        { inputKey: 'plm_fab_type', outputKey: 'plm_fab_type', config: { trim: true } },
        { inputKey: 'plm_cw', outputKey: 'plm_cw', config: { trim: true } },
        { inputKey: 'plm_placement', outputKey: 'plm_placement', config: { trim: true } },
        { inputKey: 'plm_color', outputKey: 'plm_color', config: { trim: true } },
        { inputKey: 'gmt_color_order', outputKey: 'gmt_color_order', config: { trim: true } },
        //Colors
        { inputKey: 'plm_cw_id', outputKey: 'plm_cw_id', config: { trim: true } },
        { inputKey: 'cw_name', outputKey: 'cw_name', config: { trim: true } },
        { inputKey: 'cw_desc', outputKey: 'cw_desc', config: { trim: true } },
        { inputKey: 'colorway', outputKey: 'colorway', config: { trim: true } },
        { inputKey: 'garmentway', outputKey: 'garmentway', config: { trim: true } },
        { inputKey: 'cw_order', outputKey: 'cw_order', config: { trim: true } },
      ],
      groupingSpec: { // field: 'name', spans: [[0, 1], [1, 3], [3, 7]]
      },
      concatenateKeys: [
        {
          newKey: 'computecolordesc_item',
          keysToConcatenate: ['plm_color'],
          delimiter: '',
          config: { trim: true }
        },
        {
          newKey: 'computecolordesc_color',
          keysToConcatenate: ['plm_color'],
          delimiter: '',
          config: { trim: true }
        },
      ],
      arrayKeySpecs: [ //{ key: 'ArrayKey2', repeatValue: 'Value2' }
      ],
      mergeKeys: [//'Tags'
      ],
    },
    //End: plm api data read parameters
  },
  //Aritzia
  {
    cus_id: 3,
    variation: 1,
    //Start: olr excel read parameters
    olrValidations: {
      sheetName: 'SIZED',
      sheetNumber: 0,
      blankRows: false,
      filterKey: 'Tech Pack Style',
      joinParameters: {
        join: true,
        data01Key: 'mastsizedesc', //Excel data
        data02Key: 'size_name', //Size template data
      },
      sections: false,
      headerKeys: ['Purchasing Document', 'Vendor Article Number', 'Short Text', 'Season', 'Colour', 'Order Quantity', 'Size'],
      mandatoryKeys: ['Purchasing Document', 'Vendor Article Number', 'Short Text', 'Season', 'Colour', 'Order Quantity', 'Size'],
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
      fieldMappings: [ //config: { replace: ['-', ' '], trim: true , split: ',' , sub: {option: 'init, last, mid, find', numberofletters: 0, startnumber: 2, findchar: ? ''}}
        //{ inputKey: '', outputKey: 'custname', config: { trim: true } },
        //{ inputKey: 'Division', outputKey: 'divisioncode', config: { trim: true } },
        { inputKey: 'Purchasing Document', outputKey: 'vpono', config: { trim: true } },
        { inputKey: 'Vendor Article Number', outputKey: 'techpackno', config: { trim: true } },
        { inputKey: 'Short Text', outputKey: 'maststyledesc', config: { trim: true } },
        //{ inputKey: 'Vendor Article Number', outputKey: 'custstyle', config: { trim: true } },
        //  { inputKey: 'Item Description', outputKey: 'custstyledesc', config: { trim: true } },
        { inputKey: 'Colour', outputKey: 'mastcolordesc', config: { trim: true } },
        //{ inputKey: 'Style Color Name', outputKey: 'stylecolorname', config: { trim: true } },
        //{ inputKey: 'Style Color Extension', outputKey: 'stylecolorextension', config: { trim: true } },
        //{ inputKey: 'Style Color', outputKey: 'stylecolor', config: { trim: true } },
        { inputKey: 'Size', outputKey: 'mastsizedesc', config: { trim: true } },
        { inputKey: 'Order Quantity', outputKey: 'orderqty', config: { trim: true } },
        { inputKey: 'Season', outputKey: 'season', config: { trim: true } }
      ],
      groupingSpec: { // field: 'name', spans: [[0, 1], [1, 3], [3, 7]]
        field: 'techpackno'
      },
      concatenateKeys: [
        {
          newKey: 'custstyle',
          keysToConcatenate: ['techpackno'],
          delimiter: '',
          config: {}
        },
        {
          newKey: 'custstyledesc',
          keysToConcatenate: ['maststyledesc'],
          delimiter: '',
          config: {}
        },
        {
          newKey: 'computecolordesc',
          keysToConcatenate: ['mastcolordesc'],
          delimiter: '',
          config: {}
        }
      ],
      arrayKeySpecs: [ //{ key: 'ArrayKey2', repeatValue: 'Value2' }
        { key: 'custname', repeatValue: '-' },
        { key: 'divisioncode', repeatValue: 'ARITZIA' },
        { key: 'stylecolorname', repeatValue: '-' },
        { key: 'stylecolorextension', repeatValue: '-' },
        { key: 'stylecolor', repeatValue: '-' }
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

      filterKey: '',
      joinParameters: {
        join: false
      },
      mandatoryKeys: ['plm_color'],
      outputModel: null, //{} 
      fieldMappings: [ //config: { replace: ['-', ' '], trim: true , split: ',' , sub: {option: 'init, last, mid, find', numberofletters: 0, startnumber: 2, findchar: ? ''}}
        //BOM Items
        { inputKey: 'fabyy_id', outputKey: 'fabyy_id', config: { trim: true } },
        { inputKey: 'plm_item_id', outputKey: 'plm_item_id', config: { trim: true } },
        { inputKey: 'plm_actual', outputKey: 'plm_actual', config: { trim: true } },
        { inputKey: 'plm_item_name', outputKey: 'plm_item_name', config: { trim: true } },
        { inputKey: 'plm_item_desc', outputKey: 'plm_item_desc', config: { trim: true } },
        { inputKey: 'plm_colorway_type', outputKey: 'plm_colorway_type', config: { trim: true } },
        { inputKey: 'plm_supplier', outputKey: 'plm_supplier', config: { trim: true } },
        { inputKey: 'plm_fab_type', outputKey: 'plm_fab_type', config: { trim: true } },
        { inputKey: 'plm_cw', outputKey: 'plm_cw', config: { trim: true } },
        { inputKey: 'plm_placement', outputKey: 'plm_placement', config: { trim: true } },
        { inputKey: 'plm_color', outputKey: 'plm_color', config: { trim: true } },
        { inputKey: 'gmt_color_order', outputKey: 'gmt_color_order', config: { trim: true } },
        //Colors
        { inputKey: 'plm_cw_id', outputKey: 'plm_cw_id', config: { trim: true } },
        { inputKey: 'cw_name', outputKey: 'cw_name', config: { trim: true } },
        { inputKey: 'cw_desc', outputKey: 'cw_desc', config: { trim: true } },
        { inputKey: 'colorway', outputKey: 'colorway', config: { trim: true } },
        { inputKey: 'garmentway', outputKey: 'garmentway', config: { trim: true } },
        { inputKey: 'cw_order', outputKey: 'cw_order', config: { trim: true } },
      ],
      groupingSpec: { // field: 'name', spans: [[0, 1], [1, 3], [3, 7]]
      },
      concatenateKeys: [
        {
          newKey: 'computecolordesc_item',
          keysToConcatenate: ['plm_color'],
          delimiter: '',
          config: { trim: true, sub: { option: 'last', numberofletters: 3 } }
        },
        {
          newKey: 'computecolordesc_color',
          keysToConcatenate: ['plm_color'],
          delimiter: '',
          config: { trim: true, sub: { option: 'last', numberofletters: 3 } }
        },
      ],
      arrayKeySpecs: [ //{ key: 'ArrayKey2', repeatValue: 'Value2' }
      ],
      mergeKeys: [//'Tags'
      ],
    },
    //End: plm api data read parameters
  },
  //PVH-CKNA
  {
    cus_id: 4,
    variation: 1,
    //Start: olr excel read parameters
    olrValidations: {
      sheetName: 'SIZED',
      sheetNumber: 0,
      blankRows: false,
      joinParameters: {
        join: true,
        data01Key: 'mastsizedesc', //Excel data
        data02Key: 'size_name', //Size template data
      },
      sections: false,
      headerKeys: ['Division', 'Tech Pack Style', 'Style Desc', 'Tech Pack Style', 'Size', 'Size Qty', 'Tech Pack Season', 'Style Color Name', 'Style Color Extension', 'Style Color'],
      mandatoryKeys: ['Division', 'Tech Pack Style', 'Style Desc', 'Tech Pack Style', 'Size', 'Size Qty', 'Tech Pack Season', 'Style Color Name', 'Style Color Extension', 'Style Color'],
      filterKey: 'Tech Pack Style',
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
      fieldMappings: [ //config: { replace: ['-', ' '], trim: true , split: ',' , sub: {option: 'init, last, mid, find', numberofletters: 0, startnumber: 2, findchar: ? ''}}
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
          delimiter: '-',
          config: {}
        },
        {
          newKey: 'computecolordesc',
          keysToConcatenate: ['stylecolor'],
          delimiter: '',
          config: {}
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

      filterKey: '',
      joinParameters: {
        join: false
      },
      mandatoryKeys: ['plm_color'],
      outputModel: null, //{} 
      fieldMappings: [ //config: { replace: ['-', ' '], trim: true , split: ',' , sub: {option: 'init, last, mid, find', numberofletters: 0, startnumber: 2, findchar: ? ''}}
        //BOM Items
        { inputKey: 'fabyy_id', outputKey: 'fabyy_id', config: { trim: true } },
        { inputKey: 'plm_item_id', outputKey: 'plm_item_id', config: { trim: true } },
        { inputKey: 'plm_actual', outputKey: 'plm_actual', config: { trim: true } },
        { inputKey: 'plm_item_name', outputKey: 'plm_item_name', config: { trim: true } },
        { inputKey: 'plm_item_desc', outputKey: 'plm_item_desc', config: { trim: true } },
        { inputKey: 'plm_colorway_type', outputKey: 'plm_colorway_type', config: { trim: true } },
        { inputKey: 'plm_supplier', outputKey: 'plm_supplier', config: { trim: true } },
        { inputKey: 'plm_fab_type', outputKey: 'plm_fab_type', config: { trim: true } },
        { inputKey: 'plm_cw', outputKey: 'plm_cw', config: { trim: true } },
        { inputKey: 'plm_placement', outputKey: 'plm_placement', config: { trim: true } },
        { inputKey: 'plm_color', outputKey: 'plm_color', config: { trim: true } },
        { inputKey: 'gmt_color_order', outputKey: 'gmt_color_order', config: { trim: true } },
        //Colors
        { inputKey: 'plm_cw_id', outputKey: 'plm_cw_id', config: { trim: true } },
        { inputKey: 'cw_name', outputKey: 'cw_name', config: { trim: true } },
        { inputKey: 'cw_desc', outputKey: 'cw_desc', config: { trim: true } },
        { inputKey: 'colorway', outputKey: 'colorway', config: { trim: true } },
        { inputKey: 'garmentway', outputKey: 'garmentway', config: { trim: true } },
        { inputKey: 'cw_order', outputKey: 'cw_order', config: { trim: true } },
      ],
      groupingSpec: { // field: 'name', spans: [[0, 1], [1, 3], [3, 7]]
      },
      concatenateKeys: [
        {
          newKey: 'computecolordesc_item',
          keysToConcatenate: ['plm_color'],
          delimiter: '',
          config: { trim: true, sub: { option: 'last', numberofletters: 3 } }
        },
        {
          newKey: 'computecolordesc_color',
          keysToConcatenate: ['plm_color'],
          delimiter: '',
          config: { trim: true, sub: { option: 'last', numberofletters: 3 } }
        },
      ],
      arrayKeySpecs: [ //{ key: 'ArrayKey2', repeatValue: 'Value2' }
      ],
      mergeKeys: [//'Tags'
      ],
    },
    //End: plm api data read parameters
  },
  //PVH-TUG
  {
    cus_id: 5,
    variation: 1,
    //Start: olr excel read parameters
    olrValidations: {
      sheetName: 'AA',
      sheetNumber: 0,
      blankRows: false,
      filterKey: '**Global Style',
      joinParameters: {
        join: true,
        data01Key: 'mastsizedesc', //Excel data
        data02Key: 'size_name', //Size template data
      },
      sections: false,
      headerKeys: ['**Style Descr', '**Global Style', '**Color Descr', '**NRF', '**Color', 'Size', 'Qty'],
      mandatoryKeys: ['**Style Descr', '**Global Style', '**Color Descr', '**NRF', '**Color', 'Size', 'Qty'],
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
      fieldMappings: [ //config: { replace: ['-', ' '], trim: true , split: ',' , sub: {option: 'init, last, mid, find', numberofletters: 0, startnumber: 2, findchar: ? ''}}
        //{ inputKey: '', outputKey: 'custname', config: { trim: true } },
        { inputKey: 'Division', outputKey: 'divisioncode', config: { trim: true } },
        //{ inputKey: '', outputKey: 'vpono', config: { trim: true } },
        { inputKey: '**Global Style', outputKey: 'techpackno', config: { trim: true } },
        { inputKey: '**Style Descr', outputKey: 'maststyledesc', config: { trim: true } },
        //{ inputKey: 'PrePack Style#', outputKey: 'custstyle', config: { trim: true } },
        //{ inputKey: 'Item Description', outputKey: 'custstyledesc', config: { trim: true } },
        { inputKey: '**Color Descr', outputKey: 'stylecolorname', config: { trim: true } },
        { inputKey: '**Color', outputKey: 'stylecolorextension', config: { trim: true } },
        { inputKey: '**NRF', outputKey: 'stylecolor', config: { trim: true } },
        { inputKey: 'Size', outputKey: 'mastsizedesc', config: { trim: true } },
        { inputKey: 'Qty', outputKey: 'orderqty', config: { trim: true } },
        //{ inputKey: 'Tech Pack Season', outputKey: 'season', config: { trim: true } }
      ],
      groupingSpec: { // field: 'name', spans: [[0, 1], [1, 3], [3, 7]]
        field: 'techpackno'
      },
      concatenateKeys: [
        {
          newKey: 'mastcolordesc',
          keysToConcatenate: ['stylecolorname', 'stylecolorextension', 'stylecolor'],
          delimiter: '-',
          config: {}
        },
        {
          newKey: 'computecolordesc',
          keysToConcatenate: ['stylecolor'],
          delimiter: '',
          config: {}
        },
        {
          newKey: 'custstyle',
          keysToConcatenate: ['techpackno'],
          delimiter: '',
          config: {}
        },
        {
          newKey: 'custstyledesc',
          keysToConcatenate: ['maststyledesc'],
          delimiter: '',
          config: {}
        }
      ],
      arrayKeySpecs: [ //{ key: 'ArrayKey2', repeatValue: 'Value2' }
        { key: 'custname', repeatValue: '-' },
        { key: 'divisioncode', repeatValue: '-' },
        { key: 'divisioncode', repeatValue: '-' },
        { key: 'vpono', repeatValue: '-' },
        { key: 'season', repeatValue: '-' }
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

      filterKey: '',
      joinParameters: {
        join: false
      },
      mandatoryKeys: ['plm_color'],
      outputModel: null, //{} 
      fieldMappings: [ //config: { replace: ['-', ' '], trim: true , split: ',' , sub: {option: 'init, last, mid, find', numberofletters: 0, startnumber: 2, findchar: ? ''}}
        //BOM Items
        { inputKey: 'fabyy_id', outputKey: 'fabyy_id', config: { trim: true } },
        { inputKey: 'plm_item_id', outputKey: 'plm_item_id', config: { trim: true } },
        { inputKey: 'plm_actual', outputKey: 'plm_actual', config: { trim: true } },
        { inputKey: 'plm_item_name', outputKey: 'plm_item_name', config: { trim: true } },
        { inputKey: 'plm_item_desc', outputKey: 'plm_item_desc', config: { trim: true } },
        { inputKey: 'supplier_ref', outputKey: 'supplier_ref', config: { trim: true } },
        { inputKey: 'plm_colorway_type', outputKey: 'plm_colorway_type', config: { trim: true } },
        { inputKey: 'plm_supplier', outputKey: 'plm_supplier', config: { trim: true } },
        { inputKey: 'plm_fab_type', outputKey: 'plm_fab_type', config: { trim: true } },
        { inputKey: 'plm_cw', outputKey: 'plm_cw', config: { trim: true } },
        { inputKey: 'plm_placement', outputKey: 'plm_placement', config: { trim: true } },
        { inputKey: 'plm_color', outputKey: 'plm_color', config: { trim: true } },
        { inputKey: 'gmt_color_order', outputKey: 'gmt_color_order', config: { trim: true } },
        //Colors
        { inputKey: 'plm_cw_id', outputKey: 'plm_cw_id', config: { trim: true } },
        { inputKey: 'cw_name', outputKey: 'cw_name', config: { trim: true } },
        { inputKey: 'cw_desc', outputKey: 'cw_desc', config: { trim: true } },
        { inputKey: 'colorway', outputKey: 'colorway', config: { trim: true } },
        { inputKey: 'garmentway', outputKey: 'garmentway', config: { trim: true } },
        { inputKey: 'cw_order', outputKey: 'cw_order', config: { trim: true } },
      ],
      groupingSpec: { // field: 'name', spans: [[0, 1], [1, 3], [3, 7]]
      },
      concatenateKeys: [
        {
          newKey: 'computecolordesc_item',
          keysToConcatenate: ['plm_color'],
          delimiter: '',
          config: { trim: true, sub: { option: 'last', numberofletters: 3 } }
        },
        {
          newKey: 'computecolordesc_color',
          keysToConcatenate: ['plm_color'],
          delimiter: '',
          config: { trim: true, sub: { option: 'last', numberofletters: 3 } }
        }
      ],
      arrayKeySpecs: [ //{ key: 'ArrayKey2', repeatValue: 'Value2' }
      ],
      mergeKeys: [//'Tags'
      ],
    },
    //End: plm api data read parameters
  },
  //Harper Wilde
  {
    cus_id: 6,
    variation: 1,
    //Start: olr excel read parameters
    olrValidations: {
      sheetName: 'PO',
      sheetNumber: 0,
      blankRows: false,
      joinParameters: {
        join: true,
        data01Key: 'mastsizedesc', //Excel data
        data02Key: 'size_name', //Size template data
      },
      sections: true,
      headerKeys: ['HW Style #', 'Description', 'Vendor Size', 'Quantity', 'Type', 'Vendor Style #'],
      mandatoryKeys: ['Style::Vendor Style #', 'Style::HW Style #', 'Style::Description', 'Size::Vendor Size', 'Body Color::Description', 'Body Color::#', 'Size::Vendor Size', 'Price & Qtys::Quantity'],
      filterKey: 'Style::HW Style #',
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
      fieldMappings: [ //config: { replace: ['-', ' '], trim: true , split: ',' , sub: {option: 'init, last, mid, find', numberofletters: 0, startnumber: 2, findchar: ? ''}}
        //{ inputKey: '', outputKey: 'custname', config: { trim: true } },
        //{ inputKey: 'Division', outputKey: 'divisioncode', config: { trim: true } },
        //{ inputKey: '', outputKey: 'vpono', config: { trim: true } },
        { inputKey: 'Style::Vendor Style #', outputKey: 'techpackno', config: { trim: true } },
        { inputKey: 'Style::Description', outputKey: 'maststyledesc', config: { trim: true } },
        { inputKey: 'PrePack Style#', outputKey: 'custstyle', config: { trim: true } },
        { inputKey: 'Style::HW Style #', outputKey: 'custstyledesc', config: { trim: true } },
        { inputKey: 'Body Color::Description', outputKey: 'stylecolorname', config: { trim: true } },
        { inputKey: 'Body Color::#', outputKey: 'stylecolorextension', config: { trim: true } },
        //{ inputKey: 'Style Color', outputKey: 'stylecolor', config: { trim: true } },
        { inputKey: 'Size::Vendor Size', outputKey: 'mastsizedesc', config: { trim: true } },
        { inputKey: 'Price & Qtys::Quantity', outputKey: 'orderqty', config: { trim: true } },
        //{ inputKey: 'Tech Pack Season', outputKey: 'season', config: { trim: true } }
      ],
      groupingSpec: { // field: 'name', spans: [[0, 1], [1, 3], [3, 7]]
        field: 'techpackno'
      },
      concatenateKeys: [
        {
          newKey: 'mastcolordesc',
          keysToConcatenate: ['stylecolorname', 'stylecolorextension', 'stylecolor'],
          delimiter: '-',
          config: {}
        },
        {
          newKey: 'computecolordesc',
          keysToConcatenate: ['stylecolorname'],
          delimiter: '',
          config: {}
        },
        {
          newKey: 'custstyledesc',
          keysToConcatenate: ['maststyledesc'],
          delimiter: '',
          config: {}
        },
        {
          newKey: 'stylecolor',
          keysToConcatenate: ['stylecolorname'],
          delimiter: '',
          config: {}
        }
      ],
      arrayKeySpecs: [ //{ key: 'ArrayKey2', repeatValue: 'Value2' }
        { key: 'custname', repeatValue: '-' },
        { key: 'vpono', repeatValue: '-' },
        { key: 'divisioncode', repeatValue: '-' },
        { key: 'season', repeatValue: '-' }
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

      filterKey: '',
      joinParameters: {
        join: false
      },
      mandatoryKeys: ['plm_color'],
      outputModel: null, //{} 
      fieldMappings: [ //config: { replace: ['-', ' '], trim: true , split: ',' , sub: {option: 'init, last, mid, find', numberofletters: 0, startnumber: 2, findchar: ? ''}}
        //BOM Items
        { inputKey: 'fabyy_id', outputKey: 'fabyy_id', config: { trim: true } },
        { inputKey: 'plm_item_id', outputKey: 'plm_item_id', config: { trim: true } },
        { inputKey: 'plm_actual', outputKey: 'plm_actual', config: { trim: true } },
        { inputKey: 'plm_item_name', outputKey: 'plm_item_name', config: { trim: true } },
        { inputKey: 'plm_item_desc', outputKey: 'plm_item_desc', config: { trim: true } },
        { inputKey: 'plm_colorway_type', outputKey: 'plm_colorway_type', config: { trim: true } },
        { inputKey: 'plm_supplier', outputKey: 'plm_supplier', config: { trim: true } },
        { inputKey: 'plm_fab_type', outputKey: 'plm_fab_type', config: { trim: true } },
        { inputKey: 'plm_cw', outputKey: 'plm_cw', config: { trim: true } },
        { inputKey: 'plm_placement', outputKey: 'plm_placement', config: { trim: true } },
        { inputKey: 'plm_color', outputKey: 'plm_color', config: { trim: true } },
        { inputKey: 'gmt_color_order', outputKey: 'gmt_color_order', config: { trim: true } },
        //Colors
        { inputKey: 'plm_cw_id', outputKey: 'plm_cw_id', config: { trim: true } },
        { inputKey: 'cw_name', outputKey: 'cw_name', config: { trim: true } },
        { inputKey: 'cw_desc', outputKey: 'cw_desc', config: { trim: true } },
        { inputKey: 'colorway', outputKey: 'colorway', config: { trim: true } },
        { inputKey: 'garmentway', outputKey: 'garmentway', config: { trim: true } },
        { inputKey: 'cw_order', outputKey: 'cw_order', config: { trim: true } },
      ],
      groupingSpec: { // field: 'name', spans: [[0, 1], [1, 3], [3, 7]]
      },
      concatenateKeys: [
        {
          newKey: 'computecolordesc_item',
          keysToConcatenate: ['plm_color'],
          delimiter: '',
          config: { trim: true } //, sub: { option: 'last', numberofletters: 3 }
        },
        {
          newKey: 'computecolordesc_color',
          keysToConcatenate: ['plm_color'],
          delimiter: '',
          config: { trim: true } //, sub: { option: 'last', numberofletters: 3 }
        },
      ],
      arrayKeySpecs: [ //{ key: 'ArrayKey2', repeatValue: 'Value2' }
      ],
      mergeKeys: [//'Tags'
      ],
    },
    //End: plm api data read parameters
  }
];