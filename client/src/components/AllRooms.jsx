import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Button } from '@mui/material';
import Slider from 'react-slick'; // Ensure you have react-slick and slick-carousel installed
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import WifiIcon from '@mui/icons-material/Wifi';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import BathtubIcon from '@mui/icons-material/Bathtub';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from 'antd';
import Swal from 'sweetalert2';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';


const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedRoom, setEditedRoom] = useState({
    name: '',
    description: '',
    maxCount: '',
    rentPerDay: '',
    imageUrls: [''],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageIndices, setImageIndices] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const availableFacilities = [
    "Free Wi-Fi",
    "Minibar",
    "Shower WC",
    "Bathrobe",
    "In-room Digital Safe",
    "Iron and Iron Board",
  ];
  
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setError("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleEdit = (room) => {
    setEditMode(room._id);
    setEditedRoom({
      name: room.name || '',
      description: room.description || '',
      maxCount: room.maxCount || '',
      rentPerDay: room.rentPerDay || '',
      imageUrls: room.imageUrls && room.imageUrls.length > 0 ? room.imageUrls : [''],
    });
    setDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // Close the dialog
    setEditMode(null); // Reset edit mode
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/api/rooms/${editMode}`, editedRoom);
      setRooms((prevRooms) =>
        prevRooms.map((room) => (room._id === editMode ? response.data : room))
      );
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Room updated successfully!',
      });
      handleCloseDialog();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update room.',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRoom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFacilityChange = (event, newFacilities) => {
    setEditedRoom((prev) => ({
      ...prev,
      facilities: newFacilities,
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  
  const handleUpdate = async (roomId) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/rooms/${roomId}`, editedRoom);
      setRooms((prevRooms) =>
        prevRooms.map((room) => (room._id === roomId ? response.data : room))
      );
      setEditMode(null); 
    } catch (error) {
      console.error("Error updating room:", error.response ? error.response.data : error.message);
      setError("Failed to update room");
    }
  };
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleImageChange = (roomId, direction) => {
    setImageIndices((prev) => ({
      ...prev,
      [roomId]: direction === 'next'
        ? (prev[roomId] + 1) % editedRoom.imageUrls.length
        : (prev[roomId] - 1 + editedRoom.imageUrls.length) % editedRoom.imageUrls.length,
    }));
  };

  const handleDelete = async (roomId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this room?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/api/rooms/${roomId}`);
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
      alert("Room deleted successfully");
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Failed to delete room");
    }
  };

  // Function to add a new image input
  const addImageInput = () => {
    setEditedRoom((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ''], 
    }));
  };

  // Function to handle changes to image URLs
  const handleImageUrlChange = (index, value) => {
    const updatedImages = [...editedRoom.imageUrls];
    updatedImages[index] = value; 
    setEditedRoom((prev) => ({ ...prev, imageUrls: updatedImages }));
  };

  // Function to delete a specific image URL
  const deleteImageUrl = (index) => {
    const updatedImages = [...editedRoom.imageUrls];
    updatedImages.splice(index, 1); 
    setEditedRoom((prev) => ({ ...prev, imageUrls: updatedImages }));
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setOpenDialog(true);
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

const facilityIcons = {
  "Free Wi-Fi": <WifiIcon />,
  "Minibar": <FreeBreakfastIcon />,
  "Shower WC": <BathtubIcon />,
  "Bathrobe": <LocalLaundryServiceIcon />,
  "In-room Digital Safe": <SafetyCheckIcon />,
  "Iron and Iron Board": <LocalLaundryServiceIcon />,
};

  return (
    <div>
      <Typography.Title level={2} style={{ textAlign: 'center', margin: '2vh 0', color: '#031d42', fontWeight: 'bold', fontSize: '35px'}}>
        All Rooms
      </Typography.Title>
      <Grid container spacing={3} style={{ padding: '1vh 1vw' }}>
        {rooms.map((room) => (
        <Grid item key={room._id} xs={12} sm={6} md={4}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'left',
              height: '65vh',
              boxSizing: 'border-box',
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              paddingBottom: '1vh',
              
              backgroundColor: '#fff',
            }}
            onClick={() => handleRoomClick(room)}
                onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0px 8px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <Slider {...settings} style={{ width: '100%', height: '38%' }}>
              {room.imageUrls && Array.isArray(room.imageUrls) && room.imageUrls.length > 0 ? (
                room.imageUrls.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`${room.name} ${index}`}
                      style={{
                        width: '100%',
                        height: '30vh',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '10px' }}>
                  <p>No images available</p>
                </div>
              )}
            </Slider>
              <p 
                style={{
                  position: 'relative',
                  top: '-22vh',
                  left: '1.5vw',
                  zIndex: '1',
                  backgroundColor: 'rgba(0, 0, 50, 0.8)',
                  color: '#fff',
                  width: 'fit-content',
                  padding: '4px 8px',
                }}
              >
                {room.type}
              </p>
              <div style={{ height: '55%', padding: '1vh 1vw' }}>
                <h3
                  style={{
                    margin: '2vh 0vw 1vh 0vw',
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    color: '#333',
                  }}
                >
                  {room.name}
                </h3>
                <p
                  style={{
                    margin: '0 1vw 0 0vw',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    color: '#555',
                  }}
                >
                  {room.description}
                </p>
                <div style={{ backgroundColor: '#0A369D', height: '5px', width: '20%', margin: '1vh 0 1vh 0' }}></div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: '0.6vw',
                    alignItems: 'center',
                    overflowX: 'auto',
                    width: '100%',
                    height: '30%',
                  }}
                >
                  {room.facilities && Array.isArray(room.facilities) && room.facilities.map((facility, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '5vw',
                        maxWidth: '6vw',
                        flexShrink: 0,
                      }}
                    >
                      {facilityIcons[facility]}
                      <span style={{ fontSize: '0.8rem', marginTop: '4px', textAlign: 'center' }}>
                        {facility}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'left', marginTop: '1vh' }}>
                <Button
                  onClick={() => handleEdit(room)}
                  variant="contained"
                  color="secondary"
                  startIcon={<EditOutlinedIcon />}
                  style={{ color: '#072d8f' , backgroundColor: 'white', border: '1px solid #072d8f' }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(room._id)}
                  variant="contained"
                  startIcon={<DeleteOutlineOutlinedIcon />}
                  style={{ color: 'red', backgroundColor: 'white', border: '1px solid red' }}
                >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle style={{ fontSize: '25px', textAlign: 'center'}}>Edit Room Details</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={editedRoom.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            value={editedRoom.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Max Count"
            name="maxCount"
            fullWidth
            value={editedRoom.maxCount}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Rent Per Day"
            name="rentPerDay"
            fullWidth
            value={editedRoom.rentPerDay}
            onChange={handleInputChange}
          />
          <Autocomplete
            multiple
            options={availableFacilities}
            getOptionLabel={(option) => option}
            value={editedRoom.facilities}
            onChange={handleFacilityChange}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  color="primary"
                  variant="outlined"
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Facilities"
                placeholder="Select facilities"
                margin='dense'
              />
            )}
          />
        </DialogContent>
        <DialogActions style={{ padding: '0vh 2vw 3vh 0' }}>
          <Button onClick={handleCloseDialog} style={{ border: '1px solid #072d8f', color: '#072d8f' }}>
            Cancel
          </Button>
          <Button onClick={handleSave}  style={{ border: '1px solid #072d8f', color: 'white', backgroundColor: '#072d8f' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllRooms;
