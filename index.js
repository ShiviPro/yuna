const express = require("express");
const cors = require("cors");
const { initialiseDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotel.models");
require("dotenv").config();

initialiseDatabase();
const app = express();
app.use(express.json());
const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));

const readAllHotels = async () => {
  try {
    const allHotels = await Hotel.find();
    return allHotels;
  } catch (error) {
    throw error;
  }
};

app.get("/hotels", async (req, res) => {
  try {
    const allHotels = await readAllHotels();

    allHotels.length > 0
      ? res.json(allHotels)
      : res.status(404).json({ error: "No hotels found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels!" });
  }
});

const readHotelByName = async (name) => {
  try {
    const desiredHotel = await Hotel.findOne({ name: name });
    return desiredHotel;
  } catch (error) {
    throw error;
  }
};

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotelName = req.params.hotelName;
    const hotel = await readHotelByName(hotelName);

    hotel
      ? res.json(hotel)
      : res.status(404).json({ error: "Hotel not found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel!" });
  }
});

const readHotelByPhoneNumber = async (phoneNumber) => {
  try {
    const desiredHotel = await Hotel.findOne({ phoneNumber: phoneNumber });
    return desiredHotel;
  } catch (error) {
    throw error;
  }
};

app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotelPhoneNum = req.params.phoneNumber;
    const hotel = await readHotelByPhoneNumber(hotelPhoneNum);

    hotel
      ? res.json(hotel)
      : res.status(404).json({ error: "Hotel not found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel!" });
  }
});

const readHotelsByRating = async (rating) => {
  try {
    const desiredHotels = await Hotel.find({ rating: rating });
    return desiredHotels;
  } catch (error) {
    throw error;
  }
};

app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotelsRating = req.params.hotelRating;
    const hotels = await readHotelsByRating(hotelsRating);

    hotels.length > 0
      ? res.json(hotels)
      : res.status(404).json({ error: "No hotels found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels!" });
  }
});

const readHotelsByCategory = async (category) => {
  try {
    const desiredHotels = await Hotel.find({ category: { $in: [category] } });
    return desiredHotels;
  } catch (error) {
    throw error;
  }
};

app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotelsCategory = req.params.hotelCategory;
    const hotels = await readHotelsByCategory(hotelsCategory);

    hotels.length > 0
      ? res.json(hotels)
      : res.status(404).json({ error: "No hotels found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels!" });
  }
});

const createHotel = async (hotelData) => {
  try {
    const newHotel = new Hotel(hotelData);
    const savedHotel = await newHotel.save();
    return savedHotel;
  } catch (error) {
    throw error;
  }
};

app.post("/hotels", async (req, res) => {
  try {
    const hotelData = req.body;
    const savedHotel = await createHotel(hotelData);
    res
      .status(201)
      .json({ message: "Hotel added successfully.", hotel: savedHotel });
  } catch (error) {
    res.status(500).json({ error: "Failed to add hotel!" });
  }
});

const deleteHotelById = async (hotelId) => {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
    return deletedHotel;
  } catch (error) {
    throw error;
  }
};

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const deletedHotel = await deleteHotelById(hotelId);
    deletedHotel
      ? res.json({
          message: "Hotel deleted successfully.",
          hotel: deletedHotel,
        })
      : res.status(404).json({ error: "Hotel not found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete hotel!" });
  }
});

const updateHotel = async (hotelId, updateData) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updateData, {
      new: true,
    });
    return updatedHotel;
  } catch (error) {
    console.log("Error updating Hotel:", error);
  }
};

app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const updateData = req.body;
    const updatedHotel = await updateHotel(hotelId, updateData);

    updatedHotel
      ? res.json({
          message: "Hotel updated successfully.",
          updatedHotel: updatedHotel,
        })
      : res.status(404).json({ error: "Hotel not found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update hotel!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
