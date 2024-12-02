import React, { useState, useEffect } from "react";
import { Grid, TextField, InputAdornment, Box, Typography, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ServiceCard from "./components/ServiceCard";
import UserNavbar from "./components/UserNavbar";
import axios from "axios";
import { useService } from "../../context/ServicesContext";
import API_URL from "../../config";

const useStyles = {
  searchBox: {
    margin: "10px 0",
    width: "100%",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px",
  },
  horizontalServicesContainer: {
    display: "flex",
    overflowX: "auto", // Horizontal scrolling for smaller screens
    gap: "10px",
    paddingBottom: "10px",
    borderBottom: "1px solid #ddd",
  },
  verticalServicesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    borderRight: "1px solid #ddd",
    paddingRight: "10px",
  },
  serviceBox: {
    flexShrink: 0, // Prevent shrinking in the horizontal scroll
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: "10px",
  },
};

function UserHome() {
  const [refresh, setRefresh] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all service");
  const [services, setServices] = useState([]);
  const [servicesName, setServicesName] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(16);

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:960px) and (min-width:601px)");
  const isLargeScreen = useMediaQuery("(min-width:961px)");

  const triggerRefresh = () => setRefresh(!refresh);

  const { service } = useService();

  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const filteredServices = services
    .filter(
      (service) =>
        (selectedCategory === "all service" || service.serv_Name?.toLowerCase() === selectedCategory) &&
        service.servSubType_Name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, visibleCount);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/serviceSubTypes`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchServicesName = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/service/all`);
        setServicesName(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServicesName();
  }, []);

  const handleClick = (serv_Name) => setSelectedCategory(serv_Name.toLowerCase());
 // Infinite Scroll Handler
 const handleScroll = () => {
  const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  if (bottom) {
    setVisibleCount((prev) => prev + 17); // Load 12 more items
  }
};

useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll); // Cleanup listener
}, []);
  const renderServiceBox = (service, index) => (
    <Box
      key={index}
      onClick={() => handleClick(service.name)}
      style={{
        ...useStyles.serviceBox,
       
      }}
    >
      <img
        src={service.img}
        alt={service.name}
        style={{
          width: isSmallScreen ? "40px" : "60px",
          height: isSmallScreen ? "40px" : "60px",
          objectFit: "cover",
          borderRadius: "50%",
          marginBottom: "5px",
          border: selectedCategory === service.name.toLowerCase() ? "2px solid #2790f5" : "2px solid transparent",
        }}
      />
      <Typography variant="caption" style={{ fontSize: isSmallScreen ? "10px" : "12px", textAlign: "center" }}>
        {service.name}
      </Typography>
    </Box>
  );

  return (
    <>
      <UserNavbar />

      <div style={useStyles.mainContainer}>
        {/* Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search for Products, Services, and More"
          value={searchTerm}
          onChange={handleSearchChange}
          style={useStyles.searchBox}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={2}>
          {/* Render Horizontal Services for xs and sm screens */}
          {(isSmallScreen || isMediumScreen) && (
            <Grid item xs={12}>
              <div style={useStyles.horizontalServicesContainer}>
                {[{ name: "All Service", img: "http://136.185.14.8:8099/uploads/service.png" }]
                  .concat(
                    servicesName.map((service) => ({
                      name: service.serv_Name,
                      img: `${API_URL}/uploads/product-images/${service.imagefile}`,
                    }))
                  )
                  .map(renderServiceBox)}
              </div>
            </Grid>
          )}

          {/* Render Vertical Services for md and lg screens */}
          {isLargeScreen && (
            <Grid item md={1}>
              <div style={useStyles.verticalServicesContainer}>
                {[{ name: "All Service", img: "http://136.185.14.8:8099/uploads/service.png" }]
                  .concat(
                    servicesName.map((service) => ({
                      name: service.serv_Name,
                      img: `${API_URL}/uploads/product-images/${service.imagefile}`,
                    }))
                  )
                  .map(renderServiceBox)}
              </div>
            </Grid>
          )}

          {/* Products Section */}
          <Grid
            item
            xs={12} // Full width for product section
            md={isLargeScreen ? 11 : 12} // Adjust width based on vertical services
          >
            <Grid container spacing={2}>
              {filteredServices.map((service) => (
                <Grid
                item
                xs={6} // 50% width on extra-small screens (2 cards per row)
                sm={4} // 33.33% width on small screens (3 cards per row, optional)
                md={3}
                lg={1.5} // 12 / 1.5 = 8 cards per row on medium+ screens
                key={service.servSubType_Id}
              >
                <ServiceCard triggerRefresh={triggerRefresh} refresh={refresh} service={service} />
              </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default UserHome;
