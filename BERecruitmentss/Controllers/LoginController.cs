using BERecruitmentss.Common;
using BERecruitmentss.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace BERecruitmentss.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public LoginController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest model)
        {
            var user = _dbContext.Staff.FirstOrDefault(u => u.Email == model.Email);

            if (user == null)
            {
                return BadRequest("Invalid username or password");
            }

            // Mã hóa mật khẩu nhập vào bằng MD5 để so sánh
            var hashedPassword = ComputeMD5Hash(model.Password);
            if (user.Password != hashedPassword)
            {
                return Unauthorized();
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("my_key_secret_very_long_and_big_rat_dai_va_to_bu_khong_lo");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.StaffName),
                    new Claim("user_id", user.Id.ToString()),
                    new Claim("role", user.Role.ToString()),
                    // Thêm các claim khác tùy ý
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { Token = tokenString });
        }
        [HttpPost("change-password")]
        public IActionResult ChangePassword(ChangePasswordRequest model)
        {
            var user = _dbContext.Staff.FirstOrDefault(u => u.Email == model.Email);

            if (user == null)
            {
                return BadRequest("User not found");
            }

            var hashedOldPassword = ComputeMD5Hash(model.OldPassword);
            if (user.Password != hashedOldPassword)
            {
                return BadRequest("Old password is incorrect");
            }

            user.Password = ComputeMD5Hash(model.NewPassword);
            _dbContext.SaveChanges();

            return Ok("Password changed successfully");
        }
        private string ComputeMD5Hash(string input)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] data = md5.ComputeHash(Encoding.UTF8.GetBytes(input));
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < data.Length; i++)
                {
                    sb.Append(data[i].ToString("x2"));
                }
                return sb.ToString();
            }
        }
    }
}
