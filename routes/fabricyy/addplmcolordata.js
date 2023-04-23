const { pool } = require('../dbconfig');
const moment = require('moment');

module.exports = async (req, res) => {

  //Check Body Is Empty
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {

    res.status(200).json({ Type: "ERROR", Msg: "Oops! Empty Data Set." })
    return;

  }

  //Check Element Count
  console.log(`Checking Length: ${Object.keys(req.body).length}`);
  if (Object.keys(req.body).length < 2) {

    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Dataset" })
    return;

  }

  const var_fabricyyid = req.body.fabric_yyid;
  const var_colorset = req.body.colorset;
  console.log(`Checking`);
  //Amendmant 
  if(!req.body?.isAmendmant){
    var sqlqry_delete = `DELETE FROM plm_colorways WHERE fabyy_id='${var_fabricyyid}';`;
    console.log(`DELETE FROM plm_colorways WHERE fabyy_id=${var_fabricyyid} `);
    var respose_delete = await query(sqlqry_delete);
  }

  for (var row_index in var_colorset) {

    var obj_color = var_colorset[row_index];
    var colorname_new = await dyerootmap(obj_color.name);

    var valitem_colorold = String(obj_color.name).replace(/'/g, "''");
    var valitem_colorname = String(colorname_new).replace(/'/g, "''");
    var valitem_colorway = String(obj_color.colorway).replace(/'/g, "''");
    var valitem_garmentway = String(obj_color.garmentway).replace(/'/g, "''");

    var sqlqry_insert = `INSERT INTO plm_colorways(fabyy_id, plm_cw_id, cw_name, cw_desc, colorway, garmentway,cw_order) 
    VALUES ('${var_fabricyyid}','${obj_color.id}','${valitem_colorname}','${valitem_colorold}','${valitem_colorway}',
    '${valitem_garmentway}','${obj_color.seq}');`;
    var response_insert = await query(sqlqry_insert);
  }

  res.status(200).json({Type: 'SUCCESS', Dataset : "Successfully Added."})
  return;

    async function dyerootmap(value) {
      
      if(value.toUpperCase().includes('_HTR') === true)
      {
        return value.replace('_HTR','');
      }
      else if(value.toUpperCase().includes('_NATURAL') === true)
      {
        return value.replace('_Natural','');
      }
      else if(value.toUpperCase().includes('_PRINT') === true)
      {
        return value.replace('_Print','');
      }
      else if(value.toUpperCase().includes('_SOLID') === true)
      {
        return value.replace('_Solid','');
      }
      else if(value.toUpperCase().includes('_NDD') === true)
      {
        return value.replace('_NDD','');
      }
      else if(value.toUpperCase().includes('_YD') === true)
      {
        return value.replace('_YD','');
      }
      else if(value.toUpperCase().includes('_PD') === true)
      {
        return value.replace('_PD','');
      }
      else if(value.toUpperCase().includes('_SD') === true)
      {
        return value.replace('_SD','');
      }
      else if(value.toUpperCase().includes('_DSD') === true)
      {
        return value.replace('_DSD','');
      }
      else if(value.toUpperCase().includes('_PSD') === true)
      {
        return value.replace('_PSD','');
      }
      else if(value.toUpperCase().includes('_DD') === true)
      {
        return value.replace('_DD','');
      }
      else if(value.toUpperCase().includes('_ND') === true)
      {
        return value.replace('_ND','');
      }
      else if(value.toUpperCase().includes('_NPSD') === true)
      {
        return value.replace('_NPSD','');
      }
      else if(value.toUpperCase().includes('_NDD') === true)
      {
        return value.replace('_NDD','');
      }
      else if(value.toUpperCase().includes('_NPD') === true)
      {
        return value.replace('_NPD','');
      }
      else if(value.toUpperCase().includes('_PFD') === true)
      {
        return value.replace('_PFD','');
      }
      else if(value.toUpperCase().includes(' - TOP') === true)
      {
        return value.replace(' - TOP','');
      }
      //without space
      else if(value.toUpperCase().includes('-TOP') === true)
      {
        return value.replace('-TOP','');
      }
      else if(value.toUpperCase().includes(' - BOTTOM') === true)
      {
        return value.replace(' - BOTTOM','');
      }
      //without space
      else if(value.toUpperCase().includes('-BOTTOM') === true)
      {
        return value.replace('-BOTTOM','');
      }
      else if(value.toUpperCase().includes(' - BTM') === true)
      {
        return value.replace(' - BTM','');
      }
      //without space
      else if(value.toUpperCase().includes('-BTM') === true)
      {
        return value.replace('-BTM','');
      }
      //newly added dyeroots-------------------------------------------------------------starts
      else if(value.toUpperCase().includes(' - KIM') === true)
      {
        return value.replace(' - KIM','');
      }
      //without space
      else if(value.toUpperCase().includes('-KIM') === true)
      {
        return value.replace('-KIM','');
      }
      else if(value.toUpperCase().includes(' - M') === true)
      {
        return value.replace(' - M','');
      }
      //without space
      else if(value.toUpperCase().includes('-M') === true)
      {
        return value.replace('-M','');
      }
      else if(value.toUpperCase().includes(' - G') === true)
      {
        return value.replace(' - G','');
      }
      //without space
      else if(value.toUpperCase().includes('-G') === true)
      {
        return value.replace('-G','');
      }
      else if(value.toUpperCase().includes(' - S') === true)
      {
        return value.replace(' - S','');
      }
      //without space
      else if(value.toUpperCase().includes('-S') === true)
      {
        return value.replace('-S','');
      }
      //newly added dyeroots-------------------------------------------------------------ends
      else
      {
        return value;
      }

    }

    //Postgres Query Run With Async Await
    async function query(q) {
      const client = await pool.connect()
      let res
      try {
        await client.query('BEGIN')
        try {
          res = await client.query(q)
          await client.query('COMMIT')
        } catch (err) {
          await client.query('ROLLBACK')
          throw err
        }
      } finally {
        client.release()
      }
      return res
    }

};