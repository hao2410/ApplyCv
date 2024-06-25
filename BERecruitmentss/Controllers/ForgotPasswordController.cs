using BERecruitmentss.Repository;
using BERecruitmentss.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using BERecruitmentss.Models;
using BERecruitmentss.Repository;
using BERecruitmentss.Services;

namespace BERecruitmentss.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ForgotPasswordController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IEmailRepository _emailRepository;

        public ForgotPasswordController(IEmailRepository emailRepository, IEmailService emailService)
        {
            _emailRepository = emailRepository;
            _emailService = emailService;
        }

        [HttpPost("forgotpassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            string email = model.Email;
            // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
            var user = await _emailRepository.GetUserByEmailAsync(email);

            if (user == null)
            {
                // Log lỗi ở đây
                Console.WriteLine($"Không thể tìm thấy người dùng với email: {email}");
                return BadRequest(new { message = "Email không tồn tại." });
            }

            // Tạo resetToken và mã ngẫu nhiên
            string resetToken = GenerateResetToken();
            string code = GenerateRandomCode();
            string emailContent = $"Mã xác nhận của bạn là: <strong>{code}</strong>";

            // Địa chỉ email gốc để gửi email
            string fromEmail = "your_email@gmail.com"; // Thay đổi email của bạn tại đây
            string callbackUrl = $"https://yourwebsite.com/resetpassword?token={resetToken}&email={model.Email}";
            string emailSubject = "Reset Password for " + model.Email;

            // Mã hóa mật khẩu tạm thời
            var passwordHash = GenerateTemporaryPasswordHash(code);
            user.Password = passwordHash;

            // Cập nhật mật khẩu cho tài khoản
            await _emailRepository.UpdateUserAsync(user);

            // Gửi email
            await _emailService.SendEmailAsync(fromEmail, model.Email, emailSubject, emailContent);

            return Ok(new { message = "Email reset password đã được gửi." });
        }

        [HttpPost("confirmcode")]
        public async Task<IActionResult> ConfirmCode([FromBody] ConfirmCodeModel model)
        {
            string email = model.Email;
            string code = model.Code;

            var user = await _emailRepository.GetUserByEmailAsync(email);

            if (user == null)
            {
                Console.WriteLine($"Không thể tìm thấy người dùng với email: {email}");
                return BadRequest(new { message = "Email không tồn tại." });
            }

            // Mã hóa mã code nhập vào bằng MD5
            string hashedCode = GenerateTemporaryPasswordHash(code);

            // Kiểm tra xem mã hash của mã code có khớp với mã hash trong cơ sở dữ liệu hay không
            if (user.Password != hashedCode)
            {
                Console.WriteLine($"Mã code không hợp lệ cho email: {email}");
                return BadRequest(new { message = "Mã code không hợp lệ." });
            }

            // Xóa mật khẩu tạm thời
            user.Password = null;
            await _emailRepository.UpdateUserAsync(user);

            return Ok(new { message = "Xác nhận mã code thành công." });
        }


        [HttpPost("resetpassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            var user = await _emailRepository.GetUserByEmailAsync(model.Email);

            if (user == null)
            {
                Console.WriteLine($"Không thể tìm thấy người dùng với email: {model.Email}");
                return BadRequest(new { message = "Email không tồn tại." });
            }

            // Đặt lại mật khẩu mới cho người dùng
            var newPasswordHash = GenerateTemporaryPasswordHash(model.NewPassword);
            user.Password = newPasswordHash;

            // Cập nhật mật khẩu cho tài khoản
            await _emailRepository.UpdateUserAsync(user);

            return Ok(new { message = "Đặt lại mật khẩu thành công." });
        }

        private string GenerateResetToken()
        {
            // Tạo và trả về resetToken, sử dụng Guid
            return Guid.NewGuid().ToString();
        }

        private string GenerateRandomCode()
        {
            Random random = new Random();
            int code = random.Next(100000, 999999); // Sinh số ngẫu nhiên từ 100,000 đến 999,999
            return code.ToString();
        }

        private string GenerateTemporaryPasswordHash(string password)
        {
            // Tạo một đối tượng MD5 để tính toán mã hash
            using (MD5 md5 = MD5.Create())
            {
                // Chuyển đổi mật khẩu thành một mảng byte
                byte[] inputBytes = Encoding.UTF8.GetBytes(password);

                // Tính toán mã hash
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                // Chuyển đổi mã hash thành một chuỗi hexa
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("x2"));
                }

                return sb.ToString();
            }
        }

        public class ForgotPasswordModel
        {
            public string Email { get; set; }
        }

        public class ConfirmCodeModel
        {
            public string Email { get; set; }
            public string Code { get; set; }
        }

        public class ResetPasswordModel
        {
            public string Email { get; set; }
            public string NewPassword { get; set; }
        }
    }
}
