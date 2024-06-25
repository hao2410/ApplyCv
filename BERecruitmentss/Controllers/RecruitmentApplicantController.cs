using BERecruitmentss.Common;
using BERecruitmentss.Data;
using BERecruitmentss.Models;
using BERecruitmentss.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace BERecruitmentss.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecruitmentApplicantController : BaseController<RecruitmentApplicant>
    {
        private readonly IRecruitmentApplicantRepository _recruitmentApplicantRepository;
        private readonly IVancanciesRepository _vacanciesRepository;
        private readonly ApplicationDbContext _context;

        public RecruitmentApplicantController(
            IBaseRepository<RecruitmentApplicant> repository,
            IRecruitmentApplicantRepository recruitmentApplicantRepository,
            IVancanciesRepository vacanciesRepository,
            ApplicationDbContext context)
            : base(repository)
        {
            _recruitmentApplicantRepository = recruitmentApplicantRepository;
            _vacanciesRepository = vacanciesRepository;
            _context = context;
        }

        [HttpPost("assignApplicant")]
        public async Task<IActionResult> AssignApplicantToVacancy([FromBody] RecruitmentApplicantDto dto)
        {
            var vacancy = await _vacanciesRepository.GetVacancyByRecruitmentIDAsync(dto.RecruitmentID.Value);
            if (vacancy == null)
            {
                return NotFound(new { message = "Vị trí tuyển dụng không tồn tại." });
            }

            if (vacancy.Status == 2)
            {
                return BadRequest(new { message = "Không thể gán ứng viên vào vị trí tuyển dụng đã đóng hoặc bị đình chỉ." });
            }

            var recruitmentApplicant = new RecruitmentApplicant
            {
                DateStart = dto.DateStart,
                EndDate = dto.EndDate,
                Status = dto.Status,
                CandidateId = dto.CandidateId,
                VacanciesId = vacancy.Id
            };

            await _recruitmentApplicantRepository.AddAsync(recruitmentApplicant);
            await _context.SaveChangesAsync();

            await CheckAndUpdateVacancyStatus(vacancy.Id);

            var options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };

            return new JsonResult(new { message = "Ứng viên đã được gán thành công vào vị trí tuyển dụng.", recruitmentApplicant }, options);
        }

        private async Task CheckAndUpdateVacancyStatus(int vacancyId)
        {
            var vacancy = await _context.Vacancies
                .Include(v => v.RecruitmentApplicant)
                .FirstOrDefaultAsync(v => v.Id == vacancyId);
            if (vacancy != null)
            {
                if (vacancy.RecruitmentApplicant.Count >= vacancy.Quantity)
                {
                    vacancy.Status = 2;
                    _context.Entry(vacancy).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                }
            }
        }
        [HttpGet("lichphongvan")]
        public IActionResult GetCandidatesWithVacancies()
        {
            var candidates = (from c in _context.Candidate
                              join ra in _context.RecruitmentApplicant on c.Id equals ra.CandidateId
                              join v in _context.Vacancies on ra.VacanciesId equals v.Id
                              select new
                              {
                                  CandidateCode = c.CandidateCode,
                                  Name = c.Name,
                                  DateCreated = c.DateCreated,
                                  Cv = c.Cv,
                                  Status = c.Status,
                                  VacanciesTitle = v.Title,
                                  VacanciesDescription = v.Description,
                                  VacanciesStatus = v.Status
                              })
                            .ToList();

            return Ok(candidates);
        }
    }
}
