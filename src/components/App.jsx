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
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export function App() {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [newGameName, setNewGameName] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const theme = createTheme();

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((userData) => {
        setUsers(userData);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedUserId) {
          return;
        }

        const response = await fetch(
          `http://localhost:5000/data/${selectedUserId}`
        );
        if (response.ok) {
          const gameData = await response.json();
          setData(gameData);
          setSortedData([...gameData]);
        } else {
          console.error("Error fetching games:", response.status);
        }
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchData();
  }, [selectedUserId]);

  const addGame = async () => {
    try {
      if (newGameName.trim() === "") {
        console.warn("ゲーム名を入力してください");
        return;
      }
      const response = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newGameName, userId: selectedUserId }),
      });

      if (response.ok) {
        await fetchAndSetGameData(selectedUserId);
        setNewGameName("");
      }
    } catch (error) {
      console.error("追加できませんでした:", error);
    }
  };

  const addUser = async () => {
    try {
      if (newUserName.trim() === "") {
        console.warn("ユーザー名を入力してください");
        return;
      }

      const response = await fetch("http://localhost:5000/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUserName }),
      });

      if (response.ok) {
        await fetchAndSetUserData();
        setNewUserName("");
      }
    } catch (error) {
      console.error("ユーザーを追加できませんでした:", error);
    }
  };

  const fetchAndSetUserData = async () => {
    try {
      const newUsersResponse = await fetch("http://localhost:5000/users");
      if (newUsersResponse.ok) {
        const newUsers = await newUsersResponse.json();
        setUsers(newUsers);
        setSelectedUserId(newUsers[newUsers.length - 1].id);
        await fetchAndSetGameData(newUsers[newUsers.length - 1].id);
      }
    } catch (error) {
      console.error("ユーザーデータの取得エラー:", error);
    }
  };

  const fetchAndSetGameData = async (userId) => {
    try {
      const newDataResponse = await fetch(
        `http://localhost:5000/data/${userId}`
      );
      if (newDataResponse.ok) {
        const newData = await newDataResponse.json();
        setSortedData([...newData]);
        setData(newData);
      }
    } catch (error) {
      console.error("ゲームデータの取得エラー:", error);
    }
  };

  const handleDeleteGame = async (gameId) => {
    try {
      const response = await fetch(`http://localhost:5000/delete/${gameId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // データが更新されるのを待ってからもう一度データをフェッチ
        await fetchAndSetGameData(selectedUserId);
      } else {
        console.error("削除できませんでした:", response.status);
      }
    } catch (error) {
      console.error("削除できませんでした:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ userSelect: "none" }}>
        <AppBar position="static">
          <Toolbar>
            <h1>積みゲー記録</h1>
          </Toolbar>
        </AppBar>

        <div>
          <div style={{ margin: "10px" }}>
            <div style={{ margin: "10px" }}>
              {/* ユーザー追加 */}
              <TextField
                label="新しいユーザーを入力"
                variant="outlined"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                style={{ marginRight: "5px" }}
              />
              <Button
                style={{
                  background: "#FFA500",
                  color: "white",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  verticalAlign: "middle",
                }}
                onClick={addUser}
              >
                追加
              </Button>
            </div>
            <div style={{ margin: "10px" }}>
              {/* ユーザー選択 */}
              <FormControl style={{ width: "200px" }}>
                <InputLabel id="user-select-label">ユーザー選択</InputLabel>
                <Select
                  labelId="user-select-label"
                  id="user-select"
                  value={selectedUserId}
                  label="ユーザー選択"
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  style={{ marginRight: "5px" }}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* ゲーム追加*/}
              <TextField
                label="ゲーム名を入力"
                variant="outlined"
                value={newGameName}
                onChange={(e) => setNewGameName(e.target.value)}
                style={{ marginRight: "5px" }}
              />
              <Button
                disabled={newGameName.trim() === ""}
                style={{
                  background: "#FFA500",
                  color: "white",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  verticalAlign: "middle",
                }}
                onClick={addGame}
              >
                追加
              </Button>
            </div>
          </div>

          {/* ゲーム一覧 */}
          <Paper elevation={10} style={{ margin: "10px" }}>
            <TableContainer style={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        color: "#ffffff",
                        backgroundColor: "#4caf50",
                      }}
                    >
                      ゲーム名
                    </TableCell>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        color: "#ffffff",
                        backgroundColor: "#4caf50",
                      }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteGame(item.id)}
                        >
                          クリアした！
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
