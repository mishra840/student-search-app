import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isUserSelecting, setIsUserSelecting] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce effect, preventing unnecessary API calls
  useEffect(() => {
    if (isUserSelecting || selected) return; // Stop debouncing if user selects something

    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    },1000);

    return () => clearTimeout(timer);
  }, [query, isUserSelecting, selected]);

  // API call to fetch results
  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      axios
        .get(`http://localhost:5000/api/students?q=${debouncedQuery}`)
        .then((res) => setResults(res.data));
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        placeholder="Search student"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected(null);
          setIsUserSelecting(false); // Ensure user is typing
        }}
      />

      {/* Display search results only when there are results & no selection */}
      {results.length > 0 && !selected && (
        <ul className={styles.results}>
          {results.map((s, i) => (
            <li
              className={styles.resultItem}
              key={i}
              onClick={() => {
                setSelected(s);
                setQuery(s.name); // Update input with selected name
                setResults([]); // Clear dropdown results instantly
                setIsUserSelecting(true); // Mark selection state
                setDebouncedQuery(""); // Stop debounce updates
                setTimeout(() => setIsUserSelecting(false), 500); // Reset after short delay
              }}
            >
              <strong>{s.name.substring(0, debouncedQuery.length)}</strong>
              {s.name.substring(debouncedQuery.length)}
            </li>
          ))}
        </ul>
      )}

      {/* Display selected student's details */}
      {selected && (
        <div className={styles.selected}>
          <h3>Student Details</h3>
          <p>
            <b>Name:</b> {selected.name}
          </p>
          <p>
            <b>Class:</b> {selected.class}
          </p>
          <p>
            <b>Roll Number:</b> {selected.rollNumber}
          </p>
        </div>
      )}
    </div>
  );
}
