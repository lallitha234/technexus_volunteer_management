// Simple test script to call volunteer API
const data = {
  full_name: "Test Volunteer",
  email: "test@example.com",
  phone: "+1-555-0123",
  pronouns: "they/them",
  bio: "Test bio",
  admin_notes: "Test notes",
  status: "active",
  skills: ["Event Planning", "Marketing"],
  interests: ["Education", "Community Service"],
  availability_weekdays: ["Monday", "Wednesday"],
  availability_time_slots: ["Morning (9am-12pm)"],
  consent_contact: true,
  consent_photo: false,
};

console.log("Testing POST /api/volunteers");
console.log("Payload:", JSON.stringify(data, null, 2));

fetch("http://localhost:3000/api/volunteers", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
})
  .then((res) => {
    console.log("\nResponse Status:", res.status, res.statusText);
    return res.json();
  })
  .then((json) => {
    console.log("Response Body:", JSON.stringify(json, null, 2));
  })
  .catch((err) => {
    console.error("Error:", err);
  });
