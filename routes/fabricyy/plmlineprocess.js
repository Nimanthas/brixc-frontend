const { pool } = require('../dbconfig');

module.exports = async (req, res) => {

        const var_fabyyid = req.params.fabyyid;

        var sqlqry_deleteplmvpo =`DELETE FROM plm_items_vpo WHERE fabyy_id='${var_fabyyid}';`;

        const respose_delete = await query(sqlqry_deleteplmvpo);

        var sqlqry_selectplm =`SELECT * FROM plm_items WHERE fabyy_id='${var_fabyyid}' ORDER BY gmt_color_order;`;

        const results_selectplm = await query(sqlqry_selectplm);

        for (var row_selectplm in results_selectplm.rows)
        {
          var obj_selectplm = results_selectplm.rows[row_selectplm];

          var valitem_actual = String(obj_selectplm.plm_actual).replace(/'/g, "''");
          var valitem_plm_item_name = String(obj_selectplm.plm_item_name).replace(/'/g, "''");
          var valitem_plm_item_desc = String(obj_selectplm.plm_item_desc).replace(/'/g, "''");
          var valitem_plm_colorway_type = String(obj_selectplm.plm_colorway_type).replace(/'/g, "''");
          var valitem_plm_supplier = String(obj_selectplm.plm_supplier).replace(/'/g, "''");
          var valitem_plm_fab_type = String(obj_selectplm.plm_fab_type).replace(/'/g, "''");
          var valitem_plm_placement = String(obj_selectplm.plm_placement).replace(/'/g, "''");
          var valitem_plm_color = String(obj_selectplm.plm_color).replace(/'/g, "''");

          var sqlqry_insertplmvpo =`INSERT INTO plm_items_vpo(vpono, fabyy_id, plm_item_id, plm_actual, plm_item_name, plm_item_desc, plm_colorway_type, plm_supplier, plm_fab_type, plm_cw, plm_placement, plm_color, item_comment, gmt_color_order)
            SELECT vpono,${obj_selectplm.fabyy_id},'${obj_selectplm.plm_item_id}','${valitem_actual}','${valitem_plm_item_name}',
            '${valitem_plm_item_desc}','${valitem_plm_colorway_type}','${valitem_plm_supplier}',
            '${valitem_plm_fab_type}','${obj_selectplm.plm_cw}','${valitem_plm_placement}',
            '${valitem_plm_color}','',${obj_selectplm.gmt_color_order} FROM olr_items WHERE fabyy_id='${var_fabyyid}' AND upper(color) IN (SELECT upper(cw_name) FROM plm_colorways WHERE fabyy_id='${var_fabyyid}' AND cw_order='${obj_selectplm.gmt_color_order}') ORDER BY vpono;`;
          console.log(`Query insert :${JSON.stringify(sqlqry_insertplmvpo)}`);
          const results_insertvpo = await query(sqlqry_insertplmvpo); 
        }

        res.status(200).json({Type: 'SUCCESS', Msg : 'PLM Material Combined With VPO Completed.'})
        return;

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
  
}