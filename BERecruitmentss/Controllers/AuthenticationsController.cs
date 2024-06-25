using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Dynamic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BERecruitmentss.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationsController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AuthenticationsController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;


        }
        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestModel model)
        {
            string username = model.Username;
            string password = model.Password;

            // Kiểm tra xem username và password có được cung cấp không
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                return BadRequest("Vui lòng cung cấp username và password.");
            }

            // Tìm kiếm người dùng trong cơ sở dữ liệu bằng username
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return BadRequest("Không tìm thấy người dùng.");
            }

            // Kiểm tra xem password có khớp với người dùng tìm thấy không
            var isValidPassword = await _userManager.CheckPasswordAsync(user, password);
            if (!isValidPassword)
            {
                return BadRequest("Sai username hoặc password.");
            }

            // Nếu username và password đều hợp lệ, tạo token JWT và trả về kết quả thành công
            var tokenString = await GenerateJWTTokenAsync(user);
            dynamic result = new ExpandoObject();
            result.token = tokenString;
            result.message = "Đăng nhập thành công.";
            return Ok(result);
        }

        public class LoginRequestModel
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }


        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            await this.InitRole();
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user != null)
            {
                return BadRequest("Tài khoản đã tồn tại! Vui lòng đăng nhập.");
            }
            else
            {
                var newUser = new IdentityUser(model.Username) { Email = model.Email,  };
                var checker = await _userManager.CreateAsync(newUser, model.Password);
                if (checker.Succeeded)
                {
                    //Phân quyền cho user
                    if (!string.IsNullOrEmpty(model.Role))
                    {
                        await _userManager.AddToRoleAsync(newUser, model.Role);
                    }
                    else
                    {
                        // Xử lý khi giá trị model.Role không được thiết lập
                        await _userManager.AddToRoleAsync(newUser, "CUSTOMER");
                    }

                    var tokenString = await GenerateJWTTokenAsync(newUser);
                    dynamic result = new ExpandoObject();
                    result.token = tokenString;
                    result.message = "Đăng ký thành công!";
                    return Ok(result);
                }
            }
            return BadRequest("Đăng ký không thành công! Vui lòng thử lại.");
        }


        public class RegisterViewModel
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public string Email { get; set; }

            public string Role { get; set; }
        }

        private async Task InitRole()
        {
            var roleAdmin = new IdentityRole("ADMIN");
            var roleSubAdmin = new IdentityRole("SUBADMIN");
            var roleCustomer = new IdentityRole("CUSTOMER");

            if (await _roleManager.RoleExistsAsync("ADMIN") == false)
            {
                await _roleManager.CreateAsync(roleAdmin);
            }
            if (await _roleManager.RoleExistsAsync("SUBADMIN") == false)
            {
                await _roleManager.CreateAsync(roleSubAdmin);
            }
            if (await _roleManager.RoleExistsAsync("CUSTOMER") == false)
            {
                await _roleManager.CreateAsync(roleCustomer);
            }
        }

        private async Task<string> GenerateJWTTokenAsync(IdentityUser user)
        {
            var secretKey = _configuration.GetSection("JWT")["Secret"];
            var audithen = _configuration.GetSection("JWT")["Audithen"];
            var isuser = _configuration.GetSection("JWT")["Isuser"];

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var roles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Role, string.Join(",", roles)),
                new Claim(ClaimTypes.Email, user.Email??"")

            };

            var token = new JwtSecurityToken(
                issuer: isuser,
                audience: audithen,
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
                );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return tokenString;
        }
    }
}
