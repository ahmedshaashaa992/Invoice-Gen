// This is a mock email service. It simulates sending an email by showing an alert.
// To send a real email, you can use a service like EmailJS.
// 1. Sign up for a free account at https://www.emailjs.com
// 2. Create an email template in your EmailJS account. It should accept variables like {{to_name}} and {{reset_code}}.
// 3. Find your Service ID, Template ID, and Public Key from your EmailJS dashboard.
// 4. Uncomment the code below and fill in your credentials.

// Make sure to declare emailjs in a global scope if you're using the script tag,
// or import it if you're using the npm package.
declare const emailjs: any;

export const emailService = {
  sendResetCode: async (to_email: string, username: string, reset_code: string): Promise<{success: boolean; message: string}> => {
    console.log(`Sending reset code ${reset_code} to ${username} at ${to_email}`);

    // --- MOCK IMPLEMENTATION (for testing without EmailJS) ---
    // This will show the code in an alert so you can test the flow.
    // You can remove this when you implement a real email service.
    alert(`Password Reset\n\nFor testing purposes, your reset code for user "${username}" is: ${reset_code}`);
    return { success: true, message: 'Simulated email sent.' };
    
    // --- REAL EMAILJS IMPLEMENTATION (uncomment and configure below) ---
    /*
    try {
      const SERVICE_ID = 'YOUR_SERVICE_ID';
      const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
      const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

      if (!SERVICE_ID || SERVICE_ID === 'YOUR_SERVICE_ID') {
          const message = "EmailJS is not configured. Please check lib/emailService.ts";
          console.error(message);
          alert(message);
          return { success: false, message };
      }

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        to_name: username,
        to_email: to_email,
        reset_code: reset_code,
      }, PUBLIC_KEY);

      return { success: true, message: 'Password reset email sent successfully.' };

    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, message: 'Failed to send password reset email.' };
    }
    */
  },
};