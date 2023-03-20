import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import AddForm from "./AddDialog";


export default function Grid() {

  const [loginData, setLoginData] = React.useState({});
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({
    name: "",
    place: "",
    time: "",
    gender: "",
    parentName: ""
  });
  const [submitData, setSubmitData] = React.useState([]);

  React.useEffect(() => {
    if(loginData.token){
    
      fetch("http://localhost:4000/channels/mychannel/chaincodes/birthcert?args=[]", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + loginData.token
      }
    })
      .then((response) => response.json())
      .then((json) => setRows(json))
      .catch((error) => console.log(error));
    }



    
  }, [loginData]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/channels/mychannel/chaincodes/birthcert", {
      method: "POST",
      body: JSON.stringify({
            
              "name":data.name,
              "place":data.place,
              "time":data.time,
              "gender":data.gender,
              "parentName":data.parentName
      }),
      headers: {
        'Authorization': 'Bearer ' + loginData.token,
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then((res) => res.json())
      .then((resData) => {
        setSubmitData((data) => [resData, ...data]);
        handleClose();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  
  React.useEffect(() => {
    fetch("http://localhost:4000/users", {
      method: "POST",
      body: JSON.stringify({
        "username":"user",
        "orgName":"Org1"
    }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((res) => res.json())
      .then((resData) => {
        setLoginData(resData)
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  console.log("loginData", loginData);
  return (
    <div>
      {/* {JSON.stringify(data)}; */}
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add
      </Button>
      <AddForm
        open={open}
        handleChange={handleChange}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Place</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Parents Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.place}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell>{row.parentsName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
