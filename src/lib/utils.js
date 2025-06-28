/** * Redirects the user to the Spotify authorization page with PKCE support.
 *
 * @param {string} idpUrl - The base URL for Spotify's authorization endpoint.
 * @param {string} clientId - The client ID of your Spotify application.
 * @param {string} redirectUri - The URI to redirect to after authorization.
 * @param {string} scope - The scopes requested for access.
 * @param {string} codeChallenge - The code challenge generated for PKCE.
 */
export async function redirectToSpotifyAuth(
  idpUrl,
  clientId,
  redirectUri,
  scope,
  challenge
) {
  sessionStorage.setItem("code_verifier", challenge.code_verifier);

  const authUrl = new URL(`${idpUrl}/authorize`);
  authUrl.search = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    code_challenge_method: 'S256',
    code_challenge: challenge.code_challenge,
    redirect_uri: redirectUri,
  }).toString();

  window.location.href = authUrl.toString();
}


/**
 * Exchanges the authorization code for an access token.
 * @param {string} idpUrl - The base URL for the identity provider's API.
 * @param {string} code - The authorization code received from the callback.
 * @param {string} codeVerifier - The code verifier used in the initial authorization request.
 * @param {string} clientId - The client ID of your application.
 * @param {string} redirectUri - The URI to redirect to after authorization.
 * @returns {Promise<Object>} - The response from the token endpoint.
 */
export async function exchangeCode(
  idpUrl,
  code,
  codeVerifier,
  clientId,
  redirectUri
) {
  const res = await fetch(`${idpUrl}/api/token`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: new URLSearchParams({
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
    }),
  });

  const rawData = await res.json();

  if (!res.ok) {
    throw new Error(`Failed to exchange authorization code for access token: ${JSON.stringify(rawData)}`);
  }

  return rawData;
}

/**
 * Handles the callback from the identity provider after authorization.
 * @param {string} idpUrl - The base URL for the identity provider's API.
 * @param {string} clientId - The client ID of your application.
 * @param {string} redirectUri - The URI to redirect to after authorization.
 * @returns {Promise<Object>} - The response from the token endpoint.
 */
export async function handleCallBack(
  idpUrl,
  clientId,
  redirectUri
) {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  
  if (!code) {
    throw new Error("Authorization code not found in URL parameters.");
  }

  const codeVerifier = sessionStorage.getItem("code_verifier");
  if (!codeVerifier) {
    throw new Error("Code verifier not found in session storage.");
  }

  return exchangeCode(
    idpUrl,
    code,
    codeVerifier,
    clientId,
    redirectUri
  );
}
