// Create an authentication provider
const authProvider = {
    getAccessToken: async () => {
        // Call getToken in auth.js
        return await getToken();
    }
};
// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });
//Get user info from Graph
async function getUser() {
    ensureScope('user.read');
    return await graphClient
        .api('/me')
        .select('id,displayName,mail')
        .get();
}

//Get user photo from Graph
async function getUserPhoto() {
    ensureScope('user.read');
    return await graphClient
        .api('/me/photo/$value')
        .get();
}

//Get user emails from Graph
async function getUserEmails(nextLink) {
    ensureScope('mail.read');
    if(nextLink) {
        return await graphClient
        .api(nextLink)
        .get()
    } else {
        return await graphClient
        .api('/me/messages')
        .select('subject,receivedDateTime')
        .orderby('receivedDateTime desc')
        .top(10)
        .get();   
    }
}

