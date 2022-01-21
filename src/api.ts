const baseUrl = "https://api.airtable.com/v0/appDnoU4THPFBgVIr";
const token = "keyOE5FWfkul67dm0";

const authenticationHeader = {
  Authorization: `Bearer ${token}`,
};

const get = (path: string) =>
  fetch(`${baseUrl}${path}`, { headers: authenticationHeader })
    .then((res) => res.json())
    .then((res) => res.records.map((r: { fields: unknown[] }) => r.fields));

export const getTrips = async () => await get("/Trips");
