const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
const getStudents = () => {
  const data = fs.readFileSync(path.join(__dirname, "data", "students.json"), "utf8");
  return JSON.parse(data);
};

app.get("/api/students", (req, res) => {
  const query = req.query.q?.toLowerCase();
  if (!query || query.length < 3) return res.json([]);

  const students = getStudents();
  const results = students
    .filter((student) => student.name.toLowerCase().includes(query))
    .slice(0, 5);
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
