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
      businesses: {
        Row: {
          business_type: string | null
          category_id: string | null
          city: string | null
          contact_name: string | null
          country: string | null
          created_at: string
          description: string | null
          designation: string | null
          established_year: number | null
          gallery_urls: string[]
          id: string
          logo_url: string | null
          moq: string | null
          name: string
          owner_id: string
          price_range: string | null
          products: string | null
          public_email: string | null
          public_phone: string | null
          service_areas: string | null
          short_description: string | null
          slug: string
          status: string
          updated_at: string
          verified: boolean
          website_url: string | null
          whatsapp: string | null
        }
        Insert: {
          business_type?: string | null
          category_id?: string | null
          city?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          designation?: string | null
          established_year?: number | null
          gallery_urls?: string[]
          id?: string
          logo_url?: string | null
          moq?: string | null
          name: string
          owner_id: string
          price_range?: string | null
          products?: string | null
          public_email?: string | null
          public_phone?: string | null
          service_areas?: string | null
          short_description?: string | null
          slug: string
          status?: string
          updated_at?: string
          verified?: boolean
          website_url?: string | null
          whatsapp?: string | null
        }
        Update: {
          business_type?: string | null
          category_id?: string | null
          city?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          designation?: string | null
          established_year?: number | null
          gallery_urls?: string[]
          id?: string
          logo_url?: string | null
          moq?: string | null
          name?: string
          owner_id?: string
          price_range?: string | null
          products?: string | null
          public_email?: string | null
          public_phone?: string | null
          service_areas?: string | null
          short_description?: string | null
          slug?: string
          status?: string
          updated_at?: string
          verified?: boolean
          website_url?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          budget: string | null
          business_id: string | null
          city: string | null
          contact_name: string | null
          country: string | null
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          is_international: boolean
          owner_id: string
          public_email: string | null
          public_phone: string | null
          quantity: string | null
          status: string
          title: string
          type: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          budget?: string | null
          business_id?: string | null
          city?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          is_international?: boolean
          owner_id: string
          public_email?: string | null
          public_phone?: string | null
          quantity?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          budget?: string | null
          business_id?: string | null
          city?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          is_international?: boolean
          owner_id?: string
          public_email?: string | null
          public_phone?: string | null
          quantity?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          language: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          language?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          language?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      profiles_public: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string | null
        }
        Relationships: []
      }
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

export type Business = Database["public"]["Tables"]["businesses"]["Row"]
export type BusinessInsert = Database["public"]["Tables"]["businesses"]["Insert"]
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type Opportunity = Database["public"]["Tables"]["opportunities"]["Row"]
export type OpportunityInsert =
  Database["public"]["Tables"]["opportunities"]["Insert"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export type BusinessWithCategory = Business & {
  categories: Pick<Category, "id" | "name" | "slug" | "icon"> | null
}

export type OpportunityWithBusiness = Opportunity & {
  businesses: Pick<Business, "id" | "name" | "slug"> | null
}

// Public projections never include `owner_id`.
export type PublicBusiness = Omit<Business, "owner_id"> & {
  categories: Pick<Category, "id" | "name" | "slug" | "icon"> | null
}

export type PublicOpportunity = Omit<Opportunity, "owner_id"> & {
  businesses: Pick<Business, "id" | "name" | "slug"> | null
}
