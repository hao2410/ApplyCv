using BERecruitmentss.Data;
using BERecruitmentss.Models;
using Microsoft.EntityFrameworkCore;

namespace BERecruitmentss.Repository
{
    public interface ICandidateRepository : IBaseRepository<Candidate>
    {
        Task<string> GenerateUniqueCodeAsync();
        void Add(Candidate candidate);
        Task SaveChangesAsync();
    }

    public class CandidateRepository : BaseRepository<Candidate>, ICandidateRepository
    {
        private readonly ApplicationDbContext _context;

        public CandidateRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
            : base(context, httpContextAccessor)
        {
            _context = context;
        }

        public void Add(Candidate candidate)
        {
            _context.Candidate.Add(candidate);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<string> GenerateUniqueCodeAsync()
        {
            int newCodeNumber = 1;

            // Lặp cho đến khi tìm được mã không trùng lặp
            while (true)
            {
                // Tạo mã mới
                string newCode = $"C{newCodeNumber:D5}";

                // Kiểm tra xem mã đã tồn tại trong cơ sở dữ liệu chưa
                bool codeExists = await _context.Candidate.AnyAsync(c => c.CandidateCode == newCode);

                // Nếu mã chưa tồn tại, trả về mã mới
                if (!codeExists)
                {
                    return newCode;
                }

             
                newCodeNumber++;
            }
        }
    }
}
