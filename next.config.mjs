/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    // Mapear variáveis ENV_ para NEXT_PUBLIC_ (acessíveis no browser)
    NEXT_PUBLIC_SUPABASE_URL: process.env.ENV_NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.ENV_NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

export default nextConfig
