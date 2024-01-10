import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export function App() {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [newGameName, setNewGameName] = useState("");
  const theme = createTheme();

  useEffect(() => {
    fetch("http://localhost:5000/data")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setSortedData([...data].sort());
      })
      .catch((error) => console.error("Error!!", error));
  }, []);

  console.log(data);
  const addGame = async () => {
    try {
      const response = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newGameName }),
      });

      if (response.ok) {
        const newDataResponse = await fetch("http://localhost:5000/data");
        if (newDataResponse.ok) {
          const newData = await newDataResponse.json();
          setSortedData([...newData].sort());
          setData(newData);
        }
        setNewGameName("");
      }
    } catch (error) {
      console.error("追加できませんでした:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="static">
          <Toolbar>
            <h1>積みゲー記録</h1>
          </Toolbar>
        </AppBar>

        <div>
          <TextField
            label="新しい積みゲー"
            variant="outlined"
            value={newGameName}
            onChange={(e) => setNewGameName(e.target.value)}
          />
          <Button onClick={addGame}>追加</Button>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ゲーム名</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
