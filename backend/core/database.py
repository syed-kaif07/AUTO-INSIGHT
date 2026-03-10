from supabase import create_client, Client
from core.config import settings

# Supabase client (service role - full access for backend)
supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY
)

# Public client (anon key - for auth operations)
supabase_public: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_ANON_KEY
)


def get_supabase() -> Client:
    return supabase
