-- Supabase Database Schema
-- Tables pour l'application GP Travel

-- Table des utilisateurs (Users & GPs)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  country TEXT NOT NULL,
  contact TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_gp BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des abonnements GP
CREATE TABLE IF NOT EXISTS gp_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Table des annonces de voyage (Travel Announcements)
CREATE TABLE IF NOT EXISTS travel_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gp_id UUID REFERENCES users(id) ON DELETE CASCADE,
  from_country TEXT NOT NULL,
  to_country TEXT NOT NULL,
  departure_date TEXT NOT NULL,
  max_weight TEXT NOT NULL,
  price_per_kg TEXT NOT NULL,
  available_space TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des demandes d'envoi (Request Announcements)
CREATE TABLE IF NOT EXISTS request_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  from_country TEXT NOT NULL,
  to_country TEXT NOT NULL,
  weight TEXT NOT NULL,
  date TEXT NOT NULL,
  product_type TEXT NOT NULL,
  description TEXT,
  contact_info TEXT NOT NULL,
  posted_date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  last_message TEXT,
  last_message_time TIMESTAMPTZ,
  request_id UUID REFERENCES request_announcements(id) ON DELETE SET NULL,
  travel_id UUID REFERENCES travel_announcements(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des participants aux conversations
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  is_gp BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Table des messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Types d'énumération pour les statuts d'envoi
CREATE TYPE shipment_status AS ENUM (
  'pending',
  'accepted',
  'in_transit',
  'customs',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

-- Table des envois (Shipments)
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES request_announcements(id) ON DELETE CASCADE,
  gp_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status shipment_status DEFAULT 'pending',
  tracking_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table de l'historique de suivi des envois
CREATE TABLE IF NOT EXISTS tracking_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  status shipment_status NOT NULL,
  location TEXT NOT NULL,
  notes TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Table des statistiques (pour le marketing)
CREATE TABLE IF NOT EXISTS app_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_users INTEGER DEFAULT 0,
  total_gps INTEGER DEFAULT 0,
  total_shipments INTEGER DEFAULT 0,
  total_successful_deliveries INTEGER DEFAULT 0,
  total_revenue NUMERIC(12,2) DEFAULT 0,
  active_gps INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date)
);

-- Index pour améliorer les performances
CREATE INDEX idx_users_contact ON users(contact);
CREATE INDEX idx_users_is_gp ON users(is_gp);
CREATE INDEX idx_gp_subscriptions_user_id ON gp_subscriptions(user_id);
CREATE INDEX idx_travel_announcements_gp_id ON travel_announcements(gp_id);
CREATE INDEX idx_travel_announcements_active ON travel_announcements(is_active);
CREATE INDEX idx_request_announcements_user_id ON request_announcements(user_id);
CREATE INDEX idx_conversations_participants ON conversation_participants(conversation_id, user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_shipments_user_id ON shipments(user_id);
CREATE INDEX idx_shipments_gp_id ON shipments(gp_id);
CREATE INDEX idx_shipments_request_id ON shipments(request_id);
CREATE INDEX idx_tracking_history_shipment_id ON tracking_history(shipment_id);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gp_subscriptions_updated_at BEFORE UPDATE ON gp_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_travel_announcements_updated_at BEFORE UPDATE ON travel_announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour mettre à jour les statistiques
CREATE OR REPLACE FUNCTION update_app_statistics()
RETURNS void AS $$
DECLARE
  v_date DATE := CURRENT_DATE;
BEGIN
  INSERT INTO app_statistics (
    date,
    total_users,
    total_gps,
    total_shipments,
    total_successful_deliveries,
    active_gps
  )
  VALUES (
    v_date,
    (SELECT COUNT(*) FROM users),
    (SELECT COUNT(*) FROM users WHERE is_gp = true),
    (SELECT COUNT(*) FROM shipments),
    (SELECT COUNT(*) FROM shipments WHERE status = 'delivered'),
    (SELECT COUNT(*) FROM gp_subscriptions WHERE is_active = true AND end_date > NOW())
  )
  ON CONFLICT (date) DO UPDATE SET
    total_users = EXCLUDED.total_users,
    total_gps = EXCLUDED.total_gps,
    total_shipments = EXCLUDED.total_shipments,
    total_successful_deliveries = EXCLUDED.total_successful_deliveries,
    active_gps = EXCLUDED.active_gps;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE gp_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_history ENABLE ROW LEVEL SECURITY;

-- Policies pour users (tous peuvent lire, seul l'utilisateur peut modifier son profil)
CREATE POLICY "Tous peuvent lire les profils utilisateurs" ON users FOR SELECT USING (true);
CREATE POLICY "Utilisateurs peuvent créer leur profil" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Utilisateurs peuvent modifier leur profil" ON users FOR UPDATE USING (id = current_setting('app.user_id')::UUID);

-- Policies pour travel_announcements (tous peuvent lire les annonces actives, seul le GP peut modifier)
CREATE POLICY "Tous peuvent lire les annonces de voyage actives" ON travel_announcements FOR SELECT USING (is_active = true);
CREATE POLICY "GPs peuvent créer des annonces" ON travel_announcements FOR INSERT WITH CHECK (gp_id = current_setting('app.user_id')::UUID);
CREATE POLICY "GPs peuvent modifier leurs annonces" ON travel_announcements FOR UPDATE USING (gp_id = current_setting('app.user_id')::UUID);
CREATE POLICY "GPs peuvent supprimer leurs annonces" ON travel_announcements FOR DELETE USING (gp_id = current_setting('app.user_id')::UUID);

-- Policies pour request_announcements (tous peuvent lire, seul l'utilisateur peut supprimer)
CREATE POLICY "Tous peuvent lire les demandes" ON request_announcements FOR SELECT USING (true);
CREATE POLICY "Utilisateurs peuvent créer des demandes" ON request_announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Utilisateurs peuvent supprimer leurs demandes" ON request_announcements FOR DELETE USING (user_id = current_setting('app.user_id')::UUID);

-- Policies pour messages (seuls les participants peuvent lire et créer des messages)
CREATE POLICY "Participants peuvent lire les messages" ON messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = messages.conversation_id 
      AND user_id = current_setting('app.user_id')::UUID
    )
  );
CREATE POLICY "Participants peuvent envoyer des messages" ON messages FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_participants 
      WHERE conversation_id = messages.conversation_id 
      AND user_id = current_setting('app.user_id')::UUID
    )
  );

-- Policies pour shipments (utilisateurs et GPs peuvent voir leurs envois)
CREATE POLICY "Utilisateurs peuvent voir leurs envois" ON shipments FOR SELECT 
  USING (user_id = current_setting('app.user_id')::UUID OR gp_id = current_setting('app.user_id')::UUID);
CREATE POLICY "GPs peuvent créer des envois" ON shipments FOR INSERT 
  WITH CHECK (gp_id = current_setting('app.user_id')::UUID);
CREATE POLICY "GPs peuvent mettre à jour leurs envois" ON shipments FOR UPDATE 
  USING (gp_id = current_setting('app.user_id')::UUID);

-- Policies pour tracking_history
CREATE POLICY "Utilisateurs peuvent voir l'historique de suivi" ON tracking_history FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM shipments 
      WHERE shipments.id = tracking_history.shipment_id 
      AND (shipments.user_id = current_setting('app.user_id')::UUID OR shipments.gp_id = current_setting('app.user_id')::UUID)
    )
  );
CREATE POLICY "GPs peuvent ajouter à l'historique de suivi" ON tracking_history FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM shipments 
      WHERE shipments.id = tracking_history.shipment_id 
      AND shipments.gp_id = current_setting('app.user_id')::UUID
    )
  );

-- Vues pour faciliter les requêtes

-- Vue pour les profils utilisateurs avec leur abonnement GP
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
  u.*,
  jsonb_build_object(
    'is_active', COALESCE(gs.is_active, false),
    'start_date', gs.start_date,
    'end_date', gs.end_date,
    'amount', gs.amount
  ) as gp_subscription
FROM users u
LEFT JOIN gp_subscriptions gs ON u.id = gs.user_id;

-- Vue pour les envois avec détails complets
CREATE OR REPLACE VIEW shipment_details AS
SELECT 
  s.*,
  u.first_name || ' ' || u.last_name as user_name,
  u.contact as user_contact,
  gp.first_name || ' ' || gp.last_name as gp_name,
  gp.contact as gp_contact,
  ra.from_country,
  ra.to_country,
  ra.product_type
FROM shipments s
JOIN users u ON s.user_id = u.id
JOIN users gp ON s.gp_id = gp.id
JOIN request_announcements ra ON s.request_id = ra.id;

-- Commentaires pour documentation
COMMENT ON TABLE users IS 'Table des utilisateurs (particuliers et GPs)';
COMMENT ON TABLE gp_subscriptions IS 'Table des abonnements pour les Grands Porteurs (GP)';
COMMENT ON TABLE travel_announcements IS 'Annonces de voyage publiées par les GPs';
COMMENT ON TABLE request_announcements IS 'Demandes d''envoi publiées par les utilisateurs';
COMMENT ON TABLE conversations IS 'Conversations entre utilisateurs et GPs';
COMMENT ON TABLE messages IS 'Messages échangés dans les conversations';
COMMENT ON TABLE shipments IS 'Envois/Colis en cours ou livrés';
COMMENT ON TABLE tracking_history IS 'Historique de suivi des envois';
COMMENT ON TABLE app_statistics IS 'Statistiques de l''application pour le marketing';
