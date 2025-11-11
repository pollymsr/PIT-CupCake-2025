// const.ts - versão simplificada
export const APP_TITLE = "Cupcake Pit";

export const APP_LOGO = "https://placehold.co/128x128/E1E7EF/1F2937?text=App";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  // Verifica se estamos no cliente (navegador)
  if (typeof window === 'undefined') {
    return "";
  }
  
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  // URLs hardcoded temporariamente
  const oauthPortalUrl = "https://oauth.example.com";
  const appId = "cupcake-app";

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};