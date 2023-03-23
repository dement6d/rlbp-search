const bearer = 'eyJraWQiOiJhYzg0YSIsImFsZyI6IkhTMjU2In0.eyJ4dWlkIjoiMjUzNTQwNjQ0NDg5Nzk1MyIsImFnZyI6IkFkdWx0Iiwic3ViIjoiNWQxZmVlOTItNTQ3OS00ZTc2LTg0M2ItNzUwMmFiNDg4NzI2IiwiYXV0aCI6IlhCT1giLCJucyI6ImRlZmF1bHQiLCJyb2xlcyI6W10sImlzcyI6ImF1dGhlbnRpY2F0aW9uIiwicGxhdGZvcm0iOiJVTktOT1dOIiwieXVpZCI6ImY0ZmZmZWY2N2FhZjY0N2E5NmQwNWUwZjU0ZjAxMjg4IiwibmJmIjoxNjc5NTExMTA4LCJleHAiOjE2Nzk1OTc1MDgsImlhdCI6MTY3OTUxMTEwOH0.P7yfRDtPYmN4W8UChNhzHV0YmpIZWi1e6rl06rsOo3U'
const numberOfRequests = 100;



// Change these
const api = 'https://minecraftapi-bef7bxczg0amd8ef.z01.azurefd.net'
const endpoint = '/minecraft/profile'
const headers: Headers = new Headers({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${bearer}`,
  'X-Forwarded-For': 'api.minecraftservices.com'
})
const body = { profileName: 'test' }



const results: Response[] = [];

async function createProfile() {
  const res = await fetch(api + endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    headers
  });
  if (res.status === 401) {
    console.log('Bearer expired')
    process.exit(-1);
  }
  if (res.status === 404) {
    console.log(`Endpoint "${endpoint}" not found`)
    process.exit(-1);
  }
  results.push(res);
  if (results.length === numberOfRequests)
    printResults();
}

async function printResults() {
  const jsons = await Promise.all(results.map(async res => await res.json().catch(() => {})))
  const successful = jsons.filter(json => json.details?.status === 'DUPLICATE');
  const ratelimited = results.filter(res => res.status === 429);
  console.log(`${successful.length} successful attempts, ${ratelimited.length} ratelimited`)
}

for (let i = 0; i < numberOfRequests; i++)
  createProfile();