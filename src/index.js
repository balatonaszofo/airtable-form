export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/submit") {
      await submitHandler(request, env);
    }
    return new Response("Not found", { status: 404 });
  },
};

async function submitHandler(request, env) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
    });
  }
  const body = await request.formData();

  const { email } =
    Object.fromEntries(body);

  const reqBody = {
    fields: {
      "Email": email
    },
  };
  await createAirtableRecord(env, reqBody);
}

async function createAirtableRecord(env, body) {
  try {
    const result = fetch(
      `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${encodeURIComponent(env.AIRTABLE_TABLE_NAME)}`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${env.AIRTABLE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );
    return result;
  } catch (error) {
    console.error(error);
  }
}