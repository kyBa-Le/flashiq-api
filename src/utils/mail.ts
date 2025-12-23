import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendVerifyEmail = async (
  email: string,
  username: string,
  token: string
) => {
  const verifyLink = `${process.env.BACKEND_URL}/api/v1/auth/verify-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Verify your email',
    html: `
        <h2>Hello ${username}</h2>
        <p>Please click the link below to verify your email:</p>
        <a href="${verifyLink}">Verify Email</a>
        <p>This link will expire in 15 minutes.</p>
        `,
  });
};
