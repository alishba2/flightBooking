const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const axios = require('axios');
const stripe = require('stripe')('sk_test_51Psj5C07GQO3xPIPEokNEfMCnYar4RclEbMFyBXJDYAR2CnOPsXczCbsw3hX8TPxkUw1uSOorAmoTl4Wo4sOl1yQ00mksVWTMa'); // Your Stripe Secret Key
const cron = require('node-cron');
const FlightNotification = require('./models/FlightNotification');
const Notification = require('./models/Notification');
const { OAuth2Client } = require('google-auth-library');


const app = express();
const PORT = 5000;

const googleClient = new OAuth2Client('785108943658-4g9405tqmbl633dqf6l29qccvu8o1p3r.apps.googleusercontent.com');


// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/aerooptimize')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Stripe Checkout Session Route
app.post('/create-checkout-session', async (req, res) => {
  const { price, currency } = req.body; // Extract price and currency from the request

  try {
    const amountInCents = Math.round(price * 100);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency || 'usd',
          product_data: {
            name: 'Flight Booking',
          },
          unit_amount: amountInCents  // Convert price to cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:3000/',  // Redirect after successful payment
      cancel_url: 'http://localhost:3000/confirmation',    // Redirect after canceled payment
    });

    res.json({
      id: session.id,  // Send session ID to client for redirect
    });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ error: 'Something went wrong creating the Stripe session' });
  }
});

// Define the User Schema
const userSchema = new mongoose.Schema({
  fullName: String,
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  mobile: String,
  password: { type: String, required: true },
  otp: String,
  otpExpires: Date,
});

const User = mongoose.model('User', userSchema);

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aadidaa609@gmail.com',
    pass: 'hdwl irga ccrt lkib'
  }
});

// Forgot Password Route (Send OTP via Email)
app.post('/forgot-password-check', async (req, res) => {
  const { email, mobile } = req.body;

  try {
    // Check if both email and mobile exist in the database
    const user = await User.findOne({ email, mobile });
    if (!user) {
      return res.status(400).json({ message: 'User not found with the provided email and phone number.' });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP and expiration in the database
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    await user.save();

    // Configure email options
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: user.email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    };

    // Send the email with OTP
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'OTP sent to your email address.' });
      }
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Verify OTP Route
app.post('/verify-otp', async (req, res) => {
  const { email, mobile, otp } = req.body;

  try {
    // Find the user based on both email and mobile, and check the OTP
    const user = await User.findOne({ email, mobile, otp });

    // Check if the user and OTP exist and are valid
    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP or user not found.' });
    }

    // Check if the OTP has expired
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Expired OTP.' });
    }

    // Clear the OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // If OTP is valid, send a success response
    res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});


// Reset Password Route
app.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});



// Reset Password Route
app.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Signup Route
app.post('/signup', async (req, res) => {
  const { fullName, username, email, mobile, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      username,
      email,
      mobile,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    // Check whether user is logging in via email or phone
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ mobile: phone });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid email/phone or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email/phone or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Google OAuth Login Route
app.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: '785108943658-4g9405tqmbl633dqf6l29qccvu8o1p3r.apps.googleusercontent.com', // Replace with your Google Client ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Check if user exists in database
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({
        fullName: name,
        email,
        username: email,
        password: googleId,  // Set Google ID as password (you can manage this differently)
      });
      await user.save();
    }

    res.status(200).json({
      message: 'Google login successful',
      user: {
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

// Route to fetch user details
app.get('/user-details', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
    });
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Update user details route
app.post('/update-user', async (req, res) => {
  const { email, fullName, username, password, mobile } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fullName = fullName;
    user.username = username;
    user.mobile = mobile;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// RapidAPI: Search Flights Route
app.get('/search-flights', async (req, res) => {
  const { departure, destination, date, passengers, travelClass, currency } = req.query;

  const options = {
    method: 'GET',
    url: 'https://flight-fare-search.p.rapidapi.com/v2/flights/',
    params: {
      from: departure,
      to: destination,
      date: date,
      adult: passengers,
      type: travelClass || 'economy',
      currency: currency || 'USD'
    },
    headers: {
      'x-rapidapi-key': '6b3827e649msh2ca5197a9a43d06p18ccd4jsnb0bf3777c854', // Replace with your RapidAPI key
      'x-rapidapi-host': 'flight-fare-search.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);  // Send flight data back to client
  } catch (error) {
    console.error('Error fetching flight data:', error);
    res.status(500).json({ message: 'Failed to fetch flight data' });
  }
});



/// subscribe to notifications
app.post('/subscribe-flight-notifications', async (req, res) => {
  console.log(req.body, "req body in subscribe notificationsssss");
  const { from, to, date, passengers, travelClass, currency, lowestPrice, userId } = req.body;

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required to subscribe to notifications.' });
  }

  try {
    // Save the notification details in the database, including the userId
    const flightAlert = new FlightNotification({
      userId,  // Store the userId
      queryDetails: {
        from,
        to,
        date,
        passengers,
        travelClass,
        currency,
      },
      previousPrice: lowestPrice,
      createdAt: new Date(),
    });

    await flightAlert.save();
    res.status(200).json({ message: 'Notification subscription saved successfully!' });
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    res.status(500).json({ message: 'Failed to subscribe to notifications.' });
  }
});




// Get subscriptions by userId
app.get('/subscriptions/:userId', async (req, res) => {
  const { userId } = req.params;

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    // Find all flight notifications for the given user ID
    const userSubscriptions = await FlightNotification.find({ userId });

    if (userSubscriptions.length > 0) {
      res.status(200).json(userSubscriptions);
    } else {
      res.status(404).json({ message: 'No subscriptions found for this user.' });
    }
  } catch (error) {
    console.error('Error fetching user subscriptions:', error);
    res.status(500).json({ message: 'Failed to fetch user subscriptions.' });
  }
});






// // Cron job to run every 5 minutes for testing
// cron.schedule('*/1 * * * *', async () => {
//   console.log('Running scheduled task: Fetching flight data...');

//   try {
//     // Fetch all saved flight queries from the database
//     const notifications = await FlightNotification.find();

//     // Iterate through each user's saved query
//     for (let notification of notifications) {
//       const { userId, queryDetails } = notification;

//       // Make API call to RapidAPI with the saved query details
//       const response = await axios.get('https://flight-fare-search.p.rapidapi.com/v2/flights/', {
//         params: {
//           from: queryDetails.from,
//           to: queryDetails.to,
//           date: queryDetails.date,
//           adult: queryDetails.passengers || 1,
//           type: queryDetails.travelClass || 'economy',
//           currency: queryDetails.currency || 'USD'
//         },
//         headers: {
//           'x-rapidapi-key': '55a9da7574msh62e895c4b5e801ap1f053cjsn848091deb26a',
//           'x-rapidapi-host': 'flight-fare-search.p.rapidapi.com'
//         }
//       });

//       const newFlightResults = response.data.results;

//       // Compare new prices with previous
//       let cheaperFlights = [];
//       newFlightResults.forEach(flight => {
//         if (flight.totals.total < notification.previousPrice) {
//           cheaperFlights.push(flight);
//         }
//       });

//       // If cheaper flights are found, send email
//       if (cheaperFlights.length > 0) {
//         const emailContent = cheaperFlights.map(flight => `
//           Flight: ${flight.flight_name} (${flight.flight_code})\n
//           From: ${flight.departureAirport.label} (${flight.departureAirport.code})\n
//           To: ${flight.arrivalAirport.label} (${flight.arrivalAirport.code})\n
//           Price: ${flight.totals.total.toFixed(2)} ${flight.currency}
//         `).join('\n\n');

//         // Send email to the user
//         await transporter.sendMail({
//           from: 'aadidaa609@gmail.com',
//           to: notification.userEmail,  // The user's email
//           subject: 'Cheaper flight found for your saved search!',
//           text: `We found cheaper flights for your search:\n\n${emailContent}`
//         });

//         console.log(`Email sent to ${notification.userEmail} about cheaper flights.`);
//       }
//     }

//   } catch (error) {
//     console.error('Error running the scheduled flight data task:', error);
//   }
// });



app.post('/notifications', async (req, res) => {
  console.log(req.body, "reab dddddddddddd");
  const { userId, content } = req.body;

  // Validate input
  if (!userId || !content) {
    return res.status(400).json({ message: 'User ID and content are required.' });
  }

  try {
    const notification = new Notification({ userId, content });
    await notification.save();
    res.status(201).json({ message: 'Notification created successfully!', notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Failed to create notification.' });
  }
});




app.post('/send-email', (req, res) => {
  console.log(req.body, "============");
  const { email, subject, text } = req.body;

  const mailOptions = {
    from: 'aadidaa609@gmail.com',
    to: email,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error, "error===========");
      return res.status(500).json({ message: 'Failed to send email', error });

    }
    console.log(info.response, "responseeeeeeee");
    if (info) {
      console.log("nseeeeeeeeeeee");
    }

    res.status(200).json({ message: 'Email sent successfully', info });
  });
});


app.get('/notifications/:userId', async (req, res) => {
  const { userId } = req.params;

  // Validate input
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    // Fetch notifications for the given userId
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    if (notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found for this user.' });
    }

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
