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

router.post('/send-mail', multer().fields([{ name: 'profileImage', maxCount: 1 }, { name: 'signImage', maxCount: 1 }]), async function(req, res, next) {
  
  const recipientEmail = req.body.recipientEmail;
  const name = req.body.name;
  const age = req.body.age;
  const dob = req.body.dob;
  const religion = req.body.religion;
  const caste = req.body.caste;
  const sc_st_oec = req.body.sc_st_oec;
  const father_name = req.body.father_name;
  const address = req.body.address;
  const phone_no = req.body.phone_no;
  const graduation = req.body.graduation;
  const educational_qualification = req.body.educational_qualification;
  const sslc_i_name = req.body.sslc_i_name;
  const sslc_u_name = req.body.sslc_u_name;
  const sslc_mark = req.body.sslc_mark;
  const plus_two_i_name = req.body.plus_two_i_name;
  const plus_two_u_name = req.body.plus_two_u_name;
  const plus_two_mark = req.body.plus_two_mark;
  const degree_i_name = req.body.degree_i_name;
  const degree_u_name = req.body.degree_u_name;
  const degree_mark = req.body.degree_mark;
  const kmat_score = req.body.kmat_score;
  const kmat_date = req.body.kmat_date;
  const admission_date = req.body.admission_date;

  const profileImage = req.files['profileImage'][0];
  const signImage = req.files['signImage'][0];

  const base64profileImage = profileImage.buffer.toString('base64');
  const base64signImage = signImage.buffer.toString('base64');

  const imageSrc1 = `data:${profileImage.mimetype};base64,${base64profileImage}`;
  const imageSrc2 = `data:${signImage.mimetype};base64,${base64signImage}`;

  // Create a PDF document
  const doc = new PDFDocument({size:'A4'});

  // Write the image to the PDF
  doc.image('/images/imtpunnapra-logo.png',{width:400,height:50,align:'center'})
  doc.image(imageSrc1, { width: 100,height:100 });
  doc.fontSize(16).text('Name: ' + name);
  doc.fontSize(16).text('Age: ' + age);
  doc.fontSize(16).text('Date of Birth: ' + dob);
  doc.fontSize(16).text('Religion: ' + religion);
  doc.fontSize(16).text('Caste: ' + caste);
  doc.fontSize(16).text('SC/ST/OEC: ' + sc_st_oec);
  doc.fontSize(16).text('Father\'s Name: ' + father_name);
  doc.fontSize(16).text('Address: ' + address);
  doc.fontSize(16).text('Phone Number: ' + phone_no);
  doc.fontSize(16).text('Graduation: ' + graduation);
  doc.fontSize(16).text('Educational Qualification: ' + educational_qualification);
  doc.fontSize(16).text('SSLC Institution Name: ' + sslc_i_name);
  doc.fontSize(16).text('SSLC University Name: ' + sslc_u_name);
  doc.fontSize(16).text('SSLC Mark: ' + sslc_mark);
  doc.fontSize(16).text('Plus Two Institution Name: ' + plus_two_i_name);
  doc.fontSize(16).text('Plus Two University Name: ' + plus_two_u_name);
  doc.fontSize(16).text('Plus Two Mark: ' + plus_two_mark);
  doc.fontSize(16).text('Degree Institution Name: ' + degree_i_name);
  doc.fontSize(16).text('Degree University Name: ' + degree_u_name);
  doc.fontSize(16).text('Degree Mark: ' + degree_mark);
  doc.fontSize(16).text('KMAT Score: ' + kmat_score);
  doc.fontSize(16).text('KMAT Date: ' + kmat_date);
  doc.fontSize(16).text('Admission Date: ' + admission_date);
  doc.image(imageSrc2, { width: 100, height:100 });

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
