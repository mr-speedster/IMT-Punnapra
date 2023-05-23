const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();
const upload = multer();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.single('image'), (req, res) => {
  const recipientEmail = req.body.recipientEmail;
  const subject = req.body.subject;
  const message = req.body.message;
  const name = req.body.name;
  const address = req.body.address;
  const education = req.body.education;

  const base64Image = req.file.buffer.toString('base64');
  const imageSrc = `data:${req.file.mimetype};base64,${base64Image}`;

  // Create a PDF document
  const doc = new PDFDocument();

  // Write the image to the PDF
  doc.image(imageSrc, { width: 400 });

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
  //  doc.pipe(fs.createWriteStream('document.pdf'));
  doc.end();
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
