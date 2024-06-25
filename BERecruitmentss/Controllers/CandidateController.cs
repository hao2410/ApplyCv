using BERecruitmentss.Common;
using BERecruitmentss.Data;
using BERecruitmentss.Models;
using BERecruitmentss.Repository;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BERecruitmentss.Controllers
{
    [Microsoft.AspNetCore.Components.Route("api/[controller]")]
    [ApiController]
    public class CandidateController : BaseController<Candidate>
    {
        private ICandidateRepository _candidateRepository;
        private readonly ApplicationDbContext _context;

        public CandidateController(IBaseRepository<Candidate> repository, ICandidateRepository candidateRepository, ApplicationDbContext context) : base(repository)
        {
            _candidateRepository = candidateRepository;
            _context = context;
        }
        [HttpPost("UploadImage")]
        public async Task<IActionResult> UploadImage(IFormFile image)
        {
            try
            {
                if (image == null || image.Length == 0)
                {
                    return BadRequest("No image uploaded");
                }
                // Tạo thư mục lưu ảnh nếu chưa tồn tại
                var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Cv");
                if (!Directory.Exists(uploadDir))
                {
                    Directory.CreateDirectory(uploadDir);
                }

                // Tạo tên file duy nhất
                var fileName = $"{Guid.NewGuid()}_{image.FileName}";

                // Đường dẫn lưu trữ
                var filePath = Path.Combine(uploadDir, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(fileStream);
                }

                // Trả về đường dẫn ảnh
                var imageUrl = $"{Request.Scheme}://{Request.Host}/images/{fileName}";

                return Ok(new { imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
        [HttpPost("Createaaa")]
        public async Task<IActionResult> Create([FromBody] Candidate candidate)
        {
            try
            {
                if (candidate == null)
                {
                    return BadRequest("Candidate object is null");
                }

                candidate.CandidateCode = await _candidateRepository.GenerateUniqueCodeAsync();
                candidate.DateCreated = DateTime.Now;

                _candidateRepository.Add(candidate);
                await _candidateRepository.SaveChangesAsync();

                return CreatedAtAction(nameof(Create), new { id = candidate.Id }, candidate);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
        [HttpGet("GetAllCandidates")]
        public async Task<IActionResult> GetAllCandidates()
        {
            try
            {
                var candidates = from candidate in _context.Candidate
                                 join recruitmentApplicant in _context.RecruitmentApplicant
                                     on candidate.Id equals recruitmentApplicant.CandidateId into ca
                                 from recruitmentApplicant in ca.DefaultIfEmpty()
                                 join vacancies in _context.Vacancies
                                     on recruitmentApplicant.VacanciesId equals vacancies.Id into rv
                                 from vacancies in rv.DefaultIfEmpty()
                                 where candidate.IsDeleted == null || candidate.IsDeleted == false // Thêm điều kiện vào đây
                                 select new CandidateDto
                                 {
                                     CandidateId = candidate.Id,
                                     CandidateCode = candidate.CandidateCode,
                                     Name = candidate.Name,
                                     Email = candidate.Email,
                                     Phone = candidate.Phone,
                                     DateCreated = candidate.DateCreated,
                                     Cv = candidate.Cv,
                                     Status = candidate.Status,
                                     RecruitmentApplicantId = recruitmentApplicant.Id,
                                     RecruitmentApplicantDateStart = recruitmentApplicant.DateStart,
                                     RecruitmentApplicantEndDate = recruitmentApplicant.EndDate,
                                     RecruitmentApplicantStatus = recruitmentApplicant.Status,
                                     VacanciesRecruitmentCode = vacancies.RecruitmentCode,
                                     VacanciesId = vacancies.Id,
                                     VacanciesTitle = vacancies.Title,
                                     VacanciesDescription = vacancies.Description,
                                     VacanciesQuantity = vacancies.Quantity,
                                     VacanciesRecruitmentClosingDate = vacancies.RecruitmentClosingDate
                                 };

                return Ok(await candidates.ToListAsync());
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("GetCandidateRAId/{id}")]
        public async Task<IActionResult> GetCandidateRAId(int id)
        {
            try
            {
                var candidateData = await (from c in _context.Candidate
                                           join ra in _context.RecruitmentApplicant
                                               on c.Id equals ra.CandidateId into ca
                                           from ra in ca.DefaultIfEmpty()
                                           join v in _context.Vacancies
                                               on ra.VacanciesId equals v.Id into rv
                                           from v in rv.DefaultIfEmpty()
                                           where c.Id == id && (c.IsDeleted == null || c.IsDeleted == false)
                                           select new CandidateRADto
                                           {
                                               CandidateId = c.Id,
                                               RecruitmentApplicantId = ra.Id,
                                               RecruitmentApplicantDateStart = ra.DateStart,
                                               RecruitmentApplicantEndDate = ra.EndDate,
                                               RecruitmentApplicantStatus = ra.Status,
                                               Name = c.Name,
                                               Email = c.Email,
                                           }).FirstOrDefaultAsync();

                if (candidateData == null)
                {
                    return NotFound($"Candidate with Id = {id} not found.");
                }

                return Ok(candidateData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }
}