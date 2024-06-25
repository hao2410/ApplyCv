//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Threading.Tasks;
//using BERecruitmentss.Models;
//[Route("api/[controller]")]
//[ApiController]
//public class UsersController : ControllerBase
//{
//    private readonly UserManager<IdentityUser> _userManager;
//    public UsersController(UserManager<IdentityUser> userManager)
//    {
//        _userManager = userManager;
//    }

//    // GET: api/users/{id}
//    [HttpGet("{code}")]
//    public async Task<ActionResult<IdentityUser>> GetUserByCode(string code)
//    {
//        var userCode = await _context.UserCode.FirstOrDefaultAsync(u => u.Code == code);
//        if (userCode == null)
//        {
//            return NotFound();
//        }
//        var user = await _userManager.FindByIdAsync(userCode.IdentityUserId);

//        if (user == null)
//        {
//            return NotFound();
//        }

//        return user;
//    }
//    // POST: api/users
//    [HttpPost]
//    public async Task<ActionResult<IdentityUser>> CreateUser(IdentityUser user, string password)
//    {
//        var result = await _userManager.CreateAsync(user, password);

//        if (result.Succeeded)
//        {
//            return CreatedAtAction(nameof(GetUserByCode), new { id = user.Id }, user);
//        }

//        return BadRequest(result.Errors);
//    }

//    // PUT: api/users/{id}
//    [HttpPut("{id}")]
//    public async Task<IActionResult> UpdateUser(string id, IdentityUser user)
//    {
//        if (id != user.Id)
//        {
//            return BadRequest();
//        }

//        var existingUser = await _userManager.FindByIdAsync(id);

//        if (existingUser == null)
//        {
//            return NotFound();
//        }

//        existingUser.UserName = user.UserName;
//        existingUser.Email = user.Email;

//        var result = await _userManager.UpdateAsync(existingUser);

//        if (result.Succeeded)
//        {
//            return NoContent();
//        }

//        return BadRequest(result.Errors);
//    }

//    // DELETE: api/users/{id}
//    [HttpDelete("{id}")]
//    public async Task<IActionResult> DeleteUser(string id)
//    {
//        var user = await _userManager.FindByIdAsync(id);

//        if (user == null)
//        {
//            return NotFound();
//        }

//        var result = await _userManager.DeleteAsync(user);

//        if (result.Succeeded)
//        {
//            return NoContent();
//        }

//        return BadRequest(result.Errors);
//    }
//}