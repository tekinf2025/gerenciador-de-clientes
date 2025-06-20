export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          conta_criada: string
          created_at: string
          data_vencimento: string
          id: string
          id_client: string
          nome: string
          observacao: string | null
          plano_mensal: number
          plano_trimestral: number
          servidor: Database["public"]["Enums"]["tipo_servidor"]
          status: Database["public"]["Enums"]["status_cliente"]
          telefone: string | null
          updated_at: string
        }
        Insert: {
          conta_criada?: string
          created_at?: string
          data_vencimento: string
          id?: string
          id_client: string
          nome: string
          observacao?: string | null
          plano_mensal?: number
          plano_trimestral?: number
          servidor: Database["public"]["Enums"]["tipo_servidor"]
          status?: Database["public"]["Enums"]["status_cliente"]
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          conta_criada?: string
          created_at?: string
          data_vencimento?: string
          id?: string
          id_client?: string
          nome?: string
          observacao?: string | null
          plano_mensal?: number
          plano_trimestral?: number
          servidor?: Database["public"]["Enums"]["tipo_servidor"]
          status?: Database["public"]["Enums"]["status_cliente"]
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      configuracoes_servidor: {
        Row: {
          created_at: string
          id: string
          preco_mensal: number
          tipo_servidor: Database["public"]["Enums"]["tipo_servidor"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          preco_mensal?: number
          tipo_servidor: Database["public"]["Enums"]["tipo_servidor"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          preco_mensal?: number
          tipo_servidor?: Database["public"]["Enums"]["tipo_servidor"]
          updated_at?: string
        }
        Relationships: []
      }
      configuracoes_whatsapp: {
        Row: {
          assinatura: string | null
          assinatura_automatica: boolean
          created_at: string
          id: string
          mensagem_padrao: string
          updated_at: string
        }
        Insert: {
          assinatura?: string | null
          assinatura_automatica?: boolean
          created_at?: string
          id?: string
          mensagem_padrao?: string
          updated_at?: string
        }
        Update: {
          assinatura?: string | null
          assinatura_automatica?: boolean
          created_at?: string
          id?: string
          mensagem_padrao?: string
          updated_at?: string
        }
        Relationships: []
      }
      logs_recarga: {
        Row: {
          cliente_id: string
          created_at: string
          data_vencimento_antes: string
          data_vencimento_depois: string
          id: string
          meses_adicionados: number
          nome_cliente: string
          servidor: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_vencimento_antes: string
          data_vencimento_depois: string
          id?: string
          meses_adicionados: number
          nome_cliente: string
          servidor: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_vencimento_antes?: string
          data_vencimento_depois?: string
          id?: string
          meses_adicionados?: number
          nome_cliente?: string
          servidor?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_logs_recarga_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      dias_ate_vencimento: {
        Args: { data_venc: string }
        Returns: number
      }
      dias_conta_ativa: {
        Args: { data_criacao: string }
        Returns: number
      }
    }
    Enums: {
      status_cliente: "Ativo" | "Vencido"
      tipo_servidor: "P2X" | "P2_SERVER" | "CPLAYER" | "RTV" | "RTV-VODs"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      status_cliente: ["Ativo", "Vencido"],
      tipo_servidor: ["P2X", "P2_SERVER", "CPLAYER", "RTV", "RTV-VODs"],
    },
  },
} as const
