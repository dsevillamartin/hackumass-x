const sdk = require("node-appwrite");
const ical = require('ical-generator');
const fs = require('fs');

/*
'req' variable has:
'headers' - object with request headers
'payload' - request body data as a string
'variables' - object with function variables

'res' variable has:
'send(text, status)' - function to return text response. Status code defaults to 200
'json(obj, status)' - function to return JSON response. Status code defaults to 200

If an error is thrown, a response with code 500 will be returned.
*/

const process = async (storage, documents, userId) => {
  console.log('* Processing', documents.length, 'documents')

  const events = [];

  for (const document of documents) {
    try {
      const { name, notes, start_time, end_time, location } = document;
      events.push({
        summary: name,
        description: notes,
        start: start_time,
        end: end_time,
        location,
        url: 'https://blahgenda.tech/calendar',
      });
    } catch (e) {
      console.error('Failed processing document for', userId, document, e);
      return res.json({ error: true });
    }
  };

  const calendar = ical({name: 'Blahgenda.tech', events });
  
  fs.writeFileSync(`${__dirname}/user-${userId}.ics`, calendar.toString());    
  
  await storage.createFile('6370291502dec4fa9083', userId, sdk.InputFile.fromPath(`${__dirname}/user-${userId}.ics`, `user-${userId}.ics`));
  
  console.log('* Uploaded for', userId, ' (', events.length, ')');
}

module.exports = async function (req, res) {
  const client = new sdk.Client();
  
  // You can remove services you don't use
  const account = new sdk.Account(client);
  const avatars = new sdk.Avatars(client);
  const database = new sdk.Databases(client);
  const functions = new sdk.Functions(client);
  const health = new sdk.Health(client);
  const locale = new sdk.Locale(client);
  const storage = new sdk.Storage(client);
  const teams = new sdk.Teams(client);
  const users = new sdk.Users(client);
  
  if (
    !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.variables['APPWRITE_FUNCTION_API_KEY']
    ) {
      console.warn("Environment variables are not set. Function cannot use Appwrite SDK.");
    } else {
      client
      .setEndpoint('https://api.blahgenda.tech/v1')
      .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
      .setKey(req.variables['APPWRITE_FUNCTION_API_KEY'])
      .setSelfSigned(true);
    }
    
    const payload = req.payload.length > 10 && JSON.parse(req.payload);

    // if event
    const eventData = req.variables['APPWRITE_FUNCTION_EVENT_DATA'] || "{}";
    const userId = payload?.userId || JSON.parse(eventData)?.$id;
    
    console.log('--> Fetching for', userId || 'ALL')
    
    const query = userId ? [
      sdk.Query.equal('user_id', userId),
      sdk.Query.limit(100),
    ] : [
      sdk.Query.limit(100),
    ];
    const allUsers = userId ? null : await users.list();
    const documents = await database.listDocuments('636f5b6eafb4f87bc2a5', '636f5ba37013c90ca3fb', query);
    
    if (userId) {
      process(storage, documents.documents, userId);
    } else {
      const users = documents.documents.reduce((groups, item) => {
        const group = (groups[item.user_id] || []);
        group.push(item);
        groups[item.user_id] = group;
        return groups;
      }, {});

      console.log('--> Processing', Object.keys(users).length, 'users');

      await Promise.all(
        allUsers.users.map(doc => {
          const id = doc.$id;
          console.log('======= Processing User ID', id, ' (' + (users[id] || []).length + ') =======');
          return process(storage, users[id] || [], id);
        })
      )

    }
    
    res.json({
      areDevelopersAwesome: true,
    });
  };
  