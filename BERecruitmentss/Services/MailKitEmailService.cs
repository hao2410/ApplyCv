using BERecruitmentss.Services;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace BERecruitmentss.Services
{
    public class MailKitEmailService : IEmailService
    {
        public async Task SendEmailAsync(string fromEmail, string toEmail, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("", fromEmail));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = body };

            using var client = new SmtpClient();
            await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls); // Sử dụng STARTTLS
            await client.AuthenticateAsync("buihongson6203@gmail.com", "kbrk ycoc gmms bpuo");
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
