export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus = 'new' | 'processed';

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          description: string | null;
          price: number;
          images: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          description?: string | null;
          price: number;
          images?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name?: string;
          description?: string | null;
          price?: number;
          images?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          created_at: string;
          customer_name: string;
          customer_phone: string;
          status: OrderStatus;
          total_price: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          customer_name: string;
          customer_phone: string;
          status?: OrderStatus;
          total_price: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          customer_name?: string;
          customer_phone?: string;
          status?: OrderStatus;
          total_price?: number;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          quantity: number;
          price_at_purchase: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          quantity: number;
          price_at_purchase: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          quantity?: number;
          price_at_purchase?: number;
        };
      };
    };
  };
}

export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];

export type ProductWithCategory = Product & {
  categories: Category | null;
};

export type OrderWithItems = Order & {
  order_items: (OrderItem & {
    products: Product | null;
  })[];
};

// Homepage Content Types
export interface HomepageContent {
  id: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_background_image_url: string | null;
  hero_button1_text: string | null;
  hero_button1_link: string | null;
  hero_button2_text: string | null;
  hero_button2_link: string | null;
  advantages_title: string | null;
  advantages_subtitle: string | null;
  advantages: Json;
  work_steps_title: string | null;
  work_steps_subtitle: string | null;
  work_steps: Json;
  popular_categories_title: string | null;
  popular_categories_subtitle: string | null;
  popular_categories: Json;
  faq_title: string | null;
  faq_subtitle: string | null;
  faq_items: Json;
  cta_title: string | null;
  cta_subtitle: string | null;
  cta_button1_text: string | null;
  cta_button1_link: string | null;
  cta_button2_text: string | null;
  cta_button2_link: string | null;
  cta_background_color: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServicesContent {
  id: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  services: Json;
  cta_title: string | null;
  cta_subtitle: string | null;
  cta_button_text: string | null;
  cta_button_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface AboutContent {
  id: string;
  hero_title: string | null;
  hero_description: string | null;
  history_title: string | null;
  history_text: string | null;
  history_image_url: string | null;
  history_year: string | null;
  team_title: string | null;
  team_subtitle: string | null;
  team_members: Json;
  values_title: string | null;
  values_subtitle: string | null;
  values_items: Json;
  created_at: string;
  updated_at: string;
}

export interface ContactsContent {
  id: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  working_hours: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  telegram_url: string | null;
  telegram_chat_id: string | null;
  map_address: string | null;
  map_latitude: number | null;
  map_longitude: number | null;
  map_zoom: number | null;
  advantages: Json;
  created_at: string;
  updated_at: string;
}



