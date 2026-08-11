from django.db import connections
from datetime import datetime

class DashboardService:
    @staticmethod
    def get_cadunico_stats():
        """
        Runs the legacy query to calculate statistics for:
        - Total Families, People, Female-headed households, Elderly, Disabled.
        - Age distributions, Housing situation, Education status, and Income brackets.
        """
        sql = """
        SELECT 
              sum(m_extpb) as mExtPobr
            , sum(m_pob) as mPobr
            , sum(m_bxrd) as mBaixRen
            , sum(m_1sm) as mAte1sm
            , sum(m_2sm) as mAte2sm
            , sum(m_3sm) as mAte3sm
            , sum(m_mais3sm) as mMaior3sm
            ,SUM(renda.renda_media_faixa_1) AS renda_media_faixa_1
            ,SUM(renda.renda_media_faixa_2) AS renda_media_faixa_2
            ,SUM(renda.renda_media_faixa_3) AS renda_media_faixa_3
            ,SUM(renda.renda_media_faixa_4) AS renda_media_faixa_4
            ,SUM(renda.renda_media_faixa_5) AS renda_media_faixa_5
            ,MAX(CASE WHEN renda.fx_rfpc = 1 THEN renda.descricao_faixa END) AS desc_faixa_1
            ,MAX(CASE WHEN renda.fx_rfpc = 2 THEN renda.descricao_faixa END) AS desc_faixa_2
            ,MAX(CASE WHEN renda.fx_rfpc = 3 THEN renda.descricao_faixa END) AS desc_faixa_3
            ,MAX(CASE WHEN renda.fx_rfpc = 4 THEN renda.descricao_faixa END) AS desc_faixa_4
            ,MAX(CASE WHEN renda.fx_rfpc = 5 THEN renda.descricao_faixa END) AS desc_faixa_5
            , COUNT(*) as Total
            , MAX(m6) as m6, MAX(m7_15) as m7_15, MAX(m16_19) as m16_19, MAX(m20_29) as m20_29, MAX(m30_39) as m30_39, MAX(m40_49) as m40_49, MAX(m50_59) as m50_59, MAX(m60_64) as m60_64, MAX(m65) as m65, MAX(mMulher_Arrimo) as mMulher_Arrimo, MAX(mDef) as mDef
            , MAX(mAlugada) as mAlugada, MAX(mCedida_Coabit) as mCedida_Coabit, MAX(mCedida_Unica) as mCedida_Unica, MAX(mOcupada) as mOcupada, MAX(mCParentes) as mCParentes, MAX(mOutros) as mOutros, MAX(mSolteiro) as mSolteiro, MAX(mCasado) as mCasado, MAX(mDivorc) as mDivorc, MAX(mSepar) as mSepar, MAX(mViuvo) as mViuvo, MAX(mUniEst) as mUniEst
            , MAX(feminino_m6) as feminino_m6, MAX(feminino_m7_15) as feminino_m7_15, MAX(feminino_m16_19) as feminino_m16_19, MAX(feminino_m20_29) as feminino_m20_29, MAX(feminino_m30_39) as feminino_m30_39, MAX(feminino_m40_49) as feminino_m40_49, MAX(feminino_m50_59) as feminino_m50_59, MAX(feminino_m60_64) as feminino_m60_64, MAX(feminino_m65) as feminino_m65, MAX(total_feminino) as total_feminino
            , MAX(masculino_m6) as masculino_m6, MAX(masculino_m7_15) as masculino_m7_15, MAX(masculino_m16_19) as masculino_m16_19, MAX(masculino_m20_29) as masculino_m20_29, MAX(masculino_m30_39) as masculino_m30_39, MAX(masculino_m40_49) as masculino_m40_49, MAX(masculino_m50_59) as masculino_m50_59, MAX(masculino_m60_64) as masculino_m60_64, MAX(masculino_m65) as masculino_m65, MAX(total_masculino) as total_masculino
            , (MAX(total_feminino) + MAX(total_masculino)) as totpes, MAX(m0_5_naofreq) as m0_5_naofreq, MAX(m6_14_naofreq) as m6_14_naofreq, MAX(m15_17_naofreq) as m15_17_naofreq, MAX(m10_17_naole) as m10_17_naole, MAX(m18_59_naole) as m18_59_naole, MAX(m60_naole) as m60_naole
                From ( SELECT SUM(pessoas.val_remuner_empr_memb) AS RendaBruta_Fam, COUNT(pessoas.id) AS NumPes_Fam, 
                        familia_domicilio.fx_rfpc,
                        frp.valor AS descricao_faixa,

                        SUM(pessoas.val_remuner_empr_memb) / COUNT(pessoas.id) AS PerCapita_Fam, 
                        if( round(SUM(pessoas.val_remuner_empr_memb) / COUNT(pessoas.id)) < 105, 1 , 0) as m_extpb, 
                        if( round(SUM(pessoas.val_remuner_empr_memb) / COUNT(pessoas.id)) between 105.1 and 210, 1 , 0) as m_pob, 
                        if( round(SUM(pessoas.val_remuner_empr_memb) / COUNT(pessoas.id)) between 210.1 and 606, 1 , 0) as m_bxrd, 
                        if( round(SUM(pessoas.val_remuner_empr_memb) / COUNT(pessoas.id)) between 606.1 and 1212, 1 , 0) as m_1sm, 
                        if( round(SUM(pessoas.val_remuner_empr_memb) / COUNT(pessoas.id)) between 1212.1 and 2424, 1 , 0) as m_2sm, 
                        if( round(SUM(pessoas.val_remuner_empr_memb) / COUNT(pessoas.id)) between 2424.1 and 3636, 1 , 0) as m_3sm, 
                        if( round(SUM(pessoas.val_remuner_empr_memb) / COUNT(pessoas.id)) > 3636.1, 1 , 0) as m_mais3sm ,
                        IF(familia_domicilio.fx_rfpc = 1, 1, 0) AS renda_media_faixa_1,
                        IF(familia_domicilio.fx_rfpc = 2, 1, 0) AS renda_media_faixa_2,
                        IF(familia_domicilio.fx_rfpc = 3, 1, 0) AS renda_media_faixa_3,
                        IF(familia_domicilio.fx_rfpc = 4, 1, 0) AS renda_media_faixa_4,
                        IF(familia_domicilio.fx_rfpc = 5, 1, 0) AS renda_media_faixa_5
                                FROM familia_domicilio familia_domicilio 
                                LEFT JOIN pessoas pessoas ON  familia_domicilio.id = pessoas.cod_familia 
                                AND pessoas.cod_est_cad_memb != 4 
                                LEFT JOIN faixa_renda_percapta frp ON frp.faixa = familia_domicilio.fx_rfpc
                                GROUP BY familia_domicilio.id, pessoas.cod_familia 
                                ORDER BY familia_domicilio.id ) renda 
                            join ( SELECT 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) < 7 then 1 else NULL end) AS m6, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 7  and 15 then 1 else NULL end) AS m7_15, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 16  and 19 then 1 else NULL end) AS m16_19, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 20  and 29 then 1 else NULL end) AS m20_29, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 30  and 39 then 1 else NULL end) AS m30_39, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 40  and 49 then 1 else NULL end) AS m40_49, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 50  and 59 then 1 else NULL end) AS m50_59, 	
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 60  and 64 then 1 else NULL end) AS m60_64, 							
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) > 64 then 1 else NULL end) AS m65,
                                    COUNT(case when pessoas.cod_def_memb = 'Sim' then 1 else NULL end) AS mDef, 
                                    COUNT(case when pessoas.cod_sexo_pes = 'Fem' and pessoas.cod_parent_rf_pes = 1 then 1 else NULL end) AS mMulher_Arrimo,
                                    COUNT(case when familia_domicilio.tipo_residencia = 2 then 1 else NULL end) AS mAlugada, 
                                    COUNT(case when familia_domicilio.tipo_residencia = 3 then 1 else NULL end) AS mCedida_Coabit, 
                                    COUNT(case when familia_domicilio.tipo_residencia = 4 then 1 else NULL end) AS mCedida_Unica,
                                    COUNT(case when familia_domicilio.tipo_residencia = 6 then 1 else NULL end) AS mOcupada, 
                                    COUNT(case when familia_domicilio.tipo_residencia = 7 then 1 else NULL end) AS mCParentes, 
                                    COUNT(case when familia_domicilio.tipo_residencia = 8 then 1 else NULL end) AS mOutros, 
                                    COUNT(case when pessoas.estado_civil = 1 then 1 else NULL end) AS mSolteiro, 
                                    COUNT(case when pessoas.estado_civil between 2  and 4 then 1 else NULL end) AS mCasado, 
                                    COUNT(case when pessoas.estado_civil = 5 then 1 else NULL end) AS mDivorc, 
                                    COUNT(case when pessoas.estado_civil = 6 then 1 else NULL end) AS mSepar, 
                                    COUNT(case when pessoas.estado_civil = 7 then 1 else NULL end) AS mViuvo, 
                                    COUNT(case when pessoas.estado_civil = 8 then 1 else NULL end) AS mUniEst, 
                                    COUNT(*) as Total,
                                    
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) < 7 AND pessoas.cod_sexo_pes = 'Fem' then 1 else NULL end) AS feminino_m6, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 7  and 15 AND pessoas.cod_sexo_pes = 'Fem' then 1 else NULL end) AS feminino_m7_15, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 16  and 19 AND pessoas.cod_sexo_pes = 'Fem' then 1 else NULL end) AS feminino_m16_19, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 20  and 29 AND pessoas.cod_sexo_pes = 'Fem' then 1 else NULL end) AS feminino_m20_29, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 30  and 39 AND pessoas.cod_sexo_pes = 'Fem' then 1 else NULL end) AS feminino_m30_39, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 40  and 49 AND pessoas.cod_sexo_pes = 'Fem' then 1 else NULL end) AS feminino_m40_49, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 50  and 59 AND pessoas.cod_sexo_pes = 'Fem' then 1 else NULL end) AS feminino_m50_59, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 60  and 64 AND pessoas.cod_sexo_pes = 'Fem' then 1 else NULL end) AS feminino_m60_64, 							
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) > 64 AND pessoas.cod_sexo_pes = 'Fem' then 1 else NULL end) AS feminino_m65, 
                                    COUNT(case when pessoas.cod_sexo_pes = 'Fem' then 1 else NULL end) AS total_feminino,
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) < 7 AND pessoas.cod_sexo_pes = 'Masc' then 1 else NULL end) AS masculino_m6, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 7  and 15 AND pessoas.cod_sexo_pes = 'Masc' then 1 else NULL end) AS masculino_m7_15, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 16  and 19 AND pessoas.cod_sexo_pes = 'Masc' then 1 else NULL end) AS masculino_m16_19, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 20  and 29 AND pessoas.cod_sexo_pes = 'Masc' then 1 else NULL end) AS masculino_m20_29, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 30  and 39 AND pessoas.cod_sexo_pes = 'Masc' then 1 else NULL end) AS masculino_m30_39, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 40  and 49 AND pessoas.cod_sexo_pes = 'Masc' then 1 else NULL end) AS masculino_m40_49, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 50  and 59 AND pessoas.cod_sexo_pes = 'Masc' then 1 else NULL end) AS masculino_m50_59, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 60  and 64 AND pessoas.cod_sexo_pes = 'Masc' then 1 else NULL end) AS masculino_m60_64, 							
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) > 64 AND pessoas.cod_sexo_pes = 'Masc' then 1 else NULL end) AS masculino_m65,
                                    COUNT(case when pessoas.cod_sexo_pes != 'Fem' then 1 else NULL end) AS total_masculino,	
         							
         							COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) < 6 AND pessoas.ind_freq_escola_memb IN(3,4) then 1 else NULL end) AS m0_5_naofreq, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 6  and 14 AND pessoas.ind_freq_escola_memb IN(3,4) then 1 else NULL end) AS m6_14_naofreq, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 15  and 17 AND pessoas.ind_freq_escola_memb IN(3,4) then 1 else NULL end) AS m15_17_naofreq, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 10  and 17 AND pessoas.cod_sabe_ler_escrever_memb = 'Não' then 1 else NULL end) AS m10_17_naole, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) between 18  and 59 AND pessoas.cod_sabe_ler_escrever_memb = 'Não' then 1 else NULL end) AS m18_59_naole, 
                                    COUNT(case when TIMESTAMPDIFF(YEAR,pessoas.dta_nasc_pes,CURDATE()) > 60 AND pessoas.cod_sabe_ler_escrever_memb = 'Não' then 1 else NULL end) AS m60_naole 
                                                                
                                    
                            FROM   familia_domicilio familia_domicilio 
                            LEFT JOIN pessoas pessoas ON  familia_domicilio.id = pessoas.cod_familia 
                            AND pessoas.cod_est_cad_memb != 4 AND familia_domicilio.ativo = 1) AS PES
        """
        with connections['default'].cursor() as cursor:
            cursor.execute(sql)
            row = cursor.fetchone()
            if not row:
                return {}
            columns = [col[0] for col in cursor.description]
            res_dict = dict(zip(columns, row))
            
            # Convert decimal/numeric types to float or int for JSON serialization
            for k, v in res_dict.items():
                if v is None:
                    res_dict[k] = 0
                elif isinstance(v, (int, float)):
                    pass
                else:
                    try:
                        res_dict[k] = float(v) if '.' in str(v) else int(v)
                    except ValueError:
                        res_dict[k] = str(v)
            return res_dict

    @staticmethod
    def get_atendimentos_period(start_date, end_date):
        """
        Retrieves daily atendimentos counts between start_date and end_date.
        """
        sql = """
            SELECT COUNT(id) AS total_atend, DATE(data_atend) as dia
            FROM atendimento_social
            WHERE ativo = 1 AND DATE(data_atend) BETWEEN %s AND %s
            GROUP BY DATE(data_atend)
            ORDER BY DATE(data_atend)
        """
        with connections['default'].cursor() as cursor:
            cursor.execute(sql, [start_date, end_date])
            rows = cursor.fetchall()
            data = []
            for r in rows:
                dia_str = r[1].strftime('%Y-%m-%d') if isinstance(r[1], datetime) or hasattr(r[1], 'strftime') else str(r[1])
                data.append({
                    'dia': dia_str,
                    'atendimento': int(r[0])
                })
            return data
