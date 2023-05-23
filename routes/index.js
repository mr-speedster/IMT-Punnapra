var express = require('express');
var router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs-extra');
const path = require('path');
const handlebars = require('handlebars');


router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/about-us', function(req, res, next) {
  res.render('about-us');
});

router.get('/admission', function(req, res, next) {
  res.render('admission');
});

router.get('/our-course', function(req, res, next) {
  res.render('our-course');
});

router.get('/facilities', function(req, res, next) {
  res.render('facilities');
});

router.get('/faculty', function(req, res, next) {
  res.render('faculty');
});

router.get('/contact-us', function(req, res, next) {
  res.render('contact-us',);
});

router.get('/chat-bot', function(req, res, next) {
  res.render('chat-bot');
});

router.get('/dummy', function(req, res, next) {
  res.render('dummy');
});


router.get('/admission-form', function(req, res, next) {
  res.render('admission-form');
});

router.post('/upload', multer().fields([{ name: 'profileImage', maxCount: 1 }, { name: 'signImage', maxCount: 1 }]), async function(req, res, next) {
  const recipientEmail = req.body.recipientEmail;
  const subject = req.body.subject;
  const message = req.body.message;
  const name = req.body.name;
  const address = req.body.address;
  const education = req.body.education;

  const profileImage = req.files['profileImage'][0];
  const signImage = req.files['signImage'][0];

  const base64profileImage = profileImage.buffer.toString('base64');
  const base64signImage = signImage.buffer.toString('base64');

  const imageSrc1 = `data:${profileImage.mimetype};base64,${base64profileImage}`;
  const imageSrc2 = `data:${signImage.mimetype};base64,${base64signImage}`;

  // Create a PDF document
  const doc = new PDFDocument({size:'A4'});

  // Write the image to the PDF
  doc.image(imageSrc1, { width: 100,height:100 });
  doc.image(imageSrc2, { width: 100, height:100 });

  // Add text and other content to the PDF
  doc.fontSize(16).text('Name: ' + name);
  doc.fontSize(16).text('Address: ' + address);
  doc.fontSize(16).text('Education: ' + education);

  doc.fontSize(20).text(subject, { align: 'center' });
  doc.fontSize(14).text(message);

  // Generate the PDF buffer
  const pdfBuffer = [];
  doc.on('data', (chunk) => {
    pdfBuffer.push(chunk);
  });
  doc.on('end', () => {
    const pdfData = Buffer.concat(pdfBuffer);

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // e.g., Gmail, Outlook, etc.
      auth: {
        user: 'ajithd78564@gmail.com',
        pass: 'nheredjgynxgiblk'
      }
    });

    // Define email options
    const mailOptions = {
      from: 'ajithd78564@gmail.com',
      to: recipientEmail,
      subject: subject,
      html: `<h1>${subject}</h1><p>${message}</p>`,
      attachments: [
        {
          filename: 'document.pdf',
          content: pdfData
        }
      ]
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.send('Error sending email.');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Email sent successfully!');
      }
    });
  });

  // Stream the PDF to a file (optional)
  doc.end();
});

module.exports = router;
