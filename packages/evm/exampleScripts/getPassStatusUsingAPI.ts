// Get the state of a custom pass by calling the Civic Partner API with Oauth client credentials.
// Usage: CLIENT_ID=<client-id> CLIENT_SECRET=<client-secret> bun run getPassStatusUsingAPI.ts <walletAddress> <chainType> <chainNetwork>
// For example, to look up a pass on Sepolia: 
// CLIENT_ID=<client-id> CLIENT_SECRET=<client-secret> bun run getPassStatusUsingAPI.ts 0xaD067391A1C62e6fEafEe35a36fa520f9EDA48d9 ethereum sepolia
// Full documentation: https://civicteam.github.io/openapi-docs

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const walletAddress = process.argv[2];
const chainType = process.argv[3];
const chainNetwork = process.argv[4];

// Authentication credentials for the Civic API
const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

// The Civic endpoints used to authenticate and lookup the pass status
const authUrl = "https://auth0.civic.com/oauth/token";
const lookupUrl = `https://api.civic.com/partner/pass/${chainType}/${chainNetwork}/${walletAddress}`;

(async () => {
    // fetch the oauth client credentials token
    const loginResponse = await fetch(authUrl, {
        headers: {
            accept: "application/json, text/plain, */*",
            authorization: `Basic ${basicAuth}`,
            "content-type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
        method: "POST"
    });
    const token = (await loginResponse.json()).access_token;

    // now use that token to fetch the pass status
    const lookupResponse = await fetch(lookupUrl, {
        headers: {
            accept: "application/json",
            authorization: `Bearer ${token}`,
        },
    });

    const passStatus = await lookupResponse.json();
    console.log(passStatus);
})().catch((error) => console.error(error));