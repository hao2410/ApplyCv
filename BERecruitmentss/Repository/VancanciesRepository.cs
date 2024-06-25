using BERecruitmentss.Data;
using BERecruitmentss.Models;
using Microsoft.EntityFrameworkCore;

namespace BERecruitmentss.Repository
{
    public interface IVancanciesRepository : IBaseRepository<Vacancies>
    {
        Task<Vacancies> GetByIdAsync(int id);
        Task<Vacancies> GetVacancyByRecruitmentIDAsync(int recruitmentID);
        Task<string> GenerateUniqueCodeAsync();
        void Add(Vacancies vacancies);
        Task SaveChangesAsync();
    }

    public class VancanciesRepository : BaseRepository<Vacancies>, IVancanciesRepository
    {
        public VancanciesRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor) : base(context, httpContextAccessor)
        {
        }

        public async Task<Vacancies> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<Vacancies> GetVacancyByRecruitmentIDAsync(int recruitmentID)
        {
            return await _context.Vacancies
                .Include(v => v.RecruitmentApplicant)
                .FirstOrDefaultAsync(v => v.Id == recruitmentID);
        }
        public void Add(Vacancies vacancies)
        {
            _context.Vacancies.Add(vacancies);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<string> GenerateUniqueCodeAsync()
        {
            int newCodeNumber = 1;

           
            while (true)
            {
                
                string newCode = $"D{newCodeNumber:D5}";

              
                bool codeExists = await _context.Vacancies.AnyAsync(c => c.RecruitmentCode == newCode);

               
                if (!codeExists)
                {
                    return newCode;
                }


                newCodeNumber++;
            }
        }
    }
}
