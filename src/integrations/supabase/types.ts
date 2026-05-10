export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      calculos: {
        Row: {
          adicionais_trabalho: string[] | null
          adicional_noturno: boolean | null
          ainda_trabalhando: boolean | null
          anos_servico: number | null
          aviso_previo: string | null
          aviso_previo_confirmado: string | null
          calc_aviso_previo: number | null
          calc_decimo_terceiro: number | null
          calc_desconto_inss: number | null
          calc_desconto_irrf: number | null
          calc_dias_aviso_previo: number | null
          calc_dias_trabalhados_mes: number | null
          calc_ferias_proporcionais: number | null
          calc_ferias_vencidas: number | null
          calc_multa_fgts: number | null
          calc_saldo_salario: number | null
          calc_terco_ferias_proporcionais: number | null
          calc_terco_ferias_vencidas: number | null
          calc_total_bruto: number | null
          calc_total_liquido: number | null
          codigo_unico: string
          cpf: string | null
          created_at: string
          data_admissao: string | null
          data_desligamento: string | null
          dias_trabalhados_por_semana: number | null
          diferenca: number | null
          email: string | null
          erro_na_rescisao: string | null
          fazia_horas_extras: string | null
          ferias_vencidas: string | null
          funcoes_diferentes: string | null
          horario_contratado: string | null
          horario_real_medio: string | null
          id: string
          insalubridade: boolean | null
          intervalo_almoco_completo: boolean | null
          itens_verbas: Json | null
          media_mensal_comissao: number | null
          media_mensal_por_fora: number | null
          media_variavel: number | null
          meses_desde_ultima_ferias: number | null
          meses_trabalhados_2026: number | null
          meses_trabalhados_ano_rescisao: number | null
          nivel_oportunidade: string | null
          nome: string | null
          num_dependentes: number | null
          periculosidade: boolean | null
          periodos_ferias_vencidas: number | null
          principais_fatores: string[] | null
          quando_ultimas_ferias: string | null
          recebia_comissao: boolean | null
          recebia_por_fora: boolean | null
          salario_fixo: number | null
          saldo_fgts: number | null
          status: string
          status_pagamento: string | null
          tem_variavel: boolean | null
          tipo_aviso_previo: string | null
          tipo_desligamento: string | null
          tirou_ferias_corretamente: string | null
          trabalhava_sabados: boolean | null
          updated_at: string
          valor_base: number | null
          valor_por_fora: string | null
          valor_refinado: number | null
        }
        Insert: {
          adicionais_trabalho?: string[] | null
          adicional_noturno?: boolean | null
          ainda_trabalhando?: boolean | null
          anos_servico?: number | null
          aviso_previo?: string | null
          aviso_previo_confirmado?: string | null
          calc_aviso_previo?: number | null
          calc_decimo_terceiro?: number | null
          calc_desconto_inss?: number | null
          calc_desconto_irrf?: number | null
          calc_dias_aviso_previo?: number | null
          calc_dias_trabalhados_mes?: number | null
          calc_ferias_proporcionais?: number | null
          calc_ferias_vencidas?: number | null
          calc_multa_fgts?: number | null
          calc_saldo_salario?: number | null
          calc_terco_ferias_proporcionais?: number | null
          calc_terco_ferias_vencidas?: number | null
          calc_total_bruto?: number | null
          calc_total_liquido?: number | null
          codigo_unico: string
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          data_desligamento?: string | null
          dias_trabalhados_por_semana?: number | null
          diferenca?: number | null
          email?: string | null
          erro_na_rescisao?: string | null
          fazia_horas_extras?: string | null
          ferias_vencidas?: string | null
          funcoes_diferentes?: string | null
          horario_contratado?: string | null
          horario_real_medio?: string | null
          id?: string
          insalubridade?: boolean | null
          intervalo_almoco_completo?: boolean | null
          itens_verbas?: Json | null
          media_mensal_comissao?: number | null
          media_mensal_por_fora?: number | null
          media_variavel?: number | null
          meses_desde_ultima_ferias?: number | null
          meses_trabalhados_2026?: number | null
          meses_trabalhados_ano_rescisao?: number | null
          nivel_oportunidade?: string | null
          nome?: string | null
          num_dependentes?: number | null
          periculosidade?: boolean | null
          periodos_ferias_vencidas?: number | null
          principais_fatores?: string[] | null
          quando_ultimas_ferias?: string | null
          recebia_comissao?: boolean | null
          recebia_por_fora?: boolean | null
          salario_fixo?: number | null
          saldo_fgts?: number | null
          status?: string
          status_pagamento?: string | null
          tem_variavel?: boolean | null
          tipo_aviso_previo?: string | null
          tipo_desligamento?: string | null
          tirou_ferias_corretamente?: string | null
          trabalhava_sabados?: boolean | null
          updated_at?: string
          valor_base?: number | null
          valor_por_fora?: string | null
          valor_refinado?: number | null
        }
        Update: {
          adicionais_trabalho?: string[] | null
          adicional_noturno?: boolean | null
          ainda_trabalhando?: boolean | null
          anos_servico?: number | null
          aviso_previo?: string | null
          aviso_previo_confirmado?: string | null
          calc_aviso_previo?: number | null
          calc_decimo_terceiro?: number | null
          calc_desconto_inss?: number | null
          calc_desconto_irrf?: number | null
          calc_dias_aviso_previo?: number | null
          calc_dias_trabalhados_mes?: number | null
          calc_ferias_proporcionais?: number | null
          calc_ferias_vencidas?: number | null
          calc_multa_fgts?: number | null
          calc_saldo_salario?: number | null
          calc_terco_ferias_proporcionais?: number | null
          calc_terco_ferias_vencidas?: number | null
          calc_total_bruto?: number | null
          calc_total_liquido?: number | null
          codigo_unico?: string
          cpf?: string | null
          created_at?: string
          data_admissao?: string | null
          data_desligamento?: string | null
          dias_trabalhados_por_semana?: number | null
          diferenca?: number | null
          email?: string | null
          erro_na_rescisao?: string | null
          fazia_horas_extras?: string | null
          ferias_vencidas?: string | null
          funcoes_diferentes?: string | null
          horario_contratado?: string | null
          horario_real_medio?: string | null
          id?: string
          insalubridade?: boolean | null
          intervalo_almoco_completo?: boolean | null
          itens_verbas?: Json | null
          media_mensal_comissao?: number | null
          media_mensal_por_fora?: number | null
          media_variavel?: number | null
          meses_desde_ultima_ferias?: number | null
          meses_trabalhados_2026?: number | null
          meses_trabalhados_ano_rescisao?: number | null
          nivel_oportunidade?: string | null
          nome?: string | null
          num_dependentes?: number | null
          periculosidade?: boolean | null
          periodos_ferias_vencidas?: number | null
          principais_fatores?: string[] | null
          quando_ultimas_ferias?: string | null
          recebia_comissao?: boolean | null
          recebia_por_fora?: boolean | null
          salario_fixo?: number | null
          saldo_fgts?: number | null
          status?: string
          status_pagamento?: string | null
          tem_variavel?: boolean | null
          tipo_aviso_previo?: string | null
          tipo_desligamento?: string | null
          tirou_ferias_corretamente?: string | null
          trabalhava_sabados?: boolean | null
          updated_at?: string
          valor_base?: number | null
          valor_por_fora?: string | null
          valor_refinado?: number | null
        }
        Relationships: []
      }
      funnel_sessions: {
        Row: {
          calculo_id: string | null
          completed_quiz: boolean | null
          current_question_campo: string | null
          current_question_index: number | null
          device_type: string | null
          id: string
          last_activity_at: string
          max_question_reached: number | null
          payment_completed: boolean | null
          reached_loading: boolean | null
          reached_payment: boolean | null
          reached_resultado: boolean | null
          reached_risk_screen: boolean | null
          session_id: string
          started_at: string
          total_questions: number | null
          user_agent: string | null
        }
        Insert: {
          calculo_id?: string | null
          completed_quiz?: boolean | null
          current_question_campo?: string | null
          current_question_index?: number | null
          device_type?: string | null
          id?: string
          last_activity_at?: string
          max_question_reached?: number | null
          payment_completed?: boolean | null
          reached_loading?: boolean | null
          reached_payment?: boolean | null
          reached_resultado?: boolean | null
          reached_risk_screen?: boolean | null
          session_id: string
          started_at?: string
          total_questions?: number | null
          user_agent?: string | null
        }
        Update: {
          calculo_id?: string | null
          completed_quiz?: boolean | null
          current_question_campo?: string | null
          current_question_index?: number | null
          device_type?: string | null
          id?: string
          last_activity_at?: string
          max_question_reached?: number | null
          payment_completed?: boolean | null
          reached_loading?: boolean | null
          reached_payment?: boolean | null
          reached_resultado?: boolean | null
          reached_risk_screen?: boolean | null
          session_id?: string
          started_at?: string
          total_questions?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funnel_sessions_calculo_id_fkey"
            columns: ["calculo_id"]
            isOneToOne: false
            referencedRelation: "calculos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos_pix: {
        Row: {
          amount: number
          calculo_id: string
          charge_id_pagarme: string | null
          created_at: string
          expires_at: string | null
          id: string
          order_id_pagarme: string | null
          paid_at: string | null
          qr_code: string | null
          qr_code_url: string | null
          status: string
        }
        Insert: {
          amount: number
          calculo_id: string
          charge_id_pagarme?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          order_id_pagarme?: string | null
          paid_at?: string | null
          qr_code?: string | null
          qr_code_url?: string | null
          status?: string
        }
        Update: {
          amount?: number
          calculo_id?: string
          charge_id_pagarme?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          order_id_pagarme?: string | null
          paid_at?: string | null
          qr_code?: string | null
          qr_code_url?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_pix_calculo_id_fkey"
            columns: ["calculo_id"]
            isOneToOne: false
            referencedRelation: "calculos"
            referencedColumns: ["id"]
          },
        ]
      }
      relatorios: {
        Row: {
          calculo_id: string
          created_at: string
          id: string
          relatorio_ai: Json
          report_hash: string | null
          report_url: string | null
        }
        Insert: {
          calculo_id: string
          created_at?: string
          id?: string
          relatorio_ai: Json
          report_hash?: string | null
          report_url?: string | null
        }
        Update: {
          calculo_id?: string
          created_at?: string
          id?: string
          relatorio_ai?: Json
          report_hash?: string | null
          report_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_calculo_id_fkey"
            columns: ["calculo_id"]
            isOneToOne: true
            referencedRelation: "calculos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
