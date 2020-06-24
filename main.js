var fs = require("fs");
const fetch = require("node-fetch");

async function fetchData() {
  const response = await fetch(
    "https://www.freelancer.com/api/projects/0.1/projects/all?limit=100&offset=1&compact=true",
    {
      method: "GET",
      headers: {
        "freelancer-oauth-v1": "token here",
        "Content-Type": "application/json",
      },
    }
  );
  const responseObject = await response.json();

  if (responseObject.status === "success") {
    const file = fs.readFileSync("freelancer.json", "utf8");
    const obj = JSON.parse(file);

    console.log(`Found ${responseObject.result.total_count} entries`);
    responseObject.result.projects.forEach((p, i) => {
      obj.data.push({
        id: p.id,
        title: p.title,
        description: p.preview_description,
        budget: {
          minimum: p.budget.minimum,
          maximum: p.budget.maximum,
        },
        currency: p.currency.code,
        time: p.time_submitted,
        language: p.language,
        location: p.location.country.code,
      });
    });

    const json = JSON.stringify(obj);
    fs.writeFileSync("freelancer.json", json, "utf8");
  }
}

fetchData();
