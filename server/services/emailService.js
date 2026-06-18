const transporter = require("../config/mailer");

const sendTaskAssignedEmail = async ({
  toEmail,
  assigneeName,
  taskTitle,
  projectName,
}) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: `New Task Assigned: ${taskTitle}`,
      html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4F46E5;">Task Assigned to You</h2>
          <p>Hi <strong>${assigneeName}</strong>,</p>
          <p>You have been assigned a new task:</p>
          <div style="background: #F3F4F6; padding: 15px; border-radius: 8px;">
            <p><strong>Task:</strong> ${taskTitle}</p>
            <p><strong>Project:</strong> ${projectName}</p>
          </div>
          <p>Login to your dashboard to view the full details.</p>
          <p style="color: #6B7280; font-size: 12px;">Trello Lite — Task Management</p>
        </div>
        `,
    });
    console.log(`Assignment email sent to ${toEmail}`);
  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};

// EMAIL 2 — Sent when a task is moved to Done column
const sendTaskCompletedEmail = async ({
  toEmail,
  assigneeName,
  taskTitle,
  projectName,
}) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: `Task Completed: ${taskTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #10B981;">Task Marked as Done ✅</h2>
          <p>Hi <strong>${assigneeName}</strong>,</p>
          <p>Great news! The following task has been completed:</p>
          <div style="background: #F3F4F6; padding: 15px; border-radius: 8px;">
            <p><strong>Task:</strong> ${taskTitle}</p>
            <p><strong>Project:</strong> ${projectName}</p>
          </div>
          <p style="color: #6B7280; font-size: 12px;">Trello Lite — Task Management</p>
        </div>
      `,
    });
    console.log(`Completion email sent to ${toEmail}`);
  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};

module.exports = { sendTaskAssignedEmail, sendTaskCompletedEmail };
