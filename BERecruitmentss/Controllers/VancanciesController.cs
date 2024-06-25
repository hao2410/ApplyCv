using BERecruitmentss.Models;
using BERecruitmentss.Repository;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using RouteAttribute = Microsoft.AspNetCore.Components.RouteAttribute;
namespace BERecruitmentss.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VancanciesController : BaseController<Vacancies>
    {
        private IVancanciesRepository _vancanciesRepository;
        public VancanciesController(IBaseRepository<Vacancies> repository, IVancanciesRepository vancanciesRepository) : base(repository)
        {
            _vancanciesRepository = vancanciesRepository;
        }
        [HttpPost("Createaa")]
        public async Task<IActionResult> Create([FromBody] Vacancies vacancies)
        {
            try
            {
                if (vacancies == null)
                {
                    return BadRequest("Candidate object is null");
                }

                vacancies.RecruitmentCode = await _vancanciesRepository.GenerateUniqueCodeAsync();
         
                _vancanciesRepository.Add(vacancies);
                await _vancanciesRepository.SaveChangesAsync();

                return CreatedAtAction(nameof(Create), new { id = vacancies.Id }, vacancies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }
}
