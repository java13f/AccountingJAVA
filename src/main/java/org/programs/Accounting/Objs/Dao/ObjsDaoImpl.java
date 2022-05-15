package org.kaznalnrprograms.Accounting.Objs.Dao;


import org.kaznalnrprograms.Accounting.Kter.Models.KokModel;
import org.kaznalnrprograms.Accounting.Kter.Models.UserModel;
import org.kaznalnrprograms.Accounting.Objs.Interfaces.IObjsDao;
import org.kaznalnrprograms.Accounting.Objs.Models.*;
import org.kaznalnrprograms.Accounting.Utils.DBUtils;
import org.springframework.stereotype.Repository;
import org.sql2o.Connection;
import org.sql2o.data.Table;


import java.util.*;

@Repository
public class ObjsDaoImpl implements IObjsDao {

    private String appName = "Objs - перечень объектов";
    private DBUtils db;

    public ObjsDaoImpl(DBUtils db) {
        this.db = db;
    }


    /**
     * Получить количество объектов с учетом фильра
     *
     * @param filterData - модель фильтра
     * @return
     * @throws Exception
     */
    @Override
    public int countObjs(ObjsFilterModel filterData) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new Hashtable<>();

            String dataFilter = "";

            // Проверка даты на пустоту, если пустая, то текущий день
            if (filterData.getDate() == null || filterData.getDate().length() == 0) {
                Date date = new Date();
                filterData.setDate(date.toString());
            }
            String dateObj = " AND o.datebuy <= get_day_beg(CAST(:paramDate as timestamp without time zone))+ interval '1 day'\n";
            params.put("paramDate", filterData.getDate());

            // Собираем фильтр
            if (filterData.getAccsid() != 0) {
                dataFilter += " AND ac.id = " + filterData.getAccsid();
            }
            if (filterData.getInvGrpsid() != 0) {
                dataFilter += " AND iga.inv_grp_id = " + filterData.getInvGrpsid();
            }
            if (filterData.getInvno().length() > 0) {
                dataFilter += " AND o.invno ilike '%'|| :invno || '%'";
                params.put("invno", filterData.getInvno());
            }
            if (filterData.getInvser().length() > 0) {
                dataFilter += " AND o.invser ilike '%' || :invser || '%'";
                params.put("invser", filterData.getInvser());
            }
            if (filterData.getObjtypeid().length() > 0) {
                dataFilter += " AND o.objtypeid = " + filterData.getObjtypeid();
            }
            if (filterData.getName().length() > 0) {
                dataFilter += " AND o.name ilike '%' || :name || '%'";
                params.put("name", filterData.getName());
            }
            if (filterData.getFromstrtamount().length() > 0) {
                dataFilter += " AND o.strtamount >= CAST(replace(:FromStrtAmount, ' ', '') as money)";
                params.put("FromStrtAmount", filterData.getFromstrtamount());
            }
            if (filterData.getBeforestrtamount().length() > 0) {
                dataFilter += " AND o.strtamount <= CAST(replace(:BeforeStrtAmount, ' ', '') as money)";
                params.put("BeforeStrtAmount", filterData.getBeforestrtamount());
            }
            if (filterData.getFondTypesid() != 0) {
                dataFilter += " AND ft.id= " + filterData.getFondTypesid();
            }
            if (filterData.getKekrid() != 0) {
                dataFilter += "AND kek.id = " + filterData.getKekrid();
            }
            if (filterData.getUnitsid() != 0) {
                dataFilter += "AND un.id = " + filterData.getUnitsid();
            }
            // Дата приобритения
            if (filterData.getDatebuyin().length() > 0 && filterData.getDatebuyby().length() > 0) {
                dataFilter += " AND (o.datebuy >= CAST(:datebuyin as timestamp without time zone) AND o.datebuy <= CAST(:datebuyby as timestamp without time zone))";
                params.put("datebuyin", filterData.getDatebuyin());
                params.put("datebuyby", filterData.getDatebuyby());
            } else if (filterData.getDatebuyin().length() == 0 && filterData.getDatebuyby().length() > 0) {
                dataFilter += " AND o.datebuy <= CAST(:datebuy as timestamp without time zone)";
                params.put("datebuy", filterData.getDatebuyby());
            } else if (filterData.getDatebuyin().length() > 0 && filterData.getDatebuyby().length() == 0) {
                dataFilter += " AND o.datebuy >= CAST(:datebuy as timestamp without time zone)";
                params.put("datebuy", filterData.getDatebuyin());
            }
            // Дата ввода в эксплуатацию
            if (filterData.getDateexpin().length() > 0 && filterData.getDateexpby().length() > 0) {
                dataFilter += " AND (et.date_beg >= CAST(:dateexpin as timestamp without time zone) AND et.date_beg <= CAST(:dateexpby as timestamp without time zone))";
                params.put("dateexpin", filterData.getDateexpin());
                params.put("dateexpby", filterData.getDateexpby());
            } else if (filterData.getDateexpin().length() == 0 && filterData.getDateexpby().length() > 0) {
                dataFilter += " AND et.date_beg <= CAST(:dateexpby as timestamp without time zone)";
                params.put("dateexpby", filterData.getDateexpby());
            } else if (filterData.getDateexpin().length() > 0 && filterData.getDateexpby().length() == 0) {
                dataFilter += " AND et.date_beg >= CAST(:dateexpby as timestamp without time zone)";
                params.put("dateexpby", filterData.getDateexpin());
            }
            //Дата ликвидации
            if (filterData.getDatelikvin().length() > 0 && filterData.getDatelikvby().length() > 0) {
                if (filterData.getFlaglikv() == null || filterData.getFlaglikv().length() > 0) {
                    dataFilter += " AND (et.date_end >= CAST(:datelikvin as timestamp without time zone) AND et.date_end <= CAST(:datelikvby as timestamp without time zone)) AND et.likv_flag = 1";
                    params.put("datelikvin", filterData.getDatelikvin());
                    params.put("datelikvby", filterData.getDatelikvby());
                } else {
                    dataFilter += " AND (et.date_end >= CAST(:datelikvin as timestamp without time zone) AND et.date_end <= CAST(:datelikvby as timestamp without time zone)) AND et.likv_flag = 0";
                    params.put("datelikvin", filterData.getDatelikvin());
                    params.put("datelikvby", filterData.getDatelikvby());
                }
            } else if (filterData.getDatelikvin().length() == 0 && filterData.getDatelikvby().length() > 0) {
                if (filterData.getFlaglikv() == null || filterData.getFlaglikv().length() > 0) {
                    dataFilter += " AND et.date_end <= CAST(:datelikvby as timestamp without time zone) AND et.likv_flag = 1";
                    params.put("datelikvby", filterData.getDatelikvby());
                } else {
                    dataFilter += " AND et.date_end <= CAST(:datelikvby as timestamp without time zone) AND et.likv_flag = 0";
                    params.put("datelikvby", filterData.getDatelikvby());
                }
            } else if (filterData.getDatelikvin().length() > 0 && filterData.getDatelikvby().length() == 0) {
                if (filterData.getFlaglikv() == null || filterData.getFlaglikv().length() > 0) {
                    dataFilter += " AND et.date_end >= CAST(:datelikvby as timestamp without time zone) AND et.likv_flag = 1";
                    params.put("datelikvby", filterData.getDatelikvin());
                } else {
                    dataFilter += " AND et.date_end >= CAST(:datelikvby as timestamp without time zone) AND et.likv_flag = 0";
                    params.put("datelikvby", filterData.getDatelikvin());
                }

            }
            String kterlist = "";
            if (filterData.getKterid().length() > 0) {
                kterlist += " JOIN objs_list_by_kter(" + filterData.getKterid() + ",:paramDate::date) k on k.obj_id = o.id\n";
            }
            if (filterData.getWearMthdsid() != 0) {
                dataFilter += "AND wm.id = " + filterData.getWearMthdsid();
            }
            if (filterData.getNamelp().length() != 0) {
                if (filterData.getValuelpid().length() > 0) {
                    dataFilter += "AND  o.id IN ((SELECT lv.ownerid FROM listparams lp\n" +
                            " LEFT JOIN listvalues lv ON lp.id=lv.paramId \n" +
                            " WHERE lp.taskcode = 'objs'\n" +
                            " AND lp.paramcode = (SELECT paramcode FROM listparams Where name = :paramcodeLP AND taskcode = 'objs')\n" +
                            " AND val = :valLP))\n";
                    params.put("paramcodeLP", filterData.getNamelp());
                    params.put("valLP", filterData.getValuelpid());
                } else {
                    dataFilter += "AND  o.id IN ((SELECT lv.ownerid FROM listparams lp\n" +
                            " LEFT JOIN listvalues lv ON lp.id=lv.paramId \n" +
                            " WHERE lp.taskcode = 'objs'\n" +
                            " AND lp.paramcode = (SELECT paramcode FROM listparams Where name = :paramcodeLP AND taskcode = 'objs')\n" +
                            " AND val ilike '%' || :valLP|| '%'))\n";
                    params.put("paramcodeLP", filterData.getNamelp());
                    params.put("valLP", filterData.getValuelpname());
                }
            }

            if (filterData.getNamepp().length() != 0) {
                dataFilter += " AND (SELECT pv.val FROM periodvalues pv where 1=1 and pv.ownerId=o.id \n" +
                        " AND pv.ParamId=" + filterData.getIdpp() + "\n" +
                        " AND pv.date<=CAST(:paramDate as timestamp without time zone)  + interval '1 day'\n" +
                        " ORDER BY date desc OFFSET 0 LIMIT 1 ) = :valPP \n";
                params.put("valPP", filterData.getValueppid());
            }

        /*    String sql = "SELECT COUNT(*) FROM objs o \n" +
                    " JOIN objtypes ob ON ob.id = o.objtypeid \n" +
                    " JOIN obj_types_id_by_user() ot ON ot.obj_type_id = o.objtypeid \n" +
                    " JOIN accs ac ON ac.id = o.acc_id \n" +
                    " JOIN inv_grp_accs iga ON iga.id = o.inv_grp_acc_id \n" +
                    " JOIN fond_types ft ON ft.id = o.fond_type_id \n" +
                    " JOIN kekr kek ON kek.id = o.kekr_id \n" +
                    " JOIN units un ON un.id = o.unit_id \n" +
                    " LEFT JOIN wear_mthds wm ON ac.id = wm.acc_id AND iga.inv_grp_id = wm.inv_grp_id \n" +
                    " LEFT JOIN expl_trms et ON et.obj_id = o.id \n" +
                    " WHERE 1=1" +*/
            String sql = " SELECT \n" +
                    " COUNT(*)\n" +
                    " FROM \n" +
                    " objs o \n" +
                    " JOIN objtypes ob ON ob.id = o.objtypeid \n" +
                    " JOIN obj_types_id_by_user() ot ON ot.obj_type_id = o.objtypeid JOIN accs ac ON ac.id = o.acc_id \n" +
                    " JOIN inv_grp_accs iga ON iga.id = o.inv_grp_acc_id \n" +
                    " JOIN fond_types ft ON ft.id = o.fond_type_id \n" +
                    " JOIN kekr kek ON kek.id = o.kekr_id \n" +
                    " JOIN units un ON un.id = o.unit_id \n" +
                    "  JOIN getter_obj_right() gtr on gtr.obj_id=o.id\n" +
                    " LEFT JOIN perval_list_by_date('location',:paramDate::date) p on p.obj_id=o.id\n" +
                    " LEFT JOIN get_objs_list_amount(:paramDate::date) a on a.obj_id = o.id\n" +
                    " LEFT JOIN (SELECT pv.ownerid, MAX(pv.Date) as date\n" +
                    " FROM periodvalues pv \n" +
                    " JOIN periodparams pp on pp.id=pv.paramId \n" +
                    " AND taskcode='objs' \n" +
                    " AND pp.paramcode= 'location'\n" +
                    " AND pv.date <= get_day_beg(CAST(:paramDate as timestamp without time zone))+ interval '1 day'\n" +
                    " GROUP BY pv.ownerid\n" +
                    " )location ON location.ownerId=o.id\n" +
                    " LEFT JOIN periodparams pplocation ON pplocation.taskcode='objs' AND pplocation.paramcode='location'\n" +
                    " LEFT JOIN periodvalues pvlocation ON pvlocation.paramid = pplocation.id AND pvlocation.ownerid = o.id  AND pvlocation.date = location.date\n" +
                    kterlist +
                    " WHERE 1=1 \n" +
                    " AND o.datebuy <= get_day_beg(CAST(:paramDate as timestamp without time zone))+ interval '1 day'\n" +
                    dateObj +
                    dataFilter;
            return db.Query(con, sql, Integer.class, params).get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получаем список объектов с учетом фильтра
     *
     * @return
     */
    @Override
    public Table list(ObjsMainFilterModel filterMain) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            ObjsFilterModel filterData = filterMain.getFilterData();
            List<ObjsFilterDgvModel> filterDgv = filterMain.getFilterDgv();

            // Проверка даты на пустоту, если пустая, то текущий день
            if (filterData.getDate() == null || filterData.getDate().length() == 0) {
                Date date = new Date();
                filterData.setDate(date.toString());
            }

            int offset = (filterData.getPage() - 1) * filterData.getRows();
            offset = offset < 0 ? 0 : offset;

            String dataFilter = "";
            String dataDGV = "";
            String colName = "";
            String datePParam = "";

            String dateObj = " AND o.datebuy <= get_day_beg(CAST(:paramDate as timestamp without time zone))+ interval '1 day'\n";
            String location = " get_objs_location_id(o.id, CAST(:paramDate as timestamp without time zone)) locid,\n ";
            String amount = " CAST(get_objs_amount(o.id, CAST(:paramDate as timestamp without time zone))as money)::decimal amount,\n";
            params.put("paramDate", filterData.getDate());

            for (int i = 0; i < filterDgv.size(); i++) {
                String[] splitParamCode = filterDgv.get(i).getParamcode().split("==");
                if (!splitParamCode[0].equals("P")) {
                    dataDGV += " LEFT JOIN listparams lp_" + splitParamCode[1] + " ON lp_" + splitParamCode[1] + ".taskcode='objs' AND lp_" + splitParamCode[1] + ".paramcode='" + splitParamCode[1] + "'\n" +
                            " LEFT JOIN  listvalues lv_" + splitParamCode[1] + " ON lp_" + splitParamCode[1] + ".id=lv_" + splitParamCode[1] + ".paramId AND lv_" + splitParamCode[1] + ".ownerId=o.id";

                    colName += " CASE WHEN lp_" + splitParamCode[1] + ".reffertable <> '' AND  lp_" + splitParamCode[1] + ".reffertable IS NOT NULL " +
                            " THEN (select get_name_from_var_table(lp_" + splitParamCode[1] + ".reffertable, lv_" + splitParamCode[1] + ".val)) ELSE lv_" + splitParamCode[1] + ".val END as " + splitParamCode[1] + "_T,\n";
                } else {
                    datePParam = " AND pv.date <= CAST((SELECT now() :: date)+ interval '1 day' as timestamp without time zone)\n";
                    if (filterData.getDate() != null && filterData.getDate().length() > 0) {
                        datePParam = " AND pv.date <= get_day_beg(CAST('" + filterData.getDate() + "' as timestamp without time zone))+ interval '1 day'\n";

                    }
                    dataDGV += " LEFT JOIN (SELECT pv.ownerid, MAX(pv.Date) as date\n" +
                            " FROM periodvalues pv \n" +
                            " JOIN periodparams pp on pp.id=pv.paramId \n" +
                            " AND taskcode='objs' \n" +
                            " AND pp.paramcode= '" + splitParamCode[1] + "'\n" +
                            datePParam +
                            " GROUP BY pv.ownerid\n" +
                            " )" + splitParamCode[1] + " ON " + splitParamCode[1] + ".ownerId=o.id\n" +
                            " LEFT JOIN periodparams pp" + splitParamCode[1] + " ON pp" + splitParamCode[1] + ".taskcode='objs' AND pp" + splitParamCode[1] + ".paramcode='" + splitParamCode[1] + "'\n" +
                            " LEFT JOIN periodvalues pv" + splitParamCode[1] + " ON pv" + splitParamCode[1] + ".paramid = pp" + splitParamCode[1] + ".id AND pv" + splitParamCode[1] + ".ownerid = o.id " +
                            " AND pv" + splitParamCode[1] + ".date = " + splitParamCode[1] + ".date\n";
                    colName += "CASE WHEN pp" + splitParamCode[1] + ".reffertable <> '' " +
                            " AND pp" + splitParamCode[1] + ".reffertable IS NOT NULL THEN (select get_name_from_var_table(pp" + splitParamCode[1] + ".reffertable, pv" + splitParamCode[1] + ".val)) " +
                            " ELSE pv" + splitParamCode[1] + ".val END " + splitParamCode[1] + "_T,";
                }
            }

            // Собираем фильтр
            if (filterData.getAccsid() != 0) {
                dataFilter += " AND ac.id = " + filterData.getAccsid();
            }
            if (filterData.getInvGrpsid() != 0) {
                dataFilter += " AND iga.inv_grp_id = " + filterData.getInvGrpsid();
            }
            if (filterData.getInvno().length() > 0) {
                dataFilter += " AND o.invno ilike '%'|| :invno || '%'";
                params.put("invno", filterData.getInvno());
            }
            if (filterData.getInvser().length() > 0) {
                dataFilter += " AND o.invser ilike '%' || :invser || '%'";
                params.put("invser", filterData.getInvser());
            }
            if (filterData.getObjtypeid().length() > 0) {
                dataFilter += " AND o.objtypeid = " + filterData.getObjtypeid();
            }
            if (filterData.getName().length() > 0) {
                dataFilter += " AND o.name ilike '%' || :name || '%'";
                params.put("name", filterData.getName());
            }
            if (filterData.getFromstrtamount().length() > 0) {
                dataFilter += " AND o.strtamount >= CAST(replace(:FromStrtAmount, ' ', '') as money)";
                params.put("FromStrtAmount", filterData.getFromstrtamount());
            }
            if (filterData.getBeforestrtamount().length() > 0) {
                dataFilter += " AND o.strtamount <= CAST(replace(:BeforeStrtAmount, ' ', '') as money)";
                params.put("BeforeStrtAmount", filterData.getBeforestrtamount());
            }
            if (filterData.getFondTypesid() != 0) {
                dataFilter += " AND ft.id= " + filterData.getFondTypesid();
            }
            if (filterData.getKekrid() != 0) {
                dataFilter += "AND kek.id = " + filterData.getKekrid();
            }
            if (filterData.getUnitsid() != 0) {
                dataFilter += "AND un.id = " + filterData.getUnitsid();
            }
            // Дата приобритения
            if (filterData.getDatebuyin().length() > 0 && filterData.getDatebuyby().length() > 0) {
                dataFilter += " AND (o.datebuy >= CAST(:datebuyin as timestamp without time zone) AND o.datebuy <= CAST(:datebuyby as timestamp without time zone))";
                params.put("datebuyin", filterData.getDatebuyin());
                params.put("datebuyby", filterData.getDatebuyby());
            } else if (filterData.getDatebuyin().length() == 0 && filterData.getDatebuyby().length() > 0) {
                dataFilter += " AND o.datebuy <= CAST(:datebuy as timestamp without time zone)";
                params.put("datebuy", filterData.getDatebuyby());
            } else if (filterData.getDatebuyin().length() > 0 && filterData.getDatebuyby().length() == 0) {
                dataFilter += " AND o.datebuy >= CAST(:datebuy as timestamp without time zone)";
                params.put("datebuy", filterData.getDatebuyin());
            }
            // Дата ввода в эксплуатацию
            if (filterData.getDateexpin().length() > 0 && filterData.getDateexpby().length() > 0) {
                dataFilter += " AND (et.date_beg >= CAST(:dateexpin as timestamp without time zone) AND et.date_beg <= CAST(:dateexpby as timestamp without time zone))";
                params.put("dateexpin", filterData.getDateexpin());
                params.put("dateexpby", filterData.getDateexpby());
            } else if (filterData.getDateexpin().length() == 0 && filterData.getDateexpby().length() > 0) {
                dataFilter += " AND et.date_beg <= CAST(:dateexpby as timestamp without time zone)";
                params.put("dateexpby", filterData.getDateexpby());
            } else if (filterData.getDateexpin().length() > 0 && filterData.getDateexpby().length() == 0) {
                dataFilter += " AND et.date_beg >= CAST(:dateexpby as timestamp without time zone)";
                params.put("dateexpby", filterData.getDateexpin());
            }
            //Дата ликвидации
            if (filterData.getDatelikvin().length() > 0 && filterData.getDatelikvby().length() > 0) {
                if (filterData.getFlaglikv() == null || filterData.getFlaglikv().length() > 0) {
                    dataFilter += " AND (et.date_end >= CAST(:datelikvin as timestamp without time zone) AND et.date_end <= CAST(:datelikvby as timestamp without time zone)) AND et.likv_flag = 1";
                    params.put("datelikvin", filterData.getDatelikvin());
                    params.put("datelikvby", filterData.getDatelikvby());
                } else {
                    dataFilter += " AND (et.date_end >= CAST(:datelikvin as timestamp without time zone) AND et.date_end <= CAST(:datelikvby as timestamp without time zone)) AND et.likv_flag = 0";
                    params.put("datelikvin", filterData.getDatelikvin());
                    params.put("datelikvby", filterData.getDatelikvby());
                }
            } else if (filterData.getDatelikvin().length() == 0 && filterData.getDatelikvby().length() > 0) {
                if (filterData.getFlaglikv() == null || filterData.getFlaglikv().length() > 0) {
                    dataFilter += " AND et.date_end <= CAST(:datelikvby as timestamp without time zone) AND et.likv_flag = 1";
                    params.put("datelikvby", filterData.getDatelikvby());
                } else {
                    dataFilter += " AND et.date_end <= CAST(:datelikvby as timestamp without time zone) AND et.likv_flag = 0";
                    params.put("datelikvby", filterData.getDatelikvby());
                }
            } else if (filterData.getDatelikvin().length() > 0 && filterData.getDatelikvby().length() == 0) {
                if (filterData.getFlaglikv() == null || filterData.getFlaglikv().length() > 0) {
                    dataFilter += " AND et.date_end >= CAST(:datelikvby as timestamp without time zone) AND et.likv_flag = 1";
                    params.put("datelikvby", filterData.getDatelikvin());
                } else {
                    dataFilter += " AND et.date_end >= CAST(:datelikvby as timestamp without time zone) AND et.likv_flag = 0";
                    params.put("datelikvby", filterData.getDatelikvin());
                }

            }
            String kterlist = "";
            if (filterData.getKterid().length() > 0) {
                kterlist += " JOIN objs_list_by_kter(" + filterData.getKterid() + ",:paramDate::date) k on k.obj_id = o.id\n";
            }
            if (filterData.getWearMthdsid() != 0) {
                dataFilter += "AND wm.id = " + filterData.getWearMthdsid();
            }
            if (filterData.getNamelp().length() != 0) {
                if (filterData.getValuelpid().length() > 0) {
                    dataFilter += "AND  o.id IN ((SELECT lv.ownerid FROM listparams lp\n" +
                            " LEFT JOIN listvalues lv ON lp.id=lv.paramId \n" +
                            " WHERE lp.taskcode = 'objs'\n" +
                            " AND lp.paramcode = (SELECT paramcode FROM listparams Where name = :paramcodeLP AND taskcode = 'objs')\n" +
                            " AND val = :valLP))\n";
                    params.put("paramcodeLP", filterData.getNamelp());
                    params.put("valLP", filterData.getValuelpid());
                } else {
                    dataFilter += "AND  o.id IN ((SELECT lv.ownerid FROM listparams lp\n" +
                            " LEFT JOIN listvalues lv ON lp.id=lv.paramId \n" +
                            " WHERE lp.taskcode = 'objs'\n" +
                            " AND lp.paramcode = (SELECT paramcode FROM listparams Where name = :paramcodeLP AND taskcode = 'objs')\n" +
                            " AND val ilike '%' || :valLP|| '%'))\n";
                    params.put("paramcodeLP", filterData.getNamelp());
                    params.put("valLP", filterData.getValuelpname());
                }
            }

            if (filterData.getNamepp().length() != 0) {
                dataFilter += " AND (SELECT pv.val FROM periodvalues pv where 1=1 and pv.ownerId=o.id \n" +
                        " AND pv.ParamId=" + filterData.getIdpp() + "\n" +
                        " AND pv.date<=CAST(:paramDate as timestamp without time zone)  + interval '1 day'\n" +
                        " ORDER BY date desc OFFSET 0 LIMIT 1 ) = :valPP \n";
                params.put("valPP", filterData.getValueppid());
            }

            String sql =
                    " SELECT \n" +
                            " o.id,\n" +
                            " o.invno,\n" +
                            " o.invser,\n" +
                            " o.objtypeid,\n" +
                            " CASE WHEN o.invser <> '' THEN o.invno ||' - '|| o.invser ELSE o.invno END inv,\n" +
                            " o.name,\n" +
                            " o.descr,\n" +
                            " o.dateexp,\n" +
                            " o.datelikv,\n" +
                            " o.datebuy,\n" +
                            " o.info,\n" +
                            "  a.calc_amount::decimal amount," +
                            colName +
                            " ob.name objstypesname\n" +
                            " FROM \n" +
                            " objs o \n" +
                            " JOIN objtypes ob ON ob.id = o.objtypeid \n" +
                            " JOIN obj_types_id_by_user() ot ON ot.obj_type_id = o.objtypeid" +
                            " JOIN accs ac ON ac.id = o.acc_id \n" +
                            " JOIN inv_grp_accs iga ON iga.id = o.inv_grp_acc_id \n" +
                            " JOIN fond_types ft ON ft.id = o.fond_type_id \n" +
                            " JOIN kekr kek ON kek.id = o.kekr_id \n" +
                            " JOIN units un ON un.id = o.unit_id \n" +
                            " LEFT JOIN perval_list_by_date('location',:paramDate::date) p on p.obj_id=o.id\n" +
                            " JOIN getter_obj_right() gtr on gtr.obj_id = o.id \n" +
                            " LEFT JOIN get_objs_list_amount(:paramDate::date) a on a.obj_id = o.id\n" +
                            kterlist +
                            dataDGV +
                            " WHERE 1=1 \n"
                            + dateObj
                            + dataFilter;
            sql += " ORDER BY o.invno";
            sql += " OFFSET " + offset;
            sql += " LIMIT " + filterData.getRows();
            return db.Query(con, sql, params);
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Получаем объект по указаному идентификатору
     *
     * @param id - Идентификатор записи
     * @return
     * @throws Exception
     */
    @Override
    public ObjsGetModel get(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = " SELECT \n" +
                    " o.id,\n" +
                    " o.acc_id,\n" +
                    " iga.inv_grp_id,\n" +
                    " o.invno,\n" +
                    " o.invser,\n" +
                    " o.objtypeid,\n" +
                    " o.objtypeid || ' = ' || ot.name objtype,\n" +
                    " o.name,\n" +
                    " o.descr,\n" +
                    " o.fond_type_id,\n" +
                    " o.kekr_id,\n" +
                    " CAST(o.strtamount as text ) strtamount,\n" +
                    " to_char(o.datebuy, 'DD.MM.YYYY') datebuy,\n" +
                    " CASE WHEN et.date_beg IS NOT NULL THEN to_char(et.date_beg, 'DD.MM.YYYY') ELSE 'Не эксплуатируетстя' END datebeg,\n" +
                    " CASE WHEN et.date_end IS NOT NULL THEN to_char(et.date_end, 'DD.MM.YYYY') ELSE 'Не ликвидирован' END dateend,\n" +
                    " et.likv_flag flaglikv, \n" +
                    " o.unit_id,\n" +
                    " o.info,\n" +
                    " o.created,\n" +
                    " o.creator,\n" +
                    " o.changed,\n" +
                    " o.changer,\n" +
                    " CASE WHEN iv.img IS NOT NULL THEN iv.id ELSE 0 END img,\n" +
                    " CAST(iga.perc AS text) \n" +
                    " FROM objs o \n" +
                    " JOIN objtypes ot ON o.objtypeid = ot.id\n" +
                    " LEFT JOIN imgvalues iv ON  o.id = iv.recid AND iv.objectid = @objectid\n" +
                    " LEFT JOIN inv_grp_accs iga ON iga.id = o.inv_grp_acc_id  AND iga.acc_id = o.acc_id \n" +
                    " LEFT JOIN expl_trms et ON  et.obj_id = o.id\n" +
                    " WHERE o.id = " + id;
            List<ObjsGetModel> result = db.Query(con, sql, ObjsGetModel.class, null);
            if (result.size() == 0) {
                throw new Exception("Не удалось получить объект с Id = " + id);
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Получаем список всех дополнительных реквизитов для таблицы objs
     *
     * @return
     * @throws Exception
     */
    @Override
    public List<ObjsListParamsModel> listListParams() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT" +
                    " id," +
                    " paramcode," +
                    " name," +
                    " strict," +
                    " refferfunc," +
                    " reffertable " +
                    " FROM listparams" +
                    " WHERE taskcode = 'objs'" +
                    " AND del = 0";
            return db.Query(con, sql, ObjsListParamsModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получаем список значений для дполнителных реквизитов
     *
     * @param id - идентификатор объекта
     * @return
     * @throws Exception
     */
    @Override
    public List<ObjsListValuesModel> listListValues(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = " SELECT\n" +
                    " lp.id LParamId,\n" +
                    " lp.paramcode LParamCode,\n" +
                    " lp.name LParamName,\n" +
                    " lp.reffermodul LParamRefferModul,\n" +
                    " lp.refferfunc LParamRefferFunc,\n" +
                    " lp.reffertable LParamRefferTable,\n" +
                    " lp.reffercode LParamRefferCode,\n" +
                    " lp.codejs LParamCodeJs,\n" +
                    " lv.id LValueId,\n" +
                    " lv.val LValueVal,\n" +
                    " lv.ownerid LValueOwnerId,\n" +
                    " CASE WHEN iml.id IS NULL THEN -1 ELSE iml.id END lvimg,\n" +
                    " CASE WHEN lp.reffertable IS not null AND lv.val IS not null THEN (select get_name_from_var_table(lp.reffertable, lv.val)) ELSE '' END LValueName\n" +
                    " FROM listparams lp \n" +
                    " LEFT JOIN listvalues lv ON lv.paramid=lp.id \n" +
                    " LEFT JOIN imgvalues iml ON iml.recid= lv.id \n" +
                    " WHERE lp.taskcode = 'objs'\n" +
                    " AND lp.del = 0\n" +
                    " AND lv.ownerid =" + id;
            return db.Query(con, sql, ObjsListValuesModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получаем список всех переодических реквизитов для таблицы objs
     *
     * @return
     * @throws Exception
     */
    @Override
    public List<ObjsPeriodParamsModel> listPeriodParams() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT" +
                    " id," +
                    " paramcode," +
                    " name," +
                    " strict," +
                    " refferfunc," +
                    " reffertable" +
                    " FROM periodparams" +
                    " WHERE taskcode = 'objs'" +
                    " AND del = 0";
            return db.Query(con, sql, ObjsPeriodParamsModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получаем список значений для периодических реквизитов
     *
     * @param id - индентификатор объекта
     * @return
     * @throws Exception
     */
    @Override
    public List<ObjsPeriodValuesModel> listPeriodValues(int id, String date) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String _date = " AND pv.date <= CAST((SELECT now() :: date)+ interval '1 day' as timestamp without time zone) \n";
            if (date.length() > 0) {
                params.put("date", date);
                _date = " AND pv.date <= CAST(:date as timestamp without time zone) \n";
            }

            String sql = "SELECT" +
                    " pp.id PParamId," +
                    " pp.paramcode PParamCode," +
                    " pp.name PParamName," +
                    " pp.reffermodul PParamRefferModul," +
                    " pp.refferfunc PParamRefferFunc," +
                    " pp.reffertable PParamRefferTable," +
                    " pp.reffercode PParamRefferCode," +
                    " pv.id PValueId," +
                    " pv.ownerid PValueOwnerId," +
                    " pv.val PValueVal," +
                    " CASE WHEN pp.reffertable IS not null AND pv.val IS not null THEN  (select get_name_from_var_table(pp.reffertable, pv.val)) ELSE '' END PValueName" +
                    " FROM periodparams pp" +
                    " LEFT JOIN periodvalues pv ON pv.paramid=pp.id" +
                    " WHERE lower(pp.taskcode)='objs'" +
                    " AND pp.taskcode = 'objs'" +
                    _date +
                    " AND pp.del=0 " +
                    " AND pv.ownerid = " + id +
                    " ORDER BY pv.date  DESC ";
            return db.Query(con, sql, ObjsPeriodValuesModel.class, params);
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Запрос для получения строки в формате id = name (универсальный)
     *
     * @param table - Имя таблицы
     * @param id    - Идентификатор записи в таблице
     * @return
     * @throws Exception
     */
    @Override
    public String universalDataAcquisition(String table, int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("table", table);
            String sql = "SELECT CASE WHEN  r.getobject_id IS NULL THEN -1 ELSE 1 END TableId FROM " +
                    " (SELECT getobject_id(:table)) r";
            List<String> result = db.Query(con, sql, String.class, params);
            if (Integer.parseInt(result.get(0)) != 1) {
                throw new Exception("Таблица с именем '" + table + "' не найдена");
            } else {
                String sql1 = "SELECT (id || ' = ' || name) as name FROM " + table + " WHERE id =  " + id;
                List<String> result1 = db.Query(con, sql1, String.class, null);
                if (result1.size() == 0) {
                    throw new Exception("Не найден тип объекта с ID = " + id);
                }
                return result1.get(0);
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверка на закрытие дня в Today и TodayUsers
     *
     * @param date - провреяемая дата
     * @return
     * @throws Exception
     */
    @Override
    public int checkCloseDay(String date) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("date", date);
            String sql = "SELECT COUNT(*) cnt FROM todayusers tu" +
                    " JOIN users u ON u.id = tu.userid" +
                    " JOIN today t ON t.id = tu.todayid" +
                    " WHERE u.code = '" + db.getUserCode() + "' AND tu.del = 0";
            List<String> result = db.Query(con, sql, String.class, null);
            if (Integer.parseInt(result.get(0)) > 0) {
                throw new Exception("Не нравится пользователь");
            } else {
                sql = "SELECT COUNT(*) cnt FROM today WHERE Date = CAST(:date as timestamp without time zone) AND OpenMode = 1";
                List<String> result1 = db.Query(con, sql, String.class, params);
                return Integer.parseInt(result1.get(0));
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверка двух дат на закрытие дня в Today и TodayUsers
     *
     * @param dateOne - первая проверяемая дата
     * @param dateTwo - вторая проверяемая дата
     * @return
     * @throws Exception
     */
    @Override
    public int checkCloseTwoDay(String dateOne, String dateTwo) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("UserCode", db.getUserCode());
            String sql = "SELECT COUNT(*) cnt FROM todayusers tu" +
                    " JOIN users u ON u.id = tu.userid" +
                    " JOIN today t ON t.id = tu.todayid" +
                    " WHERE u.code = :UserCode AND tu.del = 0";
            List<String> result = db.Query(con, sql, String.class, params);
            if (Integer.parseInt(result.get(0)) > 0) {
                throw new Exception("Не нравится пользователь");
            } else {
                params.remove("UserCode");
                params.put("dateOne", dateOne);
                params.put("dateTwo", dateTwo);
                sql = "SELECT COUNT(*) cnt FROM today \n" +
                        " WHERE Date = CAST(:dateOne as timestamp without time zone) \n" +
                        " AND Date = CAST(:dateTwo as timestamp without time zone) \n" +
                        " AND OpenMode = 1";
                List<String> result1 = db.Query(con, sql, String.class, params);
                return Integer.parseInt(result1.get(0));
            }
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получаем список данных "справочник счетов" для заполнения comboBox с использованием универсальной модели
     *
     * @return
     * @throws Exception
     */
    @Override
    public List<UniversalBoxModel> GetAccsList() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, id || ' = ' || code || ' : ' || name as name FROM accs WHERE del = 0 ORDER BY name";
            return db.Query(con, sql, UniversalBoxModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Получаем список данных "справочник групп инвентарного учета" для заполнения comboBox с использованием универсальной модели
     *
     * @return
     * @throws Exception
     */
    @Override
    public List<UniversalBoxModel> GetInvGrpsList() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, id || ' = ' || code || ' : ' || name as name FROM inv_grps WHERE del = 0 ORDER BY code";
            return db.Query(con, sql, UniversalBoxModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получаем список данных "справочник единиц измерения" для заполнения comboBox с использованием универсальной модели
     *
     * @return
     * @throws Exception
     */
    @Override
    public List<UniversalBoxModel> GetUnitsList() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, code as name FROM units WHERE del = 0 ORDER BY code";
            return db.Query(con, sql, UniversalBoxModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получаем список данных "справочник КЭКР" для заполнения comboBox с использованием универсальной модели
     *
     * @return
     * @throws Exception
     */
    @Override
    public List<UniversalBoxModel> GetKekrList() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, id || ' = ' || code || ' : ' || name as name FROM kekr WHERE del = 0 ORDER BY name";
            return db.Query(con, sql, UniversalBoxModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получаем список данных "справочник типов фондов" для заполнения comboBox с использованием универсальной модели
     *
     * @return
     * @throws Exception
     */
    @Override
    public List<UniversalBoxModel> GetTypeFondsList() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, id || ' = ' || code || ' : ' || name as name FROM fond_types WHERE del = 0 ORDER BY name";
            return db.Query(con, sql, UniversalBoxModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получаем Id таблицы по наименованию таблицы
     *
     * @param TableName - наименование таблицы
     * @return
     * @throws Exception
     */
    @Override
    public String TableId(String TableName) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("TableName", TableName);
            String sql = "select getobject_id(:TableName)";
            List<String> result = db.Query(con, sql, String.class, params);
            if (result.get(0) == null) {
                throw new Exception("Таблица не найдена");
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получаем значение из таблицы periodlock
     *
     * @param id - идентификатор  записи в таблице periodlock
     * @return
     * @throws Exception
     */
    @Override
    public String getPeriodEdit(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", id);
            String sql = "SELECT CASE WHEN name = '' THEN val ELSE val || ' = ' || name END FROM periodlock WHERE id = :id";
            List<String> result = db.Query(con, sql, String.class, params);
            if (result.get(0) == null) {
                throw new Exception("Запись не найдена");
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Удаляем из таблицы ImgLock/PeriodValues все записи из сессии
     *
     * @param sesId - сессия по которой будет проходить удаление
     * @throws Exception
     */
    @Override
    public void DeleteImgLockAndDeletePeriodLock(String sesId) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("sesId", sesId);
            String sql = " DELETE FROM periodlock WHERE sesid =  CAST(:sesId as uuid)";
            db.Execute(con, sql, params);
            sql = " DELETE FROM imglock WHERE sesid =  CAST(:sesId as uuid)";
            db.Execute(con, sql, params);
        } catch (Exception ex) {
            throw ex;
        }
    }


    /**
     * Генерация инвентарного номера
     *
     * @param AccsId    - счет объекта
     * @param InvGrpsId - группа инвентарного счета объекта
     * @return
     * @throws Exception
     */
    @Override
    public String genInvNo(int AccsId, int InvGrpsId) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("AccsId", AccsId);
            params.put("InvGrpsId", InvGrpsId);
            String sql = "SELECT gen_InvNo(:AccsId, :InvGrpsId)";
            List<String> result = db.Query(con, sql, String.class, params);
            if (result.get(0) == null) {
                throw new Exception("Ошибка во время генерации инвентарного номер");
            }
            return result.get(0);
        }
    }

    /**
     * Проверка наличия счета в группе
     *
     * @param AccsId    - счет объекта
     * @param InvGrpsId - группа инвентарного счета объекта
     * @return
     * @throws Exception
     */
    @Override
    public int checkInvGrpAccs(int AccsId, int InvGrpsId) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("AccsId", AccsId);
            params.put("InvGrpsId", InvGrpsId);
            String sql = "SELECT COUNT(*) cnt FROM inv_grp_accs \n" +
                    " WHERE acc_id = :AccsId \n" +
                    " AND inv_grp_id = :InvGrpsId";
            List<String> result = db.Query(con, sql, String.class, params);
            if (result.get(0) == null) {
                throw new Exception("Ошибка при поиске дубликата");
            }
            return Integer.parseInt(result.get(0));
        }
    }

    /**
     * Добавление/изменение объекта
     *
     * @param model - модель объекта
     * @return
     * @throws Exception
     */
    @Override
    public int save(ObjsModel model) throws Exception {
        try (Connection con = db.getConnectionWithTran(appName)) {
            int res_Id = -1;

            String[] arry_Ojs = new String[model.getCountObjs()];
            if(model.getCountObjs() > 1) {
                for (int i = 0; i < model.getCountObjs(); ++i) {
                    if (String.valueOf(i + 1).length() == 1) {
                        arry_Ojs[i] = "000" + String.valueOf(i+1);
                    } else if (String.valueOf(i + 1).length() == 2) {
                        arry_Ojs[i] = "00" +  String.valueOf(i+1);
                    } else if (String.valueOf(i + 1).length() == 3) {
                        arry_Ojs[i] = "0" +  String.valueOf(i+1);
                    } else {
                        arry_Ojs[i] =  String.valueOf(i+1);
                    }
                }
            }

            for(int t = 0; t < arry_Ojs.length; ++t) {

                String sql = "";
                Map<String, Object> params = new HashMap<>();
                params.put("accs", model.getAccs());
                params.put("invGrps", model.getInvGrps());
                params.put("invNo", model.getInvNo());
                params.put("invSer", arry_Ojs[t]);
                params.put("objType", model.getObjType());
                params.put("name", model.getName());
                params.put("descr", model.getDescr());
                params.put("typeFonds", model.getTypeFonds());
                params.put("kekr", model.getKekr());
                params.put("strtAmount", model.getStrtAmount());
                params.put("dateBuy", model.getDateBuy());
                params.put("units", model.getUnits());
                params.put("info", model.getInfo());

                if (model.getId() == -1) {
                    sql = " INSERT INTO objs (acc_id, inv_grp_acc_id, invno, invser, objtypeid, name, descr, fond_type_id, kekr_id, strtamount, datebuy, unit_id, info, imgid) \n" +
                            " VALUES (:accs, (SELECT id FROM inv_grp_accs WHERE acc_id = :accs AND inv_grp_id = :invGrps), :invNo, :invSer, :objType, :name, :descr, :typeFonds, :kekr, " +
                            " CAST(replace(:strtAmount, '.', ',') as money), CAST(:dateBuy as timestamp without time zone), :units, :info, -1)\n" +
                            " RETURNING id";
                    res_Id = db.Execute(con, sql, Integer.class, params);
                } else {
                    db.CheckLock(con, model.getId(), "objs");
                    sql = "UPDATE objs SET \n" +
                            " acc_id = :accs,\n" +
                            " inv_grp_acc_id = (SELECT id FROM inv_grp_accs WHERE acc_id = :accs AND inv_grp_id = :invGrps),\n" +
                            " invno = :invNo,\n" +
                            " invser = :invSer,  \n" +
                            " objtypeid = :objType,\n" +
                            " name = :name,\n" +
                            " descr = :descr,\n" +
                            " fond_type_id = :typeFonds,\n" +
                            " kekr_id = :kekr,\n" +
                            " strtamount = CAST(replace(:strtAmount, '.', ',') as money),\n" +
                            " datebuy = CAST(:dateBuy as timestamp without time zone),\n" +
                            " unit_id = :units,\n" +
                            " info = :info\n" +
                            " WHERE id = " + model.getId();
                    res_Id = model.getId();
                    db.Execute(con, sql, params);
                }

                // Сохраянем картинку для объекта
            //    ImgSaveObjs(con, model.getSesid(), model.getImg(), model.getId());
                ImgSaveObjs(con, model.getSesid(), model.getImg(), res_Id);

                // Сохранение периодических реквизитов
               // PeriodParamsSave(con, model.getSesid(), model.getId());
                PeriodParamsSave(con, model.getSesid(), res_Id);

                // Сохранение дополнительных реквизитов
                for (int i = 0; i < model.getLvmodel().size(); ++i) {
                 //   ListParamsSave(con, model.getId(), model.getLvmodel().get(i), model.getSesid());
                    ListParamsSave(con, res_Id, model.getLvmodel().get(i), model.getSesid());
                }

                // Сохранение сроков эксплуатации объекта
                for (int i = 0; i < model.getExplmodel().size(); ++i) {
                   // ExplSave(con, model.getId(), model.getExplmodel().get(i));
                    ExplSave(con,  res_Id, model.getExplmodel().get(i));
                }

                //String ckPV = checkPeriodParamsDate(con, model.getId());
                String ckPV = checkPeriodParamsDate(con, res_Id);
                if (ckPV != null && ckPV.length() > 0) {
                    con.rollback();
                    throw new Exception("В периодических реквизитах: '" + ckPV + "' " +
                            "значение первоначальной даты должно соответвовать дате приобритения " + model.getDateBuy() + " и время должно быть 00:00:00");
                }
            }
            con.commit();
            model.setId(res_Id);
            return res_Id;
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверка что бы дата приобритения совпадала с периодическими реквизитами
     *
     * @param con   -  открытое соедениение
     * @param objId - идентификатор объекта
     * @return
     */
    private String checkPeriodParamsDate(Connection con, int objId) {
        Map<String, Object> params = new HashMap<>();

        String sql = "SELECT  string_agg(name, ', ') FROM\n" +
                " (\n" +
                "   SELECT o. datebuy, p.paramcode, p.Name, min(v.date) v_date\n" +
                "   FROM periodvalues v \n" +
                "   JOIN periodparams p on p.id=v.paramid and v.ownerid=" + objId + "\n" +
                "   JOIN objs o on o.id=v.ownerid \n" +
                "   GROUP BY o. datebuy,p.paramcode, p.Name\n" +
                " ) a\n" +
                " WHERE datebuy<>v_date\n";
        List<String> result = db.Query(con, sql, String.class, params);
        return result.get(0);
    }


    private int ImgSaveObjs(Connection con, String sesId, int recId, int objsId) {
        Map<String, Object> params = new HashMap<>();
        params.put("sesId", sesId);
        String sql = "";
        sql = " SELECT flagdel fd, flagchange fc, recid rd, img, objectid \n" +
                " FROM imglock \n" +
                " WHERE sesid = CAST(:sesId as uuid) AND id = " + recId;
        List<ObjsModelLockImg> model = db.Query(con, sql, ObjsModelLockImg.class, params);
        params.remove("sesId");
        for (int i = 0; i < model.size(); ++i) {
            params.put("objectid", model.get(i).getObjectid());
            sql = "SELECT COUNT(*) cnt FROM imgvalues WHERE objectid = :objectid AND recid = " + objsId;
            List<String> result = db.Query(con, sql, String.class, params);
            int cnt = Integer.parseInt(result.get(0));
            if (model.get(i).getFd() == 1) {
                sql = "DELETE FROM imgvalues WHERE objectid = :objectid AND recid = " + objsId;
                db.Execute(con, sql, params);
            } else if (model.get(i).getFd() == 0 && cnt == 0) {
                params.put("img", model.get(i).getImg());
                sql = " INSERT INTO imgvalues (objectid, recid, img)\n" +
                        " VALUES (:objectid, " + objsId + ", :img)\n" +
                        " RETURNING id";
                db.Execute(con, sql, Integer.class, params);
            } else if (model.get(i).getRd() != -1 && cnt > 0) {
                params.put("img", model.get(i).getImg());
                sql = " UPDATE imgvalues SET \n" +
                        " objectid = :objectid, \n" +
                        " recid = " + objsId + ", \n" +
                        " img = :img \n" +
                        " WHERE id = (SELECT id FROM imgvalues WHERE objectid = :objectid AND recid = " + objsId + ")";
                db.Execute(con, sql, params);
            }
        }
        return 0;
    }


    /**
     * Добавление/изменение периодических реквизитов
     *
     * @param con     - открытое соедениение
     * @param sesId   - текущая сессия
     * @param ownerid - идентификатор записи в таблице objs
     * @return
     */
    private int PeriodParamsSave(Connection con, String sesId, int ownerid) {
        Map<String, Object> params = new HashMap<>();

        params.put("sesId", sesId);
        String sql = "";
        sql = " SELECT flagdel fd, flagchange fc, recid rd, val, date, periodparamid \n" +
                " FROM periodlock \n" +
                " WHERE sesid = CAST(:sesId as uuid)";
        List<ObjsModelLock> model = db.Query(con, sql, ObjsModelLock.class, params);
        params.remove("sesId");
        params.put("ownerid", ownerid);
        for (int i = 0; i < model.size(); ++i) {
            int[][] masId = {{model.get(i).getRd()}, {model.get(i).getPeriodparamid()}};
//            System.out.println(nums2[1][0]); // getPeriodparamid
//            System.out.println(nums2[0][0]); // rd
            String val = model.get(i).getVal();
            params.put("val", val);
            if (model.get(i).getFd() == 1) {
                params.put("periodparamid", model.get(i).getPeriodparamid());
                sql = "DELETE FROM periodvalues WHERE ownerid = :ownerid AND paramid = :periodparamid AND val = :val";
                db.Execute(con, sql, params);
            } else if (model.get(i).getFd() == 0 && model.get(i).getRd() == -1) {
                params.put("date", model.get(i).getDate());
                params.put("periodparamid", model.get(i).getPeriodparamid());
                sql = " INSERT INTO periodvalues (paramid, ownerid, date, val) \n" +
                        " VALUES (:periodparamid, :ownerid, CAST(:date as timestamp without time zone), :val) \n" +
                        " RETURNING id";
                masId[0][0] = db.Execute(con, sql, Integer.class, params);
            } else {
                params.put("date", model.get(i).getDate());
                params.put("periodparamid", model.get(i).getPeriodparamid());
                sql = " UPDATE periodvalues SET \n" +
                        " paramid = :periodparamid, \n" +
                        " ownerid = :ownerid, \n" +
                        " date = CAST(:date as timestamp without time zone), \n" +
                        " val = :val \n" +
                        " WHERE id = " + model.get(i).getRd();
                db.Execute(con, sql, params);
            }
            ImgPeriodValues(con, sesId, masId);
        }
        return 0;
    }

    private int ImgPeriodValues(Connection con, String sesId, int[][] mas) {
        Map<String, Object> params = new HashMap<>();
        params.put("sesId", sesId);
        String sql = "";
        sql = " SELECT flagdel fd, flagchange fc, recid rd, img, objectid \n" +
                " FROM imglock \n" +
                " WHERE sesid = CAST(:sesId as uuid) AND  period_lock_id <> 0 AND periodparamid = " + mas[1][0];
        List<ObjsModelLockImg> model = db.Query(con, sql, ObjsModelLockImg.class, params);
        params.remove("sesId");
        for (int i = 0; i < model.size(); ++i) {
            params.put("objectid", model.get(i).getObjectid());
            sql = "SELECT COUNT(*) cnt FROM imgvalues WHERE objectid = :objectid AND recid = " + mas[0][0];
            List<String> result = db.Query(con, sql, String.class, params);
            int cnt = Integer.parseInt(result.get(0));
            if (model.get(i).getFd() == 1) {
                sql = "DELETE FROM imgvalues WHERE objectid = :objectid AND recid = " + mas[0][0];
                db.Execute(con, sql, params);
            } else if (model.get(i).getFd() == 0 && cnt == 0) {
                params.put("img", model.get(i).getImg());
                sql = " INSERT INTO imgvalues (objectid, recid, img)\n" +
                        " VALUES (:objectid, " + mas[0][0] + ", :img)\n" +
                        " RETURNING id";
                db.Execute(con, sql, Integer.class, params);
                params.remove("img");
            } else if (model.get(i).getRd() != -1 && cnt > 0) {
                params.put("img", model.get(i).getImg());
                sql = " UPDATE imgvalues SET \n" +
                        " objectid = :objectid, \n" +
                        " recid = " + mas[0][0] + ", \n" +
                        " img = :img \n" +
                        " WHERE id = (SELECT id FROM imgvalues WHERE objectid = :objectid AND recid = " + mas[0][0] + ")";
                db.Execute(con, sql, params);
                params.remove("img");
            }
        }
        return 0;
    }

    /**
     * Добавление/изменение дополнительных реквизитов
     *
     * @param con     - открытое соедениение
     * @param ownerid - идентификатор записи в таблице objs
     * @param lpmodel - модель с дополнительными реквизитами
     * @return
     */
    private int ListParamsSave(Connection con, int ownerid, ObjsListValuesModel lpmodel, String sesId) {
        Map<String, Object> params = new HashMap<>();
        params.put("ownerid", ownerid);
        params.put("paramid", lpmodel.getLparamid());
        params.put("val", lpmodel.getLvalueval());
        String sql = "";
        if (lpmodel.getLvalueid() == -1) {
            sql = " INSERT INTO listvalues (paramid, ownerid, val) \n" +
                    " VALUES (:paramid, :ownerid, :val)\n" +
                    " RETURNING id";
            lpmodel.setLvalueid(db.Execute(con, sql, Integer.class, params));

        } else {
            sql = " UPDATE listvalues SET \n" +
                    " paramid = :paramid, \n" +
                    " ownerid = :ownerid, \n" +
                    " val = :val \n" +
                    " WHERE id = " + lpmodel.getLvalueid();
            db.Execute(con, sql, params);
        }
        ImgListValues(con, sesId, lpmodel.getLvimg(), lpmodel.getLvalueid());
        return 0;
    }

    /**
     * Сохранение картинки для дополнительного реквизита
     *
     * @param con   - открытое соедениение
     * @param sesId
     * @param recId
     * @return
     */
    private int ImgListValues(Connection con, String sesId, int recId, int lvId) {
        Map<String, Object> params = new HashMap<>();
        params.put("sesId", sesId);
        String sql = "";
        sql = " SELECT flagdel fd, flagchange fc, recid rd, img, objectid \n" +
                " FROM imglock \n" +
                " WHERE sesid = CAST(:sesId as uuid) AND id = " + recId;
        List<ObjsModelLockImg> model = db.Query(con, sql, ObjsModelLockImg.class, params);
        params.remove("sesId");
        for (int i = 0; i < model.size(); ++i) {
            // params.put("recid", model.get(i).getRd());
            params.put("objectid", model.get(i).getObjectid());
            sql = "SELECT COUNT(*) cnt FROM imgvalues WHERE objectid = :objectid AND recid = " + lvId;
            List<String> result = db.Query(con, sql, String.class, params);
            int cnt = Integer.parseInt(result.get(0));
            if (model.get(i).getFd() == 1) {
                sql = "DELETE FROM imgvalues WHERE objectid = :objectid AND recid = " + lvId;
                db.Execute(con, sql, params);
            } else if (model.get(i).getFd() == 0 && cnt == 0) {
                params.put("img", model.get(i).getImg());
                sql = " INSERT INTO imgvalues (objectid, recid, img)\n" +
                        " VALUES (:objectid, " + lvId + ", :img)\n" +
                        " RETURNING id";
                db.Execute(con, sql, Integer.class, params);
            } else if (model.get(i).getRd() != -1 && cnt > 0) {
                params.put("img", model.get(i).getImg());
                sql = " UPDATE imgvalues SET \n" +
                        " objectid = :objectid, \n" +
                        " recid = " + lvId + ", \n" +
                        " img = :img \n" +
                        " WHERE id = (SELECT id FROM imgvalues WHERE objectid = :objectid AND recid = " + lvId + ")";
                db.Execute(con, sql, params);
            }
        }
        return 0;
    }


    /**
     * Сохраненеи "сроков эксплуатации"
     *
     * @param con       - открытое соедениение
     * @param objsid
     * @param modelDate
     * @return
     */
    private int ExplSave(Connection con, int objsid, ObjsModelDate modelDate) {
        Map<String, Object> params = new HashMap<>();
        String sql = "";

        // Если возведен флаг del = 1, то удаляем запись из базы
        // Если возведен флаг id = -1, то вставляем данные в базу
        // Во всех остальных случаях обновляем данные в базе
        if (modelDate.getDel() == 1) {
            sql = "DELETE FROM expl_trms WHERE id = " + modelDate.getId();
            db.Execute(con, sql, null);
        } else if (modelDate.getId() == -1) {
            params.put("objsId", objsid);
            String dateEnd = "";
            if (modelDate.getDateend().length() > 0) {
                dateEnd = modelDate.getDateend();
            }
            params.put("dateBeg", modelDate.getDatebeg());
            params.put("dateEnd", dateEnd);
            params.put("flagLikv", modelDate.getFlaglikv());
            params.put("actNom", modelDate.getActnom());
            params.put("outInfo", modelDate.getOut_info());

            sql = " INSERT INTO expl_trms (obj_id, date_beg, date_end,likv_flag, act_nom, out_info) \n" +
                    " VALUES (:objsId, CAST(:dateBeg as timestamp without time zone), CASE WHEN length(:dateEnd) = 0 THEN NULL ELSE CAST(:dateEnd as timestamp without time zone) END, :flagLikv, :actNom, :outInfo) \n" +
                    " RETURNING id";
            db.Execute(con, sql, Integer.class, params);
        } else {
            params.put("objsId", objsid);
            String dateEnd = "";
            if (modelDate.getDateend() != null) {
                dateEnd = modelDate.getDateend();
            }
            params.put("dateBeg", modelDate.getDatebeg());
            params.put("dateEnd", dateEnd);
            params.put("flagLikv", modelDate.getFlaglikv());
            params.put("actNom", modelDate.getActnom());
            params.put("outInfo", modelDate.getOut_info());

            sql = " UPDATE expl_trms SET \n" +
                    " obj_id = :objsId, \n" +
                    " date_beg = CAST(:dateBeg as timestamp without time zone), \n" +
                    " date_end = CASE WHEN length(:dateEnd) = 0 THEN NULL ELSE CAST(:dateEnd as timestamp without time zone) END, \n" +
                    " likv_flag = :flagLikv, \n" +
                    " act_nom = :actNom, \n" +
                    " out_info = :outInfo" +
                    " WHERE id = " + modelDate.getId();
            db.Execute(con, sql, params);
        }
        return 0;
    }

    /**
     * @param objectid
     * @param recid
     * @param sesId
     * @return
     * @throws Exception
     */
    @Override
    public String CountImgValuesObjs(int objectid, int recid, String sesId) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String sql = "";
            params.put("objectid", objectid);
            params.put("recid", recid);

            sql = "SELECT COUNT(*) as cnt FROM imgvalues WHERE objectid = :objectid AND recid = :recid";
            List<String> result = db.Query(con, sql, String.class, params);
            if (result.get(0) == null) {
                throw new Exception("Поиск изображения не выполнен");
            }
            params.put("sesId", sesId);
            sql = "SELECT flagdel fd FROM imglock WHERE objectid = :objectid AND recid = :recid AND sesid = CAST(:sesId as uuid)";
            List<String> _result = db.Query(con, sql, String.class, params);
            if (_result.get(0) == null) {
                throw new Exception("Поиск изображения не выполнен");
            }
            return _result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверяем была ли удалена записиь в таблице PeriodLock
     *
     * @param periodparamid - идентификатор периодического реквизита
     * @param sesId         - текущая сессия
     * @return
     * @throws Exception
     */
    @Override
    public String FlagDelPeriodLock(int periodparamid, String sesId) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String sql = "";
            params.put("periodparamid", periodparamid);
            params.put("sesId", sesId);
            sql = "SELECT flagdel fd FROM periodlock WHERE sesid = CAST(:sesId as uuid) AND periodparamid = :periodparamid";
            List<String> result = db.Query(con, sql, String.class, params);
            if (result.get(0) == null) {
                throw new Exception("Поиск периодических реквизитов не выполнен");
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получаем сроки эксплуатации объекта
     *
     * @param objsId - идентификатор объекта
     * @return
     * @throws Exception
     */
    @Override
    public List<ObjsModelDate> listDateObjs(int objsId) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = " SELECT \n" +
                    " id,\n" +
                    " to_char(date_beg, 'DD.MM.YYYY') datebeg,\n" +
                    " to_char(date_end, 'DD.MM.YYYY') dateend,\n" +
                    " to_char(date_beg, 'DD.MM.YYYY') datebegbase,\n" +
                    " to_char(date_end, 'DD.MM.YYYY') dateendbase,\n" +
                    " out_info, \n" +
                    " likv_flag flaglikv,\n" +
                    " CASE WHEN likv_flag = 1 THEN 'Ликвидирован' ELSE 'Не ликвидирован' END flaglikvtx,\n" +
                    " act_nom actnom,\n" +
                    " creator,\n" +
                    " created,\n" +
                    " changer,\n" +
                    " changed,\n" +
                    " row_number() OVER() - 1 indexrow,\n" +
                    " 0 del\n" +
                    " FROM expl_trms\n" +
                    " WHERE obj_id = " + objsId;
            return db.Query(con, sql, ObjsModelDate.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверяем был ли удалена каринка
     *
     * @param id - идентификатор записи в imglock
     * @return
     * @throws Exception
     */
    @Override
    public int flagDelImg(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT flagdel FROM imglock WHERE id = " + id;
            List<String> result = db.Query(con, sql, String.class, null);
            return Integer.parseInt(result.get(0));
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Список начиселния износа
     *
     * @return
     * @throws Exception
     */
    @Override
    public List<UniversalBoxModel> ListWearMthds() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "SELECT id, CAST(perc as text) as name FROM wear_mthds";
            return db.Query(con, sql, UniversalBoxModel.class, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Получаем процент износа по счету и группе инвентарного учета объекта
     *
     * @param accId    - идентификатор счета объекта
     * @param invGrpId - идентификатор группы инвентарного учета
     * @return
     * @throws Exception
     */
    @Override
    public String wearMthdsPerc(int accId, int invGrpId) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            String sql = "";
            params.put("accId", accId);
            params.put("invGrpId", invGrpId);
            sql = " SELECT CAST(perc AS text) perc \n" +
                    " FROM inv_grp_accs\n" +
                    " WHERE acc_id = :accId \n" +
                    " AND inv_grp_id = :invGrpId";
            List<String> result = db.Query(con, sql, String.class, params);
            if (result.size() == 0) {
                result.add("0");
            }
            return result.get(0);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Удаление объекта
     *
     * @param id - идентификатор объекта
     * @throws Exception
     */
    @Override
    public void delete(int id) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            String sql = "";
            sql = "DELETE FROM imgvalues WHERE objectid = (SELECT getobject_id('objs')) AND recid = " + id;
            db.Execute(con, sql, null);
            sql = "DELETE FROM imgvalues WHERE objectid = (SELECT getobject_id('listvalues')) AND recid in (select id from listvalues where ownerid = " + id + ")";
            db.Execute(con, sql, null);
            sql = "DELETE FROM imgvalues WHERE objectid = (SELECT getobject_id('periodvalues')) AND recid in (select id from periodvalues where ownerid = " + id + ")";
            db.Execute(con, sql, null);
            sql = "DELETE FROM periodvalues where ownerid = " + id;
            db.Execute(con, sql, null);
            sql = "DELETE FROM listvalues where ownerid = " + id;
            db.Execute(con, sql, null);
            sql = "DELETE FROM expl_trms WHERE obj_id =" + id + "\n";
            db.Execute(con, sql, null);
            sql = "DELETE FROM objs where id = " + id;
            db.Execute(con, sql, null);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /**
     * Проверяем права пользователя и открываем поля в соответствии с правами (для КТ) для  существующей записи
     * @return
     * @throws Exception
     */
    @Override
    public String RightsUsersKTId(int objId) throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("userCode", db.getUserCode());
            String sql = "select get_act_rights('Objs.dll','ObjsRightsKT',:userCode)";
            List<String> result_right = db.Query(con, sql, String.class, params);
            params.remove("userCode");
            sql = "SELECT objtypeid FROM objs WHERE id = " + objId;
            List<String> result_obj_types = db.Query(con, sql, String.class, null);
            String res = "";
            if (result_right.get(0).length() > 0) {
                res = "Error";
            } else {
                if(Integer.parseInt(result_obj_types.get(0)) == 42)
                {
                    res = "All";
                }else{
                    res = "Part";
                }
            }
            return res;
        } catch (Exception ex) {
            throw ex;

        }
    }

    /**
     * Проверяем права пользователя и открываем поля в соответствии с правами (для КТ) для новой записи
     * @return
     * @throws Exception
     */
    @Override
    public String RightsUsersKT() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("userCode", db.getUserCode());
            String sql = "select get_act_rights('Objs.dll','ObjsRightsKT',:userCode)";
            List<String> result = db.Query(con, sql, String.class, params);
            return result.get(0);
        } catch (Exception ex) {
            throw ex;

        }
    }

    /**
     * Проверяем права пользователя и открываем поля в соответствии с правами (для Бухгалтерии)
     * @return
     * @throws Exception
     */
    @Override
    public String RightsUsersBuh() throws Exception {
        try (Connection con = db.getConnection(appName)) {
            Map<String, Object> params = new HashMap<>();
            params.put("userCode", db.getUserCode());
            String sql = "select get_act_rights('Objs.dll','ObjsRightsBuh',:userCode)";
            List<String> result = db.Query(con, sql, String.class, params);
            return result.get(0);
        } catch (Exception ex) {
            throw ex;

        }
    }
}

