const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
const sendEmail = async (to, subject, html, text = '') => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Ease and Bloom Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    console.log('Email sent to:', to);
    console.log('Email sent from:', mailOptions.from);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

// Email templates
const emailTemplates = {
  // New story submission notification to admin
  newStorySubmission: (storyData) => ({
    subject: `New Story Submission - ${storyData.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Story Submission</h2>
        <p>A new story has been submitted and requires review.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Story Details:</h3>
          <p><strong>Title:</strong> ${storyData.title}</p>
          <p><strong>Category:</strong> ${storyData.category}</p>
          <p><strong>Submitter:</strong> ${storyData.submitterName}</p>
          <p><strong>Email:</strong> ${storyData.submitterEmail || 'Not provided'}</p>
          <p><strong>Submitted:</strong> ${new Date(storyData.submittedAt).toLocaleDateString()}</p>
        </div>
        
        <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4>Story Excerpt:</h4>
          <p style="font-style: italic;">${storyData.content.substring(0, 200)}...</p>
        </div>
        
        <p>Please log in to the admin dashboard to review this submission.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            This is an automated notification from the Ease and Bloom admin system.
          </p>
        </div>
      </div>
    `
  }),

  // Story approved notification to submitter
  storyApproved: (storyData) => ({
    subject: `Your Story Has Been Published - ${storyData.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Great News!</h2>
        <p>Your story "<strong>${storyData.title}</strong>" has been approved and published on our website.</p>
        
        <div style="background-color: #f0f8f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p>Thank you for sharing your experience with our community. Your story can now inspire and help others who may be going through similar challenges.</p>
        </div>
        
        <p>You can view your published story on our website.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            This email was sent because you submitted a story to Ease and Bloom. 
            Your email address is never shared publicly.
          </p>
        </div>
      </div>
    `
  }),

  // Story rejected notification to submitter
  storyRejected: (storyData) => ({
    subject: `Update on Your Story Submission`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Update on Your Story Submission</h2>
        <p>Thank you for submitting your story "<strong>${storyData.title}</strong>" to Ease and Bloom.</p>
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p>After careful review, we've decided not to publish this particular story at this time.</p>
          ${storyData.rejectionReason ? `<p><strong>Note:</strong> ${storyData.rejectionReason}</p>` : ''}
        </div>
        
        <p>Please don't be discouraged. We encourage you to continue sharing your experiences and consider submitting other stories in the future.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            This email was sent because you submitted a story to Ease and Bloom. 
            Your email address is never shared publicly.
          </p>
        </div>
      </div>
    `
  }),

  // Password reset email
  passwordReset: (resetLink) => ({
    subject: 'Password Reset Request - Ease and Bloom Admin',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You have requested to reset your password for the Ease and Bloom admin account.</p>
        
        <div style="background-color: #e8f4fd; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p><strong>This link will expire in 1 hour.</strong></p>
        
        <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            This is an automated email from the Ease and Bloom admin system.
          </p>
        </div>
      </div>
    `
  }),

  // New admin account created
  newAdminAccount: (adminData, tempPassword) => ({
    subject: 'Your Admin Account for Ease and Bloom',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Ease and Bloom Admin</h2>
        <p>Your admin account has been created successfully.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Login Credentials:</h3>
          <p><strong>Email:</strong> ${adminData.email}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          <p><strong>Role:</strong> ${adminData.role}</p>
        </div>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Important:</strong> Please change your password after your first login for security reasons.</p>
        </div>
        
        <p>You can now access the admin dashboard to manage blogs and stories.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            This is an automated email from the Ease and Bloom admin system.
          </p>
        </div>
      </div>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};
