using BERecruitmentss.Models;
using BERecruitmentss.Repository;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using RouteAttribute = Microsoft.AspNetCore.Components.RouteAttribute;

namespace BERecruitmentss.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : BaseController<Staff>
    {
        private IStaffRepository _staffRepository;
        public StaffController(IBaseRepository<Staff> repository, IStaffRepository stafflRepository) : base(repository)
        {
            _staffRepository = stafflRepository;
        }
        [HttpPost("Createaa")]
        public async Task<IActionResult> Create([FromBody] Staff staff)
        {
            try
            {
                if (staff == null)
                {
                    return BadRequest("Candidate object is null");
                }

                staff.EmployeeCode = await _staffRepository.GenerateUniqueCodeAsync();

                _staffRepository.Add(staff);
                await _staffRepository.SaveChangesAsync();

                return CreatedAtAction(nameof(Create), new { id = staff.Id }, staff);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }
}
