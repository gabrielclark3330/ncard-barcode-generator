import { useState } from "react";
import Header from "./Header";
import StudentCard from "./StudentCard";

function App() {
  const [students, setStudents] = useState([]);

  return (
    <div className="App">
      <Header setStudents={setStudents} />
      {students.map(function (student, i) {
        return <StudentCard key={i} studentName={student[0]} studentURL={student[1]}/>; 
      })}
    </div>
  );
}

export default App;
